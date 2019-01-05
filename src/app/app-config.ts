import { InjectionToken } from '@angular/core';
import { RouterLinksModel } from './models/router-links-model';

export interface InterfaceAppConfig {
    /** is Unit Test running ? */
    isUnitTest: boolean;
}

export const APP_DI_CONFIG: InterfaceAppConfig = {
    isUnitTest: false
};

export const APP_UNIT_TEST_CONFIG: InterfaceAppConfig = {
    isUnitTest: true
};

export let APP_CONFIG = new InjectionToken<InterfaceAppConfig>('app.config');

/** interface of locale object */
export interface InterfaceLocale {
    /** code of locale */
    code: string;
    /** text of locale */
    text: string;
}

/** supported locale object array */
export const locales: Array<InterfaceLocale> = [
    {
        code: 'en',
        text: 'English'
    },
    {
        code: 'tr',
        text: 'Türkçe'
    }
];

/** routerLinks for English */
export const routerLinksEN: RouterLinksModel = {
    blogs: '/blogs',
    articles: '/articles',
    jokes: '/jokes',
    quotes: '/quotes',
    blog: '/blog',
    article: '/article',
    joke: '/joke',
    quote: '/quote',
    tag: '/tag'
};

/** routerLinks for Turkish */
export const routerLinksTR: RouterLinksModel = {
    blogs: '/gunlukler',
    articles: '/makaleler',
    jokes: '/eglence',
    quotes: '/alintilar',
    blog: '/gunluk',
    article: '/makale',
    joke: '/fikra',
    quote: '/alinti',
    tag: '/etiket'
};
