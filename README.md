# I need to focus on something else now on. So, this project is canceled!

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

[site-angular-cli-wiki]: https://github.com/angular/angular-cli/wiki
[site-angular-cli-generate]: https://github.com/angular/angular-cli/wiki/generate
[site-angular-cli-stories]: https://github.com/angular/angular-cli/wiki/stories

