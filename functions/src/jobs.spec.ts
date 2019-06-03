// tslint:disable:no-implicit-dependencies
import * as chai from 'chai';
import * as sinon from 'sinon';
const assert = chai.assert;

import * as admin from 'firebase-admin';

import * as fTest from 'firebase-functions-test';
import { JobModel } from './models/job-model';
import { firestoreStub } from './testing/index.spec';

const test = fTest();

describe('Jobs', () => {
    let myFunctions;
    let adminInitStub;

    before(() => {
        // If index.js calls admin.initializeApp at the top of the file,
        // we need to stub it out before requiring index.js. This is because the
        // functions will be executed as a part of the require process.
        // Here we stub admin.initializeApp to be a dummy function that doesn't do anything.
        adminInitStub = sinon.stub(admin, 'initializeApp');

        const appStub = sinon.stub();
        Object.defineProperty(admin, 'app', { get: (): any => appStub });
        appStub.returns(appStub);

        const firestoreVirtualStub = sinon.stub();
        Object.defineProperty(appStub, 'firestore', { get: (): any => firestoreVirtualStub });
        firestoreVirtualStub.returns(firestoreStub);

        // Now we can require index.js and save the exports inside a namespace called myFunctions.
        // tslint:disable-next-line:no-require-imports
        myFunctions = require('./index');
    });

    after(() => {
        // Restore admin.initializeApp() to its original method.
        adminInitStub.restore();
        // Do other cleanup tasks.
        test.cleanup();
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
