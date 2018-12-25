import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { PagerService, SeoService } from '../../services';
import { ArticleModel, PagerModel } from '../../models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Article List Component
 */
@Component({
    selector: 'app-article-list',
    templateUrl: './article-list.component.html',
    styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit {
    /** article object array */
    articles$: Observable<Array<ArticleModel>>;
    /** current page`s title */
    title = 'My Articles';
    /** current page`s description */
    description = 'List of My Articles';

    /** pager model */
    pagerModel: PagerModel = {
        pagePath: '/articles',
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
            this.initArticles();
        });

        this.seo.setHtmlTags({
            title: this.title,
            description: this.description
        });
    }

    /**
     * init articles and get first item
     */
    initArticles(): void {
        if (this.firstItem) // no need to get firstItem again
            this.getArticles();
        else
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
            .pipe(map(actions => {
                return actions.map(action => {
                    const id = action.payload.doc.id;
                    const data = action.payload.doc.data();
                    if (!data.hasOwnProperty('contentSummary'))
                        data['contentSummary'] = data['content'];

                    return { id, ...data as ArticleModel };
                });
            }));
        this.articles$.subscribe(articles => {
            if (articles.length > 0) {
                this.lastItemOfCurrentPage = articles[articles.length - 1];
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
