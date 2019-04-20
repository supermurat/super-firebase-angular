// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require("jasmine-spec-reporter");

if (!process.env.BROWSERSTACK_USERNAME || !process.env.BROWSERSTACK_ACCESS_KEY) {
    throw new Error("Please add BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY " +
        "to your system`s environment variables.");
}
const buildForLocal = ("Local" + (new Date()).getFullYear() + ((new Date()).getMonth() + 1) +
    (new Date()).getDate() + (new Date()).getHours() + (new Date()).getMinutes());

exports.config = {
    allScriptsTimeout: 60000 * 2,
    getPageTimeout: 60000 * 2,
    maxSessions: 2,
    specs: [
        "./**/*.e2e-spec.ts"
    ],
    commonCapabilities: {
        // https://www.browserstack.com/automate/capabilities
        "name": "E2E Test",
        "project": "super-firebase-angular",
        "build": "" + (process.env.TRAVIS_BUILD_NUMBER || buildForLocal) + "#",
        "browserstack.user": process.env.BROWSERSTACK_USERNAME,
        "browserstack.key": process.env.BROWSERSTACK_ACCESS_KEY,
        "acceptSslCerts": true,
        "browserstack.video": false,
        "browserstack.networkLogs": false,
        "browserstack.debug": false,
        "browserstack.console": "errors" // errors, warnings, info, verbose, disable
    },
    multiCapabilities: [{
        "browserName": "Chrome"
    }, {
        "browserName": "Firefox"
    } /*,{
        "os" : "Windows",
        "os_version" : "7",
        "browserName": "IE",
        "browser_version" : "10.0",
    }, {
        "browserName": "android",
        "device": "Samsung Galaxy S9 Plus",
        "realMobile": true
    }, {
        "browserName": "android",
        "device": "Google Pixel 2",
        "realMobile": true
    }*/],
    seleniumAddress: "http://hub-cloud.browserstack.com/wd/hub",
    framework: "jasmine",
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 60000 * 2,
        print() {
        }
    },
    onPrepare() {
        require("ts-node").register({
            project: "e2e/tsconfig.e2e.json"
        });
        jasmine.getEnv().addReporter(new SpecReporter({spec: {displayStacktrace: true}}));
    }
};
