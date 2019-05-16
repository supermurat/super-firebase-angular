
const { config } = require("./protractor.browserstack.base.conf.js");

exports.config = {
    ...config,
    baseUrl: "https://supermurat.com/",
    maxSessions: 4
};

exports.config.multiCapabilities.push({
    // Testing local site with Safari is kind of hard, so let`s test only live site with Safari for now
    // https://www.browserstack.com/question/663
    "browserName": "Safari",
    "browser_version" : "10.1"
}/*, {
    // Testing on iPhone is not supported
    // https://github.com/angular/protractor/issues/2840
    // https://github.com/angular/protractor/issues/1736
    // Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.
    // https://www.browserstack.com/question/663
    "browserName": "iPhone",
    "device": "iPhone X",
    "realMobile": true
}*/);

// Code to support common capabilities
exports.config.multiCapabilities.forEach(function(caps){
    Object.assign(caps, Object.assign({
            "browserstack.local": false
        },
        exports.config.commonCapabilities, caps));
});
