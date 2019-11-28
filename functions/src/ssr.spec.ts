// tslint:disable:no-implicit-dependencies
import * as admin from 'firebase-admin';
import * as fTest from 'firebase-functions-test';
import * as httpMocks from 'node-mocks-http';

import { FUNCTIONS_CONFIG } from './config';
import { firebaseAppStub, firestoreStub, sleepToGetData } from './testing/index.spec';

let test = fTest();

describe('SSR', (): void => {
    // https://www.npmjs.com/package/node-mocks-http
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

    describe('SSR - 404', (): void => {
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

        it('should get 404 for not exist url', async () => {
            const req  = httpMocks.createRequest({
                method: 'GET',
                url: '/not-exist-url-for-test'
            });
            const res = httpMocks.createResponse();

            await myFunctions.ssr(req, res);
            await sleepToGetData(res);

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

    describe('SSR - Redirect', (): void => {
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

    describe('SSR - Files', (): void => {
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

    describe('SSR - First Responses', (): void => {
        it('should pass to check for first responses for disallowed keys', async () => {
            const req  = httpMocks.createRequest({
                method: 'GET',
                url: '/__.unit-test__'
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

    describe('SSR - Pages', (): void => {
        it('should get articles for en-US', async () => {
            const req  = httpMocks.createRequest({
                method: 'GET',
                url: '/en/articles'
            });
            const res = httpMocks.createResponse();

            await myFunctions.ssr(req, res);
            await sleepToGetData(res);

            expect(res._getStatusCode())
                .toEqual(200);
            expect(res._getData())
                .toContain(' - My Articles</title>');
        });

        it('should get makaleler for tr-TR', async () => {
            const req  = httpMocks.createRequest({
                method: 'GET',
                url: '/tr/makaleler'
            });
            const res = httpMocks.createResponse();

            await myFunctions.ssr(req, res);
            await sleepToGetData(res);

            expect(res._getStatusCode())
                .toEqual(200);
            expect(res._getData())
                .toContain(' - Makalelerim</title>');
        });

        it('should redirect to articles for en-US', async () => {
            const req  = httpMocks.createRequest({
                method: 'GET',
                url: '/en/makaleler'
            });
            const res = httpMocks.createResponse();

            await myFunctions.ssr(req, res);
            await sleepToGetData(res);

            expect(res._getStatusCode())
                .toEqual(301);
            expect(res._getRedirectUrl())
                .toEqual('/en/articles');
        });

        it('should redirect to makaleler for tr-TR', async () => {
            const req  = httpMocks.createRequest({
                method: 'GET',
                url: '/tr/articles'
            });
            const res = httpMocks.createResponse();

            await myFunctions.ssr(req, res);
            await sleepToGetData(res);

            expect(res._getStatusCode())
                .toEqual(301);
            expect(res._getRedirectUrl())
                .toEqual('/tr/makaleler');
        });
    });

    describe('SSR - Pages With Cache', (): void => {
        beforeAll(() => {
            FUNCTIONS_CONFIG.cacheResponses = true;
        });

        afterAll(() => {
            FUNCTIONS_CONFIG.cacheResponses = false;
        });

        it('should get articles for en-US', async () => {
            const req  = httpMocks.createRequest({
                method: 'GET',
                url: '/en/articles'
            });
            const res = httpMocks.createResponse();

            await myFunctions.ssr(req, res);
            await sleepToGetData(res);

            expect(res._getStatusCode())
                .toEqual(200);
            expect(res._getData())
                .toContain(' - My Articles</title>');
        });

        it('should get articles for tr-TR', async () => {
            const req  = httpMocks.createRequest({
                method: 'GET',
                url: '/tr/makaleler'
            });
            const res = httpMocks.createResponse();

            await myFunctions.ssr(req, res);
            await sleepToGetData(res);

            expect(res._getStatusCode())
                .toEqual(200);
            expect(res._getData())
                .toContain(' - Makalelerim</title>');
        });

        it('should get first-cache', async () => {
            const req  = httpMocks.createRequest({
                method: 'GET',
                url: '/first-cache',
                headers: {
                    Referer: 'https:unittest.com'
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
                    Referrer: 'https:unittest.com'
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
                    Referer: 'https:unittest.com'
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

    describe('SSR - Invalid', (): void => {
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
