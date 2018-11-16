import { HtmlDocumentModel } from './html-document-model';

/**
 * Page Base Class
 */
export class PageModel extends HtmlDocumentModel {
    /** id of record */
    id?: string;
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
    created?: number;
    /** creator person */
    createdBy?: string;
    /** last change date */
    changed?: number;
    /** last changer person */
    changedBy?: string;
}
