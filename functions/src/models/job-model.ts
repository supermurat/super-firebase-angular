import * as firebase from 'firebase/app';

/** Job Model */
export class JobModel {
    /** id of record */
    id?: string;
    /** action key to do */
    actionKey?: string;
    /** created date */
    created?: firebase.firestore.Timestamp;
    /** who is want to create this job? */
    createdBy?: string;

    /** started date */
    started?: firebase.firestore.Timestamp;
    /** finished date */
    finished?: firebase.firestore.Timestamp;
    /** duration as seconds */
    duration?: number;
    /** result of action */
    result?: any;
    /** is succeed? */
    isSucceed?: boolean;

    /** collections to process */
    collections?: Array<string>;
    /** cultureCodes to process */
    cultureCodes?: Array<string>;

    /** do you want to overwrite current data */
    overwrite?: boolean;
    /** limit to get documents */
    limit?: number;
    /** custom data for job */
    customData?: any;
}
