import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/internal/operators';
import { JokeModel } from '../../models';
import { AlertService, PageService } from '../../services';

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
    /** css class of header */
    @Input() readonly headerCssClass = '';

    /** joke object array */
    jokes: Array<JokeModel>;

    /**
     * constructor of LastJokesComponent
     * @param alert: AlertService
     * @param pageService: PageService
     * @param afs: AngularFirestore
     */
    constructor(private readonly alert: AlertService,
                public pageService: PageService,
                private readonly afs: AngularFirestore) {
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
        this.afs.collection(`jokes_${this.pageService.locale}`,
            ref => ref.orderBy('orderNo')
                .limit(this.jokeLimit)
        )
            .snapshotChanges()
            .pipe(map(jokeList =>
                jokeList.map(joke => {
                    const id = joke.payload.doc.id;
                    const data = joke.payload.doc.data() as JokeModel;

                    return { id, ...data };
                })))
            .subscribe(jokes => {
                this.jokes = jokes;
            });
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
