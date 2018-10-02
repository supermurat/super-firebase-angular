// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

require('zone.js/dist/zone-node');

const functions = require('firebase-functions');
const express = require('express');
const path = require('path');
const { enableProdMode } = require('@angular/core');
const { renderModuleFactory } = require('@angular/platform-server');

const { AppServerModuleNgFactory } = require('../dist/server/main');

enableProdMode();

const indexEN = require('fs')
    .readFileSync(path.resolve(__dirname, '../dist/browser/en/index.html'), 'utf8')
    .toString();
const indexTR = require('fs')
    .readFileSync(path.resolve(__dirname, '../dist/browser/tr/index.html'), 'utf8')
    .toString();

const app = express();

app.get('**', function(req, res) {
    const supportedLocales = ['en', 'tr'];
    const defaultLocale = 'en';
    const matches = req.url.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)\//);
    //check if the requested url has a correct format '/locale' and matches any of the supportedLocales
    const locale = (matches && supportedLocales.indexOf(matches[1]) !== -1) ? matches[1] : defaultLocale;

    const index = locale ===  'tr' ? indexTR : indexEN;
    renderModuleFactory(AppServerModuleNgFactory, {
        url: req.path,
        document: index
    }).then(html => res.status(200).send(html));
});

exports.ssr = functions.https.onRequest(app);

exports.getTimeByURL = functions.https.onRequest((request, response) => {
    //response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    //response.set('Vary', 'Accept-Encoding, X-My-Custom-Header');
    const currentTime = new Date();
    response.status(200).send(`
    <!doctype html>
        <head>
          <title>Time</title>
        </head>
        <body>
          Current Time At Server : ${currentTime}
        </body>
    </html>`);

    //response.send("Hello from Firebase!");
});
