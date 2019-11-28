// tslint:disable:no-implicit-dependencies
import * as admin from 'firebase-admin';
import * as fTest from 'firebase-functions-test';
import * as nodemailer from 'nodemailer';

import { MailModel, PrivateConfigModel } from './models';
import { firebaseAppStub, firestoreStub, storageStub } from './testing/index.spec';

let test = fTest();

describe('Helpers', (): void => {
    const keyToThrowAnErrorOnMailSend = 'key-to-throw-an-error-on-mail-send';
    let myModels;

    beforeAll(() => {
        // tslint:disable-next-line:no-require-imports
        myModels = require('./models/index'); // this is a trick to include models into coverage

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

    describe('Models - JobModel', (): void => {
        it('should write and read started time', () => {
            const job = new myModels.JobModel();
            job.started = {seconds: 1574713373};

            expect(job.started.seconds)
                .toEqual(1574713373);
        });
    });

    describe('Models - FirstResponseModel', (): void => {
        it('should write and read expire date', () => {
            const firstResponse = new myModels.FirstResponseModel();
            firstResponse.expireDate = {seconds: 1574713399};

            expect(firstResponse.expireDate.seconds)
                .toEqual(1574713399);
        });
        it('should write and read changed time', () => {
            const firstResponse = new myModels.FirstResponseModel();
            firstResponse.changed = {seconds: 1574713408};

            expect(firstResponse.changed.seconds)
                .toEqual(1574713408);
        });
    });

});
