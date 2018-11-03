
const { config } = require("./protractor.browserstack.base.conf.js");
const browserstack = require("browserstack-local");

const localIdentifier = "TestID" + (process.env.TRAVIS_BUILD_NUMBER || "Local");

exports.config = {
    ...config,
    baseUrl: "http://localhost:8080/",
    beforeLaunch() {
        // Code to start browserstack local before start of test
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
    afterLaunch() {
        // Code to stop browserstack local after end of test
        return new Promise(function (resolve, reject) {
            exports.bsLocal.stop(resolve);
        });
    }
};

// Code to support common capabilities
exports.config.multiCapabilities.forEach(function(caps){
    Object.assign(caps, Object.assign({
            "browserstack.local": true,
            "browserstack.localIdentifier" : localIdentifier
        },
        exports.config.commonCapabilities, caps));
});
