import * as fs from 'fs';
import * as mysql from 'mysql';
import * as path from 'path';

import { writeResultToFile } from './helper';

// tslint:disable-next-line:no-var-requires no-require-imports
const mysqlConfig = require('../mysql-config.json');

const connection = mysql.createConnection(mysqlConfig);

const pathOfData = `${path.dirname(__dirname) + path.sep}data`;
const pathOfDataJson = `${pathOfData + path.sep}data.json`;
if (!fs.existsSync(pathOfData)) {
    fs.mkdirSync(pathOfData);
}

connection.connect();

connection.query(
    "SELECT 'random1' AS 'id', CURRENT_TIMESTAMP() AS 'testDate'", // TODO: set your own mysql query
    (error, results, fields) => {
        if (error) { throw error; }

        const collectionName = 'myCollection'; // TODO: set collection name for firestore
        const dataFirestore = {};
        dataFirestore[collectionName] = {};
        results.forEach((element) => {
            const docID = element.id; // TODO: set document ID for firestore
            dataFirestore[collectionName][docID] = element;
        });

        writeResultToFile(pathOfDataJson, dataFirestore);
});

connection.end();
