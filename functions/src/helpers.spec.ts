// tslint:disable:no-implicit-dependencies
import * as admin from 'firebase-admin';
import * as fTest from 'firebase-functions-test';
import * as nodemailer from 'nodemailer';

import { MailModel, PrivateConfigModel } from './models';
import { firebaseAppStub, firestoreStub, storageStub } from './testing/index.spec';

let test = fTest();

describe('Helpers', (): void => {
    const keyToThrowAnErrorOnMailSend = 'key-to-throw-an-error-on-mail-send';

    beforeAll(() => {
        test = fTest();
        spyOn(admin, 'initializeApp').and.returnValue(firebaseAppStub);
        spyOn(admin, 'app').and.returnValue(firebaseAppStub);
        spyOn(admin, 'firestore').and.returnValue(firestoreStub);
        spyOn(admin, 'storage').and.returnValue(storageStub);
        spyOn(nodemailer, 'createTransport').and.returnValue({
            sendMail: (data): Promise<any> =>
                data.subject.indexOf(keyToThrowAnErrorOnMailSend) > -1 ?
                    Promise.resolve({err: 'An error has been thrown!'}) : Promise.resolve({unitTest: true})
        });
    });

    afterAll(() => {
        test.cleanup();
    });

    describe('E-Mail Sender', (): void => {
        it('should skip to send e-mail', async () => {
            // tslint:disable-next-line:no-require-imports
            const myFunctions = require('./helpers');
            const mailContent: MailModel = {
                to: 'admin@unittest.com',
                from: 'my@unittest.com',
                subject: 'You Have Got a Message',
                html: 'This is <b>HTML</b> message'
            };
            const privateConfig: PrivateConfigModel = {
                smtp: undefined,
                mail: {
                    mailAddressOfAdmin: 'admin@unittest.com',
                    mailFrom: 'admin@unittest.com',
                    siteURL: 'https://unittest.com',
                    siteName: 'Unit Test',
                    logoURL: 'https://unittest.com/image/logo.png'
                }
            };
            myFunctions.sendMail(mailContent, privateConfig)
                .then(value => {
                    expect(value)
                        .toEqual(`Mail send skipped: ${mailContent.to}`);
                })
                .catch(reason => {
                    expect(reason)
                        .toBeUndefined();
                });
        });

        it('should send all of e-mails to specified e-mail address with mail.mailToForced', async () => {
            // tslint:disable-next-line:no-require-imports
            const myFunctions = require('./helpers');
            const mailContent: MailModel = {
                to: 'admin@unittest.com',
                subject: 'You Have Got a Message',
                text: 'This is text message'
            };
            const privateConfig: PrivateConfigModel = {
                smtp: {host: 'smtp.unittest.com', port: 587, secure: true, auth: {user: '', pass: ''}},
                mail: {
                    isSendMail: true,
                    mailAddressOfAdmin: 'admin@unittest.com',
                    mailFrom: 'admin@unittest.com',
                    siteURL: 'https://unittest.com',
                    siteName: 'Unit Test',
                    logoURL: 'https://unittest.com/image/logo.png',
                    mailToForced: 'always@unittest.com'
                }
            };

            myFunctions.sendMail(mailContent, privateConfig)
                .then(value => {
                    expect(value)
                        .toEqual(`Mail send succeed: ${privateConfig.mail.mailToForced}`);
                })
                .catch(reason => {
                    expect(reason)
                        .toBeUndefined();
                });
        });

        it('should throw an error while sending e-mail', async () => {
            // tslint:disable-next-line:no-require-imports
            const myFunctions = require('./helpers');
            const mailContent: MailModel = {
                to: 'admin@unittest.com',
                from: 'my@unittest.com',
                subject: `You Have Got a Message${keyToThrowAnErrorOnMailSend}`,
                html: 'This is <b>HTML</b> message'
            };
            const privateConfig: PrivateConfigModel = {
                smtp: {host: 'smtp.unittest.com', port: 587, secure: true, auth: {user: '', pass: ''}},
                mail: {
                    isSendMail: true,
                    mailAddressOfAdmin: 'admin@unittest.com',
                    mailFrom: 'admin@unittest.com',
                    siteURL: 'https://unittest.com',
                    siteName: 'Unit Test',
                    logoURL: 'https://unittest.com/image/logo.png'
                }
            };

            myFunctions.sendMail(mailContent, privateConfig)
                .then(value => {
                    expect(value)
                        .toBeUndefined();
                })
                .catch(reason => {
                    expect(reason)
                        .toEqual('An error has been thrown!');
                });
        });
    });

});
