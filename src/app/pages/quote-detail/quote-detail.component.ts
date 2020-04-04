import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { QuoteModel } from '../../models';
import { AlertService, PageService, SeoService } from '../../services';

/**
 * Quote Detail Component
 */
@Component({
    selector: 'app-quote-detail',
    templateUrl: './quote-detail.component.html'
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
     * @param pageService: PageService
     * @param locale: LOCALE_ID
     */
    constructor(
        private readonly afs: AngularFirestore,
        private readonly seo: SeoService,
        private readonly alert: AlertService,
        public router: Router,
        private readonly route: ActivatedRoute,
        public pageService: PageService,
        @Inject(LOCALE_ID) public locale: string
    ) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.route.paramMap.subscribe(pmap => {
            if (this.pageService.checkToRedirectByIDParam(pmap,
                'quotes',
                this.pageService.routerLinks.quotes,
                this.pageService.routerLinks.quote)) {
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
        this.quote$ = this.pageService.getPageFromFirestore(QuoteModel, 'quotes', this.quoteID);
    }

}
