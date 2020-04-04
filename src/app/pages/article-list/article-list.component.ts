import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ArticleModel, PageModel, PagerModel } from '../../models';
import { PagerService, PageService, SeoService } from '../../services';

/**
 * Article List Component
 */
@Component({
    selector: 'app-article-list',
    templateUrl: './article-list.component.html'
})
export class ArticleListComponent implements OnInit {
    /** current page object */
    page$: Observable<PageModel>;
    /** article object array */
    articles$: Observable<Array<ArticleModel>>;

    /** pager model */
    pagerModel: PagerModel = {
        currentPageNo: 1,
        maxPageNo: 0,
        pageSize: 3
    };

    /** first article */
    firstItem: ArticleModel;
    /** order no of first article, also it means (count of items * -1) */
    firstItemOrderNo: number;

    /** last item of current page */
    lastItemOfCurrentPage: ArticleModel;
    /** last item order no of current page */
    lastItemOrderNoOfCurrentPage: number;

    /**
     * constructor of ArticleListComponent
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
            this.initArticles();
        });
        this.page$ = this.pageService.getPageFromFirestore(PageModel, 'pages', this.pageService.getRoutePathName());
    }

    /**
     * init articles and get first item
     */
    initArticles(): void {
        if (this.firstItem) { // no need to get firstItem again
            this.getArticles();
        } else {
            this.afs.collection(`articles_${this.locale}`,
                ref => ref.orderBy('orderNo')
                    .limit(1)
            )
                .valueChanges()
                .subscribe(articles => {
                    if (articles.length > 0) {
                        this.firstItem = articles[0];
                        this.firstItemOrderNo = this.firstItem.orderNo;
                        this.getArticles();
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
     * get articles
     */
    getArticles(): void {
        this.checkPageNo();
        const startAtOrderNo = this.firstItemOrderNo + ((this.pagerModel.currentPageNo - 1) * this.pagerModel.pageSize);
        this.articles$ = this.afs.collection(`articles_${this.locale}`,
            ref => ref.orderBy('orderNo')
                .startAt(startAtOrderNo)
                .limit(this.pagerModel.pageSize)
        )
            .snapshotChanges()
            .pipe(map(actions =>
                actions.map(action => {
                    const id = action.payload.doc.id;
                    const data = action.payload.doc.data() as ArticleModel;
                    if (!data.hasOwnProperty('contentSummary')) {
                        data.contentSummary = data.content;
                    }

                    return { id, ...data };
                })));
        this.articles$.subscribe(articles => {
            if (articles.length > 0) {
                this.lastItemOfCurrentPage = articles[articles.length - 1];
                this.lastItemOrderNoOfCurrentPage = this.lastItemOfCurrentPage.orderNo;
            }
        });
    }
}
