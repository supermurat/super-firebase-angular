/** configuration values of production environment */
export const environment = {
    production: true,
    protocol: 'https://',
    host: 'supermurat.com',
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
            trackingIds: ['UA-8121050-6']
        }
    },
    firebase: {
        apiKey: 'AIzaSyBVj-tYpt71UKnxWR-vQKvrBli_-_4Pwb0',
        authDomain: 'super-murat-prod.firebaseapp.com',
        databaseURL: 'https://super-murat-prod.firebaseio.com',
        projectId: 'super-murat-prod',
        storageBucket: 'super-murat-prod.appspot.com',
        messagingSenderId: '130699905933',
        appId: '1:130699905933:web:018d488d5454ec7a'
    }
};
