const mysql = require('mysql');
const fs = require('fs');
const mysqlConfig = require("./mysql-config.json");

const connection = mysql.createConnection(mysqlConfig);

connection.connect();

connection.query(
    "SELECT 'random1' AS 'id', CURRENT_TIMESTAMP() AS 'testDate'", // TODO: set your own mysql query
    function (error, results, fields) {
        if (error) throw error;

        const collectionName = "myCollection"; // TODO: set collection name for firestore
        const resultsForFirestore = {};
        resultsForFirestore[collectionName] = {};
        results.forEach(function(element) {
            const docID = element.id; // TODO: set document ID for firestore
            resultsForFirestore[collectionName][docID] = element;
        });

        fs.writeFile('data.json', JSON.stringify(resultsForFirestore, undefined, 2), {encoding: 'utf8', flag: 'w'}, function (err) {
            if (err) throw err;
            console.log('Exported row count:' + results.length);
        });
});

connection.end();
