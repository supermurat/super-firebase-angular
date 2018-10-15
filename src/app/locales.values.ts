
/** interface of locale object */
export interface ILocale {
    /** code of locale */
    code: string;
    /** text of locale */
    text: string;
}

/** supported locale object array */
export const locales: Array<ILocale> = [
    {
        code: 'en',
        text: 'English'
    },
    {
        code: 'tr',
        text: 'Türkçe'
    }
];
