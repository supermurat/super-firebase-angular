/**
 * Private Config Model Class
 */
export class PrivateConfigModel {
    /** smtp configuration */
    smtp?: {
        /** host name or ip of smtp server */
        host: string;
        /** port of smtp server */
        port: number;
        /** is SSL/TLS activated */
        secure: boolean;
        /** authentication credentials of smtp server */
        auth: {
            /** user name to authenticate */
            user: string;
            /** password of user to authenticate */
            pass: string;
        };
    };
    /** mail configuration */
    mail?: {
        /** do you want to send mail? */
        isSendMail?: boolean;
        /** sender of mail */
        mailAddressOfAdmin: string;
        /** sender of mail */
        mailFrom: string;
        /**
         * if you want to send all of mails to only one mail address for TESTING
         * keep undefined for production
         */
        mailToForced?: string;
        /** url of web site */
        siteURL: string;
        /**
         * url of main logo
         * keep undefined if you want to use only web site name
         */
        logoURL?: string;
        /** name of web site */
        siteName: string;
        /**
         * color code of header
         * color name, HEX or RGB color code
         * sample; Gray, #808080, rgb(128, 128, 128)
         * keep undefined if you want to use #222
         */
        headerBackgroundColor?: string;
        /**
         * color code of footer
         * color name, HEX or RGB color code
         * sample; Gray, #808080, rgb(128, 128, 128)
         * keep undefined if you want to use #AAA
         */
        footerBackgroundColor?: string;
        /** automatically generated email notification text  */
        automaticallyGeneratedEmailNote?: string;
    };
}
