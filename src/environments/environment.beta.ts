import { environmentBase } from './environment.base';

export const environment = {...environmentBase};

environment.production = true;
environment.protocol = 'https://';
environment.host = 'beta.supermurat.com';
environment.Angulartics2 = JSON.parse(process.env.CONFIG_BETA_ANGULARTICS2);
environment.firebase = JSON.parse(process.env.CONFIG_BETA_FIREBASE);
environment.cse = JSON.parse(process.env.CONFIG_BETA_CSE);
