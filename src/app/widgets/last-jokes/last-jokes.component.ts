import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';
import { JokeModel } from '../../models';
import { AlertService } from '../../services';

/**
 * Last Jokes Component
 */
@Component({
    selector: 'app-last-jokes',
    templateUrl: './last-jokes.component.html'
})
export class LastJokesComponent implements OnInit {
    /** limit number of jokes to show */
    @Input() readonly jokeLimit = 10;

    /** joke object array */
    jokes$: Observable<Array<JokeModel>>;

    /**
     * constructor of LastJokesComponent
     * @param alert: AlertService
     * @param afs: AngularFirestore
     * @param locale: LOCALE_ID
     */
    constructor(private readonly alert: AlertService,
                private readonly afs: AngularFirestore,
                @Inject(LOCALE_ID) public locale: string) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.getJokes();
    }

    /**
     * get jokes
     */
    getJokes(): void {
        this.jokes$ = this.afs.collection(`jokes_${this.locale}`,
            ref => ref.orderBy('orderNo')
                .limit(this.jokeLimit)
        )
            .snapshotChanges()
            .pipe(map(taxonomyList =>
                taxonomyList.map(taxonomy => {
                    const id = taxonomy.payload.doc.id;
                    const data = taxonomy.payload.doc.data() as JokeModel;

                    return { id, ...data };
                })));
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
