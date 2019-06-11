// tslint:disable:no-implicit-dependencies
import * as admin from 'firebase-admin';
import * as fTest from 'firebase-functions-test';
import * as httpMocks from 'node-mocks-http';
import * as nodemailer from 'nodemailer';

import { ContactModel } from './models/contact-model';
import { JobModel } from './models/job-model';
import { firebaseAppStub, firestoreStub, sleepToGetData, storageStub } from './testing/index.spec';

let test = fTest();

// tslint:disable-next-line:only-arrow-functions
describe('Firebase Functions', function(): void {

    beforeEach(() => {
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

    afterEach(() => {
        test.cleanup();
    });

    // tslint:disable-next-line:only-arrow-functions
    describe('Jobs - Firestore', (): void => {
        let myFunctions;

        beforeEach(() => {
            // tslint:disable-next-line:no-require-imports
            myFunctions = require('./index');
        });

        it('should call only jobRunner', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: ''})
            };
            const wrapped = test.wrap(myFunctions.jobRunner);

            expect(await wrapped(snap))
                .toEqual(undefined);
        });

        it('should call generateSiteMap', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'generateSiteMap', customData: {hostname: 'https:unittest.com'}}),
                ref: {
                    set(data): any {
                        expect(data.result)
                            .toEqual('Count of urls: 56');

                        return Promise.resolve([data]);
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);

            expect(await wrapped(snap))
                .toEqual('generateSiteMap is finished. Count of urls: 56');
        });

        it('should call generateSEOData', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'generateSEOData'}),
                ref: {
                    set(data): any {
                        expect(data.result)
                            .toEqual('Count of processed documents: 50');

                        return Promise.resolve([data]);
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);

            expect(await wrapped(snap))
                .toEqual('generateSEOData is finished. Count of processed documents: 50');
        });

        it('should call generateJsonLDs', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'generateJsonLDs'}),
                ref: {
                    set(data): any {
                        expect(data.result)
                            .toEqual('Count of processed documents: 50');

                        return Promise.resolve([data]);
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);

            expect(await wrapped(snap))
                .toEqual('generateJsonLDs is finished. Count of processed documents: 50');
        });

        it('should call generateLocales', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'generateLocales'}),
                ref: {
                    set(data): any {
                        expect(data.result)
                            .toEqual('Count of processed documents: 56');

                        return Promise.resolve([data]);
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);

            expect(await wrapped(snap))
                .toEqual('generateLocales is finished. Count of processed documents: 56');
        });

        it('should call generateDescription', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'generateDescription'}),
                ref: {
                    set(data): any {
                        expect(data.result)
                            .toEqual('Count of processed documents: 56');

                        return Promise.resolve([data]);
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);

            expect(await wrapped(snap))
                .toEqual('generateDescription is finished. Count of processed documents: 56');
        });

        it('should call clearCaches', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'clearCaches'}),
                ref: {
                    set(data): any {
                        expect(data.result)
                            .toEqual('Count of processed documents: 2');

                        return Promise.resolve([data]);
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);

            expect(await wrapped(snap))
                .toEqual('clearCaches is finished. Count of processed documents: 2');
        });

    });

    // tslint:disable-next-line:only-arrow-functions
    describe('Jobs - Storage', (): void => {
        let myFunctions;

        beforeEach(() => {
            // tslint:disable-next-line:no-require-imports
            myFunctions = require('./index');
        });

        it('should call fixPublicFilesPermissions', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'fixPublicFilesPermissions'}),
                ref: {
                    set(data): any {
                        expect(data.result)
                            .toEqual('Count of processed files: 1');

                        return Promise.resolve([data]);
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);

            expect(await wrapped(snap))
                .toEqual('fixPublicFilesPermissions is finished. Count of processed docs: 1');
        });

    });

    // tslint:disable-next-line:only-arrow-functions
    describe('Triggers - Firestore', (): void => {
        let myFunctions;

        beforeEach(() => {
            // tslint:disable-next-line:no-require-imports
            myFunctions = require('./index');
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

    // tslint:disable-next-line:only-arrow-functions
    describe('SSR', (): void => {
        // https://www.npmjs.com/package/node-mocks-http
        let myFunctions;

        beforeEach(() => {
            // tslint:disable-next-line:no-require-imports
            myFunctions = require('./index');
        });

        it('should get 404 for invalid url', async () => {
            const req  = httpMocks.createRequest({
                method: 'GET',
                url: '/test.php?invalid=true'
            });
            const res = httpMocks.createResponse();

            await myFunctions.ssr(req, res);

            expect(res._getStatusCode())
                .toEqual(404);
        });

        it('should get 404 for not exist url', async () => {
            const req  = httpMocks.createRequest({
                method: 'GET',
                url: '/tr/not-exist-url-for-test'
            });
            const res = httpMocks.createResponse();

            await myFunctions.ssr(req, res);
            await sleepToGetData(res);

            // expect(res._getData())
            //                 .toEqual(404);
            expect(res._getStatusCode())
                .toEqual(404);
        });

    });

});
