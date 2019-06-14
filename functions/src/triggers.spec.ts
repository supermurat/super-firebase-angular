// tslint:disable:no-implicit-dependencies
import * as admin from 'firebase-admin';
import * as fTest from 'firebase-functions-test';
import * as nodemailer from 'nodemailer';

import { ContactModel } from './models/contact-model';
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
                // console.log(data);
                Promise.resolve({unitTest: true})
        });

        // tslint:disable-next-line:no-require-imports
        myFunctions = require('./index');
    });

    afterAll(() => {
        test.cleanup();
    });

    it('should call newMessageEn', async () => {
        const snap = {
            data: (): ContactModel => (
                {
                    userLongName: 'Unit Test', email: 'mw@unittest.com',
                    message: 'Hello from Unit Test', isSendCopyToOwner: true, isAgreed: true
                })
        };
        const wrapped = test.wrap(myFunctions.newMessageEn);

        expect(await wrapped(snap))
            .toEqual('Mail send succeed: mw@unittest.com');
    });

    it('should call newMessageTr', async () => {
        const snap = {
            data: (): ContactModel => (
                {
                    userLongName: 'Unit Test', email: 'mw@unittest.com',
                    message: 'Unit Test`ten Merhaba', isSendCopyToOwner: true, isAgreed: true
                })
        };
        const wrapped = test.wrap(myFunctions.newMessageTr);

        expect(await wrapped(snap))
            .toEqual('Mail send succeed: mw@unittest.com');
    });

});
