import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';
import { ArticleModel } from '../../models';
import { AlertService, PageService, SeoService } from '../../services';

/** State key of current article */
const ARTICLE_KEY = makeStateKey<any>('article');

/**
 * Article Detail Component
 */
@Component({
    selector: 'app-article-detail',
    templateUrl: './article-detail.component.html',
    styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {
    /** current article object */
    article$: Observable<ArticleModel>;
    /** current article id */
    articleID = '';

    /**
     * constructor of ArticleDetailComponent
     * @param afs: AngularFirestore
     * @param seo: SeoService
     * @param alert: AlertService
     * @param router: Router
     * @param route: ActivatedRoute
     * @param state: TransferState
     * @param pageService: PageService
     * @param locale: LOCALE_ID
     */
    constructor(
        private readonly afs: AngularFirestore,
        private readonly seo: SeoService,
        private readonly alert: AlertService,
        public router: Router,
        private readonly route: ActivatedRoute,
        private readonly state: TransferState,
        public pageService: PageService,
        @Inject(LOCALE_ID) public locale: string
    ) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.route.paramMap.subscribe(pmap => {
            if (this.pageService.checkToRedirectByIDParam(pmap, 'articles', '/articles', '/article')) {
                return;
            }
            this.articleID = pmap.get('id');
            this.initArticle();
        });
    }

    /**
     * init article
     */
    initArticle(): void {
        this.article$ = this.ssrFirestoreDoc(`articles_${this.locale}/${this.articleID}`);
        this.article$.subscribe(article => {
            if (article === undefined) {
                this.pageService.redirectToTranslationOr404(undefined, 'articles', this.articleID);
            } else if (article.id) {
                this.pageService.initPage(article);
            }
        });
    }

    /**
     * Get article object from firestore by path
     * @param path: article path
     */
    ssrFirestoreDoc(path: string): Observable<ArticleModel> {
        const exists = this.state.get(ARTICLE_KEY, new ArticleModel());

        return this.afs.doc<ArticleModel>(path)
            .valueChanges()
            .pipe(tap(article => {
                    if (article) {
                        this.state.set(ARTICLE_KEY, article);
                    }
                }),
                startWith(exists)
            );
    }

}
