// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    config.set({
        basePath: "",
        frameworks: ["jasmine", "@angular-devkit/build-angular"],
        plugins: [
            require("karma-jasmine"),
            require("karma-mocha-reporter"),
            require("karma-chrome-launcher"),
            require("karma-jasmine-html-reporter"),
            require("karma-coverage-istanbul-reporter"),
            require("@angular-devkit/build-angular/plugins/karma"),
            require("karma-scss-preprocessor")
        ],
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        coverageIstanbulReporter: {
            dir: require("path").join(__dirname, "coverage"), reports: ["html", "lcovonly", "text-summary"],
            fixWebpackSourcePaths: true
        },
        angularCli: {
            environment: "dev"
        },
        reporters: ["progress", "mocha", "kjhtml"],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ["Chrome"],
        singleRun: false,
        files: [
            { pattern: "./src/**/*.scss", watched: true,  included: true, served: true }
        ],
        preprocessors: {
            "src/**/*.scss": ["scss"]
        },
        scssPreprocessor: {
            options: {
                sourceMap: true
            }
        }
    });
};
