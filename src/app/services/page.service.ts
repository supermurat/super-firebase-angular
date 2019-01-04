import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ArticleModel, PageModel } from '../models';
import { AlertService } from './alert.service';
import { CarouselService } from './carousel.service';
import { SeoService } from './seo.service';

/**
 * Page Service
 */
@Injectable()
export class PageService {
    /**
     * constructor of PageService
     * @param seo: SeoService
     * @param carouselService: CarouselService
     * @param alert: AlertService
     * @param afs: AngularFirestore
     * @param router: Router
     * @param locale: LOCALE_ID
     */
    constructor(public seo: SeoService,
                public carouselService: CarouselService,
                private readonly alert: AlertService,
                private readonly afs: AngularFirestore,
                public router: Router,
                @Inject(LOCALE_ID) public locale: string) {
    }

    /**
     * init page
     * @param pageName: Page Name to load from Firestore
     */
    initPage(pageName: string): Observable<PageModel> {
        const page$ = this.afs.doc<PageModel>(`pages_${this.locale}/${pageName}`)
            .valueChanges();
        page$.subscribe(page => {
            if (page) {
                this.seo.setHtmlTags(page);
                this.carouselService.init(page.carousel);
            }
        });

        return page$;
    }

    /**
     * check to redirect by id param, if redirected a page; true will be returned otherwise false will be returned
     * @param pmap: ParamMap
     * @param pathOfCollectionWithoutLocalePart: main collection path of firestore;
     * used in: `${pathOfCollectionWithoutLocalePart}_${this.locale}`
     * @param pathOfListPage: path of list page; sample: '/articles'
     * @param pathOfDetailPage: path of detail page; sample: '/article'
     */
    checkToRedirectByIDParam(pmap: ParamMap,
                             pathOfCollectionWithoutLocalePart: string,
                             pathOfListPage: string,
                             pathOfDetailPage: string): boolean {
        const pID = Number(pmap.get('id'));
        if (pID || pID === 0) {
            this.afs.collection(`${pathOfCollectionWithoutLocalePart}_${this.locale}`,
                ref => ref.where('orderNo', '==', pID)
                    .limit(1)
            )
                .snapshotChanges()
                .subscribe(data => {
                    if (data && data.length > 0) {
                        data.map(pld => {
                            const article = pld.payload.doc.data() as ArticleModel;
                            this.router.navigate([article.routePath, article.id])
                                .catch(// istanbul ignore next
                                    reason => {
                                        this.alert.error(reason);
                                    });
                        });
                    } else if (pID === 0) {
                        this.router.navigate([pathOfListPage])
                            .catch(// istanbul ignore next
                                reason => {
                                    this.alert.error(reason);
                                });
                    } else {
                        this.router.navigate([pathOfDetailPage, pID + 1])
                            .catch(// istanbul ignore next
                                reason => {
                                    this.alert.error(reason);
                                });
                    }
                });

            return true;
        }

        return false;
    }

}
