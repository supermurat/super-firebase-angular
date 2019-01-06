import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp(functions.config().firebase);
admin.app()
    .firestore()
    .settings({timestampsInSnapshots: true});

import { jobRunner } from './jobs';
import { ssr } from './ssr';

exports.jobRunner = jobRunner;
exports.ssr = ssr;
