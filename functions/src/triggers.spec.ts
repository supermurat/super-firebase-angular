// tslint:disable:no-implicit-dependencies
import * as admin from 'firebase-admin';
import * as fTest from 'firebase-functions-test';
import * as googleAuthLib from 'google-auth-library';
import * as nodemailer from 'nodemailer';

import { ContactModel } from './models';
import { myData } from './testing/data.spec';
import { firebaseAppStub, firestoreStub, googleAuthStub, googleAuthStubConfig } from './testing/index.spec';

let test = fTest();

describe('Triggers - Firestore', (): void => {
    let myFunctions;

    beforeAll(() => {
        test = fTest();
        spyOn(admin, 'initializeApp').and.returnValue(firebaseAppStub as any);
        spyOn(admin, 'app').and.returnValue(firebaseAppStub as any);
        spyOn(admin, 'firestore').and.returnValue(firestoreStub as any);
        spyOn(nodemailer, 'createTransport').and.returnValue({
            sendMail: (data): Promise<any> =>
                Promise.resolve({unitTest: true})
        });

        // tslint:disable-next-line:no-require-imports
        myFunctions = require('./index');
    });

    afterAll(() => {
        test.cleanup();
    });

    it('should send e-mail to both of admin and owner when got a message for en-US', async () => {
        const snap = {
            data: (): ContactModel => (
                {
                    userLongName: 'Unit Test', email: 'my@unittest.com',
                    message: 'Hello from Unit Test', isSendCopyToOwner: true, isAgreed: true
                })
        };
        const wrapped = test.wrap(myFunctions.newMessageEn);

        expect(await wrapped(snap))
            .toEqual('Mail send succeed: my@unittest.com');
    });

    it('should send e-mail to only admin when got a message for en-US', async () => {
        const snap = {
            data: (): ContactModel => (
                {
                    userLongName: 'Unit Test', email: 'my@unittest.com',
                    message: 'Hello from Unit Test', isSendCopyToOwner: false, isAgreed: false
                })
        };
        const wrapped = test.wrap(myFunctions.newMessageEn);

        expect(await wrapped(snap))
            .toEqual('Mail send succeed: admin@unittest.com');
    });

    it('should send e-mail to both of admin and owner when got a message for tr-TR', async () => {
        const snap = {
            data: (): ContactModel => (
                {
                    userLongName: 'Unit Test', email: 'my@unittest.com',
                    message: 'Unit Test`ten Merhaba', isSendCopyToOwner: true, isAgreed: true
                })
        };
        const wrapped = test.wrap(myFunctions.newMessageTr);

        expect(await wrapped(snap))
            .toEqual('Mail send succeed: my@unittest.com');
    });

    it('should send e-mail to only admin when got a message for tr-TR', async () => {
        const snap = {
            data: (): ContactModel => (
                {
                    userLongName: 'Unit Test', email: 'my@unittest.com',
                    message: 'Unit Test`ten Merhaba', isSendCopyToOwner: false, isAgreed: false
                })
        };
        const wrapped = test.wrap(myFunctions.newMessageTr);

        expect(await wrapped(snap))
            .toEqual('Mail send succeed: admin@unittest.com');
    });

});

describe('Triggers - Firestore - NoData', (): void => {
    let myFunctions;
    let currentConfigs;

    beforeAll(() => {
        test = fTest();
        spyOn(admin, 'initializeApp').and.returnValue(firebaseAppStub as any);
        spyOn(admin, 'app').and.returnValue(firebaseAppStub as any);
        spyOn(admin, 'firestore').and.returnValue(firestoreStub as any);
        spyOn(nodemailer, 'createTransport').and.returnValue({
            sendMail: (data): Promise<any> =>
                Promise.resolve({unitTest: true})
        });
        currentConfigs = myData.configs;
        delete myData.configs['private_en-US'];
        delete myData.configs['private_tr-TR'];

        // tslint:disable-next-line:no-require-imports
        myFunctions = require('./index');
    });

    afterAll(() => {
        test.cleanup();
        myData.configs = currentConfigs;
    });

    it('should not send e-mail without configs/private_en-US', async () => {
        const snap = {
            data: (): ContactModel => (
                {
                    userLongName: 'Unit Test', email: 'my@unittest.com',
                    message: 'Hello from Unit Test', isSendCopyToOwner: true, isAgreed: true
                })
        };
        const wrapped = test.wrap(myFunctions.newMessageEn);

        expect(await wrapped(snap))
            .toEqual(new Error('There is no private config!'));
    });

    it('should not send e-mail without configs/private_tr-TR', async () => {
        const snap = {
            data: (): ContactModel => (
                {
                    userLongName: 'Unit Test', email: 'my@unittest.com',
                    message: 'Unit Test`ten Merhaba', isSendCopyToOwner: true, isAgreed: true
                })
        };
        const wrapped = test.wrap(myFunctions.newMessageTr);

        expect(await wrapped(snap))
            .toEqual(new Error('There is no private config!'));
    });

});

describe('Triggers - Pub/Sub', (): void => {
    let myFunctions;

    beforeAll(() => {
        test = fTest();
        spyOn(admin, 'initializeApp').and.returnValue(firebaseAppStub as any);
        spyOn(admin, 'app').and.returnValue(firebaseAppStub as any);
        spyOn(admin, 'firestore').and.returnValue(firestoreStub as any);
        spyOn(googleAuthLib.GoogleAuth.prototype, 'getCredentials').and.returnValue(googleAuthStub.getCredentials() as any);
        spyOn(googleAuthLib.GoogleAuth.prototype, 'getClient').and.returnValue(googleAuthStub.getClient());

        // tslint:disable-next-line:no-require-imports
        myFunctions = require('./index');
    });

    afterAll(() => {
        googleAuthStubConfig.isFail = false;
        test.cleanup();
    });

    it('should call backupFirestore', async () => {
        const wrapped = test.wrap(myFunctions.autoBackupFirestore);
        const res = await wrapped({});

        expect(res.backupUrl)
            .toContain('gs://not-a-project.appspot.com/backups/firestore/');
    });

    it('should fail backupFirestore', async () => {
        googleAuthStubConfig.isFail = true;
        const wrapped = test.wrap(myFunctions.autoBackupFirestore);
        const res = await wrapped({});

        expect(res)
            .toEqual('Marked to fail!');
    });

});
