import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BlogModel, PageModel, PagerModel } from '../../models';
import { PagerService, PageService, SeoService } from '../../services';

/**
 * Blog List Component
 */
@Component({
    selector: 'app-blog-list',
    templateUrl: './blog-list.component.html',
    styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
    /** current page object */
    page$: Observable<PageModel>;
    /** blog object array */
    blogs$: Observable<Array<BlogModel>>;

    /** pager model */
    pagerModel: PagerModel = {
        currentPageNo: 1,
        maxPageNo: 0,
        pageSize: 3,
        pagePath: '/blogs'
    };

    /** first article */
    firstItem: BlogModel;
    /** order no of first article, also it means (count of items * -1) */
    firstItemOrderNo: number;

    /** last item of current page */
    lastItemOfCurrentPage: BlogModel;
    /** last item order no of current page */
    lastItemOrderNoOfCurrentPage: number;

    /**
     * constructor of BlogListComponent
     * @param afs: AngularFirestore
     * @param seo: SeoService
     * @param router: Router
     * @param route: ActivatedRoute
     * @param pagerService: PagerService
     * @param pageService: PageService
     * @param locale: LOCALE_ID
     */
    constructor(private readonly afs: AngularFirestore,
                private readonly seo: SeoService,
                public router: Router,
                private readonly route: ActivatedRoute,
                private readonly pagerService: PagerService,
                public pageService: PageService,
                @Inject(LOCALE_ID) public locale: string) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.route.paramMap.subscribe(pmap => {
            this.pagerModel.currentPageNo = Number(pmap.get('pageNo'));
            this.initBlogs();
        });
        this.page$ = this.pageService.getPageFromFirestore(PageModel, 'pages', 'blog-list');
    }

    /**
     * init blogs and get first item
     */
    initBlogs(): void {
        if (this.firstItem) { // no need to get firstItem again
            this.getBlogs();
        } else {
            this.afs.collection(`blogs_${this.locale}`,
                ref => ref.orderBy('orderNo')
                    .limit(1)
            )
                .valueChanges()
                .subscribe(articles => {
                    if (articles.length > 0) {
                        this.firstItem = articles[0];
                        this.firstItemOrderNo = this.firstItem.orderNo;
                        this.getBlogs();
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
     * get blogs
     */
    getBlogs(): void {
        this.checkPageNo();
        const startAtOrderNo = this.firstItemOrderNo + ((this.pagerModel.currentPageNo - 1) * this.pagerModel.pageSize);
        this.blogs$ = this.afs.collection(`blogs_${this.locale}`,
            ref => ref.orderBy('orderNo')
                .startAt(startAtOrderNo)
                .limit(this.pagerModel.pageSize)
        )
            .snapshotChanges()
            .pipe(map(actions =>
                actions.map(action => {
                    const id = action.payload.doc.id;
                    const data = action.payload.doc.data() as BlogModel;
                    if (!data.hasOwnProperty('contentSummary')) {
                        data.contentSummary = data.content;
                    }

                    return {id, ...data};
                })));
        this.blogs$.subscribe(articles => {
            if (articles.length > 0) {
                this.lastItemOfCurrentPage = articles[articles.length - 1];
                this.lastItemOrderNoOfCurrentPage = this.lastItemOfCurrentPage.orderNo;
            }
        });
    }
}
