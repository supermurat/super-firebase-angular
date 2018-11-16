const mysql = require('mysql');
const fs = require('fs');
const latinize = require('latinize');

const mysqlConfig = require("./mysql-config.json");

const connection = mysql.createConnection(mysqlConfig);

connection.connect();

const resultsForFirestore = {};

const collectionNameOfBlogs = "blogs";
resultsForFirestore[collectionNameOfBlogs] = {};
const collectionNameOfPages = "pages";
resultsForFirestore[collectionNameOfPages] = {};

function fixDocID(docID) {
    docID = latinize(docID);
    return docID.toLocaleLowerCase()
        .replace(/ı\//gi, 'i')
        .replace(/blog\//gi, '').replace(/gunluk\//gi, '')
        .replace(/story\//gi, '').replace(/makale\//gi, '')
        .replace(/\//gi, '-').replace(/\\/gi, '-');
}

function getBlogs() {
    connection.query(
        "SELECT u.language, u.alias, n.nid, n.type, n.status, FROM_UNIXTIME(n.changed) AS 'changed', FROM_UNIXTIME(n.created) AS 'created', n.title, fdb.body_value AS 'content' FROM node n LEFT JOIN url_alias u ON u.source = CONCAT('node/', n.nid) AND u.language=n.language AND u.pid IN (SELECT MAX(stu.pid) FROM url_alias stu GROUP BY stu.source) LEFT JOIN field_data_body fdb ON fdb.entity_type = 'node' AND fdb.entity_id = n.nid AND fdb.revision_id = n.vid WHERE n.type='blog' AND n.status='1' ORDER BY n.changed ASC",
        function (error, results, fields) {
            if (error) throw error;

            let i = 1;
            results.forEach(function(element) {
                element.orderNo = i * -1;
                const docID = fixDocID(element.alias);
                resultsForFirestore[collectionNameOfBlogs][docID] = element;
                i++;
            });
            getPages();
        });
}

function getPages() {
    connection.query(
        "SELECT u.language, u.alias, n.nid, n.type, n.status, FROM_UNIXTIME(n.changed) AS 'changed', FROM_UNIXTIME(n.created) AS 'created', n.title, fdb.body_value AS 'content' FROM node n LEFT JOIN url_alias u ON u.source = CONCAT('node/', n.nid) AND u.language=n.language AND u.pid IN (SELECT MAX(stu.pid) FROM url_alias stu GROUP BY stu.source) LEFT JOIN field_data_body fdb ON fdb.entity_type = 'node' AND fdb.entity_id = n.nid AND fdb.revision_id = n.vid WHERE n.type IN ('page', 'story') AND n.status='1' ORDER BY n.changed ASC",
        function (error, results, fields) {
            if (error) throw error;

            let i = 1;
            results.forEach(function(element) {
                element.orderNo = i * -1;
                const docID = fixDocID(element.alias);
                resultsForFirestore[collectionNameOfPages][docID] = element;
                i++;
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