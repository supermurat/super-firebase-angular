import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, LOCALE_ID, Renderer2, RendererFactory2 } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';
import { routerLinksEN, routerLinksTR } from '../app-config';
import { PageBaseModel } from '../models';
import { RouterLinksModel } from '../models/router-links-model';
import { AlertService } from './alert.service';
import { CarouselService } from './carousel.service';
import { SeoService } from './seo.service';

/**
 * Page Service
 */
@Injectable()
export class PageService {
    /**
     * translated router links
     */
    routerLinks: RouterLinksModel;
    /**
     * Renderer2
     */
    private readonly renderer: Renderer2;

    /**
     * constructor of PageService
     * @param seo: SeoService
     * @param carouselService: CarouselService
     * @param alert: AlertService
     * @param state: TransferState
     * @param afs: AngularFirestore
     * @param router: Router
     * @param rendererFactory: RendererFactory2
     * @param document: DOCUMENT
     * @param locale: LOCALE_ID
     */
    constructor(public seo: SeoService,
                public carouselService: CarouselService,
                private readonly alert: AlertService,
                private readonly state: TransferState,
                private readonly afs: AngularFirestore,
                public router: Router,
                private readonly rendererFactory: RendererFactory2,
                @Inject(DOCUMENT) private readonly document,
                @Inject(LOCALE_ID) public locale: string) {
        this.renderer = rendererFactory.createRenderer(undefined, undefined);
        this.routerLinks = locale === 'tr-TR' ? routerLinksTR : routerLinksEN;
    }

    /**
     * track content object array by index
     * @param index: index no
     * @param item: object
     */
    trackByIndex(index, item): number {
        return index;
    }

    /**
     * init page html tags and content
     * @param page: PageBaseModel
     */
    initPage(page: PageBaseModel): void {
        this.seo.setHtmlTags(page);
        this.carouselService.init(page.carousel);
        if (page.backgroundCoverUrl) {
            this.renderer.setStyle(this.document.body, 'background-image', `url(${page.backgroundCoverUrl})`);
        } else {
            this.renderer.setStyle(this.document.body, 'background-image', '');
        }
    }

    /**
     * get route path of current page; sample: '/articles/1' will return as '/articles'
     */
    getRoutePath(inCaseOfEmptyRouterURL: string): string {
        return `/${this.getRoutePathName(inCaseOfEmptyRouterURL)}`;
    }

    /**
     * get route path name of current page; sample: '/articles/1' will return as 'articles'
     */
    getRoutePathName(inCaseOfEmptyRouterURL: string): string {
        const currentURL = this.router.url.trim() === '/' ? inCaseOfEmptyRouterURL : this.router.url;
        const currentURLParts = currentURL.trim()
            .split('?')[0]
            .split('/');
        if (currentURLParts[0].trim() === '' && currentURLParts.length > 1) {
            return currentURLParts[1].trim();
        }

        return currentURLParts[0].trim();
    }

    /**
     * get document from firestore
     * @param type: type of page
     * @param path: path of document to load from Firestore
     */
    getDocumentFromFirestore<T>(type: new() => T, path: string): Observable<T> {
        const ssrPageKey = makeStateKey<any>(`ssr_page_${path}`);
        const existPage = this.state.get(ssrPageKey, new type());

        return this.afs.doc<T>(path)
            .valueChanges()
            .pipe(tap(pageItem => {
                    if (pageItem) {
                        this.state.set(ssrPageKey, pageItem);
                    }
                }),
                startWith(existPage)
            );
    }

    /**
     * get page from firestore
     * @param type: type of page
     * @param pathOfCollectionWithoutLocalePart: main collection path of firestore;
     * used in: `${pathOfCollectionWithoutLocalePart}_${this.locale}`
     * @param pageID: page id on firestore; you can keep undefined, if you want to get pageID from 'router.url'
     */
    getPageFromFirestore<T extends PageBaseModel>(type: new() => T,
                                                  pathOfCollectionWithoutLocalePart: string,
                                                  pageID: string): Observable<T> {
        const page$ = this.getDocumentFromFirestore(type, `${pathOfCollectionWithoutLocalePart}_${this.locale}/${pageID}`);
        page$.subscribe(page => {
            if (page === undefined) {
                this.redirectToTranslationOr404(undefined, pathOfCollectionWithoutLocalePart, pageID);
            } else if (page.routePath) {
                this.initPage(page);
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
                            const pageItem = pld.payload.doc.data() as PageBaseModel;
                            this.router.navigate([pageItem.routePath, pld.payload.doc.id])
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

    /**
     * check if there is another translation and redirect to it
     * @param checkInLocale: locale code; sample: undefined, en-US, tr-TR
     * @param pathOfCollectionWithoutLocalePart: main collection path of firestore;
     * used in: `${pathOfCollectionWithoutLocalePart}_${this.locale}`
     * @param pageID: page id on firestore
     */
    redirectToTranslationOr404(checkInLocale: string, pathOfCollectionWithoutLocalePart: string, pageID: string): void {
        if (checkInLocale) {
            this.afs.doc<PageBaseModel>(`${pathOfCollectionWithoutLocalePart}_${checkInLocale}/${pageID}`)
                .valueChanges()
                .subscribe(pageItem => {
                    if (pageItem) {
                        const languageCode2 = checkInLocale.substring(0, 2);
                        this.seo.http301(`/${languageCode2}/${pageItem.routePath}/${pageItem.id}`, true);
                    } else {
                        this.seo.http404();
                    }
                });
        } else if (this.locale === 'en-US') {
            this.redirectToTranslationOr404('tr-TR', pathOfCollectionWithoutLocalePart, pageID);
        } else {
            this.redirectToTranslationOr404('en-US', pathOfCollectionWithoutLocalePart, pageID);
        }
    }

}
