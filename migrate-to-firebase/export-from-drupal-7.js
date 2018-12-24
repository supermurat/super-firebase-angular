const mysql = require('mysql');
const fs = require('fs');
const http = require('http');
const path = require('path');
const latinize = require('latinize');

const mysqlConfig = require("./mysql-config.json");

const connection = mysql.createConnection(mysqlConfig);

connection.connect();

const baseURLOfWebSite = "http://supermurat.com";
const pathOfFiles = __dirname + path.sep + "files";
if (!fs.existsSync(pathOfFiles))
    fs.mkdir(pathOfFiles);

const resultsForFirestore = {};

const collectionNameOfTaxonomy = "taxonomy";
resultsForFirestore[collectionNameOfTaxonomy + "_tr-TR"] = {};
resultsForFirestore[collectionNameOfTaxonomy + "_en-US"] = {};
const collectionNameOfBlogs = "blogs";
resultsForFirestore[collectionNameOfBlogs + "_tr-TR"] = {};
resultsForFirestore[collectionNameOfBlogs + "_en-US"] = {};
const collectionNameOfArticles = "articles";
resultsForFirestore[collectionNameOfArticles + "_tr-TR"] = {};
resultsForFirestore[collectionNameOfArticles + "_en-US"] = {};
const collectionNameOfRedirectionRecords = "redirectionRecords";
resultsForFirestore[collectionNameOfRedirectionRecords] = {};

/* region Fix Data */

function fixDocID(docID) {
    return latinize(docID).replace(/\//gi, '-').replace(/\\/gi, '-');
}

function removeUnneededFields(newData) {
    delete newData['language'];
    delete newData['alias'];
    delete newData['nid'];
    delete newData['type'];
    delete newData['status'];
    delete newData['tid'];
    delete newData['tagTitles'];
    delete newData['tagLinks'];
    delete newData['documentID'];

    return newData;
}

function generateTaxonomy(lang, newData) {
    let taxonomy = {};
    const tagTitleList = newData.tagTitles.split("|");
    const tagLinkList = newData.tagLinks.split("|");
    if (tagTitleList.length === tagLinkList.length) {
        for (let i = 0; i < tagLinkList.length; i++) {
            const docID = fixDocID(tagLinkList[i].replace(/taxonomy\/term\//gi, '').replace(/etiket\//gi, ''));
            taxonomy[docID] = tagTitleList[i].trim();

            addToTaxonomyContentsCollection(lang, docID, newData)
        }
    } else {
        console.log("Taxonomy list is invalid:", tagTitleList, tagLinkList);
    }
    newData.taxonomy = taxonomy;
}

/* endregion */

/* region Add to Export Object */

function addToTaxonomy(lang, element) {
    const newData = { ...element };
    if (lang === "_en-US")
        newData.routePath = "/tag";
    else if (lang === "_tr-TR")
        newData.routePath = "/etiket";
    newData.__collection__contents = {};
    resultsForFirestore[collectionNameOfTaxonomy + lang][element.documentID] = removeUnneededFields(newData);
    resultsForFirestore[collectionNameOfTaxonomy + lang][element.documentID].orderNo
        = (Object.keys(resultsForFirestore[collectionNameOfTaxonomy + lang]).length) * -1;
}

function addToTaxonomyContentsCollection(lang, taxonomyDocID, element) {
    let newData = removeUnneededFields({ ...element });
    const docID = newData.routePath.replace("/", "_") + "_" + element.documentID;
    newData.path = element.documentID;

    delete newData['content'];
    resultsForFirestore[collectionNameOfTaxonomy + lang][taxonomyDocID].__collection__contents[docID] = newData;
    resultsForFirestore[collectionNameOfTaxonomy + lang][taxonomyDocID].__collection__contents[docID].orderNo
        = (Object.keys(resultsForFirestore[collectionNameOfTaxonomy + lang][taxonomyDocID].__collection__contents).length) * -1;
}

function addToBlogs(lang, element) {
    const newData = { ...element };
    if (lang === "_en-US")
        newData.routePath = "/blog";
    else if (lang === "_tr-TR")
        newData.routePath = "/gunluk";
    if (newData.contentSummary === undefined || newData.contentSummary === null || newData.contentSummary.trim() === "") {
        newData.contentSummary = newData.content;
    }
    generateTaxonomy(lang, newData);
    resultsForFirestore[collectionNameOfBlogs + lang][element.documentID] = removeUnneededFields(newData);
    resultsForFirestore[collectionNameOfBlogs + lang][element.documentID].orderNo
        = (Object.keys(resultsForFirestore[collectionNameOfBlogs + lang]).length) * -1;
}

function addToArticles(lang, element) {
    const newData = { ...element };
    if (lang === "_en-US")
        newData.routePath = "/article";
    else if (lang === "_tr-TR")
        newData.routePath = "/makale";
    if (newData.contentSummary === undefined || newData.contentSummary === null || newData.contentSummary.trim() === "") {
        newData.contentSummary = newData.content;
    }
    generateTaxonomy(lang, newData);
    resultsForFirestore[collectionNameOfArticles + lang][element.documentID] = removeUnneededFields(newData);
    resultsForFirestore[collectionNameOfArticles + lang][element.documentID].orderNo
        = (Object.keys(resultsForFirestore[collectionNameOfArticles + lang]).length) * -1;
}

function addToRedirectionRecords(lang, element, path) {
    if (lang + element.alias !== lang + path + element.documentID){
        resultsForFirestore[collectionNameOfRedirectionRecords][(lang + element.alias).replace(/\//gi, '\\')]
            = {code: 301, url: "/" + lang + path + element.documentID};
        if (lang === "tr/")
            resultsForFirestore[collectionNameOfRedirectionRecords][(element.alias).replace(/\//gi, '\\')]
                = {code: 301, url: "/" + lang + path + element.documentID};
    }
}

/* endregion */

/* region Files */

function checkDirectory(directoryPath) {
    if (!fs.existsSync(directoryPath)){
        directoryPath.split(path.sep)
            .reduce((currentPath, folder) => {
                currentPath += folder + path.sep;
                if (!fs.existsSync(currentPath)){
                    fs.mkdirSync(currentPath);
                }
                return currentPath;
            }, '');
    }
}

function downloadFiles(htmlContent) {
    const fileMatchList = htmlContent.match(/<img src=[\\]?"[\w\d\/\-_\\]*\.[\w\d]*[\\]?"/gi);
    if (fileMatchList) {
        fileMatchList.forEach(function (fileMatch) {
            const filePath = fileMatch.replace(/<img src=/gi, "").replace(/[\\]?"/gi, "")
                .replace(/\//gi, path.sep).replace(/\\/gi, path.sep);
            checkDirectory(path.dirname(pathOfFiles + filePath));
            if (!fs.existsSync(pathOfFiles + filePath)) {
                const file = fs.createWriteStream(pathOfFiles + filePath); // TODO: if it starts with url, you can replace it for local file
                const request = http.get(baseURLOfWebSite + filePath, function (response) {
                    response.pipe(file);
                    file.on('finish', function () {
                        file.close();
                        console.log("Newly Downloaded File:", filePath);
                    });
                });
            } else {
                console.log("Already Downloaded File:", filePath);
            }
        })
    }
}

/* endregion */

/* region Get From Database */

function getTaxonomy() {
    connection.query(
        "SELECT u.language, u.alias, t.tid, t.name AS 'title', (SELECT FROM_UNIXTIME(MIN(ti.created)) FROM taxonomy_index ti WHERE ti.tid=t.tid) AS 'created' FROM taxonomy_term_data t LEFT JOIN url_alias u ON u.source = CONCAT('taxonomy/term/', t.tid) AND u.language=t.language AND u.pid IN (SELECT MAX(stu.pid) FROM url_alias stu GROUP BY stu.source) WHERE t.tid IN (SELECT tid FROM taxonomy_index) ORDER BY t.tid ASC",
        function (error, results, fields) {
            if (error) throw error;

            results.forEach(function(element) {
                element.documentID = fixDocID(element.alias.replace(/taxonomy\/term\//gi, '').replace(/etiket\//gi, ''));
                element.i18nKey = element.documentID; // i18nKey should be matched with translations
                if (element.language === "und") {
                    addToTaxonomy("_tr-TR", element);
                    addToTaxonomy("_en-US", element);
                    addToRedirectionRecords("tr/", element, "etiket/");
                    addToRedirectionRecords("en/", element, "tag/");
                } else if (element.language === "tr") {
                    addToTaxonomy("_tr-TR", element);
                    addToRedirectionRecords("tr/", element, "etiket/");
                } else if (element.language === "en") {
                    addToTaxonomy("_en-US", element);
                    addToRedirectionRecords("en/", element, "tag/");
                }
            });
            getBlogs();
        });
}

function getBlogs() {
    connection.query(
        "SELECT u.language, u.alias, n.nid, n.type, n.status, FROM_UNIXTIME(n.changed) AS 'changed', FROM_UNIXTIME(n.created) AS 'created', n.title, fdb.body_value AS 'content', fdb.body_summary AS 'contentSummary', GROUP_CONCAT(ttd.name ORDER BY ttd.tid SEPARATOR '|' ) AS 'tagTitles', GROUP_CONCAT(tu.alias ORDER BY ttd.tid SEPARATOR '|' ) AS 'tagLinks' FROM node n LEFT JOIN url_alias u ON u.source = CONCAT('node/', n.nid) AND u.language=n.language AND u.pid IN (SELECT MAX(stu.pid) FROM url_alias stu GROUP BY stu.source) LEFT JOIN field_data_body fdb ON fdb.entity_type = 'node' AND fdb.entity_id = n.nid AND fdb.revision_id = n.vid LEFT JOIN taxonomy_index ti ON ti.nid = n.nid LEFT JOIN taxonomy_term_data ttd ON ttd.tid = ti.tid LEFT JOIN url_alias tu ON tu.source = CONCAT('taxonomy/term/', ttd.tid) AND tu.language=ttd.language AND tu.pid IN (SELECT MAX(stu.pid) FROM url_alias stu GROUP BY stu.source) WHERE n.type='blog' AND n.status='1' GROUP BY u.language, u.alias, n.nid, n.type, n.status, n.changed, n.created, n.title, fdb.body_value, fdb.body_summary ORDER BY n.created ASC",
        function (error, results, fields) {
            if (error) throw error;

            results.forEach(function(element) {
                element.documentID = fixDocID(element.alias.replace(/blog\//gi, '').replace(/gunluk\//gi, ''));
                element.createdBy = "Murat Demir";
                element.i18nKey = element.documentID; // i18nKey should be matched with translations
                downloadFiles(element.content);
                if (element.language === "und") {
                    addToBlogs("_tr-TR", element);
                    addToBlogs("_en-US", element);
                    addToRedirectionRecords("tr/", element, "gunluk/");
                    addToRedirectionRecords("en/", element, "blog/");
                } else if (element.language === "tr") {
                    addToBlogs("_tr-TR", element);
                    addToRedirectionRecords("tr/", element, "gunluk/");
                } else if (element.language === "en") {
                    addToBlogs("_en-US", element);
                    addToRedirectionRecords("en/", element, "blog/");
                }
            });
            getArticles();
        });
}

function getArticles() {
    connection.query(
        "SELECT u.language, u.alias, n.nid, n.type, n.status, FROM_UNIXTIME(n.changed) AS 'changed', FROM_UNIXTIME(n.created) AS 'created', n.title, fdb.body_value AS 'content', fdb.body_summary AS 'contentSummary', GROUP_CONCAT(ttd.name ORDER BY ttd.tid SEPARATOR '|' ) AS 'tagTitles', GROUP_CONCAT(tu.alias ORDER BY ttd.tid SEPARATOR '|' ) AS 'tagLinks' FROM node n LEFT JOIN url_alias u ON u.source = CONCAT('node/', n.nid) AND u.language=n.language AND u.pid IN (SELECT MAX(stu.pid) FROM url_alias stu GROUP BY stu.source) LEFT JOIN field_data_body fdb ON fdb.entity_type = 'node' AND fdb.entity_id = n.nid AND fdb.revision_id = n.vid LEFT JOIN taxonomy_index ti ON ti.nid = n.nid LEFT JOIN taxonomy_term_data ttd ON ttd.tid = ti.tid LEFT JOIN url_alias tu ON tu.source = CONCAT('taxonomy/term/', ttd.tid) AND tu.language=ttd.language AND tu.pid IN (SELECT MAX(stu.pid) FROM url_alias stu GROUP BY stu.source) WHERE n.type IN ('page', 'story') AND n.status='1' GROUP BY u.language, u.alias, n.nid, n.type, n.status, n.changed, n.created, n.title, fdb.body_value, fdb.body_summary ORDER BY n.created ASC",
        function (error, results, fields) {
            if (error) throw error;

            results.forEach(function(element) {
                element.documentID = fixDocID(element.alias.replace(/story\//gi, '').replace(/makale\//gi, ''));
                element.createdBy = "Murat Demir";
                element.i18nKey = element.documentID; // i18nKey should be matched with translations
                downloadFiles(element.content);
                if (element.language === "und") {
                    addToArticles("_tr-TR", element);
                    addToArticles("_en-US", element);
                    addToRedirectionRecords("tr/", element, "makale/");
                    addToRedirectionRecords("en/", element, "article/");
                } else if (element.language === "tr") {
                    addToArticles("_tr-TR", element);
                    addToRedirectionRecords("tr/", element, "makale/");
                } else if (element.language === "en") {
                    addToArticles("_en-US", element);
                    addToRedirectionRecords("en/", element, "article/");
                }
            });
            writeResultToFile();
        });
}

/* endregion */

getTaxonomy();

function writeResultToFile() {
    fs.writeFile('data.json', JSON.stringify(resultsForFirestore, undefined, 2), {encoding: 'utf8', flag: 'w'}, function (err) {
        if (err) throw err;
        console.log('Collections Exported Successfully');
    });
    connection.end();
}
