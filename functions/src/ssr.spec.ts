// tslint:disable:no-implicit-dependencies
import * as admin from 'firebase-admin';
import * as fTest from 'firebase-functions-test';
import * as http from 'http';
import * as httpMocks from 'node-mocks-http';

import { FUNCTIONS_CONFIG } from './config';
import { firebaseAppStub, firestoreStub, sleepToGetData } from './testing/index.spec';

let test = fTest();

describe('SSR - Functions', (): void => {
    // https://www.npmjs.com/package/node-mocks-http
    let myFunctions;

    beforeAll(() => {
        test = fTest();
        spyOn(admin, 'initializeApp').and.returnValue(firebaseAppStub as any);
        spyOn(admin, 'app').and.returnValue(firebaseAppStub as any);
        spyOn(admin, 'firestore').and.returnValue(firestoreStub as any);

        // tslint:disable-next-line:no-require-imports
        myFunctions = require('./index');
    });

    afterAll(() => {
        test.cleanup();
    });

    describe('SSR - Functions - 404', (): void => {
        it('should get 404 for invalid url', async () => {
            const req  = httpMocks.createRequest({
                method: 'GET',
                url: '/test.php?invalid=true'
            });
            const res = httpMocks.createResponse();

            await myFunctions.ssr(req, res);

            expect(res._getStatusCode())
                .toEqual(404);
            expect(res._getData())
                .toContain('<title>404 - Page not found</title>');
        });

        it('should get 404 for cached not exist url', async () => {
            const req  = httpMocks.createRequest({
                method: 'GET',
                url: '/second-cache'
            });
            const res = httpMocks.createResponse();

            await myFunctions.ssr(req, res);
            await sleepToGetData(res);

            expect(res._getStatusCode())
                .toEqual(404);
            expect(res._getData())
                .toContain('<title>404 - Page not found</title>');
        });

        it('should get 404 page for our 404 marked url even if page is actually exist', async () => {
            const req  = httpMocks.createRequest({
                method: 'GET',
                url: '/en/articles/http-404'
            });
            const res = httpMocks.createResponse();

            await myFunctions.ssr(req, res);
            await sleepToGetData(res);

            expect(res._getStatusCode())
                .toEqual(404);
            expect(res._getData())
                .toContain('<title>404 - Page not found</title>');
        });
    });

    describe('SSR - Functions - Redirect', (): void => {
        it('should redirect to first-cache', async () => {
            const req  = httpMocks.createRequest({
                method: 'GET',
                url: '/forth-cache'
            });
            const res = httpMocks.createResponse();

            await myFunctions.ssr(req, res);
            await sleepToGetData(res);

            expect(res._getStatusCode())
                .toEqual(301);
            expect(res._getRedirectUrl())
                .toEqual('/first-cache');
        });
    });

    describe('SSR - Functions - Files', (): void => {
        it('should get robots.txt', async () => {
            const req  = httpMocks.createRequest({
                method: 'GET',
                url: '/robots.txt'
            });
            const res = httpMocks.createResponse();

            await myFunctions.ssr(req, res);
            await sleepToGetData(res);

            expect(res._getStatusCode())
                .toEqual(200);
            expect(res._getData())
                .toContain('User-Agent: *\r\nDisallow: / \r\n\r\n\r\n');
        });
    });

    describe('SSR - Functions - Pages With Cache', (): void => {
        beforeAll(() => {
            FUNCTIONS_CONFIG.cacheResponses = true;
        });

        afterAll(() => {
            FUNCTIONS_CONFIG.cacheResponses = false;
        });

        it('should get first-cache', async () => {
            const req  = httpMocks.createRequest({
                method: 'GET',
                url: '/first-cache',
                headers: {
                    Referer: 'https://unittest.com'
                }
            });
            const res = httpMocks.createResponse();

            await myFunctions.ssr(req, res);
            await sleepToGetData(res);

            expect(res._getStatusCode())
                .toEqual(200);
            expect(res._getData())
                .toContain('<html>First Cache</html>');
        });

        it('should get fifth-cache', async () => {
            const req  = httpMocks.createRequest({
                method: 'GET',
                url: '/fifth-cache',
                headers: {
                    Referrer: 'https://unittest.com'
                }
            });
            const res = httpMocks.createResponse();

            await myFunctions.ssr(req, res);
            await sleepToGetData(res);

            expect(res._getStatusCode())
                .toEqual(200);
            expect(res._getData())
                .toContain('<html>Fifth Cache</html>');
        });

        it('should get first-cache even if contains unneeded slash end of url', async () => {
            const req  = httpMocks.createRequest({
                method: 'GET',
                url: '/first-cache/',
                headers: {
                    Referer: 'https://unittest.com'
                }
            });
            const res = httpMocks.createResponse();

            await myFunctions.ssr(req, res);
            await sleepToGetData(res);

            expect(res._getStatusCode())
                .toEqual(200);
            expect(res._getData())
                .toContain('<html>First Cache</html>');
        });

    });

    describe('SSR - Functions - Invalid', (): void => {
        it('should get invalid page for invalid url', async () => {
            const req  = httpMocks.createRequest({
                method: 'GET',
                url: '/test%20page'
            });
            const res = httpMocks.createResponse();

            await myFunctions.ssr(req, res);

            expect(res._getStatusCode())
                .toEqual(404);
            expect(res._getData())
                .toContain('<p>Invalid Url!</p>');
        });

        it('should get invalid page for another invalid url', async () => {
            const req  = httpMocks.createRequest({
                method: 'GET',
                url: '/test=page'
            });
            const res = httpMocks.createResponse();

            await myFunctions.ssr(req, res);

            expect(res._getStatusCode())
                .toEqual(404);
            expect(res._getData())
                .toContain('<p>Invalid Url!</p>');
        });
    });

});

describe('SSR - HTTP', (): void => {
    let myFunctions;
    const httpOptions = {
        hostname: 'localhost',
        port: FUNCTIONS_CONFIG.unitTestHttpPort,
        method: 'GET'
    };

    beforeAll(() => {
        test = fTest();
        spyOn(admin, 'initializeApp').and.returnValue(firebaseAppStub as any);
        spyOn(admin, 'app').and.returnValue(firebaseAppStub as any);
        spyOn(admin, 'firestore').and.returnValue(firestoreStub as any);

        // tslint:disable-next-line:no-require-imports
        myFunctions = require('./index');
    });

    afterAll(() => {
        test.cleanup();
    });

    describe('SSR - HTTP - 404', (): void => {
        it('should get 404 for invalid url', () => {
            http.request({...httpOptions, path: '/test.php?invalid=true'}, res => {
                expect(res.statusCode)
                    .toEqual(404);

                res.on('data', data => {
                    expect(data)
                        .toContain('<title>404 - Page not found</title>');
                });
            });
        });

        it('should get 404 for not exist url', () => {
            http.request({...httpOptions, path: '/not-exist-url-for-test'}, res => {
                expect(res.statusCode)
                    .toEqual(404);

                res.on('data', data => {
                    expect(data)
                        .toContain('<title>404 - Page not found</title>');
                });
            });
        });

        it('should get 404 for cached not exist url', () => {
            http.request({...httpOptions, path: '/second-cache'}, res => {
                expect(res.statusCode)
                    .toEqual(404);

                res.on('data', data => {
                    expect(data)
                        .toContain('<title>404 - Page not found</title>');
                });
            });
        });

        it('should get 404 page for our 404 marked url even if page is actually exist', () => {
            http.request({...httpOptions, path: '/en/articles/http-404'}, res => {
                expect(res.statusCode)
                    .toEqual(404);

                res.on('data', data => {
                    expect(data)
                        .toContain('<title>404 - Page not found</title>');
                });
            });
        });
    });

    describe('SSR - HTTP - Redirect', (): void => {
        it('should redirect to first-cache', () => {
            http.request({...httpOptions, path: '/forth-cache'}, res => {
                expect(res.statusCode)
                    .toEqual(301);

                expect(res.headers.location)
                    .toEqual('/first-cache');
            });
        });
    });

    describe('SSR - HTTP - Files', (): void => {
        it('should get robots.txt', () => {
            http.request({...httpOptions, path: '/robots.txt'}, res => {
                expect(res.statusCode)
                    .toEqual(200);

                res.on('data', data => {
                    expect(data)
                        .toContain('User-Agent: *\r\nDisallow: / \r\n\r\n\r\n');
                });
            });
        });
    });

    describe('SSR - HTTP - First Responses', (): void => {
        it('should pass to check for first responses for disallowed keys', () => {
            http.request({...httpOptions, path: '/__.unit-test__'}, res => {
                expect(res.statusCode)
                    .toEqual(404);

                res.on('data', data => {
                    expect(data)
                        .toContain('<title>404 - Page not found</title>');
                });
            });
        });
    });

    describe('SSR - HTTP - Pages', (): void => {
        it('should get articles for en-US', () => {
            http.request({...httpOptions, path: '/en/articles'}, res => {
                expect(res.statusCode)
                    .toEqual(200);

                res.on('data', data => {
                    expect(data)
                        .toContain(' - My Articles</title>');
                });
            });
        });

        it('should get makaleler for tr-TR', () => {
            http.request({...httpOptions, path: '/tr/makaleler'}, res => {
                expect(res.statusCode)
                    .toEqual(200);

                res.on('data', data => {
                    expect(data)
                        .toContain(' - Makalelerim</title>');
                });
            });
        });

        it('should redirect to articles for en-US', () => {
            http.request({...httpOptions, path: '/en/makaleler'}, res => {
                expect(res.statusCode)
                    .toEqual(301);

                expect(res.headers.location)
                    .toEqual('/en/articles');
            });
        });

        it('should redirect to makaleler for tr-TR', () => {
            http.request({...httpOptions, path: '/tr/articles'}, res => {
                expect(res.statusCode)
                    .toEqual(301);

                expect(res.headers.location)
                    .toEqual('/tr/makaleler');
            });
        });
    });

    describe('SSR - HTTP - Pages With Cache', (): void => {
        beforeAll(() => {
            FUNCTIONS_CONFIG.cacheResponses = true;
        });

        afterAll(() => {
            FUNCTIONS_CONFIG.cacheResponses = false;
        });

        it('should get articles for en-US', () => {
            http.request({...httpOptions, path: '/en/articles'}, res => {
                expect(res.statusCode)
                    .toEqual(200);

                res.on('data', data => {
                    expect(data)
                        .toContain(' - My Articles</title>');
                });
            });
        });

        it('should get articles for tr-TR', () => {
            http.request({...httpOptions, path: '/tr/makaleler'}, res => {
                expect(res.statusCode)
                    .toEqual(200);

                res.on('data', data => {
                    expect(data)
                        .toContain(' - Makalelerim</title>');
                });
            });
        });

        it('should get first-cache', () => {
            http.request({...httpOptions, path: '/first-cache', headers: {Referer: 'https://unittest.com'}}, res => {
                expect(res.statusCode)
                    .toEqual(200);

                res.on('data', data => {
                    expect(data)
                        .toContain('<html>First Cache</html>');
                });
            });
        });

        it('should get fifth-cache', () => {
            http.request({...httpOptions, path: '/fifth-cache', headers: {Referer: 'https://unittest.com'}}, res => {
                expect(res.statusCode)
                    .toEqual(200);

                res.on('data', data => {
                    expect(data)
                        .toContain('<html>Fifth Cache</html>');
                });
            });
        });

        it('should get first-cache even if contains unneeded slash end of url', () => {
            http.request({...httpOptions, path: '/first-cache/', headers: {Referer: 'https://unittest.com'}}, res => {
                expect(res.statusCode)
                    .toEqual(200);

                res.on('data', data => {
                    expect(data)
                        .toContain('<html>First Cache</html>');
                });
            });
        });

    });

    describe('SSR - HTTP - Invalid', (): void => {
        it('should get invalid page for invalid url', () => {
            http.request({...httpOptions, path: '/test%20page'}, res => {
                expect(res.statusCode)
                    .toEqual(404);

                res.on('data', data => {
                    expect(data)
                        .toContain('<p>Invalid Url!</p>');
                });
            });
        });

        it('should get invalid page for another invalid url', () => {
            http.request({...httpOptions, path: '/test=page'}, res => {
                expect(res.statusCode)
                    .toEqual(404);

                res.on('data', data => {
                    expect(data)
                        .toContain('<p>Invalid Url!</p>');
                });
            });
        });
    });

});
