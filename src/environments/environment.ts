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
        apiKey: 'AIzaSyCBMHia-sEJ6srd8mnyfQqatMdZEtbyyqg',
        authDomain: 'super-murat-beta.firebaseapp.com',
        databaseURL: 'https://super-murat-beta.firebaseio.com',
        projectId: 'super-murat-beta',
        storageBucket: 'super-murat-beta.appspot.com',
        messagingSenderId: '1049127022657',
        appId: '1:1049127022657:web:11d999d7d785e02a'
    }
};
