// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require("jasmine-spec-reporter");

exports.config = {
  allScriptsTimeout: 60000 * 2,
  specs: [
    "./**/*.e2e-spec.ts"
  ],
  capabilities: {
    "browserName": "chrome"
  },
  directConnect: true,
  baseUrl: "http://localhost:4200/",
  framework: "jasmine",
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000 * 2,
    print() {}
  },
  onPrepare() {
    require("ts-node").register({
      project: "e2e/tsconfig.e2e.json"
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};
