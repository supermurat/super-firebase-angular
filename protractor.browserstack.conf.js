// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require("jasmine-spec-reporter");
const browserstack = require("browserstack-local");

if (!process.env.BROWSERSTACK_USERNAME || !process.env.BROWSERSTACK_ACCESS_KEY) {
    throw new Error("Please add BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY " +
        "to your system`s environment variables.");
}
const buildForLocal = ("Local" + (new Date()).getFullYear() + ((new Date()).getMonth() + 1) +
    (new Date()).getDate() + (new Date()).getHours() + (new Date()).getMinutes());
const localIdentifier = "TestID" + (process.env.TRAVIS_BUILD_NUMBER || "Local");

exports.config = {
    allScriptsTimeout: 1000 * 60 * 2,
    getPageTimeout: 1000 * 60 * 2,
    maxSessions: 2,
    specs: [
        "./e2e/**/*.e2e-spec.ts"
    ],
    commonCapabilities: {
        // https://www.browserstack.com/automate/capabilities
        "name": "E2E Test",
        "project": "super-firebase-angular",
        "build": "" + (process.env.TRAVIS_BUILD_NUMBER || buildForLocal) + "#",
        "browserstack.user": process.env.BROWSERSTACK_USERNAME,
        "browserstack.key": process.env.BROWSERSTACK_ACCESS_KEY,
        "acceptSslCerts": true,
        "browserstack.local": true,
        "browserstack.localIdentifier" : localIdentifier,
        "browserstack.video": false,
        "browserstack.networkLogs": true
    },
    multiCapabilities: [{
        "browserName": "Chrome"
    },{
        "browserName": "Safari"
    }, {
        "browserName": "Firefox"
    }, {
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
    }, /*{
        // https://www.browserstack.com/question/663
        "browserName": "iPhone",
        "device": "iPhone X",
        "realMobile": true
    }*/],
    seleniumAddress: "http://hub-cloud.browserstack.com/wd/hub",
    baseUrl: "http://localhost:4200/",
    framework: "jasmine",
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 120000,
        print() {
        }
    },
    onPrepare() {
        require("ts-node").register({
            project: "e2e/tsconfig.e2e.json"
        });
        jasmine.getEnv().addReporter(new SpecReporter({spec: {displayStacktrace: true}}));
    },
    // Code to start browserstack local before start of test
    beforeLaunch() {
        process.stdout.write("Connecting local\n");
        return new Promise(function (resolve, reject) {
            exports.bsLocal = new browserstack.Local();
            exports.bsLocal.start({
                "key": exports.config.commonCapabilities["browserstack.key"],
                "local-identifier": localIdentifier}, function (error) {
                if (error) {
                    process.stdout.write("Error: Couldn`t connected!\n");
                    return reject(error);
                }
                process.stdout.write("Connected. Now testing...\n");

                resolve();
            });
        });
    },
    // Code to stop browserstack local after end of test
    afterLaunch() {
        return new Promise(function (resolve, reject) {
            exports.bsLocal.stop(resolve);
        });
    }
};

// Code to support common capabilities
exports.config.multiCapabilities.forEach(function(caps){
    Object.assign(caps, Object.assign({}, exports.config.commonCapabilities, caps));
});
