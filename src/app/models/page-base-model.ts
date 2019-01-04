import { CarouselModel } from './carousel-model';
import { HtmlDocumentModel } from './html-document-model';

/**
 * Page Base Class
 */
export class PageBaseModel extends HtmlDocumentModel {
    /** id of record */
    id?: string;
    /** path of record */
    path?: string;
    /** route path without id */
    routePath?: string;
    /** order number of record */
    orderNo?: number;
    /** html content of page */
    content?: any;
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
}
