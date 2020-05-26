import { Storage } from '@google-cloud/storage';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { GoogleAuth } from 'google-auth-library';
import * as h2p from 'html2plaintext';
import * as moment from 'moment';
import { EnumChangefreq, SitemapItem, SitemapStream, streamToPromise } from 'sitemap';

import { FUNCTIONS_CONFIG } from './config';
import { getNullInsteadOfUndefined } from './helpers';
import { JobModel, LocaleAlternateModel } from './models/';
import { playAtPlayground } from './playground';

/** firestore instance */
const db = admin.firestore();

/** generate site map */
const generateSiteMap = async (jobData: JobModel): Promise<any> => {
    console.log('generateSiteMap is started');
    let urlList: Array<SitemapItem> = [];
    let hostname: string;
    if (jobData.hasOwnProperty('customData')) {
        if (jobData.customData.hasOwnProperty('urlList')) {
            urlList = jobData.customData.urlList;
        }
        if (jobData.customData.hasOwnProperty('hostname')) {
            hostname = jobData.customData.hostname;
        }
    }
    if (!hostname) {
        throw new Error('You have to provide a hostname with customData for sitemap!');
    }

    return Promise.all(jobData.cultureCodes.map(async cultureCode =>
        Promise.all(jobData.collections.map(async collectionPrefix =>
            db.collection(`${collectionPrefix}_${cultureCode}`).get()
                .then(async mainDocsSnapshot =>
                    Promise.all(mainDocsSnapshot.docs.map(async mainDoc => {
                        const mData = mainDoc.data();
                        const languageCode = cultureCode.substring(0, 2);
                        const img = mData.hasOwnProperty('image') ? mData.image.src : undefined;
                        urlList.push({
                            url: `${languageCode}/${mData.routePath}/${mainDoc.id}`.replace(/[\/]+/g, '/'),
                            changefreq: (collectionPrefix === 'pages' || collectionPrefix === 'taxonomy')
                                ? EnumChangefreq.DAILY : EnumChangefreq.WEEKLY,
                            img,
                            video: undefined,
                            links: undefined
                        });

                        return Promise.resolve();
                    }))
                )
        ))
    ))
        .then(async value => {
            const sitemap = new SitemapStream({hostname});
            for (const url of urlList) {
                sitemap.write(url);
            }
            sitemap.end();

            return streamToPromise(sitemap);
        })
        .then(async sm =>
            db.collection('firstResponses')
                .doc('sitemap.xml')
                .set({content: sm.toString(), code: 200, changed: admin.firestore.FieldValue.serverTimestamp()}, {merge: true})
                // tslint:disable-next-line:promise-function-async
                .then(() =>
                    Promise.resolve({count: urlList.length})
                ));
};

/** generate SEO data */
const generateSEOData = async (jobData: JobModel): Promise<any> => {
    console.log('generateSEOData is started');
    let processedDocCount = 0;
    const processedDocs = [];

    return Promise.all(jobData.cultureCodes.map(async cultureCode =>
        Promise.all(jobData.collections.map(async collectionPrefix =>
            db.collection(`${collectionPrefix}_${cultureCode}`).get()
                .then(async mainDocsSnapshot =>
                    Promise.all(mainDocsSnapshot.docs.map(async mainDoc => {
                        const mData = mainDoc.data();
                        if (!mData.hasOwnProperty('seo') || jobData.overwrite) {
                            const seo = {};

                            return mainDoc.ref.set({seo}, {merge: true})
                                .then(() => {
                                    processedDocCount++;
                                    processedDocs.push({
                                        path: `${collectionPrefix}_${cultureCode}/${mainDoc.id}`,
                                        old: getNullInsteadOfUndefined(mData.seo), new: seo});
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

/** generate JsonLD */
const generateJsonLDs = async (jobData: JobModel): Promise<any> => {
    console.log('generateJsonLDs is started');
    let processedDocCount = 0;
    const processedDocs = [];

    return Promise.all(jobData.cultureCodes.map(async cultureCode =>
        Promise.all(jobData.collections.map(async collectionPrefix =>
            db.collection(`${collectionPrefix}_${cultureCode}`).get()
                .then(async mainDocsSnapshot =>
                    Promise.all(mainDocsSnapshot.docs.map(async mainDoc => {
                        const mData = mainDoc.data();
                        if (!mData.hasOwnProperty('jsonLDs') || jobData.overwrite) {
                            const jsonLDs = [];

                            return mainDoc.ref.set({jsonLDs}, {merge: true})
                                .then(() => {
                                    processedDocCount++;
                                    processedDocs.push({
                                        path: `${collectionPrefix}_${cultureCode}/${mainDoc.id}`,
                                        old: getNullInsteadOfUndefined(mData.jsonLDs), new: jsonLDs});
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

/** generate locales */
const generateLocales = async (jobData: JobModel): Promise<any> => {
    console.log('generateLocales is started');
    let processedDocCount = 0;
    const processedDocs = [];

    return Promise.all(jobData.cultureCodes.map(async cultureCode =>
        Promise.all(jobData.collections.map(async collectionPrefix =>
            db.collection(`${collectionPrefix}_${cultureCode}`).get()
                .then(async mainDocsSnapshot =>
                    Promise.all(mainDocsSnapshot.docs.map(async mainDoc => {
                        const mData = mainDoc.data();
                        if (!mData.hasOwnProperty('locales') || jobData.overwrite) {
                            const alternateCultureCodes = FUNCTIONS_CONFIG.supportedCultureCodes.slice();
                            // tslint:disable-next-line:no-dynamic-delete
                            delete alternateCultureCodes[alternateCultureCodes.indexOf(cultureCode)];
                            const locales = [] as Array<LocaleAlternateModel>;

                            return Promise.all(alternateCultureCodes.map(async cultureCodeAlt =>
                                db.collection(`${collectionPrefix}_${cultureCodeAlt}`)
                                    .where('i18nKey', '==', mData.i18nKey)
                                    .limit(1)
                                    .get()
                                    .then(async documentSnapshots => {
                                        if (documentSnapshots.docs.length > 0) {
                                            const languageCodeAlt = cultureCodeAlt.substring(0, 2);
                                            const mainDocAlt = documentSnapshots.docs[0];
                                            const mDataAlt = mainDocAlt.data();
                                            locales.push({
                                                cultureCode: cultureCodeAlt,
                                                slug: `${languageCodeAlt}/${mDataAlt.routePath}/${mainDocAlt.id}`
                                                    .replace(/[\/]+/g, '/')
                                            });
                                        }

                                        return Promise.resolve();
                                    })
                            )).then(async () =>
                                mainDoc.ref.set({locales}, {merge: true})
                                    .then(() => {
                                        processedDocCount++;
                                        processedDocs.push({
                                            path: `${collectionPrefix}_${cultureCode}/${mainDoc.id}`,
                                            old: getNullInsteadOfUndefined(mData.locales), new: locales});
                                    })
                            );
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

/** generate description */
const generateDescription = async (jobData: JobModel): Promise<any> => {
    console.log('generateDescription is started');
    let processedDocCount = 0;
    const processedDocs = [];

    return Promise.all(jobData.cultureCodes.map(async cultureCode =>
        Promise.all(jobData.collections.map(async collectionPrefix =>
            db.collection(`${collectionPrefix}_${cultureCode}`).get()
                .then(async mainDocsSnapshot =>
                    Promise.all(mainDocsSnapshot.docs.map(async mainDoc => {
                        const mData = mainDoc.data();
                        if (!mData.hasOwnProperty('description') || jobData.overwrite) {
                            let cleanText = mData.contentSummary ? h2p(mData.contentSummary) :
                                mData.content ? h2p(mData.content) :
                                    mData.title;
                            cleanText = cleanText.replace(/[\r\n]/g, ' ');

                            const description = cleanText.indexOf(' ', 150) > -1 ?
                                `${cleanText.substring(0, cleanText.indexOf(' ', 150))}...` :
                                `${cleanText.substring(0, 160)}...`;

                            return mainDoc.ref.set({description}, {merge: true})
                                .then(() => {
                                    processedDocCount++;
                                    processedDocs.push({
                                        path: `${collectionPrefix}_${cultureCode}/${mainDoc.id}`,
                                        old: getNullInsteadOfUndefined(mData.description), new: description});
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

/** fix public files permissions on storage */
const fixPublicFilesPermissions = async (jobData: JobModel): Promise<any> => {
    console.log('fixPublicFilesPermissions is started');
    const storage = new Storage();
    const projectId = process.env.GCLOUD_PROJECT;
    const bucketName = `${projectId}.appspot.com`;
    const bucket = admin.storage().bucket(bucketName);

    let processedDocCount = 0;

    return bucket.getFiles({
        prefix: 'publicFiles',
        autoPaginate: false
    })
        .then(async allFiles => {
             const files = allFiles[0];

             return Promise.all(files.map(async file => {
                     if (file.name.endsWith('/')) {
                         return Promise.resolve();
                     }

                     return file.acl.add({
                         entity: 'allUsers',
                         role: storage.acl.READER_ROLE
                     }).then(info => {
                         // console.log(info); // this "info" contains lots of cool info about file
                         processedDocCount++;
                     });
                 }
             ));
         })
        .then(() =>
            Promise.resolve({processedDocCount})
        );
};

/** clear caches */
const clearCaches = async (jobData: JobModel): Promise<any> => {
    console.log('clearCaches is started');
    let processedDocCount = 0;
    let expireDate;
    let codeListToDelete;
    if (jobData.customData) {
        if (jobData.customData.hasOwnProperty('expireDate')) {
            expireDate = new Date(jobData.customData.expireDate.seconds * 1000);
        }
        if (jobData.customData.hasOwnProperty('expireDateDayDiff')) {
            expireDate = new Date();
            expireDate.setDate(Number(expireDate.getDate()) + Number(jobData.customData.expireDateDayDiff)); // add days
        }
        if (jobData.customData.hasOwnProperty('codeListToDelete')) {
            codeListToDelete = jobData.customData.codeListToDelete;
        }
    }
    let query = db.collection('firstResponses')
        .where('type', '==', 'cache');
    if (codeListToDelete) {
        query = query.where('code', 'in', codeListToDelete);
    }

    return query
        .limit(jobData.limit)
        .get()
        .then(async mainDocsSnapshot =>
            Promise.all(mainDocsSnapshot.docs.map(async mainDoc => {
                const mainDocData = mainDoc.data();
                if (expireDate && mainDocData.expireDate && mainDocData.expireDate.seconds * 1000 > expireDate.getTime()) {
                    // to keep newly created caches
                    return Promise.resolve();
                }

                return mainDoc.ref.delete()
                    .then(() => {
                        processedDocCount++;
                    });
            })))
        .then(() =>
            Promise.resolve({processedDocCount})
        );
};

/** recalculate order no of all of documents */
const recalculateOrderNo = async (jobData: JobModel): Promise<any> => {
    console.log('recalculateOrderNo is started');
    let processedDocCount = 0;
    const processedDocs = [];

    return Promise.all(jobData.cultureCodes.map(async cultureCode =>
        Promise.all(jobData.collections.map(async collectionPrefix =>
            db.collection(`${collectionPrefix}_${cultureCode}`).get()
                .then(async mainDocsSnapshot => {
                    if (collectionPrefix === 'pages') {
                        await Promise.all(mainDocsSnapshot.docs.map(async mainDoc => {
                            if (mainDoc.data().orderNo !== -1) {
                                await mainDoc.ref.set({orderNo: -1}, {merge: true})
                                    .then(() => {
                                        processedDocCount++;
                                        processedDocs.push({
                                            path: `${collectionPrefix}_${cultureCode}/${mainDoc.id}`,
                                            old: getNullInsteadOfUndefined(mainDoc.data().orderNo), new: -1});
                                    });
                            }
                        }));
                    } else {
                        const allDocs: Array<any> = [];
                        mainDocsSnapshot.docs.map(mainDoc => {
                            allDocs.push({...mainDoc.data(), ...{mainDoc}});
                        });
                        allDocs.sort((a, b) =>
                            a.created && a.created.seconds ?
                                (b.created && b.created.seconds ?
                                    (a.created.seconds * 1000 > b.created.seconds * 1000 ? 1 : -1)
                                    : 1)
                                : -1);
                        let orderNo = 0;
                        allDocs.map(doc => {
                            orderNo--;
                            if (orderNo !== doc.orderNo) {
                                doc.newOrderNo = orderNo;
                            }
                        });
                        await Promise.all(allDocs.map(async doc => {
                            if (doc.newOrderNo) {
                                await doc.mainDoc.ref.set({orderNo: doc.newOrderNo}, {merge: true})
                                    .then(() => {
                                        processedDocCount++;
                                        processedDocs.push({
                                            path: `${collectionPrefix}_${cultureCode}/${doc.mainDoc.id}`,
                                            old: getNullInsteadOfUndefined(doc.orderNo), new: doc.newOrderNo});
                                    });
                            }
                        }));
                    }

                    return Promise.resolve();
                })
        ))
    ))
        .then(() =>
            Promise.resolve({processedDocCount, processedDocs})
        );
};

/** fix taxonomy leftovers */
const fixTaxonomyMaps = async (jobData: JobModel): Promise<any> => {
    console.log('fixTaxonomyMaps is started');
    let processedDocCount = 0;
    const processedDocs = [];
    jobData.collections = jobData.collections.filter(item => ['pages', 'taxonomy'].indexOf(item) === -1);

    return Promise.all(jobData.cultureCodes.map(async cultureCode => {
        const allTaxonomyKeys = await db.collection(`taxonomy_${cultureCode}`).get()
            .then(mainDocsSnapshot => mainDocsSnapshot.docs.map(mainDoc => mainDoc.id));

        return Promise.all(jobData.collections.map(async collectionPrefix =>
            db.collection(`${collectionPrefix}_${cultureCode}`).get()
                .then(async mainDocsSnapshot => {
                    await Promise.all(mainDocsSnapshot.docs.map(async mainDoc => {
                        const mData = mainDoc.data();
                        if (mData.hasOwnProperty('taxonomy')) {
                            const taxonomy = {...mData.taxonomy};
                            for (const key of Object.keys(mData.taxonomy)) {
                                if (allTaxonomyKeys.indexOf(key) === -1) {
                                    // tslint:disable-next-line:no-dynamic-delete
                                    delete taxonomy[key];
                                    continue;
                                }
                                const contentID = `${mData.routePath}/${mainDoc.id}`.replace(/\//gui, '_');
                                const docInTag = await db.doc(`taxonomy_${cultureCode}/${key}/contents/${contentID}`).get();
                                if (!docInTag.exists) {
                                    // tslint:disable-next-line:no-dynamic-delete
                                    delete taxonomy[key];
                                }
                            }
                            if (Object.keys(mData.taxonomy).length !== Object.keys(taxonomy).length) {
                                await mainDoc.ref.set({...mData, ...{taxonomy}})
                                    .then(() => {
                                        processedDocCount++;
                                        processedDocs.push({
                                            path: `${collectionPrefix}_${cultureCode}/${mainDoc.id}`,
                                            old: mData.taxonomy, new: taxonomy});
                                    });
                            }
                        }
                    }));

                    return Promise.resolve();
                })
        ));
    }))
        .then(() =>
            Promise.resolve({processedDocCount, processedDocs})
        );
};

/** backup firestore to storage */
export const backupFirestore = async (jobData: JobModel): Promise<any> => {
    console.log('backupFirestore is started');

    const auth = new GoogleAuth({
        scopes: [
            'https://www.googleapis.com/auth/datastore',
            'https://www.googleapis.com/auth/cloud-platform'
        ]
    });
    const client = await auth.getClient();
    const projectId = process.env.GCLOUD_PROJECT;
    const bucketName = `${projectId}.appspot.com`;
    const backupFileName = new Date().toISOString();
    const backupUrl = `gs://${bucketName}/backups/firestore/${backupFileName}.json`;
    const user = await auth.getCredentials();

    return client.request({
        url: `https://firestore.googleapis.com/v1beta1/projects/${projectId}/databases/(default):exportDocuments`,
        method: 'POST',
        data: {outputUriPrefix: backupUrl}
    })
        .then(() =>
            Promise.resolve({backupUrl})
        ).catch(reason => {
            console.error(`
---------------------------------------------------------
Please consider to check permissions of service accounts.
---------------------------------------------------------
https://console.cloud.google.com/iam-admin/iam
- Give "Cloud Datastore Import Export Admin" and "Editor" roles to
-   "${projectId}@appspot.gserviceaccount.com"
-   "${user.client_email}"
---------------------------------------------------------
Please consider to check if backup directory is already exist.
---------------------------------------------------------
gs://${bucketName}/backups/firestore/
---------------------------------------------------------
`);
            throw reason;
        });

};

/** job runner function */
export const jobRunner = functions
    // .region('europe-west1')
    // .runWith({ memory: '1GB', timeoutSeconds: 120 })
    .firestore
    .document('jobs/{jobId}')
    // tslint:disable-next-line:promise-function-async
    .onCreate((snap: DocumentSnapshot, context: functions.EventContext) => {
        const jobData = snap.data() as JobModel;
        jobData.id = snap.id;
        if (!jobData.collections) {
            jobData.collections = ['pages', 'articles', 'blogs', 'jokes', 'quotes', 'taxonomy'];
        }
        if (!jobData.cultureCodes) {
            jobData.cultureCodes = FUNCTIONS_CONFIG.supportedCultureCodes;
        }
        if (!jobData.limit) {
            jobData.limit = 5000;
        }
        const startedAt = new Date();
        console.log(moment(startedAt).format('YYYY.MM.DD HH:mm:ss'), 'jobRunner is started! jobData:', jobData);

        return snap.ref
            .set({started: admin.firestore.FieldValue.serverTimestamp()}, {merge: true})
            .then(async () => {
                if (jobData.actionKey === 'generateSiteMap') {
                    return generateSiteMap(jobData);
                }
                if (jobData.actionKey === 'generateSEOData') {
                    return generateSEOData(jobData);
                }
                if (jobData.actionKey === 'generateJsonLDs') {
                    return generateJsonLDs(jobData);
                }
                if (jobData.actionKey === 'generateLocales') {
                    return generateLocales(jobData);
                }
                if (jobData.actionKey === 'generateDescription') {
                    return generateDescription(jobData);
                }
                if (jobData.actionKey === 'fixPublicFilesPermissions') {
                    return fixPublicFilesPermissions(jobData);
                }
                if (jobData.actionKey === 'clearCaches') {
                    return clearCaches(jobData);
                }
                if (jobData.actionKey === 'recalculateOrderNo') {
                    return recalculateOrderNo(jobData);
                }
                if (jobData.actionKey === 'fixTaxonomyMaps') {
                    return fixTaxonomyMaps(jobData);
                }
                if (jobData.actionKey === 'backupFirestore') {
                    return backupFirestore(jobData);
                }
                if (jobData.actionKey === 'playAtPlayground') {
                    return playAtPlayground(jobData);
                }
            })
            .then(async value => {
                const finishedAt = new Date();
                const duration = moment.duration(moment(finishedAt).diff(moment(startedAt))).asSeconds();
                console.log(
                    moment(finishedAt).format('YYYY.MM.DD HH:mm:ss'),
                    'jobRunner is finished! duration:', duration, 'result:', value);

                return snap.ref.set(
                    {result: value, isSucceed: true, finished: admin.firestore.FieldValue.serverTimestamp(), duration},
                    {merge: true})
                    .then(() => ({result: value, isSucceed: true}));
            })
            .catch(async err => {
                const finishedAt = new Date();
                const duration = moment.duration(moment(finishedAt).diff(moment(startedAt))).asSeconds();
                console.error(
                    moment(finishedAt).format('YYYY.MM.DD HH:mm:ss'),
                    'jobRunner is failed! duration:', duration, 'error:', err);

                return snap.ref.set(
                    {
                        result: {message: err.toString(), stack: err.stack}, isSucceed: false,
                        finished: admin.firestore.FieldValue.serverTimestamp(), duration},
                    {merge: true})
                    .then(() => ({result: {message: err.toString(), stack: err.stack}, isSucceed: false}));
            });
    });
