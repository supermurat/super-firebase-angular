import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import * as sitemap from 'sitemap';
import { FUNCTIONS_CONFIG } from './config';
import { JobModel } from './job-model';
import { SiteMapUrlModel } from './site-map-url-model';

const db = admin.firestore();

export const generateSiteMap = async (snap: DocumentSnapshot) => {
    console.log('generateSiteMap is started');
    const urlList: Array<SiteMapUrlModel> = [];
    const collectionList = [];
    const languageCodes = ['en-US', 'tr-TR'];
    const collections = ['pages', 'articles', 'blogs', 'jokes', 'quotes', 'taxonomy'];
    for (const lang of languageCodes) {
        for (const col of collections) {
            collectionList.push(`${col}_${lang}`);
        }
    }

    return Promise.all(collectionList.map(async (mainCollection) =>
        db.collection(mainCollection).get()
            .then(async (mainDocsSnapshot) =>
                Promise.all(mainDocsSnapshot.docs.map(async (mainDoc) => {
                    const mData = mainDoc.data();
                    const languageCode = mainCollection.endsWith('tr-TR') ? 'tr' : 'en';
                    urlList.push({
                        url: `${languageCode}/${mData.routePath}/${mainDoc.id}`.replace(/[\/]+/g, '/'),
                        changefreq: (mainCollection.startsWith('pages') || mainCollection.startsWith('taxonomy'))
                            ? 'daily' : 'weekly',
                        // tslint:disable-next-line:no-string-literal
                        img: mainDoc['image']
                    });

                    return Promise.resolve();
                })))
            .catch((err) => {
                console.error('db.collection().get()', err);
            })))
        .then(async (values) => {
            const sm = sitemap.createSitemap({
                hostname: FUNCTIONS_CONFIG.hostname,
                cacheTime: 600000, // 600 sec - cache purge period
                urls: urlList
            });

            return db.collection('dynamicFiles')
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

export const generateSEOData = async (snap: DocumentSnapshot) => {
    console.log('generateSEOData is started');
    let processedDocCount = 0;
    const collectionList = [];
    const languageCodes = ['en-US', 'tr-TR'];
    const collections = ['pages', 'articles', 'blogs', 'jokes', 'quotes', 'taxonomy'];
    for (const lang of languageCodes) {
        for (const col of collections) {
            collectionList.push(`${col}_${lang}`);
        }
    }

    return Promise.all(collectionList.map(async (mainCollection) =>
        db.collection(mainCollection).get()
            .then(async (mainDocsSnapshot) =>
                Promise.all(mainDocsSnapshot.docs.map(async (mainDoc) => {
                    const mData = mainDoc.data();
                    if (!mData.hasOwnProperty('seo')) {
                        const cultureCode = mainCollection.endsWith('tr-TR') ? 'tr-TR' : 'en-US';
                        const languageCode = cultureCode.substring(0, 2);
                        const cultureCodeAlt = cultureCode === 'tr-TR' ? 'en-US' : 'tr-TR';
                        const languageCodeAlt = cultureCodeAlt.substring(0, 2);
                        const seo = {
                            localeAlternates: [] as Array<LocaleAlternateModel>// ,
                            // custom: {},
                            // tw: {},
                            // og: {}
                        };
                        seo.localeAlternates.push({
                            cultureCode,
                            slug: `${languageCode}/${mData.routePath}/${mainDoc.id}`.replace(/[\/]+/g, '/')
                        });

                        return db.collection(mainCollection.replace(cultureCode, cultureCodeAlt))
                            .where('i18nKey', '==', mData.i18nKey)
                            .limit(1)
                            .get()
                            .then(async (documentSnapshots) => {
                                if (documentSnapshots.docs.length > 0) {
                                    const mainDocAlt = documentSnapshots.docs[0];
                                    const mDataAlt = mainDocAlt.data();
                                    seo.localeAlternates.push({
                                        cultureCode: cultureCodeAlt,
                                        slug: `${languageCodeAlt}/${mDataAlt.routePath}/${mainDocAlt.id}`
                                            .replace(/[\/]+/g, '/')
                                    });
                                }

                                return mainDoc.ref.set({seo}, {merge: true})
                                    .then(() => {
                                        processedDocCount++;
                                    })
                                    .catch((err) => {
                                        console.error('mainDoc.ref.set()', err);
                                    });
                            })
                            .catch((err) => {
                                console.error('db.collection(replace(cultureCode, cultureCodeAlt)).get()', err);
                            });
                    }

                    return Promise.resolve();
                })))
            .catch((err) => {
                console.error('db.collection().get()', err);
            })))
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

export const jobRunner = functions.firestore
    .document('jobs/{jobId}')
    // tslint:disable-next-line:promise-function-async
    .onCreate((snap, context) => {
        console.log('jobRunner is started');
        const newValue = snap.data() as JobModel;
        if (newValue.actionKey === 'generateSiteMap') {
            return generateSiteMap(snap);
        } else if (newValue.actionKey === 'generateSEOData') {
            return generateSEOData(snap);
        }

        return Promise.resolve();
    });
