// tslint:disable-next-line:no-import-side-effect ordered-imports
import 'zone.js/dist/zone-node';

// tslint:disable-next-line:ordered-imports
import { enableProdMode } from '@angular/core';
import { renderModuleFactory } from '@angular/platform-server';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { existsSync, readFileSync } from 'fs';
import * as path from 'path';

import { FUNCTIONS_CONFIG } from './config';
import { FirstResponseModel } from './first-response-model';

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

const getLocale = (req: express.Request): string => {
    const matches = req.url.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)\//);
    // check if the requested url has a correct format '/locale' and matches any of the supportedLocales

    return (matches && serverJS.hasOwnProperty(matches[1]) && indexHtml.hasOwnProperty(matches[1])) ?
        matches[1] : FUNCTIONS_CONFIG.defaultLanguageCode;
};

const getDocumentID = (req: express.Request): string => {
    // firestore doesn't allow "/" to be in document ID
    try {
        return decodeURIComponent(req.url).substring(1).replace(/\//gi, '\\');
    } catch (e) {
        console.error(e);

        return req.url.substring(1).replace(/\//gi, '\\');
    }
};

const respondToSSR = (req: express.Request, res: express.Response, html: string): FirstResponseModel => {
    const expireDate = new Date();
    const newUrlInfo = html.match(/--http-redirect-301--[\w\W]*--end-of-http-redirect-301--/gi);
    let referer = req.header('Referer') || req.header('Referrer');
    if (!referer) {
        referer = '';
    }
    if (newUrlInfo) {
        const newUrl = newUrlInfo[0]
            .replace(/--end-of-http-redirect-301--/gi, '')
            .replace(/--http-redirect-301--/gi, '');
        res.redirect(301, newUrl);
        expireDate.setDate(expireDate.getDate() + 365); // add days

        return {code: 301, type: 'cache', url: newUrl, expireDate, referer};
    }
    if (html.indexOf(uniqueKeyFor404) > -1) {
        // thing about redirect to 404 but maybe keeping current url is more cool
        res.status(404)
            .send(html);
        expireDate.setDate(expireDate.getDate() + 365); // add days

        return {code: 404, type: 'cache', expireDate, referer};
    }
    res.status(200)
        .send(html);
    expireDate.setDate(expireDate.getDate() + 30); // add days

    return {code: 200, type: 'cache', content: html, expireDate, referer};
};

const getSSR = (req: express.Request, res: express.Response): void => {
    const locale = getLocale(req);

    renderModuleFactory(serverJS[locale].AppServerModuleNgFactory, {
        url: req.path,
        document: indexHtml[locale]
    }).then((html) => {
        const firstResponse = respondToSSR(req, res, html);
        const documentID = getDocumentID(req);
        if (FUNCTIONS_CONFIG.cacheResponses && firstResponse && documentID) {
            db.collection('firstResponses')
                .doc(documentID)
                .set(firstResponse)
                .catch((error) => {
                    console.error('Error in getSSR.db.collection.set()', documentID, error);
                });
        }
    }).catch((err) => {
        console.error('Error in getSSR:', err);
        res.status(500)
            .send(err);
    });
};

const checkFirstResponse = async (req: express.Request, res: express.Response): Promise<any> =>
    new Promise<FirstResponseModel>((resolve, reject): void => {
        const documentID = getDocumentID(req);
        if (documentID) {
            db.collection('firstResponses')
                .doc(documentID)
                .get()
                .then((snapshot) => {
                    if (!snapshot.exists) {
                        resolve();
                    } else {
                        const id = snapshot.id;
                        const data = snapshot.data();
                        resolve({id, ...data});
                    }
                })
                .catch((err) => {
                    console.error('Error in db.collection(firstResponses):', err);
                    resolve(); // let's handle this error with SSR
                });
        } else {
            resolve();
        }
    });

const send404Page = (req: express.Request, res: express.Response): void => {
    const locale = getLocale(req);
    const baseHtml = indexHtml[locale]
        .replace(/<title>[^<]*<\/title>/g, '<title>404 - Page not found</title>')
        .replace(
            '<app-root></app-root>',
            '<app-root><h1>404 - Page Not Found</h1><a href="/"><h2>Go to Home Page</h2></a></app-root>');

    res.status(404)
        .send(baseHtml);
};

const ifUrlIsInvalidSend404Page = (req: express.Request, res: express.Response): boolean => {
    if (req.url.startsWith('/?') || req.url.indexOf('?page') > -1 || req.url.indexOf('.php?') > -1) {
        // this is only for old php web site but keeping them forever would be better in case of search engines
        // a url like that won't be ok anymore
        send404Page(req, res);

        return true;
    }

    return false;
};

app.get('**', (req: express.Request, res: express.Response) => {
    if (ifUrlIsInvalidSend404Page(req, res)) {
        return;
    }
    checkFirstResponse(req, res)
        .then((firstResponse: FirstResponseModel) => {
            if (firstResponse && firstResponse.code === 301) {
                res.redirect(firstResponse.code, firstResponse.url);
            } else if (firstResponse && firstResponse.code === 404) {
                send404Page(req, res);
            } else if (firstResponse && firstResponse.code === 200 && firstResponse.type === 'file') {
                const fileNameParts = firstResponse.id.split('.');
                const fileExt = `.${fileNameParts[fileNameParts.length - 1]}`;
                res.status(200)
                    .type(fileExt)
                    .send(firstResponse.content.replace(/\\r\\n/g, '\r\n'));
            } else if (FUNCTIONS_CONFIG.cacheResponses &&
                firstResponse && firstResponse.code === 200 && firstResponse.type === 'cache' &&
                (firstResponse.expireDate === undefined || firstResponse.expireDate.toDate() > new Date())) {
                respondToSSR(req, res, firstResponse.content);
            } else {
                getSSR(req, res);
            }
        })
        .catch((err) => {
            console.error('Error in checkFirstResponse:', err);
            res.status(500)
                .send(err);
        });
});

export const ssr = functions
    // .region('europe-west1')
    // .runWith({ memory: '1GB', timeoutSeconds: 120 })
    .https.onRequest(app);
