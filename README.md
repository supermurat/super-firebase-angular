[![Build Status](https://travis-ci.org/supermurat/super-firebase-angular.svg?branch=master)](https://travis-ci.org/supermurat/super-firebase-angular)

# super-firebase-angular
All-In-One firebase and angular project.

### Development
With "ng serve" (default i18n - en) - http://localhost:4200/
```sh
npm run start
```
With "firebase serve" (i18n support - en, tr) - http://localhost:5000/
```sh
npm run serve
```

### Extract i18n Translation File
```sh
npm run extract:i18n
```

### Unit Test - Karma
```sh
npm run test
```

### Protractor Test - e2e 
```sh
npm run e2e
```

### Production

Build files and deploy to Firebase Hosting (Includes all of firebase rules, indexed etc.)

```sh
firebase deploy
```

### Licence

MIT