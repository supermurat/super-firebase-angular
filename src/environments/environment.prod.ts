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
    }
};
