import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PagerService } from '../../services';
import { PagerModel } from '../../models';
import { Router } from '@angular/router';

/**
 * Pager Component
 */
@Component({
    selector: 'app-pager',
    templateUrl: './pager.component.html'
})
export class PagerComponent implements OnDestroy, OnInit {
    /** subscription */
    subscription: Subscription | undefined;

    /** pager model */
    pagerModel: PagerModel = {
        pagePath: '/'
    };

    /** next page no */
    nextPageNo?: number;
    /** previous page no */
    previousPageNo?: number;

    /**
     * constructor of PagerComponent
     * @param pagerService: PagerService
     * @param router: Router
     */
    constructor(private pagerService: PagerService,
                private router: Router) { }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.subscription = this.pagerService.getPagerModel()
            .subscribe(pagerModel => {
                if (!pagerModel.currentPageNo || pagerModel.currentPageNo < 1 || pagerModel.currentPageNo > pagerModel.maxPageNo) {
                    pagerModel.currentPageNo = !pagerModel.currentPageNo ? 1 : pagerModel.currentPageNo < 1 ? 1 : pagerModel.maxPageNo;
                    this.router.navigate([pagerModel.pagePath, pagerModel.currentPageNo]);
                } else {
                    this.previousPageNo = pagerModel.currentPageNo - 1;
                    this.nextPageNo = pagerModel.currentPageNo + 1;
                    if (pagerModel.currentPageNo === 1)
                        this.previousPageNo = undefined;
                    if (pagerModel.currentPageNo >= pagerModel.maxPageNo)
                        this.nextPageNo = undefined;
                    this.pagerModel = pagerModel;
                }
            });
    }

    /**
     * ngOnDestroy
     */
    ngOnDestroy(): void {
        if (this.subscription !== undefined)
            this.subscription.unsubscribe();
    }
}
