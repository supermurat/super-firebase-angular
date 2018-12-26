import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PagerModel } from '../models';

/**
 * Pager Service
 */
@Injectable()
export class PagerService {
    /** collection of PagerModel */
    private readonly subject = new Subject<PagerModel>();

    /**
     * init pager component
     * @param pagerModel: PagerModel
     */
    initPager(pagerModel: PagerModel): void {
        this.subject.next(pagerModel);
    }

    /**
     * get current PagerModel
     */
    getPagerModel(): Observable<PagerModel> {
        return this.subject.asObservable();
    }
}
