import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { SeoService } from '../../services';
import { PageModel } from '../../models';
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

    /** current page no */
    currentPageNo = 1;
    /** next page no */
    nextPageNo = 2;
    /** previous page no */
    previousPageNo: number;
    /** page size */
    pageSize = 3;

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
     */
    constructor(private afs: AngularFirestore,
                private seo: SeoService,
                private router: Router,
                private route: ActivatedRoute) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.currentPageNo = Number(params['pageNo']);
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
        if (this.firstItem) {
            this.getPages();

            return; // no need to get firstItem again
        }
        this.afs.collection('pages',
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
        const maxPageNo = Math.ceil((this.firstItemOrderNo * -1) / this.pageSize);
        if (!this.currentPageNo || this.currentPageNo < 1 || this.currentPageNo > maxPageNo) {
            this.currentPageNo = !this.currentPageNo ? 1 : this.currentPageNo < 1 ? 1 : maxPageNo;
            this.router.navigate(['/pages', this.currentPageNo]);

            return;
        }
        this.previousPageNo = this.currentPageNo - 1;
        this.nextPageNo = this.currentPageNo + 1;
        if (this.currentPageNo === 1)
            this.previousPageNo = undefined;
        if (this.currentPageNo >= maxPageNo)
            this.nextPageNo = undefined;
    }

    /**
     * get pages
     */
    getPages(): void {
        this.checkPageNo();
        const startAtOrderNo = this.firstItemOrderNo + ((this.currentPageNo - 1) * this.pageSize);
        this.pages$ = this.afs.collection('pages',
            ref => ref.orderBy('orderNo')
                .startAt(startAtOrderNo)
                .limit(this.pageSize)
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
