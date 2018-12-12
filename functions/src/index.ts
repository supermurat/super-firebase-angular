// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
//

require('zone.js/dist/zone-node');

const admin = require('firebase-admin');
const functions = require('firebase-functions');
const express = require('express');
const path = require('path');
const { enableProdMode } = require('@angular/core');
const { renderModuleFactory } = require('@angular/platform-server');
const { readFileSync, existsSync } = require('fs');

admin.initializeApp(functions.config().firebase);
admin.app().firestore().settings({timestampsInSnapshots: true});
const db = admin.firestore();
let serverMain;
let serverEN;
let serverTR;
let indexMain;
let indexEN;
let indexTR;

const uniqueKeyFor404 = '"doNotRemoveMe-ThisIsForOnlyGet404ErrorOnSSRWithUniqueAndHiddenKey"';
const isI18N = !existsSync(path.resolve(__dirname, '../dist/browser/index.html'));

if (isI18N) {
    serverEN = require('../dist/server/en/main');
    serverTR = require('../dist/server/tr/main');
    indexEN = readFileSync(path.resolve(__dirname, '../dist/browser/en/index.html'), 'utf8')
        .toString();
    indexTR = readFileSync(path.resolve(__dirname, '../dist/browser/tr/index.html'), 'utf8')
        .toString();
} else {
    serverMain = require('../dist/server/main');
    indexMain = readFileSync(path.resolve(__dirname, '../dist/browser/index.html'), 'utf8')
        .toString();
}

enableProdMode();

const app = express();

function getDynamicFile(req, res){
    const fileName = req.url.replace(/\//gi, "");
    const fileExt = '.' + fileName.split(".")[1];
    db.collection('dynamicFiles').doc(fileName).get()
        .then((snapshot) => {
            if (!snapshot.exists) {
                console.log('No such file:', fileName);
                res.status(404).send('404 : No such file:' + fileName);
            } else {
                res.status(200).type(fileExt).send(snapshot.data().content.replace(/\\r\\n/g, "\r\n"));
            }
        })
        .catch((err) => {
            console.log('Error in getDynamicFile:', err);
            res.status(500).send(err);
        });
}

function getSSR(req, res){
    const supportedLocales = ['en', 'tr'];
    const defaultLocale = 'en';
    const matches = req.url.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)\//);
    //check if the requested url has a correct format '/locale' and matches any of the supportedLocales
    const locale = (matches && supportedLocales.indexOf(matches[1]) !== -1) ? matches[1] : defaultLocale;

    const index = !isI18N ? indexMain : locale ===  'tr' ? indexTR : indexEN;
    const server = !isI18N ? serverMain : locale ===  'tr' ? serverTR : serverEN;
    renderModuleFactory(server.AppServerModuleNgFactory, {
        url: req.path,
        document: index
    }).then(html =>
        {
            const newUrlInfo = html.match(/--http-redirect-301--[\w\W]*--end-of-http-redirect-301--/gi);
            if (newUrlInfo){
                const newUrl = newUrlInfo[0]
                    .replace(/--end-of-http-redirect-301--/gi, "")
                    .replace(/--http-redirect-301--/gi, "");
                res.redirect(301, newUrl);
            } else
            // thing about redirect to 404 but maybe keeping current url is more cool
                res.status(html.indexOf(uniqueKeyFor404) > -1 ? 404 : 200).send(html);
        }
    );
}

function checkRedirection(req, res){
    return new Promise((resolve, reject) => {
        const url = req.url.substring(1).replace(/\//gi, "\\"); // firestore doesn't allow "/" to be in document ID
        const documentID = decodeURIComponent(url);
        if (documentID)
            db.collection('redirectionRecords').doc(documentID).get()
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
        else
            resolve();
    });
}

app.get('**', function(req, res) {
    const matchesDynamicFiles = req.url.match(/^\/([a-zA-Z0-9]*(\.)[a-zA-Z0-9]*)$/);
    if (matchesDynamicFiles && req.url.length > 3) {
        getDynamicFile(req, res);
    } else {
        checkRedirection(req, res)
            .then((redirectionRecord : { code: string, url: string }) => {
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
