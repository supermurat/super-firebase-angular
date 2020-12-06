import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, LOCALE_ID, NgZone, Renderer2, RendererFactory2 } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { ParamMap, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';
import { routerLinksEN, routerLinksTR } from '../app-config';
import { PageBaseModel, RouterLinksModel } from '../models';
import { AlertService } from './alert.service';
import { CarouselService } from './carousel.service';
import { SeoService } from './seo.service';

/**
 * Page Service
 */
@Injectable()
export class PageService {
    /** locale */
    locale: string;
    /** translated router links */
    routerLinks: RouterLinksModel;
    /** collection of PageBaseModel */
    private readonly page$ = new Subject<PageBaseModel>();
    /** Renderer2 */
    private readonly renderer: Renderer2;

    /**
     * constructor of PageService
     * @param seo: SeoService
     * @param carouselService: CarouselService
     * @param alert: AlertService
     * @param state: TransferState
     * @param afs: AngularFirestore
     * @param router: Router
     * @param ngZone: NgZone
     * @param rendererFactory: RendererFactory2
     * @param document: DOCUMENT
     * @param localeP: LOCALE_ID
     */
    constructor(public seo: SeoService,
                public carouselService: CarouselService,
                private readonly alert: AlertService,
                private readonly state: TransferState,
                private readonly afs: AngularFirestore,
                public router: Router,
                private readonly ngZone: NgZone,
                private readonly rendererFactory: RendererFactory2,
                @Inject(DOCUMENT) private readonly document,
                @Inject(LOCALE_ID) private readonly localeP: string) {
        this.locale = localeP === 'tr' ? 'tr-TR' : 'en-US'; // TODO: fix for other locales, this is quick fix to force to use with culture codes
        this.renderer = rendererFactory.createRenderer(undefined, undefined);
        this.routerLinks = this.locale === 'tr-TR' ? routerLinksTR : routerLinksEN;
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
     * get current PageBaseModel
     */
    getPage(): Observable<PageBaseModel> {
        return this.page$.asObservable();
    }

    /**
     * init page html tags and content
     * @param page: PageBaseModel
     */
    initPage(page: PageBaseModel): void {
        this.page$.next(page);
        this.seo.setSEOData(page);
        this.carouselService.init(page.carousel);
        if (page.backgroundCoverImage) {
            this.renderer.setStyle(this.document.body, 'background-image', `url(${page.backgroundCoverImage.src})`);
        } else {
            this.renderer.setStyle(this.document.body, 'background-image', '');
        }
    }

    /**
     * get route path of current page; sample: '/articles/1' will return as '/articles'
     */
    getRoutePath(): string {
        return `/${this.getRoutePathName()}`;
    }

    /**
     * get route path name of current page; sample: '/articles/1' will return as 'articles'
     */
    getRoutePathName(): string {
        const currentURLParts = this.router.url.trim()
            .split('?')[0]
            .split('/');

        return currentURLParts[1].trim(); // currentURLParts.length is always greater than 1 because it always starts with a '/'
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
     * get collection from firestore
     * @param path: path of collection to load from Firestore
     * @param queryFn: QueryFn
     * @param uniqueKey: unique key for TransferState, if path is already unique without order and limit, no need to use this
     */
    getCollectionFromFirestore<T>(path: string, queryFn?: QueryFn, uniqueKey?: any): Observable<Array<T>> {
        const ssrCollectioKey = makeStateKey<any>(`ssr_collection_${uniqueKey ? uniqueKey : ''}_${path}`);
        const existPage = this.state.get(ssrCollectioKey, []);

        return this.afs.collection<T>(path, queryFn)
            .valueChanges()
            .pipe(tap(docs => {
                    this.state.set(ssrCollectioKey, docs);
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
        const pageBase$ = this.getDocumentFromFirestore(type, `${pathOfCollectionWithoutLocalePart}_${this.locale}/${pageID}`);
        pageBase$.subscribe(page => {
            if (page === undefined) {
                this.redirectToTranslationOr404(pathOfCollectionWithoutLocalePart, pageID);
            } else if (page.routePath) {
                if (this.router.url.startsWith(page.routePath)) {
                    this.initPage(page);
                } else {
                    // redirect to origin route path for seo
                    const languageCode2 = this.locale.substring(0, 2);
                    this.seo.http301(`/${languageCode2}/${page.routePath}/${pageID}`, true);
                }
            }
        });

        return pageBase$;
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
                    this.ngZone.run(() => {
                        if (data && data.length > 0) {
                            data.map(pld => {
                                const pageItem = pld.payload.doc.data() as PageBaseModel;
                                this.ngZone.run(() => {
                                    this.router.navigate([pageItem.routePath, pld.payload.doc.id])
                                        .catch(// istanbul ignore next
                                            reason => {
                                                this.alert.error(reason);
                                            });
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
                });

            return true;
        }

        return false;
    }

    /**
     * check if there is translation by pageID on other locale and redirect to correct pageID by requested locale
     * if there is no record on other locale by pageID, page will be redirected to http-404
     * @param pathOfCollectionWithoutLocalePart: main collection path of firestore;
     * used in: `${pathOfCollectionWithoutLocalePart}_${this.locale}`
     * @param pageID: page id on firestore
     */
    redirectToTranslationOr404(pathOfCollectionWithoutLocalePart: string, pageID: string): void {
        // try to find pageID in other locale
        const checkInLocale = this.locale === 'en-US' ? 'tr-TR' : 'en-US';
        this.afs.doc<PageBaseModel>(`${pathOfCollectionWithoutLocalePart}_${checkInLocale}/${pageID}`)
            .valueChanges()
            .subscribe(pageItem => {
                if (pageItem) {
                    // found in other locale
                    // so try to find requested page in requested locale by i18nKey
                    this.afs.collection<PageBaseModel>(`${pathOfCollectionWithoutLocalePart}_${this.locale}`,
                        ref => ref.where('i18nKey', '==', pageItem.i18nKey)
                            .limit(1)
                    )
                        .snapshotChanges()
                        .subscribe(data => {
                            if (data && data.length > 0) {
                                // page in found in requested locale by i18nKey
                                data.map(pld => {
                                    const id = pld.payload.doc.id;
                                    const requestedPageItem = pld.payload.doc.data();
                                    const languageCode2 = this.locale.substring(0, 2);
                                    this.seo.http301(`/${languageCode2}/${requestedPageItem.routePath}/${id}`, true);
                                });
                            } else {
                                // there is no translation by i18nKey, so redirect to correct locale
                                const languageCode2 = checkInLocale.substring(0, 2);
                                this.seo.http301(`/${languageCode2}/${pageItem.routePath}/${pageID}`, true);
                            }
                        });
                } else {
                    // not found also in other locale
                    this.seo.http404();
                }
            });
    }

}
