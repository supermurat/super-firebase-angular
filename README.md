[![Build Status](https://travis-ci.org/supermurat/super-firebase-angular.svg?branch=master)](https://travis-ci.org/supermurat/super-firebase-angular)
[![Coverage Status](https://coveralls.io/repos/github/supermurat/super-firebase-angular/badge.svg?branch=master)](https://coveralls.io/github/supermurat/super-firebase-angular?branch=master)
[![Dependency Status](https://david-dm.org/supermurat/super-firebase-angular.svg)](https://david-dm.org/supermurat/super-firebase-angular)
[![devDependency Status](https://david-dm.org/supermurat/super-firebase-angular/dev-status.svg)](https://david-dm.org/supermurat/super-firebase-angular#info=devDependencies)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/d8bd28c7d9e4499aa0e0cee622fe2352)](https://www.codacy.com/app/supermurat/super-firebase-angular?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=supermurat/super-firebase-angular&amp;utm_campaign=Badge_Grade)
[![Angular Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://angular.io/styleguide)

# super-firebase-angular
All-In-One firebase and angular project.

## Development
With "ng serve" (default i18n - en) - [`http://localhost:4200/`](http://localhost:4200/)
```sh
npm run start
```
With "firebase serve" (i18n support - en, tr) - [`http://localhost:5000/`](http://localhost:5000/)
```sh
npm run serve:i18n
```

## Extract i18n Translation File
```sh
npm run extract:i18n
```

## Unit Test - Karma
```sh
npm run test
```

## Protractor Test - e2e 
```sh
npm run e2e
```

## Production

Build files and deploy to Firebase Hosting (Includes all of firebase rules, indexed etc.)

```sh
firebase deploy
```

## Licence

MIT