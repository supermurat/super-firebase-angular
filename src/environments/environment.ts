// the file contents for the current environment will overwrite these during build.
// the build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// the list of which env maps to which file can be found in `.angular-cli.json`.

/** configuration values of development environment */
export const environment = {
    production: false,
    protocol: '',
    host: '',
    defaultData: {
        defaultTitle: '',
        defaultDescription: '',
        'twitter:site': undefined,
        'twitter:creator': undefined,
        'fb:app_id': undefined,
        'fb:admins': undefined
    },
    Angulartics2: {
        gst: {
            trackingIds: ['UA-8121050-11']
        }
    },
    firebase: {
        apiKey: 'AIzaSyDkD6ALB_-iPZET61nR97SAjLs25gPkkcQ',
        authDomain: 'super-murat-test.firebaseapp.com',
        databaseURL: 'https://super-murat-test.firebaseio.com',
        projectId: 'super-murat-test',
        storageBucket: 'super-murat-test.appspot.com',
        messagingSenderId: '544136229746',
        appId: '1:544136229746:web:b98d5ab00ff8a989'
    }
};
