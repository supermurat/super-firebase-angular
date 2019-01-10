import { CarouselModel } from './carousel-model';
import { PageSeoModel } from './page-seo-model';

/**
 * Page Base Class
 */
export class PageBaseModel {
    /** id of record */
    id?: string;
    /** path of record */
    path?: string;
    /** route path without id */
    routePath?: string;
    /** order number of record */
    orderNo?: number;
    /** title of record */
    title?: string;
    /** description of record */
    description?: string;
    /** image url of content */
    image?: string;
    /** image alternate text */
    imageAltText?: string;
    /** html content of page */
    content?: any;
    /** taxonomy */
    taxonomy?: any; // key: link, value: title
    /** carousel item array of page */
    carousel?: CarouselModel;
    /** url of background cover image */
    backgroundCoverUrl?: CarouselModel;
    /** summary html content of page */
    contentSummary?: string;
    /** unique key for translations */
    i18nKey?: string;
    /** creation date */
    created?: any = {seconds: undefined};
    /** creator person */
    createdBy?: string;
    /** last change date */
    changed?: any = {seconds: undefined};
    /** last changer person */
    changedBy?: string;

    /** seo data of record */
    seo?: PageSeoModel;
}
