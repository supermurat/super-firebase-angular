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
    firebaseConfig: {
        apiKey: 'AIzaSyAt3I_Wnzm7_iMsXG0rM77FPAcTEAFCRHs',
        authDomain: 'supermurat-com.firebaseapp.com',
        databaseURL: 'https://supermurat-com.firebaseio.com',
        projectId: 'supermurat-com',
        storageBucket: 'supermurat-com.appspot.com',
        messagingSenderId: '200768028544'
    }
};
