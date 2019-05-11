/** configuration values of production environment */
export const environment = {
    production: true,
    protocol: 'https://',
    host: 'test.supermurat.com',
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
