import * as fs from 'fs';
import * as h2p from 'html2plaintext';
import * as http from 'http';
import * as latinize from 'latinize';
import * as mysql from 'mysql';
import * as path from 'path';

import { checkDirectory, writeResultToFile } from './helper';

// tslint:disable-next-line:no-var-requires no-require-imports
const mysqlConfig = require('../mysql-config.json');

const connection = mysql.createConnection(mysqlConfig);

connection.connect();

const baseURLOfWebSite = 'http://supermurat.com';
const pathOfData = `${path.dirname(__dirname) + path.sep}data`;
const pathOfDataJson = `${pathOfData + path.sep}data.json`;
const pathOfFiles = `${pathOfData + path.sep}files`;
checkDirectory(pathOfFiles);

// data you want to import into Firestore
const dataFirestore = {};

const cnoTaxonomy = 'taxonomy';
dataFirestore[`${cnoTaxonomy}_tr-TR`] = {};
dataFirestore[`${cnoTaxonomy}_en-US`] = {};
const cnoBlogs = 'blogs';
dataFirestore[`${cnoBlogs}_tr-TR`] = {};
dataFirestore[`${cnoBlogs}_en-US`] = {};
const cnoArticles = 'articles';
dataFirestore[`${cnoArticles}_tr-TR`] = {};
dataFirestore[`${cnoArticles}_en-US`] = {};
const cnoJokes = 'jokes';
dataFirestore[`${cnoJokes}_tr-TR`] = {};
dataFirestore[`${cnoJokes}_en-US`] = {};
const cnoQuotes = 'quotes';
dataFirestore[`${cnoQuotes}_tr-TR`] = {};
dataFirestore[`${cnoQuotes}_en-US`] = {};
const collectionNameOfFirstResponses = 'firstResponses';
dataFirestore[collectionNameOfFirstResponses] = {};

/* region Fix Data */

const fixDocID = (docID: string): string => latinize(docID).replace(/\//gi, '-').replace(/\\/gi, '-');

const removeUnneededFields = (newData: any): any => {
    delete newData.language;
    delete newData.alias;
    delete newData.nid;
    delete newData.type;
    delete newData.status;
    delete newData.tid;
    delete newData.tagTitles;
    delete newData.tagLinks;
    delete newData.documentID;

    return newData;
};

/* endregion */

/* region Add to Export Object */

const addToFirstResponses = (lang: string, element: any, url: string): void => {
    if (lang + String(element.alias) !== lang + url + String(element.documentID)) {
        dataFirestore[collectionNameOfFirstResponses][(lang + String(element.alias)).replace(/\//gi, '\\')]
            = {code: 301, url: `/${lang}${url}${element.documentID}`};
        if (lang === 'tr/') {
            dataFirestore[collectionNameOfFirstResponses][(element.alias).replace(/\//gi, '\\')]
                = {code: 301, url: `/${lang}${url}${element.documentID}`};
        }
    }
};

const addToTaxonomy = (lang: string, element: any): void => {
    const newData = {...element};
    if (lang === '_en-US') {
        newData.routePath = '/tag';
        addToFirstResponses('en/', element, 'tag/');
        newData.title = `Related Contents to "${newData.tagName}"`;
    } else if (lang === '_tr-TR') {
        newData.routePath = '/etiket';
        addToFirstResponses('tr/', element, 'etiket/');
        newData.title = `"${newData.tagName}" ile Alakalı İçerikler`;
    }
    newData.changed = newData.created;
    newData.i18nKey = newData.documentID; // i18nKey should be matched with translations
    newData.__collection__contents = {};
    dataFirestore[cnoTaxonomy + lang][element.documentID] = removeUnneededFields(newData);
    dataFirestore[cnoTaxonomy + lang][element.documentID].orderNo
        = (Object.keys(dataFirestore[cnoTaxonomy + lang]).length) * -1;
};

const addToTaxonomyContentsCollection = (lang: string, taxonomyDocID: string, element: any): void => {
    const newData = removeUnneededFields({...element});
    const docID = `${newData.routePath.replace('/', '_')}_${element.documentID}`;
    newData.path = element.documentID;

    delete newData.content;
    dataFirestore[cnoTaxonomy + lang][taxonomyDocID].__collection__contents[docID] = newData;
    dataFirestore[cnoTaxonomy + lang][taxonomyDocID].__collection__contents[docID].orderNo
        = (Object.keys(dataFirestore[cnoTaxonomy + lang][taxonomyDocID].__collection__contents).length) * -1;
};

const generateTaxonomy = (lang: string, newData: any): void => {
    const taxonomy = {};
    if (newData.tagTitles && newData.tagLinks) {
        const tagTitleList = newData.tagTitles.split('|');
        const tagLinkList = newData.tagLinks.split('|');
        if (tagTitleList.length === tagLinkList.length) {
            for (let i = 0; i < tagLinkList.length; i++) {
                const docID = fixDocID(tagLinkList[i]
                    .replace(/taxonomy\/term\//gi, '')
                    .replace(/tag\//gi, '')
                    .replace(/etiket\//gi, ''));
                taxonomy[docID] = tagTitleList[i].trim();

                addToTaxonomyContentsCollection(lang, docID, newData);
            }
        } else {
            console.log('Taxonomy list is invalid:', tagTitleList, tagLinkList);
        }
    }
    newData.taxonomy = taxonomy;
};

const getSummary = (content: string, currentLength: number): string => {
    // tslint:disable-next-line: prefer-conditional-expression
    if (content.startsWith('<p>') &&
        content.indexOf('</p>') > -1 &&
        content.substring(3, content.indexOf('</p>'))
            .indexOf('<p') === -1) {
        let tempSummary = content.substring(0, Number(content.indexOf('</p>')) + 4);
        if (tempSummary.length > 1000) {
            if (tempSummary.indexOf('<br /><br />', 500) > -1) {
                tempSummary = `${tempSummary.substring(0, tempSummary.indexOf('<br /><br />', 500))}</p>`;
            } else if (tempSummary.indexOf('<br><br>', 500) > -1) {
                tempSummary = `${tempSummary.substring(0, tempSummary.indexOf('<br><br>', 500))}</p>`;
            } else if (tempSummary.indexOf('<br />', 500) > -1) {
                tempSummary = `${tempSummary.substring(0, tempSummary.indexOf('<br />', 500))}</p>`;
            } else if (tempSummary.indexOf('<br>', 500) > -1) {
                tempSummary = `${tempSummary.substring(0, tempSummary.indexOf('<br>', 500))}</p>`;
            }
        } else if (tempSummary.length + currentLength < 400) {
            const remainingSummary = content.replace(tempSummary, '');
            tempSummary += getSummary(remainingSummary, tempSummary.length + currentLength);
        }

        return tempSummary;
    } else {
        return content;
    }
};

const generateCommonFields = (newData: any): void => {
    newData.createdBy = 'Murat Demir';
    newData.changedBy = 'Murat Demir';
    newData.i18nKey = newData.documentID; // i18nKey should be matched with translations

    if (newData.contentSummary === undefined ||
        newData.contentSummary === null ||
        newData.contentSummary.trim() === '' ||
        newData.contentSummary === newData.content ||
        newData.contentSummary.length > 1000) {
        newData.contentSummary = getSummary(newData.content, 0);
    }

    const cleanText = h2p(newData.contentSummary).replace(/[\r\n]/g, ' ');
    // tslint:disable-next-line: prefer-conditional-expression
    if (cleanText.indexOf(' ', 150) > -1) {
        newData.description = `${cleanText.substring(0, cleanText.indexOf(' ', 150))}...`;
    } else {
        newData.description = `${cleanText.substring(0, 160)}...`;
    }
};

const addToBlogs = (lang: string, element: any): void => {
    const newData = {...element};
    if (lang === '_en-US') {
        newData.routePath = '/blog';
        addToFirstResponses('en/', element, 'blog/');
    } else if (lang === '_tr-TR') {
        newData.routePath = '/gunluk';
        addToFirstResponses('tr/', element, 'gunluk/');
    }
    generateCommonFields(newData);
    generateTaxonomy(lang, newData);
    dataFirestore[cnoBlogs + lang][element.documentID] = removeUnneededFields(newData);
    dataFirestore[cnoBlogs + lang][element.documentID].orderNo
        = (Object.keys(dataFirestore[cnoBlogs + lang]).length) * -1;
};

const addToArticles = (lang: string, element: any): void => {
    const newData = {...element};
    if (lang === '_en-US') {
        newData.routePath = '/article';
        addToFirstResponses('en/', element, 'article/');
    } else if (lang === '_tr-TR') {
        newData.routePath = '/makale';
        addToFirstResponses('tr/', element, 'makale/');
    }
    generateCommonFields(newData);
    generateTaxonomy(lang, newData);
    dataFirestore[cnoArticles + lang][element.documentID] = removeUnneededFields(newData);
    dataFirestore[cnoArticles + lang][element.documentID].orderNo
        = (Object.keys(dataFirestore[cnoArticles + lang]).length) * -1;
};

const addToJokes = (lang: string, element: any): void => {
    const newData = {...element};
    if (lang === '_en-US') {
        newData.routePath = '/joke';
        addToFirstResponses('en/', element, 'joke/');
    } else if (lang === '_tr-TR') {
        newData.routePath = element.type === 'sogukespriler' ? '/soguk-espri' : '/fikra';
        addToFirstResponses('tr/', element, 'fikra/');
    }
    generateCommonFields(newData);
    generateTaxonomy(lang, newData);
    dataFirestore[cnoJokes + lang][element.documentID] = removeUnneededFields(newData);
    dataFirestore[cnoJokes + lang][element.documentID].orderNo
        = (Object.keys(dataFirestore[cnoJokes + lang]).length) * -1;
};

const addToQuotes = (lang: string, element: any): void => {
    const newData = {...element};
    if (lang === '_en-US') {
        newData.routePath = '/quote';
        addToFirstResponses('en/', element, 'quote/');
    } else if (lang === '_tr-TR') {
        newData.routePath = '/alinti';
        addToFirstResponses('tr/', element, 'alinti/');
    }
    generateCommonFields(newData);
    generateTaxonomy(lang, newData);
    dataFirestore[cnoQuotes + lang][element.documentID] = removeUnneededFields(newData);
    dataFirestore[cnoQuotes + lang][element.documentID].orderNo
        = (Object.keys(dataFirestore[cnoQuotes + lang]).length) * -1;
};

const addToDialogs = (lang: string, element: any): void => {
    const newData = {...element};
    const persons = {};
    const personsList = newData.persons.split('|');
    personsList.forEach((person) => {
        const values = h2p(person).split(':');
        if (values.length > 1) {
            persons[values[0].trim()] = values[1].trim();
        } else {
            // tslint:disable-next-line: no-string-literal
            persons['Person'] = values[0].trim();
        }
    });
    newData.persons = persons;
    addToQuotes(lang, newData);
};

/* endregion */

/* region Files */

const downloadFiles = (htmlContent: string): void => {
    const fileMatchList = htmlContent.match(/<img src=[\\]?"[\w\d\/\-_\\]*\.[\w\d]*[\\]?"/gi);
    if (fileMatchList) {
        fileMatchList.forEach((fileMatch) => {
            const filePath = fileMatch.replace(/<img src=/gi, '').replace(/[\\]?"/gi, '')
                .replace(/\//gi, path.sep).replace(/\\/gi, path.sep);
            checkDirectory(path.dirname(pathOfFiles + filePath));
            if (!fs.existsSync(pathOfFiles + filePath)) {
                const file = fs.createWriteStream(pathOfFiles + filePath);
                // TODO: if it starts with url, you can replace it for local file
                http.get(baseURLOfWebSite + filePath, (response) => {
                    response.pipe(file);
                    file.on('finish', () => {
                        file.close();
                        console.log('Newly Downloaded File:', filePath);
                    });
                });
            } else {
                console.log('Already Downloaded File:', filePath);
            }
        });
    }
};

/* endregion */

/* region Get From Database */

const getTaxonomy = (): void => {
    connection.query(
        `SELECT u.language, u.alias, t.tid, t.name AS 'tagName',
(SELECT FROM_UNIXTIME(MIN(ti.created)) FROM taxonomy_index ti WHERE ti.tid=t.tid) AS 'created'
FROM taxonomy_term_data t
    LEFT JOIN url_alias u ON u.source = CONCAT('taxonomy/term/', t.tid) AND u.language=t.language AND u.pid IN (
        SELECT MAX(stu.pid) FROM url_alias stu GROUP BY stu.source
    )
WHERE t.tid IN (SELECT tid FROM taxonomy_index)
ORDER BY t.tid ASC`,
        (error, results, fields) => {
            if (error) {
                throw error;
            }

            results.forEach((element) => {
                element.documentID = fixDocID(element.alias
                    .replace(/taxonomy\/term\//gi, '')
                    .replace(/tag\//gi, '')
                    .replace(/etiket\//gi, ''));
                if (element.language === 'und') {
                    addToTaxonomy('_tr-TR', element);
                    addToTaxonomy('_en-US', element);
                } else if (element.language === 'tr') {
                    addToTaxonomy('_tr-TR', element);
                } else if (element.language === 'en') {
                    addToTaxonomy('_en-US', element);
                }
            });
            // tslint:disable-next-line:no-use-before-declare
            getCommonContents();
        });
};

const getCommonContents = (): void => {
    connection.query(
        `SELECT u.language, u.alias, n.nid, n.type, n.status,
FROM_UNIXTIME(n.changed) AS 'changed', FROM_UNIXTIME(n.created) AS 'created',
n.title, fdb.body_value AS 'content', fdb.body_summary AS 'contentSummary',
GROUP_CONCAT(ttd.name ORDER BY ttd.tid SEPARATOR '|' ) AS 'tagTitles',
GROUP_CONCAT(tu.alias ORDER BY ttd.tid SEPARATOR '|' ) AS 'tagLinks'
FROM node n
    LEFT JOIN url_alias u ON u.source = CONCAT('node/', n.nid) AND u.language=n.language AND u.pid IN (
       SELECT MAX(stu.pid) FROM url_alias stu GROUP BY stu.source
    )
    LEFT JOIN field_data_body fdb ON fdb.entity_type = 'node' AND fdb.entity_id = n.nid AND fdb.revision_id = n.vid
    LEFT JOIN taxonomy_index ti ON ti.nid = n.nid
    LEFT JOIN taxonomy_term_data ttd ON ttd.tid = ti.tid
    LEFT JOIN url_alias tu ON tu.source = CONCAT('taxonomy/term/', ttd.tid) AND tu.language=ttd.language AND tu.pid IN (
        SELECT MAX(stu.pid) FROM url_alias stu GROUP BY stu.source
    )
WHERE n.type IN ('page', 'story', 'blog', 'fikralar', 'sogukespriler', 'project', 'book') AND n.status='1'
GROUP BY u.language, u.alias, n.nid, n.type, n.status, n.changed, n.created, n.title, fdb.body_value, fdb.body_summary
ORDER BY n.created ASC`,
        (error, results, fields) => {
            if (error) {
                throw error;
            }

            results.forEach((element) => {
                downloadFiles(element.content);
                if (element.type === 'blog') {
                    element.documentID = fixDocID(element.alias.replace(/blog\//gi, '').replace(/gunluk\//gi, ''));
                    if (element.language === 'und' || element.language === 'tr') {
                        addToBlogs('_tr-TR', element);
                    }
                    if (element.language === 'und' || element.language === 'en') {
                        addToBlogs('_en-US', element);
                    }
                } else if (element.type === 'page' || element.type === 'story' ||
                    element.type === 'project' || element.type === 'book') {
                    element.documentID = fixDocID(element.alias
                        .replace(/story\//gi, '')
                        .replace(/makale\//gi, '')
                        .replace(/doc\//gi, ''));
                    if (element.language === 'und' || element.language === 'tr') {
                        addToArticles('_tr-TR', element);
                    }
                    if (element.language === 'und' || element.language === 'en') {
                        addToArticles('_en-US', element);
                    }
                } else if (element.type === 'fikralar' || element.type === 'sogukespriler') {
                    element.documentID = fixDocID(element.alias.replace(/fikralar\//gi, '')
                        .replace(/soguk_espriler\//gi, '')
                        .replace(/icerik\//gi, ''));
                    if (element.language === 'und' || element.language === 'tr') {
                        addToJokes('_tr-TR', element);
                    }
                    if (element.language === 'und' || element.language === 'en') {
                        addToJokes('_en-US', element);
                    }
                }
            });
            // tslint:disable-next-line:no-use-before-declare
            getQuotes();
        });
};

const getQuotes = (): void => {
    connection.query(
        `SELECT u.language, u.alias, n.nid, n.type, n.status,
FROM_UNIXTIME(n.changed) AS 'changed', FROM_UNIXTIME(n.created) AS 'created',
n.title, fdb.body_value AS 'content', fdb.body_summary AS 'contentSummary',
GROUP_CONCAT(ttd.name ORDER BY ttd.tid SEPARATOR '|' ) AS 'tagTitles',
GROUP_CONCAT(tu.alias ORDER BY ttd.tid SEPARATOR '|' ) AS 'tagLinks',
fdfs.field_soyleyen_value AS 'whoSaidThat',
fdfk.field_kaynak_value AS 'source'
FROM node n
    LEFT JOIN url_alias u ON u.source = CONCAT('node/', n.nid) AND u.language=n.language AND u.pid IN (
       SELECT MAX(stu.pid) FROM url_alias stu GROUP BY stu.source
    )
    LEFT JOIN field_data_body fdb ON fdb.entity_type = 'node' AND fdb.entity_id = n.nid AND fdb.revision_id = n.vid
    LEFT JOIN taxonomy_index ti ON ti.nid = n.nid
    LEFT JOIN taxonomy_term_data ttd ON ttd.tid = ti.tid
    LEFT JOIN url_alias tu ON tu.source = CONCAT('taxonomy/term/', ttd.tid) AND tu.language=ttd.language AND tu.pid IN (
        SELECT MAX(stu.pid) FROM url_alias stu GROUP BY stu.source
    )
    LEFT JOIN field_data_field_soyleyen fdfs ON fdfs.entity_id = n.nid AND fdfs.revision_id IN (
       SELECT MAX(fdfss.revision_id) FROM field_data_field_soyleyen fdfss GROUP BY fdfss.entity_id
    )
    LEFT JOIN field_data_field_kaynak fdfk ON fdfk.entity_id = n.nid AND fdfk.revision_id IN (
       SELECT MAX(fdfks.revision_id) FROM field_data_field_kaynak fdfks GROUP BY fdfks.entity_id
    )
WHERE n.type IN ('guzelsozler') AND n.status='1'
GROUP BY u.language, u.alias, n.nid, n.type, n.status, n.changed, n.created, n.title, fdb.body_value, fdb.body_summary
ORDER BY n.created ASC`,
        (error, results, fields) => {
            if (error) {
                throw error;
            }

            results.forEach((element) => {
                downloadFiles(element.content);
                element.documentID = fixDocID(element.alias.replace(/guzel_sozler\//gi, ''));
                if (element.language === 'und' || element.language === 'tr') {
                    addToQuotes('_tr-TR', element);
                }
                if (element.language === 'und' || element.language === 'en') {
                    addToQuotes('_en-US', element);
                }
            });
            // tslint:disable-next-line:no-use-before-declare
            getDialogs();
        });
};

const getDialogs = (): void => {
    connection.query(
        `SELECT u.language, u.alias, n.nid, n.type, n.status,
FROM_UNIXTIME(n.changed) AS 'changed', FROM_UNIXTIME(n.created) AS 'created',
n.title, fdb.body_value AS 'content', fdb.body_summary AS 'contentSummary',
GROUP_CONCAT(ttd.name ORDER BY ttd.tid SEPARATOR '|' ) AS 'tagTitles',
GROUP_CONCAT(tu.alias ORDER BY ttd.tid SEPARATOR '|' ) AS 'tagLinks',
  (
    SELECT GROUP_CONCAT(fdfs.field_kisiler_value ORDER BY fdfs.delta SEPARATOR '|' ) FROM field_data_field_kisiler fdfs
    WHERE fdfs.entity_id = n.nid AND fdfs.revision_id IN (
       SELECT MAX(fdfss.revision_id) FROM field_data_field_kisiler fdfss GROUP BY fdfss.entity_id
    )
  ) AS 'persons',
fdfk.field_kaynak_value AS 'source'
FROM node n
    LEFT JOIN url_alias u ON u.source = CONCAT('node/', n.nid) AND u.language=n.language AND u.pid IN (
       SELECT MAX(stu.pid) FROM url_alias stu GROUP BY stu.source
    )
    LEFT JOIN field_data_body fdb ON fdb.entity_type = 'node' AND fdb.entity_id = n.nid AND fdb.revision_id = n.vid
    LEFT JOIN taxonomy_index ti ON ti.nid = n.nid
    LEFT JOIN taxonomy_term_data ttd ON ttd.tid = ti.tid
    LEFT JOIN url_alias tu ON tu.source = CONCAT('taxonomy/term/', ttd.tid) AND tu.language=ttd.language AND tu.pid IN (
        SELECT MAX(stu.pid) FROM url_alias stu GROUP BY stu.source
    )
    LEFT JOIN field_data_field_kaynak fdfk ON fdfk.entity_id = n.nid AND fdfk.revision_id IN (
       SELECT MAX(fdfks.revision_id) FROM field_data_field_kaynak fdfks GROUP BY fdfks.entity_id
    )
WHERE n.type IN ('diyalog') AND n.status='1'
GROUP BY u.language, u.alias, n.nid, n.type, n.status, n.changed, n.created, n.title, fdb.body_value, fdb.body_summary
ORDER BY n.created ASC`,
        (error, results, fields) => {
            if (error) {
                throw error;
            }

            results.forEach((element) => {
                downloadFiles(element.content);
                element.documentID = fixDocID(element.alias.replace(/diyalog\//gi, ''));
                if (element.language === 'und' || element.language === 'tr') {
                    addToDialogs('_tr-TR', element);
                }
                if (element.language === 'und' || element.language === 'en') {
                    addToDialogs('_en-US', element);
                }
            });
            // tslint:disable-next-line:no-use-before-declare
            saveToFile();
        });
};

/* endregion */

getTaxonomy();

const saveToFile = (): void => {
    writeResultToFile(pathOfDataJson, dataFirestore);
    connection.end();
};
