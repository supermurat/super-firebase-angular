/** Job Model */
export class JobModel {
    /** action key to do */
    actionKey?: string;
    /** created date */
    started?: any = {seconds: undefined};
    /** who is want to start this job? */
    startedBy?: string;
    /** result of action */
    result?: string;
    /** do you want to overwrite current data */
    overwrite?: boolean;
    /** limit to get documents */
    limit?: number;
    /** custom data for job */
    customData?: any;
}
