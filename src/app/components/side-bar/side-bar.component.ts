import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/internal/operators';
import { JokeModel, TaxonomyModel } from '../../models';
import { AlertService } from '../../services';

/**
 * Side Bar Component
 */
@Component({
    selector: 'app-side-bar',
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
    /** search for */
    searchFor = '';
    /** do you want to hide search widget */
    hideSearchWidget = false;

    /** taxonomy object array */
    taxonomyList$: Observable<Array<TaxonomyModel>>;

    /** joke object array */
    jokes$: Observable<Array<JokeModel>>;

    /**
     * constructor of SideBarComponent
     * @param router: Router
     * @param alert: AlertService
     * @param afs: AngularFirestore
     * @param locale: LOCALE_ID
     */
    constructor(public router: Router,
                private readonly alert: AlertService,
                private readonly afs: AngularFirestore,
                @Inject(LOCALE_ID) public locale: string) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                this.hideSearchWidget = this.router.url === '/search' || this.router.url.startsWith('/search?');
            });
        this.getTaxonomyList();
        this.getJokes();
    }

    /**
     * on click search button
     */
    onClickSearch(): void {
        this.router.navigate(['/search'], { queryParams: { q: this.searchFor}})
            .catch(// istanbul ignore next
                reason => {
                    this.alert.error(reason);
                });
    }

    /**
     * get taxonomy list
     */
    getTaxonomyList(): void {
        this.taxonomyList$ = this.afs.collection(`taxonomy_${this.locale}`,
            ref => ref.orderBy('orderNo')
                .limit(10)
        )
            .snapshotChanges()
            .pipe(map(taxonomyList =>
                taxonomyList.map(taxonomy => {
                    const id = taxonomy.payload.doc.id;
                    const data = taxonomy.payload.doc.data() as TaxonomyModel;

                    return { id, ...data };
                })));
    }

    /**
     * get jokes
     */
    getJokes(): void {
        this.jokes$ = this.afs.collection(`jokes_${this.locale}`,
            ref => ref.orderBy('orderNo')
                .limit(10)
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
