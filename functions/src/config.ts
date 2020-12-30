import * as express from 'express';

/** Local Configs */
export const FUNCTIONS_CONFIG = {
    /** supported culture codes; ['en', 'tr'] */
    supportedCultureCodes: ['en-US', 'tr-TR'],
    /** supported language codes; ['en', 'tr'] */
    supportedLanguageCodes: ['en', 'tr'],
    /** default language code to redirect; en, tr */
    defaultLanguageCode: 'tr',
    /** do you want to cache responses? */
    cacheResponses: false,
    /**
     * options for cors
     * https://www.npmjs.com/package/cors#configuration-options
     */
    cors: { origin: true },
    /**
     * options for helmet-csp
     * https://www.npmjs.com/package/helmet-csp
     */
    csp: {
        directives: {
            defaultSrc: ["'self'", '*.googleapis.com', '*.google-analytics.com'],
            imgSrc: [
                "'self'", 'data:', '*.googleapis.com', '*.google.com',
                '*.google.com.tr', '*.google-analytics.com', '*.doubleclick.net'],
            styleSrc: ["'self'", "'unsafe-inline'", '*.google.com'],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", '*.googletagmanager.com', '*.google-analytics.com', '*.google.com']
        }
    },
    /**
     * check if request is valid
     * resolve true if it is OK
     * resolve false if it is Invalid or Bad
     */
    isRequestValid: async (req: express.Request, res: express.Response, send404Page: (req1, res1) => Promise<void>): Promise<boolean> => {
        // this is only for old php web site but keeping them forever would be better in case of search engines
        // a url like that won't be ok anymore
        if (req.url.indexOf('?page') > -1 ||
            req.url.indexOf('.php?') > -1 ||
            req.url.endsWith('/all/feed')) {
            await send404Page(req, res);

            return Promise.resolve(false);
        }
        // this is for lost person, we may be in attach, so no need to use more resource
        if (req.path.indexOf('%20') > -1 || // ' '
            req.path.indexOf('%22') > -1 || // "
            req.path.indexOf('%27') > -1 || // '
            req.path.indexOf('=') > -1 ||
            req.url.startsWith('/modules/') ||
            req.url.startsWith('/sites/') ||
            req.url.startsWith('/wp-') ||
            req.url.indexOf('login.') > -1 ||
            req.url.indexOf('admin.') > -1 ||
            req.url.indexOf('/.env') > -1 ||
            req.url.indexOf('.conf') > -1) {
            res.status(404)
                .send('<p>Invalid Url!</p><p>If you lost</p> <a href="/">Go to Home Page</a>');

            return Promise.resolve(false);
        }

        return Promise.resolve(true);
    }
};

// istanbul ignore next
if (process.env.IS_RUNNING_ON_LOCALHOST) {
    console.log('FUNCTIONS_CONFIG SET FOR LOCALHOST');
} else {
    FUNCTIONS_CONFIG.cacheResponses = true;
    console.log('FUNCTIONS_CONFIG SET FOR LIVE');
}
