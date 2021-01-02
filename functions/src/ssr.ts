// tslint:disable-next-line:no-import-side-effect ordered-imports
import 'zone.js/dist/zone-node';

// tslint:disable-next-line:ordered-imports
import { APP_BASE_HREF } from '@angular/common';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import * as compression from 'compression';
import * as cors from 'cors';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { existsSync, readFileSync } from 'fs';
import * as helmet from 'helmet';
import * as http from 'http';
import * as path from 'path';

import { FUNCTIONS_CONFIG } from './config';
import { FirstResponseModel } from './models';

/** firestore instance */
const db = admin.firestore();

/** server.js objects */
const serverJS: any = {};
/** index.html files */
const indexHtml: any = {};

/** unique key to manage 404 pages */
const uniqueKeyFor404 = '"do-not-remove-me-this-is-for-only-get-404-error-on-ssr-with-unique-and-hidden-key"';

// istanbul ignore next
if (existsSync(path.resolve(__dirname, '../dist/browser/index.html'))) {
    // tslint:disable-next-line:no-var-requires no-require-imports
    serverJS[FUNCTIONS_CONFIG.defaultLanguageCode] = require(`../dist/server/main${''}`); // ${''}: to fix dynamic import issue of karma
    indexHtml[FUNCTIONS_CONFIG.defaultLanguageCode] = readFileSync(
        path.resolve(__dirname, '../dist/browser/index.html'), 'utf8')
        .toString();
} else {
    for (const supportedLanguageCode of FUNCTIONS_CONFIG.supportedLanguageCodes) {
        // istanbul ignore next
        if (existsSync(path.resolve(__dirname, `../dist/browser/${supportedLanguageCode}/index.html`))) {
            // tslint:disable-next-line:no-var-requires no-require-imports
            serverJS[supportedLanguageCode] = require(`../dist/server/${supportedLanguageCode}/main`);
            indexHtml[supportedLanguageCode] = readFileSync(
                path.resolve(__dirname, `../dist/browser/${supportedLanguageCode}/index.html`), 'utf8')
                .toString();
        }
    }
}

// istanbul ignore next
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

/** express app instance */
const app = express();

// app.use(compression());
app.use(cors(FUNCTIONS_CONFIG.cors));
app.use(helmet());
app.use(helmet.contentSecurityPolicy(FUNCTIONS_CONFIG.csp));

/** get current locale */
const getLocale = (req: express.Request): string => {
    const matches = req.url.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)\//);
    // check if the requested url has a correct format '/locale' and matches any of the supportedLocales

    return (matches && serverJS.hasOwnProperty(matches[1]) && indexHtml.hasOwnProperty(matches[1])) ?
        matches[1] : FUNCTIONS_CONFIG.defaultLanguageCode;
};

/** get document ID */
const getDocumentID = (req: express.Request): string => {
    try {
        // we do not use searchParams (req.query) on our url, we build clean url
        // probably we get these kind of requests because of search engines or our very old web site files
        // even if we use searchParams for any kind of case, no need to cache url with searchParams for seo (or ssr)
        // let it load cached page and let angular client to handle that searchParams
        // if you want to cache pages with searchParams, use "req.url" instead of "req.path" on next line
        let id = decodeURIComponent(req.path)
            .substring(1).replace(/\//gi, '\\'); // firestore doesn't allow "/" to be in document ID
        if (id.endsWith('\\')) {
            id = id.substring(0, id.length - 1);
        }
        // forbidden by firestore
        if (id === '.' ||
            id === '..' ||
            Buffer.byteLength(id, 'utf8') > 1500 ||
            new RegExp('__.*__').test(id)) {
            return undefined;
        }

        return id;
    } catch (e) {
        // istanbul ignore next
        console.error(e, 'req.url:', req.url);

        // istanbul ignore next
        return undefined;
    }
};

/** respond to SSR */
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

/** get SSR result */
const getSSR = async (req: express.Request, res: express.Response): Promise<void> =>
    new Promise((resolve, reject): void => {
        const locale = getLocale(req);
        const bundle = serverJS[locale];

        app.engine('html', bundle.ngExpressEngine({
            bootstrap: bundle.AppServerModule
        }));

        app.set('view engine', 'html');
        app.set('views', path.join(__dirname, '../dist/browser', locale));

        res.render(
            'index',
            {req, res, url: req.path, providers: [
                        {provide: APP_BASE_HREF, useValue: `/${locale}/`},
                        {provide: REQUEST, useValue: req},
                        {provide: RESPONSE, useValue: res}
                    ]},
            async (err, html): Promise<void> => {
                if (err) {
                    reject(err);
                } else {
                    const firstResponse = respondToSSR(req, res, html);
                    const documentID = getDocumentID(req);
                    if (FUNCTIONS_CONFIG.cacheResponses && firstResponse && documentID) {
                        await db.collection('firstResponses')
                            .doc(documentID)
                            .set(firstResponse);
                    }
                    resolve();
                }
            });
    });

/** check first responses for requested url */
const checkFirstResponse = async (req: express.Request, res: express.Response): Promise<any> =>
    new Promise<FirstResponseModel>((resolve, reject): void => {
        const documentID = getDocumentID(req);
        // istanbul ignore next
        if (documentID) {
            db.collection('firstResponses')
                .doc(documentID)
                .get()
                .then(snapshot => {
                    if (!snapshot.exists) {
                        resolve();
                    } else {
                        const id = snapshot.id;
                        const data = snapshot.data();
                        resolve({id, ...data});
                    }
                })
                .catch(// istanbul ignore next
                    err => {
                        console.error('Error in db.collection(firstResponses):', documentID, err);
                        resolve(); // let's handle this error with SSR
                    });
        } else {
            resolve();
        }
    });

/** send 404 page to request */
const send404Page = async (req: express.Request, res: express.Response): Promise<void> => {
    const locale = getLocale(req);
    const baseHtml = indexHtml[locale]
        .replace(/<title>[^<]*<\/title>/g, '<title>404 - Page not found</title>')
        .replace(
            '<app-root></app-root>',
            '<app-root><h1>404 - Page Not Found</h1><a href="/"><h2>Go to Home Page</h2></a></app-root>');

    res.status(404)
        .send(baseHtml);

    return Promise.resolve();
};

/** check if requested URL is valid */
const isRequestValid = async (req: express.Request, res: express.Response): Promise<boolean> => {
    // this is for our 404 pages
    if (req.url.endsWith('/http-404')) {
        await send404Page(req, res);

        return Promise.resolve(false);
    }

    return FUNCTIONS_CONFIG.isRequestValid(req, res, send404Page);
};

app.get('**', (req: express.Request, res: express.Response) => {
    isRequestValid(req, res)
        .then(async isValid => {
            if (isValid) {
                await checkFirstResponse(req, res)
                    .then(async (firstResponse: FirstResponseModel): Promise<void> => {
                        if (firstResponse && firstResponse.code === 301) {
                            res.redirect(firstResponse.code, firstResponse.url);
                        } else if (firstResponse && firstResponse.code === 404) {
                            await send404Page(req, res);
                        } else if (firstResponse && firstResponse.code === 200 && firstResponse.type === 'file') {
                            const fileNameParts = firstResponse.id.split('.');
                            const fileExt = `.${fileNameParts[fileNameParts.length - 1]}`;
                            res.status(200)
                                .type(fileExt)
                                .send(firstResponse.content.replace(/\\r\\n/g, '\r\n'));
                        } else if (FUNCTIONS_CONFIG.cacheResponses &&
                            firstResponse && firstResponse.code === 200 && firstResponse.type === 'cache' &&
                            (!firstResponse.expireDate || firstResponse.expireDate.seconds * 1000 > new Date().getTime())) {
                            respondToSSR(req, res, firstResponse.content);
                        } else {
                            await getSSR(req, res);
                        }

                        return Promise.resolve();
                    });
            }

            return Promise.resolve();
        }).catch(
            // istanbul ignore next
            err => {
                console.error(err);
                res.status(500)
                    .send(err);
            });
});

/** ssr function */
export const ssr = functions
    // .region('europe-west1')
    // .runWith({ memory: '1GB', timeoutSeconds: 120 })
    .https.onRequest(app);

if (process.env.IS_RUNNING_ON_UNIT_TEST === 'TRUE') {
    // res.render() getting empty result without an error message while UNIT TEST
    // so let's use http.Server instead of functions.https.onRequest(app) for UNIT TEST
    app.use(express.static(path.join(__dirname, '../dist/browser'), {
        dotfiles: 'ignore',
        etag: false,
        index: false,
        maxAge: '1d',
        redirect: false,
        setHeaders: (res, fpath, stat): void => {
            res.set('x-timestamp', Date.now().toString());
        }
    }));
    new http.Server(app).listen(FUNCTIONS_CONFIG.unitTestHttpPort, () => {
        console.log(`TEST server starting at http://127.0.0.1:${FUNCTIONS_CONFIG.unitTestHttpPort} for UNIT TEST`);
    });
}
