import { environmentBase } from './environment.base';

export const environment = {...environmentBase};

environment.production = true;
environment.protocol = 'https://';
environment.host = 'beta.supermurat.com';
