[![Build Status][badge-url-travis]][badge-lnk-travis]
[![BrowserStack Status][badge-url-browserstack]][badge-lnk-browserstack]
[![Coverage Status][badge-url-coveralls]][badge-lnk-coveralls]
[![Codacy Badge][badge-url-codacy]][badge-lnk-codacy]
[![Angular Style Guide][badge-url-styleguide]][badge-lnk-styleguide]

[![Dependency Status][badge-url-david-dm]][badge-lnk-david-dm]
[![devDependency Status][badge-url-david-dm-dev]][badge-lnk-david-dm-dev]
[![GitHub issues][badge-url-issues]][badge-lnk-issues]
[![GitHub forks][badge-url-network]][badge-lnk-network]
[![GitHub stars][badge-url-stargazers]][badge-lnk-stargazers]
[![GitHub license][badge-url-license]][badge-lnk-license]

[![repo size][badge-url-repo-size]][badge-lnk-repo-size]
[![last commit][badge-url-last-commit]][badge-lnk-last-commit]
[![commit activity][badge-url-commit-activity]][badge-lnk-commit-activity]

# super-firebase-angular
All-In-One firebase and angular project.

## Install global dependencies
```sh
npm run install:dependencies:global
```

## Install dependencies
```sh
npm run install:dependencies
```

## Development
With "ng serve" (default i18n - en) - [`http://localhost:4200/`](http://localhost:4200/)
```sh
npm run start
```
With "firebase serve" (i18n support - en, tr) - [`http://localhost:5000/`](http://localhost:5000/)
```sh
npm run serve:i18n
```

### Extract i18n Translation File
```sh
npm run extract:i18n
```

### Check Bundle Stats
```sh
npm run stats
```

### Unit Test - Karma
```sh
npm run test
```

### Protractor Test - e2e 
```sh
npm run e2e
```

## Deployment

Build files and deploy to Firebase Hosting 
(Includes all of firebase rules, indexed etc.)
### Deploy to Beta Environment
```sh
npm run deploy:beta
```
### Deploy to Prod Environment
```sh
npm run deploy:prod
```

## Angular CLI
get more info [`angular-cli/wiki`][site-angular-cli-wiki]

ng generate [`angular-cli/wiki/generate`][site-angular-cli-generate]

stories [`angular-cli/wiki/stories`][site-angular-cli-stories]

## Contributing
- Fork this repository to your GitHub account
- Clone the forked repository
- Create your feature branch
- Commit your changes
- Push to the remote branch
- Open a Pull Request

## Licence

MIT

## Thanks to
| [![Google Firebase][lg-fb]][st-fb] | [![JetBrains][lg-jb]][st-jb]     |
| ---                                | ---                              |
| [![Browser Stack][lg-bs]][st-bs]   | [![Travis-CI][lg-t-ci]][st-t-ci] |
| [![Codacy][lg-cdc]][st-cdc]        | [![Coveralls][lg-cvr]][st-cvr]   |

[badge-url-travis]: https://travis-ci.org/supermurat/super-firebase-angular.svg?branch=master
[badge-lnk-travis]: https://travis-ci.org/supermurat/super-firebase-angular
[badge-url-browserstack]: https://automate.browserstack.com/badge.svg?badge_key=bEJzMFVHL3Q2a3MrUDJHOGs5QnNyNVBEcjZnY3VXcUFnV0EybFM4R1YwQT0tLUtNY0hUVldOU2NlekNtOWw0U0J0SHc9PQ==--0c83c47289555797259d7502bf3b06edf066f903
[badge-lnk-browserstack]: https://automate.browserstack.com/public-build/bEJzMFVHL3Q2a3MrUDJHOGs5QnNyNVBEcjZnY3VXcUFnV0EybFM4R1YwQT0tLUtNY0hUVldOU2NlekNtOWw0U0J0SHc9PQ==--0c83c47289555797259d7502bf3b06edf066f903
[badge-url-coveralls]: https://coveralls.io/repos/github/supermurat/super-firebase-angular/badge.svg?branch=master
[badge-lnk-coveralls]: https://coveralls.io/github/supermurat/super-firebase-angular?branch=master
[badge-url-codacy]: https://api.codacy.com/project/badge/Grade/d8bd28c7d9e4499aa0e0cee622fe2352
[badge-lnk-codacy]: https://www.codacy.com/app/supermurat/super-firebase-angular?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=supermurat/super-firebase-angular&amp;utm_campaign=Badge_Grade
[badge-url-styleguide]: https://mgechev.github.io/angular2-style-guide/images/badge.svg
[badge-lnk-styleguide]: https://angular.io/styleguide

[badge-url-david-dm]: https://david-dm.org/supermurat/super-firebase-angular.svg
[badge-lnk-david-dm]: https://david-dm.org/supermurat/super-firebase-angular
[badge-url-david-dm-dev]: https://david-dm.org/supermurat/super-firebase-angular/dev-status.svg
[badge-lnk-david-dm-dev]: https://david-dm.org/supermurat/super-firebase-angular?type=dev
[badge-url-issues]: https://img.shields.io/github/issues/supermurat/super-firebase-angular.svg
[badge-lnk-issues]: https://github.com/supermurat/super-firebase-angular/issues
[badge-url-network]: https://img.shields.io/github/forks/supermurat/super-firebase-angular.svg
[badge-lnk-network]: https://github.com/supermurat/super-firebase-angular/network
[badge-url-stargazers]: https://img.shields.io/github/stars/supermurat/super-firebase-angular.svg
[badge-lnk-stargazers]: https://github.com/supermurat/super-firebase-angular/stargazers
[badge-url-license]: https://img.shields.io/github/license/supermurat/super-firebase-angular.svg
[badge-lnk-license]: https://github.com/supermurat/super-firebase-angular/blob/master/LICENSE

[badge-url-repo-size]: https://img.shields.io/github/repo-size/supermurat/super-firebase-angular.svg
[badge-lnk-repo-size]: https://github.com/supermurat/super-firebase-angular
[badge-url-last-commit]: https://img.shields.io/github/last-commit/supermurat/super-firebase-angular.svg
[badge-lnk-last-commit]: https://github.com/supermurat/super-firebase-angular/commits/master
[badge-url-commit-activity]: https://img.shields.io/github/commit-activity/w/supermurat/super-firebase-angular.svg
[badge-lnk-commit-activity]: https://github.com/supermurat/super-firebase-angular/commits/master

[site-angular-cli-wiki]: https://github.com/angular/angular-cli/wiki
[site-angular-cli-generate]: https://github.com/angular/angular-cli/wiki/generate
[site-angular-cli-stories]: https://github.com/angular/angular-cli/wiki/stories

[lg-fb]: https://raw.githubusercontent.com/supermurat/super-firebase-angular/master/docs/images/firebase.png "Google Firebase"
[lg-jb]: https://raw.githubusercontent.com/supermurat/super-firebase-angular/master/docs/images/jetbrains.png "JetBrains"
[lg-bs]: https://raw.githubusercontent.com/supermurat/super-firebase-angular/master/docs/images/browserstack.png "Browser Stack"
[lg-t-ci]: https://raw.githubusercontent.com/supermurat/super-firebase-angular/master/docs/images/travis-ci.png "Travis-CI"
[lg-cdc]: https://raw.githubusercontent.com/supermurat/super-firebase-angular/master/docs/images/codacy.png "Codacy"
[lg-coveralls]: https://raw.githubusercontent.com/supermurat/super-firebase-angular/master/docs/images/coveralls.png "Coveralls"

[st-fb]: https://firebase.google.com
[st-jb]: https://www.jetbrains.com/?from=SuperFirebaseAngular
[st-bs]: https://www.browserstack.com
[st-t-ci]: https://www.travis-ci.org
[st-cdc]: https://www.codacy.com
[st-cvr]: https://coveralls.io
