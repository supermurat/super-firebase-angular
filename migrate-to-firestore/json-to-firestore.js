const admin = require('firebase-admin');
const serviceAccount = require("./supermurat-com-service-key.json");
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
let data = require("./data.json");
const storage = require('@google-cloud/storage')();

// CONFIG
const bucketName = "supermurat-com.appspot.com";
const pathOfFiles = __dirname + path.sep + "files";
const remoteFilePath = "/publicFiles/"; // keep undefined in order to use relative path
// END OF CONFIG

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://" + serviceAccount.project_id + ".firebaseio.com"
});
admin.app().firestore().settings({timestampsInSnapshots: true});
const bucket = admin.storage().bucket(bucketName);

// FixFilePaths
function getFiles(dir, files_){
    files_ = files_ || [];
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
        let fileUpload = bucket.file(fileName);
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
            }).then(function(data) {
                //console.log(data); // this "data" contains lots of cool info about file
                resolve("https://storage.googleapis.com/" + bucket.name + fileName);
            }).catch(err => {
                reject(err);
            });
        });
        blobStream.end(fileContent);
    });
}

function uploadFileAndGetURL(pathOfFiles, filePath){
    return new Promise((resolve, reject) => {
        const relativePath = filePath.replace(pathOfFiles, "").replace(/\\/g, "/");
        const destinationPath = remoteFilePath ? remoteFilePath + path.basename(filePath) : relativePath;

        bucket.file(destinationPath).exists()
            .then(function(data) {
                if (data[0]) {
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
            });
    });
}

function uploadFilesAndFixFilePaths(){
    return new Promise((resolve, reject) => {
        let dataString = JSON.stringify(data);
        if (!fs.existsSync(pathOfFiles))
            fs.mkdir(pathOfFiles);
        const files = getFiles(pathOfFiles);
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
        if (nestedData.match(/^\d\d\d\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])[ T](00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])\.\d\d\d[Z]?$/gi)) {
            nestedData = new Date(nestedData);
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
                // console.log("nestedData:", nestedData);
                admin.firestore()
                    .collection(key)
                    .doc(docID)
                    .set(nestedData)
                    .then((res) => {
                        console.log("Document successfully written!");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
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
