import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import * as sitemap from 'sitemap';
import { JobModel } from './job-model';
import { SiteMapUrlModel } from './site-map-url-model';

const db = admin.firestore();

export const generateSiteMap = (snap: DocumentSnapshot) => {
    console.log('generateSiteMap is started');
    const urlList: Array<SiteMapUrlModel> = [];
    const promiseList = [];
    const collectionList = [];
    const languageCodes = ['en-US', 'tr-TR'];
    const collections = ['pages', 'articles', 'blogs', 'jokes', 'quotes', 'taxonomy'];
    for (const lang of languageCodes) {
        for (const col of collections) {
            collectionList.push(`${col}_${lang}`);
        }
    }

    for (const mainCollection of collectionList) {
        const pMain = db.collection(mainCollection).get();
        promiseList.push(pMain);
        pMain
            .then((mainDocsSnapshot) => {
                mainDocsSnapshot.forEach((mainDoc) => {
                    const mData = mainDoc.data();
                    const langPrefix = mainCollection.endsWith('tr-TR') ? 'tr' : 'en';
                    urlList.push({
                        url: `${langPrefix}/${mData.routePath}/${mainDoc.id}`.replace('//', '/'),
                        changefreq: (mainCollection.startsWith('pages') || mainCollection.startsWith('taxonomy'))
                            ? 'daily' : 'weekly',
                        // tslint:disable-next-line:no-string-literal
                        img: mainDoc['image']
                    });
                });
            })
            .catch((err) => {
                console.error(err);
            });
    }

    Promise.all(promiseList)
        .then(async (values) => {
            const sm = sitemap.createSitemap({
                hostname: 'http://supermurat.com',
                cacheTime: 600000, // 600 sec - cache purge period
                urls: urlList
            });
            db.collection('dynamicFiles')
                .doc('sitemap.xml')
                .set({content: sm.toString(), changed: new Date()}, {merge: true})
                .catch((err) => {
                    console.error(err);
                });
            console.log('generateSiteMap is finished');

            return snap.ref.set({result: `Count of urls: ${urlList.length}`}, {merge: true});
        })
        .catch((err) => {
            console.error(err);
        });
};

export const jobRunner = functions.firestore
    .document('jobs/{jobId}')
    .onCreate((snap, context) => {
        console.log('jobRunner is started');
        const newValue = snap.data() as JobModel;
        if (newValue.actionKey === 'generateSiteMap') {
            generateSiteMap(snap);
        }
    });
