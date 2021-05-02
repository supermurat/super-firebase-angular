import { environmentBase } from './environment.base';

export const environment = {...environmentBase};

environment.production = true;
environment.protocol = 'https://';
environment.host = 'supermurat.com';
environment.Angulartics2.gst.trackingIds = ['UA-8121050-6'];
environment.firebase = {
    apiKey: 'AIzaSyAt3I_Wnzm7_iMsXG0rM77FPAcTEAFCRHs',
    authDomain: 'supermurat-com.firebaseapp.com',
    databaseURL: 'https://supermurat-com.firebaseio.com',
    projectId: 'supermurat-com',
    storageBucket: 'supermurat-com.appspot.com',
    messagingSenderId: '200768028544',
    appId: '1:200768028544:web:afa4062f3e780479'
};
