// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
//

require('zone.js/dist/zone-node');

const functions = require('firebase-functions');
const express = require('express');
const path = require('path');
const { enableProdMode } = require('@angular/core');
const { renderModuleFactory } = require('@angular/platform-server');
const { readFileSync, existsSync } = require('fs');


let serverMain;
let serverEN;
let serverTR;
let indexMain;
let indexEN;
let indexTR;

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

app.get('**', function(req, res) {
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
    }).then(html => res.status(200).send(html));
});

exports.ssr = functions.https.onRequest(app);
