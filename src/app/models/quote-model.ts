import { PageModel } from './page-model';

/**
 * Quote Class
 */
export class QuoteModel extends PageModel {
    /** who said that quote */
    whoSaidThat?: string;
    /** where to find that quote */
    source?: string;
    /** persons in the dialog */
    persons?: any; // key: name, value: description
}
