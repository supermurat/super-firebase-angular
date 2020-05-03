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
            data: (): JobModel => ({actionKey: ''}),
            ref: {
                set(data): any {
                    expect(data.result)
                        .toEqual(undefined);

                    return Promise.resolve([data]);
                }
            }
        };
        const wrapped = test.wrap(myFunctions.jobRunner);

        expect((await wrapped(snap)).result)
            .toEqual(undefined);
    });

    describe('Jobs - generateSiteMap', (): void => {
        it('should generate site map', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'generateSiteMap', customData: {hostname: 'https://unittest.com/'}}),
                ref: {
                    set(data): any {
                        if (data.result) {
                            expect(data.result.count)
                                .toEqual(56);
                            expect(data.isSucceed)
                                .toEqual(true);
                        }

                        return Promise.resolve();
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);
            const res = await wrapped(snap);

            expect(res.result.count)
                .toEqual(56);
            expect(res.isSucceed)
                .toEqual(true);
        });

        it('should not generate site map with out customData', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'generateSiteMap'}),
                ref: {
                    set(data): any {
                        if (data.result) {
                            expect(data.result.message)
                                .toEqual('Error: You have to provide a hostname with customData for sitemap!');
                            expect(data.isSucceed)
                                .toEqual(false);
                        }

                        return Promise.resolve();
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);
            const res = await wrapped(snap);

            expect(res.result.message)
                .toEqual('Error: You have to provide a hostname with customData for sitemap!');
            expect(res.isSucceed)
                .toEqual(false);
        });

        it('should not generate site map with out customData.hostname', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'generateSiteMap', customData: {}}),
                ref: {
                    set(data): any {
                        if (data.result) {
                            expect(data.result.message)
                                .toEqual('Error: You have to provide a hostname with customData for sitemap!');
                            expect(data.isSucceed)
                                .toEqual(false);
                        }

                        return Promise.resolve();
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);
            const res = await wrapped(snap);

            expect(res.result.message)
                .toEqual('Error: You have to provide a hostname with customData for sitemap!');
            expect(res.isSucceed)
                .toEqual(false);
        });

        it('should generate bigger site map with customData.urlList', async () => {
            const snap = {
                data: (): JobModel => ({
                    actionKey: 'generateSiteMap',
                    customData: {
                        hostname: 'https://unittest.com/',
                        urlList: [{url: 'en/unit/test', changefreq: 'weekly'}]
                    }
                }),
                ref: {
                    set(data): any {
                        if (data.result) {
                            expect(data.result.count)
                                .toEqual(57);
                            expect(data.isSucceed)
                                .toEqual(true);
                        }

                        return Promise.resolve();
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);
            const res = await wrapped(snap);

            expect(res.result.count)
                .toEqual(57);
            expect(res.isSucceed)
                .toEqual(true);
        });
    });

    describe('Jobs - generateSEOData', (): void => {
        it('should generate SEO data', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'generateSEOData'}),
                ref: {
                    set(data): any {
                        if (data.result) {
                            expect(data.result.processedDocCount)
                                .toEqual(50);
                            expect(data.isSucceed)
                                .toEqual(true);
                        }

                        return Promise.resolve();
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);
            const res = await wrapped(snap);

            expect(res.result.processedDocCount)
                .toEqual(50);
            expect(res.isSucceed)
                .toEqual(true);
        });
    });

    describe('Jobs - generateJsonLDs', (): void => {
        it('should generate Json LDs', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'generateJsonLDs'}),
                ref: {
                    set(data): any {
                        if (data.result) {
                            expect(data.result.processedDocCount)
                                .toEqual(50);
                            expect(data.isSucceed)
                                .toEqual(true);
                        }

                        return Promise.resolve();
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);
            const res = await wrapped(snap);

            expect(res.result.processedDocCount)
                .toEqual(50);
            expect(res.isSucceed)
                .toEqual(true);
        });
    });

    describe('Jobs - generateLocales', (): void => {
        it('should generate locales', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'generateLocales'}),
                ref: {
                    set(data): any {
                        if (data.result) {
                            expect(data.result.processedDocCount)
                                .toEqual(54);
                            expect(data.isSucceed)
                                .toEqual(true);
                        }

                        return Promise.resolve();
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);
            const res = await wrapped(snap);

            expect(res.result.processedDocCount)
                .toEqual(54);
            expect(res.isSucceed)
                .toEqual(true);
        });

        it('should generate locales of all pages with overwrite param', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'generateLocales', overwrite: true}),
                ref: {
                    set(data): any {
                        if (data.result) {
                            expect(data.result.processedDocCount)
                                .toEqual(56);
                            expect(data.isSucceed)
                                .toEqual(true);
                        }

                        return Promise.resolve();
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);
            const res = await wrapped(snap);

            expect(res.result.processedDocCount)
                .toEqual(56);
            expect(res.isSucceed)
                .toEqual(true);
        });
    });

    describe('Jobs - generateDescription', (): void => {
        it('should generate description', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'generateDescription'}),
                ref: {
                    set(data): any {
                        if (data.result) {
                            expect(data.result.processedDocCount)
                                .toEqual(54);
                            expect(data.isSucceed)
                                .toEqual(true);
                        }

                        return Promise.resolve();
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);
            const res = await wrapped(snap);

            expect(res.result.processedDocCount)
                .toEqual(54);
            expect(res.isSucceed)
                .toEqual(true);
        });

        it('should generate description of all pages with overwrite param', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'generateDescription', overwrite: true}),
                ref: {
                    set(data): any {
                        if (data.result) {
                            expect(data.result.processedDocCount)
                                .toEqual(56);
                            expect(data.isSucceed)
                                .toEqual(true);
                        }

                        return Promise.resolve();
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);
            const res = await wrapped(snap);

            expect(res.result.processedDocCount)
                .toEqual(56);
            expect(res.isSucceed)
                .toEqual(true);
        });
    });

    describe('Jobs - clearCaches', (): void => {
        it('should clear all caches', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'clearCaches'}),
                ref: {
                    set(data): any {
                        if (data.result) {
                            expect(data.result.processedDocCount)
                                .toEqual(5);
                            expect(data.isSucceed)
                                .toEqual(true);
                        }

                        return Promise.resolve();
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);
            const res = await wrapped(snap);

            expect(res.result.processedDocCount)
                .toEqual(5);
            expect(res.isSucceed)
                .toEqual(true);
        });

        it('should clear only expired caches with expireDate param', async () => {
            const snap = {
                data: (): JobModel => ({
                    actionKey: 'clearCaches',
                    customData: {
                        expireDate: {seconds: Math.round(new Date().setDate(Number(new Date().getDate()) + 20) / 1000)}
                    }
                }),
                ref: {
                    set(data): any {
                        if (data.result) {
                            expect(data.result.processedDocCount)
                                .toEqual(4);
                            expect(data.isSucceed)
                                .toEqual(true);
                        }

                        return Promise.resolve();
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);
            const res = await wrapped(snap);

            expect(res.result.processedDocCount)
                .toEqual(4);
            expect(res.isSucceed)
                .toEqual(true);
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
                        if (data.result) {
                            expect(data.result.processedDocCount)
                                .toEqual(4);
                            expect(data.isSucceed)
                                .toEqual(true);
                        }

                        return Promise.resolve();
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);
            const res = await wrapped(snap);

            expect(res.result.processedDocCount)
                .toEqual(4);
            expect(res.isSucceed)
                .toEqual(true);
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
                        if (data.result) {
                            expect(data.result.processedDocCount)
                                .toEqual(2);
                            expect(data.isSucceed)
                                .toEqual(true);
                        }

                        return Promise.resolve();
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);
            const res = await wrapped(snap);

            expect(res.result.processedDocCount)
                .toEqual(2);
            expect(res.isSucceed)
                .toEqual(true);
        });

        it('should clear caches as much as specified with limit param', async () => {
            const snap = {
                data: (): JobModel => ({
                    actionKey: 'clearCaches',
                    limit: 1
                }),
                ref: {
                    set(data): any {
                        if (data.result) {
                            expect(data.result.processedDocCount)
                                .toEqual(1);
                            expect(data.isSucceed)
                                .toEqual(true);
                        }

                        return Promise.resolve();
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);
            const res = await wrapped(snap);

            expect(res.result.processedDocCount)
                .toEqual(1);
            expect(res.isSucceed)
                .toEqual(true);
        });

    });

    describe('Jobs - recalculateOrderNo', (): void => {
        it('should recalculate order no', async () => {
            const snap = {
                data: (): JobModel => ({actionKey: 'recalculateOrderNo'}),
                ref: {
                    set(data): any {
                        if (data.result) {
                            expect(data.result.processedDocCount)
                                .toEqual(10);
                            expect(data.isSucceed)
                                .toEqual(true);
                        }

                        return Promise.resolve();
                    }
                }
            };
            const wrapped = test.wrap(myFunctions.jobRunner);
            const res = await wrapped(snap);

            expect(res.result.processedDocCount)
                .toEqual(10);
            expect(res.isSucceed)
                .toEqual(true);
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
                    if (data.result) {
                        expect(data.result.processedDocCount)
                            .toEqual(1);
                        expect(data.isSucceed)
                            .toEqual(true);
                    }

                    return Promise.resolve();
                }
            }
        };
        const wrapped = test.wrap(myFunctions.jobRunner);
        const res = await wrapped(snap);

        expect(res.result.processedDocCount)
            .toEqual(1);
        expect(res.isSucceed)
            .toEqual(true);
    });

});
