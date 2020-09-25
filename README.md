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
| [![Google Firebase](/docs/images/firebase.png "Google Firebase")][site-firebase]     | [![JetBrains](/docs/images/jetbrains.png "JetBrains")][site-jetbrains] |
| ---                                                                                  | ---                                                                    |
| [![Browser Stack](/docs/images/browserstack.png "Browser Stack")][site-browserstack] | [![Travis-CI](/docs/images/travis-ci.png "Travis-CI")][site-travis-ci] |
| [![Codacy](/docs/images/codacy.png "Codacy")][site-codacy]                           | [![Coveralls](/docs/images/coveralls.png "Coveralls")][site-coveralls] |

[badge-url-travis]: https://travis-ci.org/supermurat/super-firebase-angular.svg?branch=master
[badge-lnk-travis]: https://travis-ci.org/supermurat/super-firebase-angular
[badge-url-browserstack]: https://automate.browserstack.com/badge.svg?badge_key=NW5WdStCU1RVVVpZOERoaGFFMnc0VWJRVlF3MVBYQ29EQWswWTJ1bmU1ST0tLTB1T3JrNmpFQWpvcDJwTGZoTHF6Snc9PQ==--d4bf8976f4d2485a4971d6606e5a72bd0559a8cb
[badge-lnk-browserstack]: https://automate.browserstack.com/public-build/NW5WdStCU1RVVVpZOERoaGFFMnc0VWJRVlF3MVBYQ29EQWswWTJ1bmU1ST0tLTB1T3JrNmpFQWpvcDJwTGZoTHF6Snc9PQ==--d4bf8976f4d2485a4971d6606e5a72bd0559a8cb
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

[site-firebase]: https://firebase.google.com
[site-jetbrains]: https://www.jetbrains.com/?from=SuperFirebaseAngular
[site-browserstack]: https://www.browserstack.com
[site-travis-ci]: https://www.travis-ci.org
[site-codacy]: https://www.codacy.com
[site-coveralls]: https://coveralls.io
