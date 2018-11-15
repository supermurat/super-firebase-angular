const mysql = require('mysql');
const fs = require('fs');
const mysqlConfig = require("./mysql-config.json");

const connection = mysql.createConnection(mysqlConfig);

connection.connect();

const resultsForFirestore = {};
const collectionNameOfBlogs = "blogs";
resultsForFirestore[collectionNameOfBlogs] = {};
let totalOfItems = 1;
let countOfCompletedItems = 0;

function fixDocID(docID) {
    return docID.replace(/blog\//gi, '').replace(/gunluk\//gi, '').replace(/\//gi, '-').replace(/\\/gi, '-');
}

connection.query(
    "SELECT u.language, u.alias, n.nid, n.type, n.status, FROM_UNIXTIME(n.changed) AS 'changed', FROM_UNIXTIME(n.created) AS 'created', n.title, fdb.body_value AS 'content' FROM node n LEFT JOIN url_alias u ON u.source = CONCAT('node/', n.nid) AND u.language=n.language AND u.pid IN (SELECT MAX(stu.pid) FROM url_alias stu GROUP BY stu.source) LEFT JOIN field_data_body fdb ON fdb.entity_type = 'node' AND fdb.entity_id = n.nid AND fdb.revision_id = n.vid WHERE n.type='blog' AND n.status='1'",
    function (error, results, fields) {
        if (error) throw error;

        results.forEach(function(element) {
            const docID = fixDocID(element.alias); // TODO: set document ID for firestore
            resultsForFirestore[collectionNameOfBlogs][docID] = element;
        });
        countOfCompletedItems++;
        writeResultToFile();
});

connection.end();

function writeResultToFile() {
    if (countOfCompletedItems === totalOfItems){
        fs.writeFile('data.json', JSON.stringify(resultsForFirestore, undefined, 2), {encoding: 'utf8', flag: 'w'}, function (err) {
            if (err) throw err;
            console.log('Exported collection count:' + countOfCompletedItems);
        });
    }
}