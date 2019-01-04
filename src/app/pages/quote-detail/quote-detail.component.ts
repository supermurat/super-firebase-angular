import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';
import { QuoteModel } from '../../models';
import { AlertService, PageService, SeoService } from '../../services';

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
            if (this.pageService.checkToRedirectByIDParam(pmap, 'quotes', '/quotes', '/quote')) {
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
        this.quote$ = this.ssrFirestoreDoc(`quotes_${this.locale}/${this.quoteID}`);
        this.quote$.subscribe(quote => {
            if (quote === undefined) {
                this.pageService.redirectToTranslationOr404(undefined, 'quotes', this.quoteID);
            } else if (quote.id) {
                this.pageService.initPage(quote);
            }
        });
    }

    /**
     * Get quote object from firestore by path
     * @param path: quote path
     */
    ssrFirestoreDoc(path: string): Observable<QuoteModel> {
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

}
