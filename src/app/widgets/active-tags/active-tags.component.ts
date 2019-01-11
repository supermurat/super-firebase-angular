import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';
import { TaxonomyModel } from '../../models';
import { AlertService } from '../../services';

/**
 * Active Tags Component
 */
@Component({
    selector: 'app-active-tags',
    templateUrl: './active-tags.component.html'
})
export class ActiveTagsComponent implements OnInit {
    /** limit number of tags to show */
    @Input() readonly tagLimit = 10;
    /** css class of header */
    @Input() readonly headerCssClass = '';

    /** taxonomy object array */
    taxonomyList$: Observable<Array<TaxonomyModel>>;

    /**
     * constructor of ActiveTagsComponent
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
        this.getTaxonomyList();
    }

    /**
     * get taxonomy list
     */
    getTaxonomyList(): void {
        this.taxonomyList$ = this.afs.collection(`taxonomy_${this.locale}`,
            ref => ref.orderBy('orderNo')
                .limit(this.tagLimit)
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
     * track content object array by index
     * @param index: index no
     * @param item: object
     */
    trackByIndex(index, item): number {
        return index;
    }

}
