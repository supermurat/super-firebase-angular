import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as mime from 'mime-types';
import * as path from 'path';
import { Storage } from '@google-cloud/storage';

const serviceAccount = require("../supermurat-com-service-key.json");

let data = require("../data/data.json");

const storage = new Storage();

// CONFIG
// keep "remoteFilePath" undefined in order to use relative path
// think about to give read permission for your users or public : "../firebase/storage.rules"
const remoteFilePath = "/publicFiles/";
// END OF CONFIG

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://" + serviceAccount.project_id + ".firebaseio.com"
});
admin.app().firestore().settings({timestampsInSnapshots: true});
const bucketName = serviceAccount.project_id + ".appspot.com";
const bucket = admin.storage().bucket(bucketName);
const pathOfData = path.dirname(__dirname) + path.sep + "data";
const pathOfFiles = pathOfData + path.sep + "files";

// FixFilePaths
function getFiles(dir, _files){
    const files_ = _files || [];
    const files = fs.readdirSync(dir);
    for (const i in files){
        const name = dir + path.sep + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

function uploadImageToStorage(fileContent, fileName) {
    return new Promise((resolve, reject) => {
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
            }).then(function(info) {
                //console.log(info); // this "info" contains lots of cool info about file
                resolve("https://storage.googleapis.com/" + bucket.name + fileName);
            }).catch(err => {
                reject(err);
            });
        });
        blobStream.end(fileContent);
    });
}

function uploadFileAndGetURL(pathOfFile, filePath){
    return new Promise((resolve, reject) => {
        const relativePath = filePath.replace(pathOfFile, "").replace(/\\/g, "/");
        const destinationPath = remoteFilePath ? remoteFilePath + path.basename(filePath) : relativePath;

        bucket.file(destinationPath).exists()
            .then(function(info) {
                if (info[0]) {
                    const url = "https://storage.googleapis.com/" + bucket.name + destinationPath;
                    console.log("Already Uploaded File : ", url);
                    resolve({ relativePath: relativePath, url: url });
                } else {
                    const fileContent = fs.readFileSync(filePath);
                    uploadImageToStorage(fileContent, destinationPath)
                        .then(url => {
                            console.log("Newly Uploaded File : ", url);
                            resolve({ relativePath: relativePath, url: url });
                        })
                        .catch(error => {
                            reject(error);
                        });
                }
            })
            .catch(error => {
                reject(error);
            });
    });
}

function uploadFilesAndFixFilePaths(){
    return new Promise((resolve, reject) => {
        let dataString = JSON.stringify(data);
        if (!fs.existsSync(pathOfFiles))
            resolve(); // There is no directory (pathOfFiles) to upload, so let's skip to import only data.json
        const files = getFiles(pathOfFiles, undefined);
        if (files.length > 0) {
            const promises = [];
            files.forEach(function (filePath) {
                promises.push(uploadFileAndGetURL(pathOfFiles, filePath));
            });
            Promise.all(promises)
                .then((results) => {
                    results.forEach(function (pru) {
                        dataString = dataString.replace(new RegExp(pru.relativePath, 'gi'), pru.url);
                        //console.log(pru.relativePath, ">>", pru.url);
                    });
                    data = JSON.parse(dataString);
                    resolve();
                })
                .catch((e) => {
                    console.log(e);
                });
        } else {
            resolve();
        }
    });
}
// End OF FixFilePaths

function fixTimestamps(nestedData){
    if (typeof nestedData === "string") {
        if (nestedData.match(/^\d\d\d\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])[ T](00|[0-9]|0[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])\.\d\d\d[Z]?$/gi)) {
            return new Date(nestedData);
        }
    } else if (typeof nestedData === "object" && nestedData !== undefined && nestedData !== null) {
        Object.keys(nestedData).forEach(key => {
            nestedData[key] = fixTimestamps(nestedData[key]);
        });
    }
    return nestedData;
}

function importIntoFirestore(){
    data && Object.keys(data).forEach(key => {
        const nestedContent = data[key];

        if (typeof nestedContent === "object") {
            Object.keys(nestedContent).forEach(docID => {
                const nestedData = fixTimestamps(nestedContent[docID]);
                const docData = {...nestedData};
                Object.keys(nestedData).forEach(subKey => {
                    if (subKey.startsWith("__collection__")) {
                        delete docData[subKey];
                    }
                });

                admin.firestore()
                    .collection(key)
                    .doc(docID)
                    .set(docData)
                    .then((res) => {
                        Object.keys(nestedData).forEach(subKey => {
                            if (subKey.startsWith("__collection__")) {
                                console.log("Importing sub collections:", key, docID, subKey);
                                const subNestedContent = nestedData[subKey];
                                Object.keys(subNestedContent).forEach(subDocID => {
                                    const subDocData = {...subNestedContent[subDocID]};
                                    admin.firestore()
                                        .collection(key)
                                        .doc(docID)
                                        .collection(subKey.replace("__collection__", ""))
                                        .doc(subDocID)
                                        .set(subDocData)
                                        .then((subRes) => {
                                            console.log("Imported:", key, docID, subKey, subDocID);
                                        })
                                        .catch((error) => {
                                            console.error("Error:", key, docID, subKey, subDocID, error);
                                        });
                                });
                            }
                        });
                        console.log("Imported:", key, docID);
                    })
                    .catch((error) => {
                        console.error("Error:", key, docID, error);
                    });

            });
        }
    });
}

uploadFilesAndFixFilePaths()
    .then(() => {
        importIntoFirestore();
    })
    .catch(error => {
        console.log(error);
    });
