import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';
import { JokeModel } from '../../models';
import { AlertService, PageService, SeoService } from '../../services';

/** State key of current joke */
const ARTICLE_KEY = makeStateKey<any>('joke');

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
            if (this.pageService.checkToRedirectByIDParam(pmap, 'jokes', '/jokes', '/joke')) {
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
        this.joke$ = this.ssrFirestoreDoc(`jokes_${this.locale}/${this.jokeID}`);
        this.joke$.subscribe(joke => {
            if (joke === undefined) {
                this.pageService.redirectToTranslationOr404(undefined, 'jokes', this.jokeID);
            } else if (joke.id) {
                this.pageService.initPage(joke);
            }
        });
    }

    /**
     * Get joke object from firestore by path
     * @param path: joke path
     */
    ssrFirestoreDoc(path: string): Observable<JokeModel> {
        const exists = this.state.get(ARTICLE_KEY, new JokeModel());

        return this.afs.doc<JokeModel>(path)
            .valueChanges()
            .pipe(tap(joke => {
                    if (joke) {
                        this.state.set(ARTICLE_KEY, joke);
                    }
                }),
                startWith(exists)
            );
    }

}
