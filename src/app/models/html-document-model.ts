import { environment } from '../../environments/environment';

/**
 * HTML Tags of Page
 *
 * Contains all kind of data for seo and html
 */
export class HtmlDocumentModel {
    /** title of page */
    title ? = environment.defaultTitle;
    /** description of page */
    description ? = environment.defaultDescription;
    /** image url of content */
    image?: string;
    /** image alternate text */
    imageAltText?: string;

    /** slug of page */
    slug?: string;
    /** culture code of page */
    cultureCode?: string;
    /** language code of page */
    languageCode?: string;
    /** alternate language object array of page */
    langAlternates?: Array<{
        /** alternate language code of page */
        languageCode: string,
        /** alternate culture code of page */
        cultureCode: string,
        /** alternate slug of page */
        slug: string
    }> = [];

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

    /**
     * robots tag of page; sample: 'index, follow', 'noindex, nofollow'
     * https://www.metatags.org/meta_name_robots
     */
    robots?: string;
    /**
     * author tag of page
     * https://www.metatags.org/meta_name_author
     */
    author?: string;
    /** owner tag of page */
    owner?: string;
    /**
     * copyright of page
     * https://www.metatags.org/meta_name_copyright
     */
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
