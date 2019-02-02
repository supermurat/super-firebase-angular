import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

dotenv.config();
admin.initializeApp(functions.config().firebase);
admin.app()
    .firestore();

import { jobRunner } from './jobs';
import { ssr } from './ssr';

exports.jobRunner = jobRunner;
exports.ssr = ssr;
