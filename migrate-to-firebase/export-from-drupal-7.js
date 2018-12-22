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

const collectionNameOfBlogs = "blogs";
resultsForFirestore[collectionNameOfBlogs + "_tr-TR"] = {};
resultsForFirestore[collectionNameOfBlogs + "_en-US"] = {};
const collectionNameOfArticles = "articles";
resultsForFirestore[collectionNameOfArticles + "_tr-TR"] = {};
resultsForFirestore[collectionNameOfArticles + "_en-US"] = {};
const collectionNameOfRedirectionRecords = "redirectionRecords";
resultsForFirestore[collectionNameOfRedirectionRecords] = {};

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

function fixDocID(docID) {
    return latinize(docID).replace(/\//gi, '-').replace(/\\/gi, '-');
}

function addToBlogs(lang, docID, element) {
    resultsForFirestore[collectionNameOfBlogs + lang][docID] = { ...element };
    resultsForFirestore[collectionNameOfBlogs + lang][docID].orderNo
        = (Object.keys(resultsForFirestore[collectionNameOfBlogs + lang]).length) * -1;
    if (lang === "_en-US")
        resultsForFirestore[collectionNameOfBlogs + lang][docID].routePath = "/blog";
    else if (lang === "_tr-TR")
        resultsForFirestore[collectionNameOfBlogs + lang][docID].routePath = "/gunluk";
}

function addToArticles(lang, docID, element) {
    resultsForFirestore[collectionNameOfArticles + lang][docID] = { ...element };
    resultsForFirestore[collectionNameOfArticles + lang][docID].orderNo
        = (Object.keys(resultsForFirestore[collectionNameOfArticles + lang]).length) * -1;
    if (lang === "_en-US")
        resultsForFirestore[collectionNameOfArticles + lang][docID].routePath = "/article";
    else if (lang === "_tr-TR")
        resultsForFirestore[collectionNameOfArticles + lang][docID].routePath = "/makale";
}

function addToRedirectionRecords(lang, alias, path, docID) {
    if (lang + alias !== lang + path + docID){
        resultsForFirestore[collectionNameOfRedirectionRecords][(lang + alias).replace(/\//gi, '\\')]
            = {code: 301, url: "/" + lang + path + docID};
        if (lang === "tr/")
            resultsForFirestore[collectionNameOfRedirectionRecords][(alias).replace(/\//gi, '\\')]
                = {code: 301, url: "/" + lang + path + docID};
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

function getBlogs() {
    connection.query(
        "SELECT u.language, u.alias, n.nid, n.type, n.status, FROM_UNIXTIME(n.changed) AS 'changed', FROM_UNIXTIME(n.created) AS 'created', n.title, fdb.body_value AS 'content' FROM node n LEFT JOIN url_alias u ON u.source = CONCAT('node/', n.nid) AND u.language=n.language AND u.pid IN (SELECT MAX(stu.pid) FROM url_alias stu GROUP BY stu.source) LEFT JOIN field_data_body fdb ON fdb.entity_type = 'node' AND fdb.entity_id = n.nid AND fdb.revision_id = n.vid WHERE n.type='blog' AND n.status='1' ORDER BY n.created ASC",
        function (error, results, fields) {
            if (error) throw error;

            results.forEach(function(element) {
                const docID = fixDocID(element.alias.replace(/blog\//gi, '').replace(/gunluk\//gi, ''));
                element.createdBy = "Murat Demir";
                element.i18nKey = docID; // i18nKey should be matched with translations
                downloadFiles(element.content);
                if (element.language === "und") {
                    addToBlogs("_tr-TR", docID, element);
                    addToBlogs("_en-US", docID, element);
                    addToRedirectionRecords("tr/", element.alias, "gunluk/", docID);
                    addToRedirectionRecords("en/", element.alias, "blog/", docID);
                } else if (element.language === "tr") {
                    addToBlogs("_tr-TR", docID, element);
                    addToRedirectionRecords("tr/", element.alias, "gunluk/", docID);
                } else if (element.language === "en") {
                    addToBlogs("_en-US", docID, element);
                    addToRedirectionRecords("en/", element.alias, "blog/", docID);
                }
            });
            getArticles();
        });
}

function getArticles() {
    connection.query(
        "SELECT u.language, u.alias, n.nid, n.type, n.status, FROM_UNIXTIME(n.changed) AS 'changed', FROM_UNIXTIME(n.created) AS 'created', n.title, fdb.body_value AS 'content' FROM node n LEFT JOIN url_alias u ON u.source = CONCAT('node/', n.nid) AND u.language=n.language AND u.pid IN (SELECT MAX(stu.pid) FROM url_alias stu GROUP BY stu.source) LEFT JOIN field_data_body fdb ON fdb.entity_type = 'node' AND fdb.entity_id = n.nid AND fdb.revision_id = n.vid WHERE n.type IN ('page', 'story') AND n.status='1' ORDER BY n.created ASC",
        function (error, results, fields) {
            if (error) throw error;

            results.forEach(function(element) {
                const docID = fixDocID(element.alias.replace(/story\//gi, '').replace(/makale\//gi, ''));
                element.createdBy = "Murat Demir";
                element.i18nKey = docID; // i18nKey should be matched with translations
                downloadFiles(element.content);
                if (element.language === "und") {
                    addToArticles("_tr-TR", docID, element);
                    addToArticles("_en-US", docID, element);
                    addToRedirectionRecords("tr/", element.alias, "makale/", docID);
                    addToRedirectionRecords("en/", element.alias, "article/", docID);
                } else if (element.language === "tr") {
                    addToArticles("_tr-TR", docID, element);
                    addToRedirectionRecords("tr/", element.alias, "makale/", docID);
                } else if (element.language === "en") {
                    addToArticles("_en-US", docID, element);
                    addToRedirectionRecords("en/", element.alias, "article/", docID);
                }
            });
            writeResultToFile();
        });
}

getBlogs();

function writeResultToFile() {
    fs.writeFile('data.json', JSON.stringify(resultsForFirestore, undefined, 2), {encoding: 'utf8', flag: 'w'}, function (err) {
        if (err) throw err;
        console.log('Collections Exported Successfully');
    });
    connection.end();
}
