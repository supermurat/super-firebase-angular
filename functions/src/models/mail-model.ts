/**
 * Mail Model
 */
export class MailModel {
    /** sender address */
    from?: string;
    /** list of receivers */
    to?: string;
    /** subject line */
    subject: string;
    /** plain text body */
    text?: string;
    /** html body */
    html?: string;
}
