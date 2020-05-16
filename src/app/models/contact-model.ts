import * as firebase from 'firebase/app';

/**
 * Contact Class
 */
export class ContactModel {
    /** user long name */
    userLongName?: string;
    /** email */
    email?: string;
    /** message */
    message?: string;
    /** is send copy to owner */
    isSendCopyToOwner?: boolean;
    /** is privacy policy agreed */
    isAgreed?: boolean;
    /** creation date */
    created?: firebase.firestore.Timestamp | firebase.firestore.FieldValue;
}
