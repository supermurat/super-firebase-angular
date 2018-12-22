import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { PaginationService, SeoService } from '../../services';
import { ArticleModel } from '../../models';

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
    constructor(private afs: AngularFirestore,
                private seo: SeoService,
                public router: Router,
                private route: ActivatedRoute,
                private pagination: PaginationService,
                @Inject(LOCALE_ID) public locale: string) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.tagID = params['id'];

            this.afs.doc<ArticleModel>(`taxonomy_${this.locale}/${this.tagID}`)
                .valueChanges()
                .subscribe(tag => {
                    if (tag) {
                        this.tagName = tag.title;
                        this.seo.setHtmlTags(tag);
                    }
                });

            this.pagination.init(`taxonomy_${this.locale}/${this.tagID}/contents/`, 'created', { reverse: true, prepend: false, limit: 5 });
        });
    }

    /**
     * scroll handler for pagination
     * @param e: event
     */
    scrollHandler(e): void {
        if (e === 'bottom')
            this.pagination.more();
        /*if (e === 'top')
            this.pagination.more();*/
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
