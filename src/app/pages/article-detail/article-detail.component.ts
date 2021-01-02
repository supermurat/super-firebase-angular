import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ArticleModel } from '../../models';
import { AlertService, PageService, SeoService } from '../../services';

/**
 * Article Detail Component
 */
@Component({
    selector: 'app-article-detail',
    templateUrl: './article-detail.component.html'
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
     * @param pageService: PageService
     */
    constructor(
        private readonly afs: AngularFirestore,
        private readonly seo: SeoService,
        private readonly alert: AlertService,
        public router: Router,
        private readonly route: ActivatedRoute,
        public pageService: PageService
    ) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.route.paramMap.subscribe(pmap => {
            if (this.pageService.checkToRedirectByIDParam(pmap,
                'articles',
                this.pageService.routerLinks.articles,
                this.pageService.routerLinks.article)) {
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
        this.article$ = this.pageService.getPageFromFirestore(ArticleModel, 'articles', this.articleID);
    }

}
