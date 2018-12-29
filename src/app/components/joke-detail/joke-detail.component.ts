import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';
import { JokeModel } from '../../models';
import { AlertService, SeoService } from '../../services';

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
                this.afs.collection(`jokes_${this.locale}`,
                    ref => ref.where('orderNo', '==', pID)
                        .limit(1)
                )
                    .snapshotChanges()
                    .subscribe(data => {
                        if (data && data.length > 0) {
                            data.map(pld => {
                                const joke = pld.payload.doc.data() as JokeModel;
                                this.router.navigate([joke.routePath, joke.id])
                                    .catch(// istanbul ignore next
                                        reason => {
                                            this.alert.error(reason);
                                        });
                            });
                        } else if (pID === 0) {
                            this.router.navigate(['/jokes'])
                                .catch(// istanbul ignore next
                                    reason => {
                                        this.alert.error(reason);
                                    });
                        } else {
                            this.router.navigate(['/joke', pID + 1])
                                .catch(// istanbul ignore next
                                    reason => {
                                        this.alert.error(reason);
                                    });
                        }
                    });

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
        this.joke$ = this.ssrFirestoreDoc(`jokes_${this.locale}/${this.jokeID}`, true);
        this.joke$.subscribe(joke => {
            if (joke === undefined) {
                this.checkTranslation(undefined);
            } else if (joke.id) {
                this.seo.setHtmlTags(joke);
            }
        });
    }

    /**
     * check if there is another translation and redirect to it
     */
    checkTranslation(checkInLocale): void {
        if (checkInLocale) {
            this.afs.doc<JokeModel>(`jokes_${checkInLocale}/${this.jokeID}`)
                .valueChanges()
                .subscribe(joke => {
                    if (joke) {
                        const languageCode2 = checkInLocale.substring(0, 2);
                        this.seo.http301(`/${languageCode2}/${joke.routePath}/${joke.id}`, true);
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
     * Get joke object from firestore by path
     * @param path: joke path
     * @param checkTranslation: check translation if current joke is not exist
     */
    ssrFirestoreDoc(path: string, checkTranslation: boolean): Observable<JokeModel> {
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

    /**
     * track content object array by index
     * @param index: index no
     * @param item: object
     */
    trackByIndex(index, item): number {
        return index;
    }

}
