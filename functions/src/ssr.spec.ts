// tslint:disable:no-implicit-dependencies
import * as admin from 'firebase-admin';
import * as fTest from 'firebase-functions-test';
import * as httpMocks from 'node-mocks-http';

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
