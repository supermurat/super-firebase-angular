[![Build Status](https://travis-ci.org/supermurat/super-firebase-angular.svg?branch=master)](https://travis-ci.org/supermurat/super-firebase-angular)
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=UFJndlRoc0JrdjBKZVBza3BYTDB6QlhwazZsYmRISnZJNXFtREZ2ZWkrRT0tLS9tVE1TU0h4N2wrekk2eWhrUlg3WkE9PQ==--880a4252fa570dd945d54f88848d9a694a2bae72)](https://www.browserstack.com/automate/public-build/UFJndlRoc0JrdjBKZVBza3BYTDB6QlhwazZsYmRISnZJNXFtREZ2ZWkrRT0tLS9tVE1TU0h4N2wrekk2eWhrUlg3WkE9PQ==--880a4252fa570dd945d54f88848d9a694a2bae72)
[![Coverage Status](https://coveralls.io/repos/github/supermurat/super-firebase-angular/badge.svg?branch=master)](https://coveralls.io/github/supermurat/super-firebase-angular?branch=master)
[![Dependency Status](https://david-dm.org/supermurat/super-firebase-angular.svg)](https://david-dm.org/supermurat/super-firebase-angular)
[![devDependency Status](https://david-dm.org/supermurat/super-firebase-angular/dev-status.svg)](https://david-dm.org/supermurat/super-firebase-angular?type=dev)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/d8bd28c7d9e4499aa0e0cee622fe2352)](https://www.codacy.com/app/supermurat/super-firebase-angular?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=supermurat/super-firebase-angular&amp;utm_campaign=Badge_Grade)
[![Angular Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://angular.io/styleguide)

[![GitHub issues](https://img.shields.io/github/issues/supermurat/super-firebase-angular.svg)](https://github.com/supermurat/super-firebase-angular/issues)
[![GitHub forks](https://img.shields.io/github/forks/supermurat/super-firebase-angular.svg)](https://github.com/supermurat/super-firebase-angular/network)
[![GitHub stars](https://img.shields.io/github/stars/supermurat/super-firebase-angular.svg)](https://github.com/supermurat/super-firebase-angular/stargazers)
[![GitHub license](https://img.shields.io/github/license/supermurat/super-firebase-angular.svg)](https://github.com/supermurat/super-firebase-angular/blob/master/LICENSE)

[![repo size](https://img.shields.io/github/repo-size/supermurat/super-firebase-angular.svg)](https://github.com/supermurat/super-firebase-angular)
[![last commit](https://img.shields.io/github/last-commit/supermurat/super-firebase-angular.svg)](https://github.com/supermurat/super-firebase-angular/commits/master)
[![commit activity](https://img.shields.io/github/commit-activity/w/supermurat/super-firebase-angular.svg)](https://github.com/supermurat/super-firebase-angular/commits/master)

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

## Production

Build files and deploy to Firebase Hosting 
(Includes all of firebase rules, indexed etc.)

```sh
npm run test:cover
firebase deploy
```

## Angular CLI
get more info [`angular-cli/wiki`](https://github.com/angular/angular-cli/wiki)

ng generate [`angular-cli/wiki/generate`](https://github.com/angular/angular-cli/wiki/generate)

stories [`angular-cli/wiki/stories`](https://github.com/angular/angular-cli/wiki/stories)

## Licence

MIT

## Thanks

[![browserstack](https://www.browserstack.com/images/layout/browserstack-logo-600x315.png)](https://www.browserstack.com/)
