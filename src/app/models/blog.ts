import { Observable } from 'rxjs';

/**
 * Blog Class
 */
export class Blog {
    /** name of blog */
    name?: string | undefined;
    /** bio of blog */
    bio?: string | undefined;
    /** image name of blog */
    imgName?: string | undefined;
    /** image url of blog */
    imgURL?: Observable<string> | undefined;
}
