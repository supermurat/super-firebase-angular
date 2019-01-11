import { InjectionToken } from '@angular/core';
import { RouterLinksModel } from './models/router-links-model';

/** Interface of APP_CONFIG */
export interface InterfaceAppConfig {
    /** is Unit Test running ? */
    isUnitTest: boolean;
}

/** default configuration object */
export const APP_DI_CONFIG: InterfaceAppConfig = {
    isUnitTest: false
};

/** configuration object for unit tests */
export const APP_UNIT_TEST_CONFIG: InterfaceAppConfig = {
    isUnitTest: true
};

/** InjectionToken for APP_CONFIG */
export let APP_CONFIG = new InjectionToken<InterfaceAppConfig>('app.config');

/** language names by language code */
export const languageNames = {
    en: 'English',
    tr: 'Türkçe'
};

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
