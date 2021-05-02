import * as dotenv from 'dotenv';
dotenv.config();

export const environmentBase = {
    production: false,
    protocol: 'http://',
    host: 'localhost:4200',
    defaultData: {
        defaultTitle: '',
        defaultDescription: '',
        'twitter:site': undefined,
        'twitter:creator': undefined,
        'fb:app_id': undefined,
        'fb:admins': undefined
    },
    Angulartics2: JSON.parse(process.env.CONFIG_BASE_ANGULARTICS2),
    firebase: JSON.parse(process.env.CONFIG_BASE_FIREBASE),
    cse: JSON.parse(process.env.CONFIG_BASE_CSE)
};
