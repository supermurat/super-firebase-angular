/**
 * Start writing Firebase Functions
 * https://firebase.google.com/docs/functions/typescript
 */

// tslint:disable-next-line:no-import-side-effect
import 'zone.js/dist/zone-node';

import { enableProdMode } from '@angular/core';
import { renderModuleFactory } from '@angular/platform-server';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { existsSync, readFileSync } from 'fs';
import * as path from 'path';

admin.initializeApp(functions.config().firebase);
admin.app()
    .firestore()
    .settings({timestampsInSnapshots: true});
const db = admin.firestore();

let serverMain: any;
let serverEN: any;
let serverTR: any;
let indexMain: any;
let indexEN: any;
let indexTR: any;

const uniqueKeyFor404 = '"doNotRemoveMe-ThisIsForOnlyGet404ErrorOnSSRWithUniqueAndHiddenKey"';
const isI18N = !existsSync(path.resolve(__dirname, '../dist/browser/index.html'));

if (isI18N) {
    // tslint:disable-next-line:no-var-requires no-require-imports
    serverEN = require('../dist/server/en/main');
    // tslint:disable-next-line:no-var-requires no-require-imports
    serverTR = require('../dist/server/tr/main');
    indexEN = readFileSync(path.resolve(__dirname, '../dist/browser/en/index.html'), 'utf8')
        .toString();
    indexTR = readFileSync(path.resolve(__dirname, '../dist/browser/tr/index.html'), 'utf8')
        .toString();
} else {
    // tslint:disable-next-line:no-var-requires no-require-imports
    serverMain = require('../dist/server/main');
    indexMain = readFileSync(path.resolve(__dirname, '../dist/browser/index.html'), 'utf8')
        .toString();
}

enableProdMode();

const app = express();

/** Redirection Record Model */
class RedirectionRecord {
    /** http code */
    code?: number;
    /** url to redirect */
    url?: string;
}

const getDynamicFile = (req: express.Request, res: express.Response) => {
    const fileName = req.url.replace(/\//gi, '');
    const fileExt = `.${fileName.split('.')[1]}`;
    db.collection('dynamicFiles').doc(fileName).get()
        .then((snapshot) => {
            if (!snapshot.exists) {
                console.log('No such file:', fileName);
                res.status(404)
                    .send(`404 : No such file:${fileName}`);
            } else {
                res.status(200)
                    .type(fileExt)
                    .send(snapshot.data().content.replace(/\\r\\n/g, '\r\n'));
            }
        })
        .catch((err) => {
            console.log('Error in getDynamicFile:', err);
            res.status(500)
                .send(err);
        });
};

const getSSR = (req: express.Request, res: express.Response) => {
    const supportedLocales = ['en', 'tr'];
    const defaultLocale = 'en';
    const matches = req.url.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)\//);
    // check if the requested url has a correct format '/locale' and matches any of the supportedLocales
    const locale = (matches && supportedLocales.indexOf(matches[1]) !== -1) ? matches[1] : defaultLocale;

    const index = !isI18N ? indexMain : locale ===  'tr' ? indexTR : indexEN;
    const server = !isI18N ? serverMain : locale ===  'tr' ? serverTR : serverEN;
    renderModuleFactory(server.AppServerModuleNgFactory, {
        url: req.path,
        document: index,
    }).then((html) => {
            const newUrlInfo = html.match(/--http-redirect-301--[\w\W]*--end-of-http-redirect-301--/gi);
            if (newUrlInfo) {
                const newUrl = newUrlInfo[0]
                    .replace(/--end-of-http-redirect-301--/gi, '')
                    .replace(/--http-redirect-301--/gi, '');
                res.redirect(301, newUrl);
            } else {
            // thing about redirect to 404 but maybe keeping current url is more cool
                res.status(html.indexOf(uniqueKeyFor404) > -1 ? 404 : 200)
                    .send(html);
            }
        },
    ).catch((err) => {
        console.log('Error in getSSR:', err);
    });
};

const checkRedirection = async (req: express.Request, res: express.Response) =>
    new Promise<RedirectionRecord>((resolve, reject) => {
        // firestore doesn't allow "/" to be in document ID
        const url = req.url.substring(1).replace(/\//gi, '\\');
        const documentID = decodeURIComponent(url);
        if (documentID) {
            db.collection('redirectionRecords')
                .doc(documentID)
                .get()
                .then((snapshot) => {
                    if (!snapshot.exists) {
                        console.log('!snapshot.exists:', documentID);
                        resolve();
                    } else {
                        resolve(snapshot.data());
                    }
                })
                .catch((err) => {
                    console.log('Error in checkRedirection:', err);
                    resolve(); // let's handle this error with SSR
                });
        } else {
            resolve();
        }
    });

app.get('**', (req: express.Request, res: express.Response) => {
    const matchesDynamicFiles = req.url.match(/^\/([a-zA-Z0-9]*(\.)[a-zA-Z0-9]*)$/);
    if (matchesDynamicFiles && req.url.length > 3) {
        getDynamicFile(req, res);
    } else {
        checkRedirection(req, res)
            .then((redirectionRecord: RedirectionRecord) => {
                if (redirectionRecord) {
                    console.log('redirectionRecord:', redirectionRecord);
                    res.redirect(redirectionRecord.code, redirectionRecord.url);
                } else {
                    getSSR(req, res);
                }
            })
            .catch((err) => {
                console.log('Error in app.get**:', err);
            });
    }
});

exports.ssr = functions.https.onRequest(app);
