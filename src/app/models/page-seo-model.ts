/**
 * SEO Data of Page
 *
 * Contains all kind of data for seo and html
 */
export class PageSeoModel {
    /** alternate language object array of page */
    localeAlternates?: Array<{
        /** alternate language code of page */
        languageCode: string,
        /** alternate culture code of page */
        cultureCode: string,
        /** alternate slug of page */
        slug: string
    }>;

    /**
     * custom meta data of page
     * Note: object keys will be used as "name" and values will be used as "content" of meta tag
     * Sample: custom = {"robots": "index, follow", "copyright": "Name of owner"}
     */
    custom?: any;

    /**
     * twitter meta data of page
     * Note: object keys will be used as "name" and values will be used as "content" of meta tag
     * Sample: tw = {"twitter:card": "article", "twitter:title": "Sample Article"}
     */
    tw?: any;
    /**
     * facebook/og meta data of page
     * Note 1: object keys will be used as "property" and values will be used as "content" of meta tag
     * Sample: og = {"og:type": "article", "og:title": "Sample Article"}
     * Note 2: if og is not undefined we will add "og:url" and "og:locale" automatically
     */
    og?: any;
}
