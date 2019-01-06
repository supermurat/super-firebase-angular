import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JokeModel } from '../../models';
import { AlertService, PageService, SeoService } from '../../services';

/**
 * Joke Detail Component
 */
@Component({
    selector: 'app-joke-detail',
    templateUrl: './joke-detail.component.html',
    styleUrls: ['./joke-detail.component.scss']
})
export class JokeDetailComponent implements OnInit {
    /** current joke object */
    joke$: Observable<JokeModel>;
    /** current joke id */
    jokeID = '';

    /**
     * constructor of JokeDetailComponent
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
                'jokes',
                this.pageService.routerLinks.jokes,
                this.pageService.routerLinks.joke)) {
                return;
            }
            this.jokeID = pmap.get('id');
            this.initJoke();
        });
    }

    /**
     * init joke
     */
    initJoke(): void {
        this.joke$ = this.pageService.getPageFromFirestore(JokeModel, 'jokes', this.jokeID);
    }

}
