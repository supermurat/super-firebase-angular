import {Observable} from 'rxjs';

export class Blog {
    name: string | undefined;
    bio: string | undefined;
    imgName: string | undefined;
    imgURL: Observable<string> | undefined;
}
