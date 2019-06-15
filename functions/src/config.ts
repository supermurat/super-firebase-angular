/** Functions Config */

const FUNCTIONS_CONFIG_LOCAL = {
    /** supported culture codes; ['en', 'tr'] */
    supportedCultureCodes: ['en-US', 'tr-TR'],
    /** supported language codes; ['en', 'tr'] */
    supportedLanguageCodes: ['en', 'tr'],
    /** default language code to redirect; en, tr */
    defaultLanguageCode: 'tr',
    /** do you want to cache responses? */
    cacheResponses: false
};

const FUNCTIONS_CONFIG_PROD = {
    /** supported culture codes; ['en', 'tr'] */
    supportedCultureCodes: ['en-US', 'tr-TR'],
    /** supported language codes; ['en', 'tr'] */
    supportedLanguageCodes: ['en', 'tr'],
    /** default language code to redirect; en, tr */
    defaultLanguageCode: 'tr',
    /** do you want to cache responses? */
    cacheResponses: true
};

// istanbul ignore next
export const FUNCTIONS_CONFIG = process.env.IS_RUNNING_ON_LOCALHOST ? FUNCTIONS_CONFIG_LOCAL : FUNCTIONS_CONFIG_PROD;

// istanbul ignore next
console.log('FUNCTIONS_CONFIG IN USE:', process.env.IS_RUNNING_ON_LOCALHOST ? '_LOCAL' : '_PROD');
