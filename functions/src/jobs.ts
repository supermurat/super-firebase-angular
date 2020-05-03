import { Storage } from '@google-cloud/storage';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import * as h2p from 'html2plaintext';
import { EnumChangefreq, SitemapItem, SitemapStream, streamToPromise } from 'sitemap';

import { FUNCTIONS_CONFIG } from './config';
import { JobModel, LocaleAlternateModel } from './models/';

/** firestore instance */
const db = admin.firestore();

/** generate site map */
const generateSiteMap = async (jobData: JobModel): Promise<any> => {
    console.log('generateSiteMap is started');
    let urlList: Array<SitemapItem> = [];
    let hostname: string;
    const collections = ['pages', 'articles', 'blogs', 'jokes', 'quotes', 'taxonomy'];
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

    return Promise.all(FUNCTIONS_CONFIG.supportedCultureCodes.map(async cultureCode =>
        Promise.all(collections.map(async collectionPrefix =>
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
    const collections = ['pages', 'articles', 'blogs', 'jokes', 'quotes', 'taxonomy'];

    return Promise.all(FUNCTIONS_CONFIG.supportedCultureCodes.map(async cultureCode =>
        Promise.all(collections.map(async collectionPrefix =>
            db.collection(`${collectionPrefix}_${cultureCode}`).get()
                .then(async mainDocsSnapshot =>
                    Promise.all(mainDocsSnapshot.docs.map(async mainDoc => {
                        const mData = mainDoc.data();
                        if (!mData.hasOwnProperty('seo') || jobData.overwrite) {
                            const seo = {};

                            return mainDoc.ref.set({seo}, {merge: true})
                                .then(() => {
                                    processedDocCount++;
                                });
                        }

                        return Promise.resolve();
                    }))
                )
        ))
    ))
        .then(() =>
            Promise.resolve({count: processedDocCount})
        );
};

/** generate JsonLD */
const generateJsonLDs = async (jobData: JobModel): Promise<any> => {
    console.log('generateJsonLDs is started');
    let processedDocCount = 0;
    const collections = ['pages', 'articles', 'blogs', 'jokes', 'quotes', 'taxonomy'];

    return Promise.all(FUNCTIONS_CONFIG.supportedCultureCodes.map(async cultureCode =>
        Promise.all(collections.map(async collectionPrefix =>
            db.collection(`${collectionPrefix}_${cultureCode}`).get()
                .then(async mainDocsSnapshot =>
                    Promise.all(mainDocsSnapshot.docs.map(async mainDoc => {
                        const mData = mainDoc.data();
                        if (!mData.hasOwnProperty('jsonLDs') || jobData.overwrite) {
                            const jsonLDs = [];

                            return mainDoc.ref.set({jsonLDs}, {merge: true})
                                .then(() => {
                                    processedDocCount++;
                                });
                        }

                        return Promise.resolve();
                    }))
                )
        ))
    ))
        .then(() =>
            Promise.resolve({count: processedDocCount})
        );
};

/** generate locales */
const generateLocales = async (jobData: JobModel): Promise<any> => {
    console.log('generateLocales is started');
    let processedDocCount = 0;
    const collections = ['pages', 'articles', 'blogs', 'jokes', 'quotes', 'taxonomy'];

    return Promise.all(FUNCTIONS_CONFIG.supportedCultureCodes.map(async cultureCode =>
        Promise.all(collections.map(async collectionPrefix =>
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
                                    })
                            );
                        }

                        return Promise.resolve();
                    }))
                )
        ))
    ))
        .then(() =>
            Promise.resolve({count: processedDocCount})
        );
};

/** generate description */
const generateDescription = async (jobData: JobModel): Promise<any> => {
    console.log('generateDescription is started');
    let processedDocCount = 0;
    const collections = ['pages', 'articles', 'blogs', 'jokes', 'quotes', 'taxonomy'];

    return Promise.all(FUNCTIONS_CONFIG.supportedCultureCodes.map(async cultureCode =>
        Promise.all(collections.map(async collectionPrefix =>
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
                                });
                        }

                        return Promise.resolve();
                    }))
                )
        ))
    ))
        .then(() =>
            Promise.resolve({count: processedDocCount})
        );
};

/** fix public files permissions on storage */
const fixPublicFilesPermissions = async (jobData: JobModel): Promise<any> => {
    console.log('fixPublicFilesPermissions is started');
    const storage = new Storage();
    const bucketName = `${process.env.GCP_PROJECT}.appspot.com`;
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
            Promise.resolve({count: processedDocCount})
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
    if (!jobData.limit) {
        jobData.limit = 5000;
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
            Promise.resolve({count: processedDocCount})
        );
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
        console.log('jobRunner is started! jobData:', jobData);

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
            })
            .then(async value => {
                console.log('jobRunner is finished! result:', value);

                return snap.ref.set(
                    {result: value, isSucceed: true, finished: admin.firestore.FieldValue.serverTimestamp()},
                    {merge: true});
            })
            .catch(async err => {
                console.error('functions.onCreate', err);

                return snap.ref.set(
                    {
                        result: {message: err.toString(), stack: err.stack}, isSucceed: false,
                        finished: admin.firestore.FieldValue.serverTimestamp()},
                    {merge: true});
            });
    });
