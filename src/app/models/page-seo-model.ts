/**
 * SEO Data of Page
 *
 * Contains all kind of data for seo and html
 */
export class PageSeoModel {
    /**
     * custom name meta data of page
     * Note: object keys will be used as "name" and values will be used as "content" of meta tag
     * Sample: names = {"robots": "index, follow", "copyright": "Name of owner"}
     * Sample: names = {"twitter:card": "article", "twitter:title": "Sample Article"}
     */
    names?: any;
    /**
     * custom property meta data of page
     * Note: object keys will be used as "property" and values will be used as "content" of meta tag
     * Sample: properties = {"og:type": "article", "og:title": "Sample Article"}
     */
    properties?: any;
}
