import { environment } from '../../environments/environment';

export class TagsDefinition {
    title ? = environment.defaultTitle;
    description ? = environment.defaultDescription;
    image?: string;

    slug?: string;
    cultureCode?: string;
    languageCode?: string;
    langAlternates?: Array<{languageCode: string, cultureCode: string, slug: string}> = [];

    twitterCard?: string;
    twitterSite?: string;
    twitterCreator?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;

    ogType?: string;
    ogSiteName?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;

    robots?: string;
    author?: string;
    owner?: string;
    copyright?: string;
    facebookAppID?: string;
    facebookAdmins?: string;
    googlePublisher?: string;
    articleAuthorURL?: string;
    articlePublisherURL?: string;
}
