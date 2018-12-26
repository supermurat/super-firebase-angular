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
