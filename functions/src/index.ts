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

const index = require('fs')
    .readFileSync(path.resolve(__dirname, '../dist/browser/index.html'), 'utf8')
    .toString();

const app = express();

app.get('**', function(req, res) {
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
