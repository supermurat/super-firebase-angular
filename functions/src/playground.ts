import { Storage } from '@google-cloud/storage';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

import { FUNCTIONS_CONFIG } from './config';
import { JobModel } from './models/';

/** firestore instance */
const db = admin.firestore();

/**
 * KEEP THIS FUNCTION CLEAN - DO NOT COMMIT YOUR CHANGES
 * do one kind of job or just play at playground
 */
export const playAtPlayground = async (jobData: JobModel): Promise<any> => {
    console.log('playAtPlayground is started');
    let processedDocCount = 0;
    const processedDocs = [];

    return Promise.all(jobData.cultureCodes.map(async cultureCode =>
        Promise.all(jobData.collections.map(async collectionPrefix =>
            db.collection(`${collectionPrefix}_${cultureCode}`).get()
                .then(async mainDocsSnapshot =>
                    Promise.all(mainDocsSnapshot.docs.map(async mainDoc => {
                        const mData = mainDoc.data();
                        if (mData.hasOwnProperty('playWithMe') || jobData.overwrite) {
                            const playData = {};

                            return mainDoc.ref.set({playData}, {merge: true})
                                .then(() => {
                                    processedDocCount++;
                                    processedDocs.push({
                                        path: `${collectionPrefix}_${cultureCode}/${mainDoc.id}`,
                                        old: mData.playData, new: playData});
                                });
                        }

                        return Promise.resolve();
                    }))
                )
        ))
    ))
        .then(() =>
            Promise.resolve({processedDocCount, processedDocs})
        );
};
