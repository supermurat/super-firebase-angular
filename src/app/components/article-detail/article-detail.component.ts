import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { SeoService } from '../../services';
import { ArticleModel } from '../../models';
import { startWith, tap } from 'rxjs/operators';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Observable } from 'rxjs';

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
     * @param router: Router
     * @param route: ActivatedRoute
     * @param state: TransferState
     * @param locale: LOCALE_ID
     */
    constructor(
        private afs: AngularFirestore,
        private seo: SeoService,
        public router: Router,
        private route: ActivatedRoute,
        private state: TransferState,
        @Inject(LOCALE_ID) public locale: string
    ) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.route.paramMap.subscribe(pmap => {
            const pID = Number(pmap.get('id'));
            if (pID || pID === 0) {
                this.afs.collection(`articles_${this.locale}`,
                    ref => ref.where('orderNo', '==', pID)
                        .limit(1)
                )
                    .snapshotChanges()
                    .subscribe(data => {
                        if (data && data.length > 0)
                            data.map(pld => {
                                this.router.navigate(['/article', pld.payload.doc.id]);
                            });
                        else if (pID === 0)
                            this.router.navigate(['/articles']);
                        else
                            this.router.navigate(['/article', pID + 1]);
                    });

                return;
            }
            this.articleID = pmap.get('id');
            this.initArticle();
        });
        // this will create a split second flash
        // this.page$ = this.afs.doc(`articles_${this.locale}/${id}`).valueChanges();
    }

    /**
     * init article
     */
    initArticle(): void {
        this.article$ = this.ssrFirestoreDoc(`articles_${this.locale}/${this.articleID}`, true);
        this.article$.subscribe(article => {
            if (article)
                this.seo.setHtmlTags(article);
            else
                this.checkTranslation(undefined);
        });
    }

    /**
     * check if there is another translation and redirect to it
     */
    checkTranslation(checkInLocale): void {
        if (checkInLocale)
            this.afs.doc<ArticleModel>(`articles_${checkInLocale}/${this.articleID}`)
                .valueChanges()
                .subscribe(article => {
                    if (article) {
                        const languageCode2 = checkInLocale.substring(0, 2);
                        this.seo.http301(`/${languageCode2}/article/${this.articleID}`);
                    } else
                        this.seo.http404();
                });
        else if (this.locale === 'en-US')
            this.checkTranslation('tr-TR');
        else if (this.locale === 'tr-TR')
            this.checkTranslation('en-US');
    }

    /**
     * Get article object from firestore by path
     * @param path: article path
     * @param checkTranslation: check translation if current article is not exist
     */
    ssrFirestoreDoc(path: string, checkTranslation: boolean): Observable<ArticleModel> {
        const exists = this.state.get(ARTICLE_KEY, new ArticleModel());

        return this.afs.doc<ArticleModel>(path)
            .valueChanges()
            .pipe(tap(article => {
                if (article)
                    this.state.set(ARTICLE_KEY, article);
            }),
            startWith(exists)
        );
    }

}
