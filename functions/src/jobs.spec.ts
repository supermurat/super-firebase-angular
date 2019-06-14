// tslint:disable:no-implicit-dependencies
import * as admin from 'firebase-admin';
import * as fTest from 'firebase-functions-test';

import { JobModel } from './models/job-model';
import { firebaseAppStub, firestoreStub, storageStub } from './testing/index.spec';

let test = fTest();

describe('Jobs - Firestore', (): void => {
    let myFunctions;

    beforeAll(() => {
        test = fTest();
        spyOn(admin, 'initializeApp').and.returnValue(firebaseAppStub);
        spyOn(admin, 'app').and.returnValue(firebaseAppStub);
        spyOn(admin, 'firestore').and.returnValue(firestoreStub);

        // tslint:disable-next-line:no-require-imports
        myFunctions = require('./index');
    });

    afterAll(() => {
        test.cleanup();
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

describe('Jobs - Storage', (): void => {
    let myFunctions;

    beforeAll(() => {
        test = fTest();
        spyOn(admin, 'initializeApp').and.returnValue(firebaseAppStub);
        spyOn(admin, 'app').and.returnValue(firebaseAppStub);
        spyOn(admin, 'firestore').and.returnValue(firestoreStub);
        spyOn(admin, 'storage').and.returnValue(storageStub);

        // tslint:disable-next-line:no-require-imports
        myFunctions = require('./index');
    });

    afterAll(() => {
        test.cleanup();
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
