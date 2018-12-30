import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';
import { QuoteModel } from '../../models';
import { AlertService, SeoService } from '../../services';

/** State key of current quote */
const ARTICLE_KEY = makeStateKey<any>('quote');

/**
 * Quote Detail Component
 */
@Component({
    selector: 'app-quote-detail',
    templateUrl: './quote-detail.component.html',
    styleUrls: ['./quote-detail.component.scss']
})
export class QuoteDetailComponent implements OnInit {
    /** current quote object */
    quote$: Observable<QuoteModel>;
    /** current quote id */
    quoteID = '';

    /**
     * constructor of QuoteDetailComponent
     * @param afs: AngularFirestore
     * @param seo: SeoService
     * @param alert: AlertService
     * @param router: Router
     * @param route: ActivatedRoute
     * @param state: TransferState
     * @param locale: LOCALE_ID
     */
    constructor(
        private readonly afs: AngularFirestore,
        private readonly seo: SeoService,
        private readonly alert: AlertService,
        public router: Router,
        private readonly route: ActivatedRoute,
        private readonly state: TransferState,
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
                this.afs.collection(`quotes_${this.locale}`,
                    ref => ref.where('orderNo', '==', pID)
                        .limit(1)
                )
                    .snapshotChanges()
                    .subscribe(data => {
                        if (data && data.length > 0) {
                            data.map(pld => {
                                const quote = pld.payload.doc.data() as QuoteModel;
                                this.router.navigate([quote.routePath, quote.id])
                                    .catch(// istanbul ignore next
                                        reason => {
                                            this.alert.error(reason);
                                        });
                            });
                        } else if (pID === 0) {
                            this.router.navigate(['/quotes'])
                                .catch(// istanbul ignore next
                                    reason => {
                                        this.alert.error(reason);
                                    });
                        } else {
                            this.router.navigate(['/quote', pID + 1])
                                .catch(// istanbul ignore next
                                    reason => {
                                        this.alert.error(reason);
                                    });
                        }
                    });

                return;
            }
            this.quoteID = pmap.get('id');
            this.initQuote();
        });
    }

    /**
     * init quote
     */
    initQuote(): void {
        this.quote$ = this.ssrFirestoreDoc(`quotes_${this.locale}/${this.quoteID}`, true);
        this.quote$.subscribe(quote => {
            if (quote === undefined) {
                this.checkTranslation(undefined);
            } else if (quote.id) {
                this.seo.setHtmlTags(quote);
            }
        });
    }

    /**
     * check if there is another translation and redirect to it
     */
    checkTranslation(checkInLocale): void {
        if (checkInLocale) {
            this.afs.doc<QuoteModel>(`quotes_${checkInLocale}/${this.quoteID}`)
                .valueChanges()
                .subscribe(quote => {
                    if (quote) {
                        const languageCode2 = checkInLocale.substring(0, 2);
                        this.seo.http301(`/${languageCode2}/${quote.routePath}/${quote.id}`, true);
                    } else {
                        this.seo.http404();
                    }
                });
        } else if (this.locale === 'en-US') {
            this.checkTranslation('tr-TR');
        } else {
            this.checkTranslation('en-US');
        }
    }

    /**
     * Get quote object from firestore by path
     * @param path: quote path
     * @param checkTranslation: check translation if current quote is not exist
     */
    ssrFirestoreDoc(path: string, checkTranslation: boolean): Observable<QuoteModel> {
        const exists = this.state.get(ARTICLE_KEY, new QuoteModel());

        return this.afs.doc<QuoteModel>(path)
            .valueChanges()
            .pipe(tap(quote => {
                    if (quote) {
                        this.state.set(ARTICLE_KEY, quote);
                    }
                }),
                startWith(exists)
            );
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
