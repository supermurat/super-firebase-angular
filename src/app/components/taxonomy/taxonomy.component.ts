import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationService, SeoService } from '../../services';

/**
 * Taxonomy Component
 */
@Component({
    selector: 'app-taxonomy',
    templateUrl: './taxonomy.component.html',
    styleUrls: ['./taxonomy.component.scss']
})
export class TaxonomyComponent implements OnInit {
    /** current tagID */
    tagID = '';
    /** current tagName */
    tagName = '';

    /**
     * constructor of TaxonomyComponent
     * @param afs: AngularFirestore
     * @param seo: SeoService
     * @param router: Router
     * @param route: ActivatedRoute
     * @param pagination: PaginationService
     * @param locale: LOCALE_ID
     */
    constructor(private readonly afs: AngularFirestore,
                private readonly seo: SeoService,
                public router: Router,
                private readonly route: ActivatedRoute,
                public pagination: PaginationService,
                @Inject(LOCALE_ID) public locale: string) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.route.paramMap.subscribe(pmap => {
            this.tagID = pmap.get('id');

            this.afs.doc<any>(`taxonomy_${this.locale}/${this.tagID}`)
                .valueChanges()
                .subscribe(tag => {
                    if (tag) {
                        this.tagName = tag.title;
                        this.seo.setHtmlTags(tag);
                    }
                });

            this.pagination.init(`taxonomy_${this.locale}/${this.tagID}/contents/`, 'created', {reverse: true, prepend: false, limit: 5});

        });
    }

    /**
     * scroll handler for pagination
     * @param e: event
     */
    scrollHandler(e): void {
        if (e === 'bottom') {
            this.pagination.more();
        }
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
