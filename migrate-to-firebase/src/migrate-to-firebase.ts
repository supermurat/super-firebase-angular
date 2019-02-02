import { Storage } from '@google-cloud/storage';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as mime from 'mime-types';
import * as path from 'path';

// tslint:disable-next-line:no-var-requires no-require-imports
const serviceAccount = require('../supermurat-com-service-key.json');

// tslint:disable-next-line:no-var-requires no-require-imports
let data = require('../data/data.json');

const storage = new Storage();

// CONFIG
// keep "remoteFilePath" undefined in order to use relative path
// think about to give read permission for your users or public : "../firebase/storage.rules"
const remoteFilePath = '/publicFiles/';
// END OF CONFIG

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});
const bucketName = `${serviceAccount.project_id}.appspot.com`;
const bucket = admin.storage().bucket(bucketName);
const pathOfData = `${path.dirname(__dirname) + path.sep}data`;
const pathOfFiles = `${pathOfData + path.sep}files`;

// File
const getFiles = (dir: string, files: Array<string>): Array<string> => {
    const filesWithBefore = files || [];
    const currentFiles = fs.readdirSync(dir);
    for (const currentFile of currentFiles) {
        const name = String(dir + path.sep + currentFile);
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, filesWithBefore);
        } else {
            filesWithBefore.push(name);
        }
    }

    return filesWithBefore;
};

const uploadImageToStorage = async (fileContent: any, fileName: string): Promise<any> =>
    new Promise<any>((resolve, reject): void => {
        const fileUpload = bucket.file(fileName);
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: mime.lookup(fileName)
            }
        });
        blobStream.on('error', (error) => {
            reject(error);
        });
        blobStream.on('finish', () => {
            fileUpload.acl.add({
                entity: 'allUsers',
                role: storage.acl.READER_ROLE
            }).then((info) => {
                // console.log(info); // this "info" contains lots of cool info about file
                resolve(`https://storage.googleapis.com/${bucket.name}${fileName}`);
            }).catch((err) => {
                reject(err);
            });
        });
        blobStream.end(fileContent);
    });

const uploadFileAndGetURL = async (pathOfFile: string, filePath: string): Promise<any> =>
    new Promise<any>((resolve, reject): void => {
        const relativePath = filePath.replace(pathOfFile, '').replace(/\\/g, '/');
        const destinationPath = remoteFilePath ? remoteFilePath + path.basename(filePath) : relativePath;

        bucket.file(destinationPath).exists()
            .then((info) => {
                if (info[0]) {
                    const url = `https://storage.googleapis.com/${bucket.name}${destinationPath}`;
                    console.log('Already Uploaded File : ', url);
                    resolve({relativePath, url});
                } else {
                    const fileContent = fs.readFileSync(filePath);
                    uploadImageToStorage(fileContent, destinationPath)
                        .then((url) => {
                            console.log('Newly Uploaded File : ', url);
                            resolve({relativePath, url});
                        })
                        .catch((error) => {
                            reject(error);
                        });
                }
            })
            .catch((error) => {
                reject(error);
            });
    });

const uploadFilesAndFixFilePaths = async (): Promise<any> =>
    new Promise<any>((resolve, reject): void => {
        let dataString = JSON.stringify(data);
        if (!fs.existsSync(pathOfFiles)) {
            resolve();
        } // There is no directory (pathOfFiles) to upload, so let's skip to import only data.json
        const files = getFiles(pathOfFiles, undefined);
        if (files.length > 0) {
            const promises = [];
            files.forEach((filePath) => {
                promises.push(uploadFileAndGetURL(pathOfFiles, filePath));
            });
            Promise.all(promises)
                .then((results) => {
                    results.forEach((pru) => {
                        dataString = dataString.replace(new RegExp(pru.relativePath, 'gi'), pru.url);
                        // console.log(pru.relativePath, ">>", pru.url);
                    });
                    data = JSON.parse(dataString);
                    resolve();
                })
                .catch((e) => {
                    console.error(e);
                });
        } else {
            resolve();
        }
    });
// End OF File

const fixTimestamps = (nestedData: any): any => {
    if (typeof nestedData === 'string') {
        // tslint:disable-next-line: max-line-length
        if (nestedData.match(/^\d\d\d\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])[ T](00|[0-9]|0[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])\.\d\d\d[Z]?$/gi)
        ) {
            return new Date(nestedData);
        }
    } else if (typeof nestedData === 'object' && nestedData !== undefined && nestedData !== null) {
        if (nestedData.hasOwnProperty('_seconds') && nestedData.hasOwnProperty('_nanoseconds') &&
            Object.keys(nestedData).length === 2) {
            return new Date((nestedData._seconds * 1000) + Number(nestedData._nanoseconds));
        }
        Object.keys(nestedData).forEach((key) => {
            nestedData[key] = fixTimestamps(nestedData[key]);
        });
    }

    return nestedData;
};

const importIntoFirestore = (): void => {
    if (data) {
        Object.keys(data).forEach((key) => {
            const nestedContent = data[key];

            if (typeof nestedContent === 'object') {
                Object.keys(nestedContent).forEach((docID) => {
                    const nestedData = fixTimestamps(nestedContent[docID]);
                    const docData = {...nestedData};
                    Object.keys(nestedData).forEach((subKey) => {
                        if (subKey.startsWith('__collection__')) {
                            // tslint:disable-next-line:no-dynamic-delete
                            delete docData[subKey];
                        }
                    });

                    admin.firestore()
                        .collection(key)
                        .doc(docID)
                        .set(docData)
                        .then((res) => {
                            Object.keys(nestedData).forEach((subKey) => {
                                if (subKey.startsWith('__collection__')) {
                                    console.log('Importing sub collections:', key, docID, subKey);
                                    const subNestedContent = nestedData[subKey];
                                    Object.keys(subNestedContent).forEach((subDocID) => {
                                        const subDocData = {...subNestedContent[subDocID]};
                                        admin.firestore()
                                            .collection(key)
                                            .doc(docID)
                                            .collection(subKey.replace('__collection__', ''))
                                            .doc(subDocID)
                                            .set(subDocData)
                                            .then((subRes) => {
                                                console.log('Imported:', key, docID, subKey, subDocID);
                                            })
                                            .catch((error) => {
                                                console.error('Error:', key, docID, subKey, subDocID, error);
                                            });
                                    });
                                }
                            });
                            console.log('Imported:', key, docID);
                        })
                        .catch((error) => {
                            console.error('Error:', key, docID, error);
                        });

                });
            }
        });
    }
};

uploadFilesAndFixFilePaths()
    .then(() => {
        importIntoFirestore();
    })
    .catch((error) => {
        console.error(error);
    });
