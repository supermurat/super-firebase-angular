// tslint:disable:no-implicit-dependencies
import * as chai from 'chai';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import * as sinon from 'sinon';

import * as fTest from 'firebase-functions-test';

import { ContactModel } from './models/contact-model';
import { JobModel } from './models/job-model';
import { firestoreStub } from './testing/index.spec';

const assert = chai.assert;
const test = fTest();

// tslint:disable-next-line:only-arrow-functions
describe('Firebase Functions', function(): void {
    this.timeout(10000);
    let adminInitStub;
    let sandbox;

    before(() => {
        adminInitStub = sinon.stub(admin, 'initializeApp');

        const appStub = sinon.stub();
        Object.defineProperty(admin, 'app', { get: (): any => appStub, configurable: true });
        appStub.returns(appStub);

        const firestoreVirtualStub = sinon.stub();
        Object.defineProperty(appStub, 'firestore', { get: (): any => firestoreVirtualStub, configurable: true });
        firestoreVirtualStub.returns(firestoreStub);

        sandbox = sinon.sandbox.create();
        const transport = {
            sendMail: (data): Promise<any> =>
                // console.log(data);
                Promise.resolve({unitTest: true})
        };
        sandbox.stub(nodemailer, 'createTransport').returns(transport);
    });

    after(() => {
        adminInitStub.restore();
        sandbox.restore();
        test.cleanup();
    });

    // tslint:disable-next-line:only-arrow-functions
    describe('Jobs', (): void => {
        let myFunctions;

        before(() => {
            // tslint:disable-next-line:no-require-imports
            myFunctions = require('./index');
        });

        it('should call only jobRunner', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: ''})
            };
            const wrapped = test.wrap(myFunctions.jobRunner);

            return assert.equal(await wrapped(snap), undefined);
        });

        it('should call generateSiteMap', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'generateSiteMap', customData: {hostname: 'https:unittest.com'}}),
                ref: {
                    set(data): any {
                        assert.equal(data.result, 'Count of urls: 56');

                        return Promise.resolve([data]);
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);

            return assert.equal(await wrapped(snap), 'generateSiteMap is finished. Count of urls: 56');
        });

        it('should call generateSEOData', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'generateSEOData'}),
                ref: {
                    set(data): any {
                        assert.equal(data.result, 'Count of processed documents: 50');

                        return Promise.resolve([data]);
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);

            return assert.equal(await wrapped(snap), 'generateSEOData is finished. Count of processed documents: 50');
        });

        it('should call generateJsonLDs', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'generateJsonLDs'}),
                ref: {
                    set(data): any {
                        assert.equal(data.result, 'Count of processed documents: 50');

                        return Promise.resolve([data]);
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);

            return assert.equal(await wrapped(snap), 'generateJsonLDs is finished. Count of processed documents: 50');
        });

        it('should call generateLocales', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'generateLocales'}),
                ref: {
                    set(data): any {
                        assert.equal(data.result, 'Count of processed documents: 56');

                        return Promise.resolve([data]);
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);

            return assert.equal(await wrapped(snap), 'generateLocales is finished. Count of processed documents: 56');
        });

        it('should call generateDescription', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'generateDescription'}),
                ref: {
                    set(data): any {
                        assert.equal(data.result, 'Count of processed documents: 56');

                        return Promise.resolve([data]);
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);

            return assert.equal(await wrapped(snap), 'generateDescription is finished. Count of processed documents: 56');
        });

        it('should call clearCaches', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'clearCaches'}),
                ref: {
                    set(data): any {
                        assert.equal(data.result, 'Count of processed documents: 2');

                        return Promise.resolve([data]);
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);

            return assert.equal(await wrapped(snap), 'clearCaches is finished. Count of processed documents: 2');
        });

    });

    // tslint:disable-next-line:only-arrow-functions
    describe('Triggers', (): void => {
        let myFunctions;

        before(() => {
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

            return assert.equal(await wrapped(snap), 'Mail send succeed: mw@unittest.com');
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

            return assert.equal(await wrapped(snap), 'Mail send succeed: mw@unittest.com');
        });

    });

});
