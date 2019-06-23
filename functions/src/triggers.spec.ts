// tslint:disable:no-implicit-dependencies
import * as admin from 'firebase-admin';
import * as fTest from 'firebase-functions-test';
import * as nodemailer from 'nodemailer';

import { ContactModel } from './models/contact-model';
import { myData } from './testing/data.spec';
import { firebaseAppStub, firestoreStub } from './testing/index.spec';

let test = fTest();

describe('Triggers - Firestore', (): void => {
    let myFunctions;

    beforeAll(() => {
        test = fTest();
        spyOn(admin, 'initializeApp').and.returnValue(firebaseAppStub);
        spyOn(admin, 'app').and.returnValue(firebaseAppStub);
        spyOn(admin, 'firestore').and.returnValue(firestoreStub);
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
        spyOn(admin, 'initializeApp').and.returnValue(firebaseAppStub);
        spyOn(admin, 'app').and.returnValue(firebaseAppStub);
        spyOn(admin, 'firestore').and.returnValue(firestoreStub);
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
