import * as colors from 'colors';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

import { checkDirectory } from './helper';

// tslint:disable-next-line:no-var-requires no-require-imports
const serviceAccount = require('../supermurat-com-service-key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});
const bucketName = `${serviceAccount.project_id}.appspot.com`;
const bucket = admin.storage().bucket(bucketName);
const pathOfData = `${path.dirname(__dirname) + path.sep}data`;
const pathOfFiles = `${pathOfData + path.sep}files`;

checkDirectory(pathOfFiles);

const downloadFromStorage = async (): Promise<any> => {
    const allFiles = await bucket.getFiles({
        autoPaginate: false
    });
    const files = allFiles[0];
    for (const file of files) {
        const filePath = pathOfFiles + path.sep + file.name.replace(/\//gi, path.sep);
        checkDirectory(path.dirname(filePath));
        if (file.name.endsWith('/')) {
            continue;
        }
        if (!fs.existsSync(filePath)) {
            file.createReadStream()
                .on('error', (err) => {
                    console.error(err);
                })
                .on('response', (response) => {
                    // Server connected and responded with the specified status and headers.
                })
                .on('end', () => {
                    // The file is fully downloaded.
                })
                .pipe(fs.createWriteStream(filePath));
            console.log('File Downloaded:', file.name);
        } else {
            console.log('File is Already Downloaded:', file.name);
        }
    }
};

downloadFromStorage()
    .then(() => {
        console.log(colors.bold(colors.green('Files Downloaded Successfully!')));
    })
    .catch((error) => {
        console.error(error);
    });
