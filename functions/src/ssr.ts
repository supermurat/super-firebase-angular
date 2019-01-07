// tslint:disable-next-line:no-import-side-effect
import 'zone.js/dist/zone-node';

import { enableProdMode } from '@angular/core';
import { renderModuleFactory } from '@angular/platform-server';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { existsSync, readFileSync } from 'fs';
import * as path from 'path';
import { FUNCTIONS_CONFIG } from './config';
import { RedirectionRecordModel } from './redirection-record-model';

const db = admin.firestore();

const serverJS: any = {};
const indexHtml: any = {};

const uniqueKeyFor404 = '"do-not-remove-me-this-is-for-only-get-404-error-on-ssr-with-unique-and-hidden-key"';

if (existsSync(path.resolve(__dirname, '../dist/browser/index.html'))) {
    // tslint:disable-next-line:no-var-requires no-require-imports
    serverJS[FUNCTIONS_CONFIG.defaultLanguageCode] = require(`../dist/server/main`);
    indexHtml[FUNCTIONS_CONFIG.defaultLanguageCode] = readFileSync(
        path.resolve(__dirname, `../dist/browser/index.html`), 'utf8')
        .toString();
} else {
    for (const supportedLanguageCode of FUNCTIONS_CONFIG.supportedLanguageCodes) {
        if (existsSync(path.resolve(__dirname, `../dist/browser/${supportedLanguageCode}/index.html`))) {
            // tslint:disable-next-line:no-var-requires no-require-imports
            serverJS[supportedLanguageCode] = require(`../dist/server/${supportedLanguageCode}/main`);
            indexHtml[supportedLanguageCode] = readFileSync(
                path.resolve(__dirname, `../dist/browser/${supportedLanguageCode}/index.html`), 'utf8')
                .toString();
        }
    }
}

if (!serverJS.hasOwnProperty(FUNCTIONS_CONFIG.defaultLanguageCode) ||
    !indexHtml.hasOwnProperty(FUNCTIONS_CONFIG.defaultLanguageCode)) {
    throw new Error(`Default Language Code (${
        FUNCTIONS_CONFIG.defaultLanguageCode
    }) should be in loaded languages (serverJS:${
        Object.keys(serverJS).toString()
    }, indexHtml:${
        Object.keys(indexHtml).toString()
    })!`);
}

enableProdMode();

const app = express();

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
    const matches = req.url.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)\//);
    // check if the requested url has a correct format '/locale' and matches any of the supportedLocales
    const locale = (matches && serverJS.hasOwnProperty(matches[1]) && indexHtml.hasOwnProperty(matches[1])) ?
        matches[1] : FUNCTIONS_CONFIG.defaultLanguageCode;

    renderModuleFactory(serverJS[locale].AppServerModuleNgFactory, {
        url: req.path,
        document: indexHtml[locale]
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
        }
    ).catch((err) => {
        console.log('Error in getSSR:', err);
    });
};

const checkRedirection = async (req: express.Request, res: express.Response) =>
    new Promise<RedirectionRecordModel>((resolve, reject) => {
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
            .then((redirectionRecord: RedirectionRecordModel) => {
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

export const ssr = functions.https.onRequest(app);
