import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { PagerService, SeoService } from '../../services';
import { PageModel, PagerModel } from '../../models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Page List Component
 */
@Component({
    selector: 'app-page-list',
    templateUrl: './page-list.component.html',
    styleUrls: ['./page-list.component.scss']
})
export class PageListComponent implements OnInit {
    /** page object array */
    pages$: Observable<Array<PageModel>>;
    /** current page`s title */
    title = 'This is temporary page list';
    /** current page`s description */
    description = 'This App is in development!';

    /** pager model */
    pagerModel: PagerModel = {
        pagePath: '/pages',
        pageSize: 3
    };

    /** first page */
    firstItem: PageModel;
    /** order no of first page, also it means (count of items * -1) */
    firstItemOrderNo: number;

    /** last item of current page */
    lastItemOfCurrentPage: PageModel;
    /** last item order no of current page */
    lastItemOrderNoOfCurrentPage: number;

    /**
     * constructor of PageListComponent
     * @param afs: AngularFirestore
     * @param seo: SeoService
     * @param router: Router
     * @param route: ActivatedRoute
     * @param pagerService: PagerService
     * @param locale: LOCALE_ID
     */
    constructor(private afs: AngularFirestore,
                private seo: SeoService,
                public router: Router,
                private route: ActivatedRoute,
                private pagerService: PagerService,
                @Inject(LOCALE_ID) public locale: string) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.route.paramMap.subscribe(pmap => {
            this.pagerModel.currentPageNo = Number(pmap.get('pageNo'));
            this.initPages();
        });

        this.seo.generateTags({
            title: this.title,
            description: this.description
        });
    }

    /**
     * init pages and get first item
     */
    initPages(): void {
        if (this.firstItem) // no need to get firstItem again
            this.getPages();
        else
            this.afs.collection(`pages_${this.locale}`,
                ref => ref.orderBy('orderNo')
                    .limit(1)
            )
                .valueChanges()
                .subscribe(pages => {
                    if (pages.length > 0) {
                        this.firstItem = pages[0];
                        this.firstItemOrderNo = this.firstItem.orderNo;
                        this.getPages();
                    }
                });
    }

    /**
     * check page no properties
     */
    checkPageNo(): void {
        this.pagerModel.maxPageNo = Math.ceil((this.firstItemOrderNo * -1) / this.pagerModel.pageSize);
        this.pagerService.initPager(this.pagerModel);
    }

    /**
     * get pages
     */
    getPages(): void {
        this.checkPageNo();
        const startAtOrderNo = this.firstItemOrderNo + ((this.pagerModel.currentPageNo - 1) * this.pagerModel.pageSize);
        this.pages$ = this.afs.collection(`pages_${this.locale}`,
            ref => ref.orderBy('orderNo')
                .startAt(startAtOrderNo)
                .limit(this.pagerModel.pageSize)
        )
            .snapshotChanges()
            .pipe(map(actions => {
                return actions.map(action => {
                    const id = action.payload.doc.id;
                    const data = action.payload.doc.data();
                    if (!data.hasOwnProperty('contentSummary'))
                        data['contentSummary'] = data['content'];

                    return { id, ...data as PageModel };
                });
            }));
        this.pages$.subscribe(pages => {
            if (pages.length > 0) {
                this.lastItemOfCurrentPage = pages[pages.length - 1];
                this.lastItemOrderNoOfCurrentPage = this.lastItemOfCurrentPage.orderNo;
            }
        });
    }

    /**
     * track page object array by page
     * @param index: page index no
     * @param item: page object
     */
    trackByPage(index, item): number {
        return index;
    }
}
