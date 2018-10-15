const browserstack = require("browserstack-local");
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require("jasmine-spec-reporter");

// console.log("process.env.BROWSERSTACK_USERNAME:", process.env.BROWSERSTACK_USERNAME);

exports.config = {
    allScriptsTimeout: 11000,
    specs: [
        "./e2e/**/*.e2e-spec.ts"
    ],
    commonCapabilities: {
        "name": "E2E Test",
        "project": "super-firebase-angular",
        "build": "" + (process.env.TRAVIS_BUILD_NUMBER || "Local") + "#",
        "browserstack.user": process.env.BROWSERSTACK_USERNAME,
        "browserstack.key": process.env.BROWSERSTACK_ACCESS_KEY,
        "acceptSslCerts": true,
        "browserstack.local": true,
        "browserstack.video": false,
    },
    multiCapabilities: [{
        "browserName": "Chrome",
        "chromeOptions": {
            "args": ["--disable-popup-blocking"]
        }
    },/* {
        'browserName': 'Safari',
        'browserstack.safari.enablePopups': true
    }, {
        'browserName': 'Firefox'
    }, {
        'browserName': 'IE',
        'browserstack.ie.enablePopups': true
    }*/
    ],
    seleniumAddress: "http://hub-cloud.browserstack.com/wd/hub",
    baseUrl: "http://localhost:4200/",
    framework: "jasmine",
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000,
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
        // console.log("Connecting local");
        return new Promise(function (resolve, reject) {
            exports.bsLocal = new browserstack.Local();
            exports.bsLocal.start({"key": exports.config.commonCapabilities["browserstack.key"]}, function (error) {
                if (error) {
                    return reject(error);
                }
                // console.log('Connected. Now testing...');

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
