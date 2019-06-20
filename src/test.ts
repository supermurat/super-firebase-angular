// this file is required by karma.conf.ts and loads recursively all the .spec and framework files

// tslint:disable:ordered-imports
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import { getTestBed } from '@angular/core/testing';
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

import { registerLocaleData } from '@angular/common';
import localeTrExtra from '@angular/common/locales/extra/tr';
import localeTr from '@angular/common/locales/tr';

registerLocaleData(localeTr, 'tr', localeTrExtra);

// unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare const __karma__: any;
declare const require: any;

// prevent Karma from running prematurely.
__karma__.loaded = () => {
    // ignore empty block
};

// first, initialize the Angular testing environment.
getTestBed()
    .initTestEnvironment(
        BrowserDynamicTestingModule,
        platformBrowserDynamicTesting()
    );
// then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// and load the modules.
context.keys()
    .map(context);
// finally, start Karma to run the tests.
__karma__.start();
