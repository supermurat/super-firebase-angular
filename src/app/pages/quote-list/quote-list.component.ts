import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PageModel, PagerModel, QuoteModel } from '../../models';
import { PagerService, PageService, SeoService } from '../../services';

/**
 * Quote List Component
 */
@Component({
    selector: 'app-quote-list',
    templateUrl: './quote-list.component.html'
})
export class QuoteListComponent implements OnInit {
    /** current page object */
    page$: Observable<PageModel>;
    /** quote object array */
    quotes$: Observable<Array<QuoteModel>>;

    /** pager model */
    pagerModel: PagerModel = {
        currentPageNo: 1,
        maxPageNo: 0,
        pageSize: 3
    };

    /** first quote */
    firstItem: QuoteModel;
    /** order no of first quote, also it means (count of items * -1) */
    firstItemOrderNo: number;

    /** last item of current page */
    lastItemOfCurrentPage: QuoteModel;
    /** last item order no of current page */
    lastItemOrderNoOfCurrentPage: number;

    /**
     * constructor of QuoteListComponent
     * @param afs: AngularFirestore
     * @param seo: SeoService
     * @param router: Router
     * @param route: ActivatedRoute
     * @param pagerService: PagerService
     * @param pageService: PageService
     */
    constructor(private readonly afs: AngularFirestore,
                private readonly seo: SeoService,
                public router: Router,
                private readonly route: ActivatedRoute,
                private readonly pagerService: PagerService,
                public pageService: PageService) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.route.paramMap.subscribe(pmap => {
            this.pagerModel.currentPageNo = Number(pmap.get('pageNo'));
            this.initQuotes();
        });
        this.page$ = this.pageService.getPageFromFirestore(PageModel, 'pages', this.pageService.getRoutePathName());
    }

    /**
     * init quotes and get first item
     */
    initQuotes(): void {
        if (this.firstItem) { // no need to get firstItem again
            this.getQuotes();
        } else {
            this.afs.collection(`quotes_${this.pageService.locale}`,
                ref => ref.orderBy('orderNo')
                    .limit(1)
            )
                .valueChanges()
                .subscribe(quotes => {
                    if (quotes.length > 0) {
                        this.firstItem = quotes[0];
                        this.firstItemOrderNo = this.firstItem.orderNo;
                        this.getQuotes();
                    }
                });
        }
    }

    /**
     * check page no properties
     */
    checkPageNo(): void {
        this.pagerModel.maxPageNo = Math.ceil((this.firstItemOrderNo * -1) / this.pagerModel.pageSize);
        this.pagerService.initPager(this.pagerModel);
    }

    /**
     * get quotes
     */
    getQuotes(): void {
        this.checkPageNo();
        const startAtOrderNo = this.firstItemOrderNo + ((this.pagerModel.currentPageNo - 1) * this.pagerModel.pageSize);
        this.quotes$ = this.afs.collection(`quotes_${this.pageService.locale}`,
            ref => ref.orderBy('orderNo')
                .startAt(startAtOrderNo)
                .limit(this.pagerModel.pageSize)
        )
            .snapshotChanges()
            .pipe(map(actions =>
                actions.map(action => {
                    const id = action.payload.doc.id;
                    const data = action.payload.doc.data() as QuoteModel;
                    if (!data.hasOwnProperty('contentSummary')) {
                        data.contentSummary = data.content;
                    }

                    return { id, ...data };
                })));
        this.quotes$.subscribe(quotes => {
            if (quotes.length > 0) {
                this.lastItemOfCurrentPage = quotes[quotes.length - 1];
                this.lastItemOrderNoOfCurrentPage = this.lastItemOfCurrentPage.orderNo;
            }
        });
    }
}
