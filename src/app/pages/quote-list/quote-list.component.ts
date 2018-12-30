import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagerModel, QuoteModel } from '../../models';
import { PagerService, SeoService } from '../../services';

/**
 * Quote List Component
 */
@Component({
    selector: 'app-quote-list',
    templateUrl: './quote-list.component.html',
    styleUrls: ['./quote-list.component.scss']
})
export class QuoteListComponent implements OnInit {
    /** quote object array */
    quotes$: Observable<Array<QuoteModel>>;
    /** current page`s title */
    title = 'My Quotes';
    /** current page`s description */
    description = 'List of My Quotes';

    /** pager model */
    pagerModel: PagerModel = {
        pagePath: '/quotes',
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
     * @param locale: LOCALE_ID
     */
    constructor(private readonly afs: AngularFirestore,
                private readonly seo: SeoService,
                public router: Router,
                private readonly route: ActivatedRoute,
                private readonly pagerService: PagerService,
                @Inject(LOCALE_ID) public locale: string) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.route.paramMap.subscribe(pmap => {
            this.pagerModel.currentPageNo = Number(pmap.get('pageNo'));
            this.initQuotes();
        });

        this.seo.setHtmlTags({
            title: this.title,
            description: this.description
        });
    }

    /**
     * init quotes and get first item
     */
    initQuotes(): void {
        if (this.firstItem) { // no need to get firstItem again
            this.getQuotes();
        } else {
            this.afs.collection(`quotes_${this.locale}`,
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
        this.quotes$ = this.afs.collection(`quotes_${this.locale}`,
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

    /**
     * track content object array by index
     * @param index: index no
     * @param item: object
     */
    trackByIndex(index, item): number {
        return index;
    }
}
