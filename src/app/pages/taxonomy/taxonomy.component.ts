import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TaxonomyModel } from '../../models';
import { PageService, PaginationService, SeoService } from '../../services';

/**
 * Taxonomy Component
 */
@Component({
    selector: 'app-taxonomy',
    templateUrl: './taxonomy.component.html',
    styleUrls: ['./taxonomy.component.scss']
})
export class TaxonomyComponent implements OnInit {
    /** current tag object */
    tag$: Observable<TaxonomyModel>;
    /** current tagID */
    tagID = '';

    /**
     * constructor of TaxonomyComponent
     * @param afs: AngularFirestore
     * @param seo: SeoService
     * @param router: Router
     * @param route: ActivatedRoute
     * @param pageService: PageService
     * @param pagination: PaginationService
     */
    constructor(private readonly afs: AngularFirestore,
                private readonly seo: SeoService,
                public router: Router,
                private readonly route: ActivatedRoute,
                public pageService: PageService,
                public pagination: PaginationService) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.route.paramMap.subscribe(pmap => {
            this.tagID = pmap.get('id');
            this.tag$ = this.pageService.getPageFromFirestore(TaxonomyModel, 'taxonomy', this.tagID);

            this.pagination.init(
                `taxonomy_${this.pageService.locale}/${this.tagID}/contents`, 'created', {reverse: true, prepend: false, limit: 5});

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

}
