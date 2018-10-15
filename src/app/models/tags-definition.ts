import { environment } from '../../environments/environment';

/**
 * Tags Definition of Page
 *
 * Contains all kind of data for seo and html
 */
export class TagsDefinition {
    /** title of page */
    title ? = environment.defaultTitle;
    /** description of page */
    description ? = environment.defaultDescription;
    /** image url of page */
    image?: string;

    /** slug of page */
    slug?: string;
    /** culture code of page */
    cultureCode?: string;
    /** language code of page */
    languageCode?: string;
    /** alternate language object array of page */
    langAlternates?: Array<{languageCode: string, cultureCode: string, slug: string}> = [];

    /** twitter:card of page */
    twitterCard?: string;
    /** twitter:site of page */
    twitterSite?: string;
    /** twitter:creator of page */
    twitterCreator?: string;
    /** title of page specified for twitter */
    twitterTitle?: string;
    /** description of page specified for twitter */
    twitterDescription?: string;
    /** image url of page specified for twitter */
    twitterImage?: string;

    /** og:type of page */
    ogType?: string;
    /** og:site_name of page */
    ogSiteName?: string;
    /** title of page specified for twitter */
    ogTitle?: string;
    /** description of page specified for twitter */
    ogDescription?: string;
    /** image url of page specified for twitter */
    ogImage?: string;

    /** robots tag of page */
    robots?: string;
    /** author tag of page */
    author?: string;
    /** owner tag of page */
    owner?: string;
    /** copyright of page */
    copyright?: string;
    /** facebook App ID */
    facebookAppID?: string;
    /** facebook Admins ID List */
    facebookAdmins?: string;
    /** google publisher of page */
    googlePublisher?: string;
    /** article:author tag of page */
    articleAuthorURL?: string;
    /** article:publisher tag of page */
    articlePublisherURL?: string;
}
