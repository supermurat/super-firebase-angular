import { PageModel } from './page-model';

/**
 * Quote Class
 */
export class QuoteModel extends PageModel {
    /** who said that quote */
    whoSaidThat?: string;
    /** where to find that quote */
    source?: string;
}
