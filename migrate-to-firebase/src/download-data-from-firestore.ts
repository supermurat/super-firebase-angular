import * as admin from 'firebase-admin';
import * as path from 'path';

import { checkDirectory, writeResultToFile } from './helper';

// tslint:disable-next-line:no-var-requires no-require-imports
const serviceAccount = require('../supermurat-com-service-key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});
const db = admin.firestore();
const pathOfData = `${path.dirname(__dirname) + path.sep}data`;
const pathOfDataJson = `${pathOfData + path.sep}data.json`;

const collectionListToDownload = []; // keep empty to download all of them
const checkForSubCollectionsOnTheseCollectionList = []; // keep empty to check on all of them

const dataFirestore = {};

checkDirectory(pathOfData);

const downloadFromFirestore = async (): Promise<any> => {
    const mainCollectionSnapshot = await db.listCollections();
    for (const mainCollection of mainCollectionSnapshot) {

        if (collectionListToDownload.length > 0 && collectionListToDownload.indexOf(mainCollection.id) === -1) {
            continue;
        }
        dataFirestore[mainCollection.id] = {};
        const mainDocsSnapshot = await db.collection(mainCollection.id).get();
        for (const mainDoc of mainDocsSnapshot.docs) {
            dataFirestore[mainCollection.id][mainDoc.id] = mainDoc.data();

            if (checkForSubCollectionsOnTheseCollectionList.length > 0 &&
                checkForSubCollectionsOnTheseCollectionList.indexOf(mainCollection.id) === -1) {
                console.log(mainCollection.id, mainDoc.id);
                continue;
            }
            const subCollectionSnapshot = await db.collection(mainCollection.id)
                .doc(mainDoc.id)
                .listCollections();
            for (const subCollection of subCollectionSnapshot) {
                dataFirestore[mainCollection.id][mainDoc.id][`__collection__${subCollection.id}`] = {};

                const subDocsSnapshot = await db.collection(mainCollection.id)
                    .doc(mainDoc.id)
                    .collection(subCollection.id)
                    .get();
                for (const subDoc of subDocsSnapshot.docs) {
                    dataFirestore[mainCollection.id][mainDoc.id]
                        [`__collection__${subCollection.id}`][subDoc.id] = subDoc.data();

                    // console.log(mainCollection.id, mainDoc.id, subCollection.id, subDoc.id);
                }
                console.log(mainCollection.id, mainDoc.id, subCollection.id);
            }
            console.log(mainCollection.id, mainDoc.id);
        }
        console.log(mainCollection.id);
    }
};

downloadFromFirestore()
    .then(() => {
        writeResultToFile(pathOfDataJson, dataFirestore);
    })
    .catch((error) => {
        console.error(error);
    });
