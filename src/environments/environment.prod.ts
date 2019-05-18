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
        apiKey: 'AIzaSyAt3I_Wnzm7_iMsXG0rM77FPAcTEAFCRHs',
        authDomain: 'supermurat-com.firebaseapp.com',
        databaseURL: 'https://supermurat-com.firebaseio.com',
        projectId: 'supermurat-com',
        storageBucket: 'supermurat-com.appspot.com',
        messagingSenderId: '200768028544',
        appId: '1:200768028544:web:afa4062f3e780479'
    }
};
