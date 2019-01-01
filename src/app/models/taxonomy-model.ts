/**
 * Taxonomy Class
 */
export class TaxonomyModel {
    /** id of record */
    id?: string;
    /** path of record */
    path?: string;
    /** route path without id */
    routePath?: string;
    /** title of tag */
    title?: string;
    /** content array of tag */
    contents?: any;
    /** order number of record */
    orderNo?: number;
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
