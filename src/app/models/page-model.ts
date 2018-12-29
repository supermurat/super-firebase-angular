import { HtmlDocumentModel } from './html-document-model';

/**
 * Page Base Class
 */
export class PageModel extends HtmlDocumentModel {
    /** id of record */
    id?: string;
    /** path of record */
    path?: string;
    /** route path without id */
    routePath?: string;
    /** order number of record */
    orderNo?: number;
    /** html content or content array of page */
    content?: any;
    /** carousel item array of page */
    carousel?: any;
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
