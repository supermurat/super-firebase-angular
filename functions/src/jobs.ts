import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import * as h2p from 'html2plaintext';
import * as sitemap from 'sitemap';

import { FUNCTIONS_CONFIG } from './config';
import { JobModel } from './job-model';
import { SiteMapUrlModel } from './site-map-url-model';

const db = admin.firestore();

export const generateSiteMap = async (snap: DocumentSnapshot, jobData: JobModel): Promise<any> => {
    console.log('generateSiteMap is started');
    const urlList: Array<SiteMapUrlModel> = [];
    const collections = ['pages', 'articles', 'blogs', 'jokes', 'quotes', 'taxonomy'];
    if (jobData.hasOwnProperty('customData')) {
        for (const smUrl of jobData.customData) {
            urlList.push(smUrl);
        }
    }

    return Promise.all(FUNCTIONS_CONFIG.supportedCultureCodes.map(async (cultureCode) =>
        Promise.all(collections.map(async (collectionPrefix) =>
            db.collection(`${collectionPrefix}_${cultureCode}`).get()
                .then(async (mainDocsSnapshot) =>
                    Promise.all(mainDocsSnapshot.docs.map(async (mainDoc) => {
                        const mData = mainDoc.data();
                        const languageCode = cultureCode.substring(0, 2);
                        // tslint:disable-next-line:no-string-literal
                        const img = mainDoc.hasOwnProperty('image') ? mainDoc['image']['src'] : undefined;
                        urlList.push({
                            url: `${languageCode}/${mData.routePath}/${mainDoc.id}`.replace(/[\/]+/g, '/'),
                            changefreq: (collectionPrefix === 'pages' || collectionPrefix === 'taxonomy')
                                ? 'daily' : 'weekly',
                            img
                        });

                        return Promise.resolve();
                    })))
                .catch((err) => {
                    console.error('db.collection().get()', err);
                })
        ))
    ))
        .then(async (values) => {
            const sm = sitemap.createSitemap({
                hostname: FUNCTIONS_CONFIG.hostname,
                cacheTime: 600000, // 600 sec - cache purge period
                urls: urlList
            });

            return db.collection('firstResponses')
                .doc('sitemap.xml')
                .set({content: sm.toString(), changed: new Date()}, {merge: true})
                // tslint:disable-next-line:promise-function-async
                .then(() =>
                    snap.ref.set({result: `Count of urls: ${urlList.length}`}, {merge: true})
                        .then(() => {
                            console.log('generateSiteMap is finished');
                        })
                        .catch((err) => {
                            console.error('snap.ref.set()', err);
                        }))
                .catch((err) => {
                    console.error('db.collection().doc().set()', err);
                });
        })
        .catch((err) => {
            console.error('Promise.all', err);
        });
};

export const generateSEOData = async (snap: DocumentSnapshot, jobData: JobModel): Promise<any> => {
    console.log('generateSEOData is started');
    let processedDocCount = 0;
    const collections = ['pages', 'articles', 'blogs', 'jokes', 'quotes', 'taxonomy'];

    return Promise.all(FUNCTIONS_CONFIG.supportedCultureCodes.map(async (cultureCode) =>
        Promise.all(collections.map(async (collectionPrefix) =>
            db.collection(`${collectionPrefix}_${cultureCode}`).get()
                .then(async (mainDocsSnapshot) =>
                    Promise.all(mainDocsSnapshot.docs.map(async (mainDoc) => {
                        const mData = mainDoc.data();
                        if (!mData.hasOwnProperty('seo') || jobData.overwrite) {
                            const seo = {};

                            return mainDoc.ref.set({seo}, {merge: true})
                                .then(() => {
                                    processedDocCount++;
                                })
                                .catch((err) => {
                                    console.error('mainDoc.ref.set()', err);
                                });
                        }

                        return Promise.resolve();
                    })))
                .catch((err) => {
                    console.error('db.collection().get()', err);
                })
        ))
    ))
        .then(async (values) =>
            snap.ref.set({result: `Count of processed documents: ${processedDocCount}`}, {merge: true})
                .then(() => {
                    console.log('generateSEOData is finished');
                })
                .catch((err) => {
                    console.error('snap.ref.set()', err);
                }))
        .catch((err) => {
            console.error('Promise.all', err);
        });
};

export const generateLocales = async (snap: DocumentSnapshot, jobData: JobModel): Promise<any> => {
    console.log('generateLocales is started');
    let processedDocCount = 0;
    const collections = ['pages', 'articles', 'blogs', 'jokes', 'quotes', 'taxonomy'];

    return Promise.all(FUNCTIONS_CONFIG.supportedCultureCodes.map(async (cultureCode) =>
        Promise.all(collections.map(async (collectionPrefix) =>
            db.collection(`${collectionPrefix}_${cultureCode}`).get()
                .then(async (mainDocsSnapshot) =>
                    Promise.all(mainDocsSnapshot.docs.map(async (mainDoc) => {
                        const mData = mainDoc.data();
                        if (!mData.hasOwnProperty('locales') || jobData.overwrite) {
                            const alternateCultureCodes = FUNCTIONS_CONFIG.supportedCultureCodes.slice();
                            // tslint:disable-next-line:no-dynamic-delete
                            delete alternateCultureCodes[alternateCultureCodes.indexOf(cultureCode)];
                            const locales = [] as Array<LocaleAlternateModel>;

                            return Promise.all(alternateCultureCodes.map(async (cultureCodeAlt) =>
                                db.collection(`${collectionPrefix}_${cultureCodeAlt}`)
                                    .where('i18nKey', '==', mData.i18nKey)
                                    .limit(1)
                                    .get()
                                    .then(async (documentSnapshots) => {
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
                                    .catch((err) => {
                                        console.error('db.collection({collectionPrefix}_{cultureCodeAlt}).get()', err);
                                    })
                            )).then(async (values) =>
                                mainDoc.ref.set({locales}, {merge: true})
                                    .then(() => {
                                        processedDocCount++;
                                    })
                                    .catch((err) => {
                                        console.error('mainDoc.ref.set()', err);
                                    })
                            );
                        }

                        return Promise.resolve();
                    })))
                .catch((err) => {
                    console.error('db.collection().get()', err);
                })
        ))
    ))
        .then(async (values) =>
            snap.ref.set({result: `Count of processed documents: ${processedDocCount}`}, {merge: true})
                .then(() => {
                    console.log('generateLocales is finished');
                })
                .catch((err) => {
                    console.error('snap.ref.set()', err);
                }))
        .catch((err) => {
            console.error('Promise.all', err);
        });
};

export const generateDescription = async (snap: DocumentSnapshot, jobData: JobModel): Promise<any> => {
    console.log('generateDescription is started');
    let processedDocCount = 0;
    const collections = ['pages', 'articles', 'blogs', 'jokes', 'quotes', 'taxonomy'];

    return Promise.all(FUNCTIONS_CONFIG.supportedCultureCodes.map(async (cultureCode) =>
        Promise.all(collections.map(async (collectionPrefix) =>
            db.collection(`${collectionPrefix}_${cultureCode}`).get()
                .then(async (mainDocsSnapshot) =>
                    Promise.all(mainDocsSnapshot.docs.map(async (mainDoc) => {
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
                                })
                                .catch((err) => {
                                    console.error('mainDoc.ref.set()', err);
                                });
                        }

                        return Promise.resolve();
                    })))
                .catch((err) => {
                    console.error('db.collection().get()', err);
                })
        ))
    ))
        .then(async (values) =>
            snap.ref.set({result: `Count of processed documents: ${processedDocCount}`}, {merge: true})
                .then(() => {
                    console.log('generateDescription is finished');
                })
                .catch((err) => {
                    console.error('snap.ref.set()', err);
                }))
        .catch((err) => {
            console.error('Promise.all', err);
        });
};

export const clearCaches = async (snap: DocumentSnapshot, jobData: JobModel): Promise<any> => {
    console.log('clearCaches is started');
    let processedDocCount = 0;
    let expireDate;
    if (jobData.customData !== undefined && Number(jobData.customData) > -1) {
        expireDate = new Date();
        expireDate.setDate(Number(expireDate.getDate()) + Number(jobData.customData)); // add days
    }

    return db.collection('firstResponses')
        .where('type', '==', 'cache')
        .get()
        .then(async (mainDocsSnapshot) =>
            Promise.all(mainDocsSnapshot.docs.map(async (mainDoc) => {
                if (expireDate && mainDoc.data().expireDate > expireDate) {
                    // to keep newly created caches
                    return Promise.resolve();
                }

                return mainDoc.ref.delete()
                    .then(() => {
                        processedDocCount++;
                    })
                    .catch((err) => {
                        console.error('mainDoc.ref.delete()', err);
                    });
            })))
        .then(async (values) =>
            snap.ref.set({result: `Count of processed documents: ${processedDocCount}`}, {merge: true})
                .then(() => {
                    console.log('clearCaches is finished');
                })
                .catch((err) => {
                    console.error('snap.ref.set()', err);
                }))
        .catch((err) => {
            console.error('Promise.all', err);
        });
};

export const jobRunner = functions
    // .region('europe-west1')
    // .runWith({ memory: '1GB', timeoutSeconds: 120 })
    .firestore
    .document('jobs/{jobId}')
    // tslint:disable-next-line:promise-function-async
    .onCreate((snap, context) => {
        console.log('jobRunner is started');
        const jobData = snap.data() as JobModel;
        if (jobData.actionKey === 'generateSiteMap') {
            return generateSiteMap(snap, jobData);
        } else if (jobData.actionKey === 'generateSEOData') {
            return generateSEOData(snap, jobData);
        } else if (jobData.actionKey === 'generateLocales') {
            return generateLocales(snap, jobData);
        } else if (jobData.actionKey === 'generateDescription') {
            return generateDescription(snap, jobData);
        } else if (jobData.actionKey === 'clearCaches') {
            return clearCaches(snap, jobData);
        }

        return Promise.resolve();
    });
