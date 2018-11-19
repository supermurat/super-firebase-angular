import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { SeoService } from '../../services';
import { PageModel } from '../../models';
import { startWith, tap } from 'rxjs/operators';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Observable } from 'rxjs';

/** State key of current page */
const BLOG_KEY = makeStateKey<any>('page');

/**
 * Page Detail Component
 */
@Component({
    selector: 'app-page-detail',
    templateUrl: './page-detail.component.html',
    styleUrls: ['./page-detail.component.scss']
})
export class PageDetailComponent implements OnInit {
    /** current page object */
    page$: Observable<PageModel>;
    /** current page name */
    pageID = '';

    /**
     * constructor of PageDetailComponent
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
        private router: Router,
        private route: ActivatedRoute,
        private state: TransferState,
        @Inject(LOCALE_ID) public locale: string
    ) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.route.params.subscribe(params => {
            if (Number(params['id']) || Number(params['id']) === 0) {
                this.afs.collection(`pages_${this.locale}`,
                    ref => ref.where('orderNo', '==', Number(params['id']))
                        .limit(1)
                )
                    .snapshotChanges()
                    .subscribe(data => {
                        if (data && data.length > 0)
                            data.map(pld => {
                                this.router.navigate(['/page', pld.payload.doc.id]);
                            });
                        else if (Number(params['id']) === 0)
                            this.router.navigate(['/pages']);
                        else
                            this.router.navigate(['/page', Number(params['id']) + 1]);
                    });

                return;
            }
            this.pageID = params['id'];
            this.initPage();
        });
        // this will create a split second flash
        // this.page$ = this.afs.doc(`pages_${this.locale}/${id}`).valueChanges();
    }

    /**
     * init page
     */
    initPage(): void {
        this.page$ = this.ssrFirestoreDoc(`pages_${this.locale}/${this.pageID}`, true);
    }

    /**
     * check if there is another translation and redirect to it
     */
    checkTranslation(checkInLocale): void {
        if (checkInLocale)
            this.afs.doc<PageModel>(`pages_${checkInLocale}/${this.pageID}`)
                .valueChanges()
                .subscribe(page => {
                    if (page) {
                        const languageCode2 = checkInLocale.substring(0, 2);
                        window.location.href = `/${languageCode2}/page/${this.pageID}`; // this.router.navigate can't work
                        // this.router.navigate([`../${languageCode2}/page`, this.pageID]);
                    } else
                        this.router.navigate(['/404']);
                });
        else if (this.locale === 'en-US')
            this.checkTranslation('tr-TR');
        else if (this.locale === 'tr-TR')
            this.checkTranslation('en-US');
    }

    /**
     * Get page object from firestore by path
     * @param path: page path
     * @param checkTranslation: check translation if current page is not exist
     */
    ssrFirestoreDoc(path: string, checkTranslation: boolean): Observable<PageModel> {
        const exists = this.state.get(BLOG_KEY, new PageModel());

        return this.afs.doc<PageModel>(path)
            .valueChanges()
            .pipe(tap(page => {
                if (page) {
                    this.state.set(BLOG_KEY, page);
                    this.seo.generateTags({
                        title: page.title,
                        description: page.content
                    });
                } else if (checkTranslation)
                    this.checkTranslation(undefined);
            }),
            startWith(exists)
        );
    }

}
