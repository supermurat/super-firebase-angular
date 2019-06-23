// tslint:disable:no-implicit-dependencies
import * as admin from 'firebase-admin';
import * as fTest from 'firebase-functions-test';

import { JobModel } from './models';
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

    it('empty actionKey should call only jobRunner', async () => {
        const snap = {
            data: (): JobModel => ({actionKey: ''})
        };
        const wrapped = test.wrap(myFunctions.jobRunner);

        expect(await wrapped(snap))
            .toEqual(undefined);
    });

    describe('Jobs - generateSiteMap', (): void => {
        it('should generate site map', async () => {
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

        it('should not generate site map with out customData', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'generateSiteMap'}),
                ref: {
                    set(data): any {
                        expect(data)
                            .toEqual(undefined);

                        return Promise.resolve([data]);
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);

            expect(await wrapped(snap))
                .toEqual(new Error('You have to provide a hostname with customData for sitemap!'));
        });

        it('should not generate site map with out customData.hostname', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'generateSiteMap', customData: {}}),
                ref: {
                    set(data): any {
                        expect(data)
                            .toEqual(undefined);

                        return Promise.resolve([data]);
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);

            expect(await wrapped(snap))
                .toEqual(new Error('You have to provide a hostname with customData for sitemap!'));
        });

        it('should generate bigger site map with customData.urlList', async () => {
            const snap = {
                data: (): JobModel => ({
                    actionKey: 'generateSiteMap',
                    customData: {
                        hostname: 'https:unittest.com',
                        urlList: [{url: 'en/unit/test', changefreq: 'weekly'}]
                    }
                }),
                ref: {
                    set(data): any {
                        expect(data.result)
                            .toEqual('Count of urls: 57');

                        return Promise.resolve([data]);
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);

            expect(await wrapped(snap))
                .toEqual('generateSiteMap is finished. Count of urls: 57');
        });
    });

    describe('Jobs - generateSEOData', (): void => {
        it('should generate SEO data', async () => {
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
    });

    describe('Jobs - generateJsonLDs', (): void => {
        it('should generate Json LDs', async () => {
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
    });

    describe('Jobs - generateLocales', (): void => {
        it('should generate locales', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'generateLocales'}),
                ref: {
                    set(data): any {
                        expect(data.result)
                            .toEqual('Count of processed documents: 54');

                        return Promise.resolve([data]);
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);

            expect(await wrapped(snap))
                .toEqual('generateLocales is finished. Count of processed documents: 54');
        });

        it('should generate locales of all pages with overwrite param', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'generateLocales', overwrite: true}),
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
    });

    describe('Jobs - generateDescription', (): void => {
        it('should generate description', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'generateDescription'}),
                ref: {
                    set(data): any {
                        expect(data.result)
                            .toEqual('Count of processed documents: 54');

                        return Promise.resolve([data]);
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);

            expect(await wrapped(snap))
                .toEqual('generateDescription is finished. Count of processed documents: 54');
        });

        it('should generate description of all pages with overwrite param', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'generateDescription', overwrite: true}),
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
    });

    describe('Jobs - clearCaches', (): void => {
        it('should clear all caches', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'clearCaches'}),
                ref: {
                    set(data): any {
                        expect(data.result)
                            .toEqual('Count of processed documents: 5');

                        return Promise.resolve([data]);
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);

            expect(await wrapped(snap))
                .toEqual('clearCaches is finished. Count of processed documents: 5');
        });

        it('should clear only expired caches with expireDate param', async () => {
            const snap = {
                data: (): JobModel => ({
                    actionKey: 'clearCaches',
                    customData: {
                        expireDate: new Date().setDate(Number(new Date().getDate()) + 20)
                    }
                }),
                ref: {
                    set(data): any {
                        expect(data.result)
                            .toEqual('Count of processed documents: 4');

                        return Promise.resolve([data]);
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);

            expect(await wrapped(snap))
                .toEqual('clearCaches is finished. Count of processed documents: 4');
        });

        it('should clear only expired caches with expireDateDayDiff param', async () => {
            const snap = {
                data: (): JobModel => ({
                    actionKey: 'clearCaches',
                    customData: {
                        expireDateDayDiff: 20
                    }
                }),
                ref: {
                    set(data): any {
                        expect(data.result)
                            .toEqual('Count of processed documents: 4');

                        return Promise.resolve([data]);
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);

            expect(await wrapped(snap))
                .toEqual('clearCaches is finished. Count of processed documents: 4');
        });

        it('should clear caches which only specified codes with codeListToDelete param', async () => {
            const snap = {
                data: (): JobModel => ({
                    actionKey: 'clearCaches',
                    customData: {
                        codeListToDelete: [200]
                    }
                }),
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

        it('should clear caches as much as specified with limit param', async () => {
            const snap = {
                data: (): JobModel => ({
                    actionKey: 'clearCaches',
                    limit: 1
                }),
                ref: {
                    set(data): any {
                        expect(data.result)
                            .toEqual('Count of processed documents: 1');

                        return Promise.resolve([data]);
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);

            expect(await wrapped(snap))
                .toEqual('clearCaches is finished. Count of processed documents: 1');
        });

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
