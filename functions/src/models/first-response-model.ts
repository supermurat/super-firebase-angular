/** First Response Model */
export class FirstResponseModel {
    /** document id */
    id?: string;
    /** http code */
    code?: number;
    /** url to redirect */
    url?: string;
    /** type of content */
    type?: string;
    /** content of object */
    content?: string;
    /** expire date */
    expireDate?: any = {seconds: undefined};
    /** last update date */
    changed?: any = {seconds: undefined};
    /** referer web site */
    referer?: string;
}
