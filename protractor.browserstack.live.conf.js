// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require("jasmine-spec-reporter");

if (process.env.BROWSERSTACK_USERNAME === undefined || process.env.BROWSERSTACK_ACCESS_KEY === undefined) {
    throw new Error('Please add BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY ' +
        'to your system`s environment variables.');
}
const buildForLocal = ("Local" + (new Date()).getFullYear() + ((new Date()).getMonth() + 1) +
    (new Date()).getDate() + (new Date()).getHours() + (new Date()).getMinutes());

exports.config = {
    allScriptsTimeout: 1000 * 60 * 2,
    getPageTimeout: 1000 * 60 * 2,
    specs: [
        "./e2e/**/*.e2e-spec.ts"
    ],
    commonCapabilities: {
        "name": "E2E Test",
        "project": "super-firebase-angular",
        "build": "" + (process.env.TRAVIS_BUILD_NUMBER || buildForLocal) + "#",
        "browserstack.user": process.env.BROWSERSTACK_USERNAME,
        "browserstack.key": process.env.BROWSERSTACK_ACCESS_KEY,
        "acceptSslCerts": true,
        "browserstack.local": false,
        "browserstack.video": false,
    },
    multiCapabilities: [{
        "browserName": "Chrome"
    },{
        'browserName': 'Safari'
    }, {
        'browserName': 'Firefox'
    }, {
        'browserName': 'IE'
    }],
    seleniumAddress: "http://hub-cloud.browserstack.com/wd/hub",
    baseUrl: "https://supermurat-com.firebaseapp.com/",
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
    }
};

// Code to support common capabilities
exports.config.multiCapabilities.forEach(function(caps){
    Object.assign(caps, Object.assign({}, exports.config.commonCapabilities, caps));
});
