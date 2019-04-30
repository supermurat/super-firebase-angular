import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

dotenv.config();
admin.initializeApp(functions.config().firebase);
admin.app()
    .firestore();

export * from './jobs';
export * from './ssr';
export * from './triggers';
