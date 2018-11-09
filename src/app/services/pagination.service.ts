import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { scan, take, tap } from 'rxjs/operators';

/**
 * options to reproduce firestore queries consistently
 */
interface QueryConfig {
    /** path to collection */
    path: string;
    /** field to orderBy */
    field: string;
    /** limit per query */
    limit?: number;
    /** reverse order? */
    reverse?: boolean;
    /** prepend to source? */
    prepend?: boolean;
}

/**
 * Pagination Service
 */
@Injectable()
export class PaginationService {
    /** observable data */
    data: Observable<any>;
    /** is done? */
    done = new BehaviorSubject<boolean>(false);
    /** is loading? */
    loading = new BehaviorSubject<boolean>(false);

    /** private source data */
    private _data = new BehaviorSubject([]);

    /** QueryConfig */
    private query: QueryConfig;

    constructor(private afs: AngularFirestore) {
    }

    /**
     * initial query sets options and defines the Observable
     * @param path: path to collection
     * @param field: field to orderBy
     * @param opts: options
     */
    init(path, field, opts?): void {
        this.query = {
            path,
            field,
            limit: 2,
            reverse: false,
            prepend: false,
            ...opts
        };

        setTimeout(() => {
            const first = this.afs.collection(this.query.path, ref => {
                return ref
                    .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
                    .limit(this.query.limit);
            });

            this.mapAndUpdate(first);

            // create the observable array for consumption in components
            this.data = this._data.asObservable()
                .pipe(scan((acc, val) => {
                    return this.query.prepend ? val.concat(acc) : acc.concat(val);
                }));
        }, 0);
    }

    /**
     * Retrieves additional data from firestore
     */
    more(): any {
        const cursor = this.getCursor();

        const more = this.afs.collection(this.query.path, ref => {
            return ref
                .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
                .limit(this.query.limit)
                .startAfter(cursor);
        });
        this.mapAndUpdate(more);
    }

    /**
     * Reset the page
     */
    reset(): void {
        this._data.next([]);
        this.done.next(false);
        this.loading.next(false);
    }

    /**
     * Determines the doc snapshot to paginate query
     */
    private getCursor(): any {
        const current = this._data.value;
        if (current.length)
            return this.query.prepend ? current[0].doc : current[current.length - 1].doc;

        return;
    }

    /**
     * Maps the snapshot to usable format the updates source
     * @param col: AngularFirestoreCollection
     */
    private mapAndUpdate(col: AngularFirestoreCollection<any>): any {

        if (this.done.value || this.loading.value)
            return;

        // loading
        this.loading.next(true);

        // map snapshot with doc ref (needed for cursor)
        return col.snapshotChanges()
            .pipe(tap(arr => {
                let values = arr.map(snap => {
                    const data = snap.payload.doc.data();
                    const doc = snap.payload.doc;

                    return {...data, doc};
                });

                // if prepending, reverse array
                values = this.query.prepend ? values.reverse() : values;

                // update source with new values, done loading
                this._data.next(values);
                this.loading.next(false);

                // no more values, mark done
                if (!values.length)
                    this.done.next(true);
            }))
            .pipe(take(1))
            .subscribe();
    }
}
