import { InjectionToken } from '@angular/core';

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
