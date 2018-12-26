import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PagerModel } from '../../models';
import { AlertService, PagerService } from '../../services';

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
     * @param alert: AlertService
     */
    constructor(private readonly pagerService: PagerService,
                private readonly router: Router,
                private readonly alert: AlertService) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.subscription = this.pagerService.getPagerModel()
            .subscribe(pagerModel => {
                if (!pagerModel.currentPageNo || pagerModel.currentPageNo < 1 || pagerModel.currentPageNo > pagerModel.maxPageNo) {
                    pagerModel.currentPageNo = !pagerModel.currentPageNo ? 1 : pagerModel.currentPageNo < 1 ? 1 : pagerModel.maxPageNo;
                    this.router.navigate([pagerModel.pagePath, pagerModel.currentPageNo])
                        .catch(reason => {
                            this.alert.error(reason);
                        });
                } else {
                    this.previousPageNo = pagerModel.currentPageNo - 1;
                    this.nextPageNo = pagerModel.currentPageNo + 1;
                    if (pagerModel.currentPageNo === 1) {
                        this.previousPageNo = undefined;
                    }
                    if (pagerModel.currentPageNo >= pagerModel.maxPageNo) {
                        this.nextPageNo = undefined;
                    }
                    this.pagerModel = pagerModel;
                }
            });
    }

    /**
     * ngOnDestroy
     */
    ngOnDestroy(): void {
        if (this.subscription !== undefined) {
            this.subscription.unsubscribe();
        }
    }
}
