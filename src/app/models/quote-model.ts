import { PageBaseModel } from './page-base-model';

/**
 * Quote Class
 */
export class QuoteModel extends PageBaseModel {
    /** who said that quote */
    whoSaidThat?: string;
    /** where to find that quote */
    source?: string;
    /** persons in the dialog */
    persons?: any; // key: name, value: description
}
