// tslint:disable:no-implicit-dependencies
import * as admin from 'firebase-admin';
import * as fTest from 'firebase-functions-test';
import * as nodemailer from 'nodemailer';

import { firebaseAppStub, firestoreStub, storageStub } from './testing/index.spec';

let test = fTest();

describe('Helpers', (): void => {

    beforeAll(() => {
        test = fTest();
        spyOn(admin, 'initializeApp').and.returnValue(firebaseAppStub);
        spyOn(admin, 'app').and.returnValue(firebaseAppStub);
        spyOn(admin, 'firestore').and.returnValue(firestoreStub);
        spyOn(admin, 'storage').and.returnValue(storageStub);
        spyOn(nodemailer, 'createTransport').and.returnValue({
            sendMail: (data): Promise<any> =>
                // console.log(data);
                Promise.resolve({unitTest: true})
        });
    });

    afterAll(() => {
        test.cleanup();
    });

});
