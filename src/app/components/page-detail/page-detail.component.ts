import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { SeoService } from '../../services';
import { PageModel } from '../../models';
import { startWith, tap } from 'rxjs/operators';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Observable } from 'rxjs';

/** State key of current page */
const BLOG_KEY = makeStateKey<any>('page');

/**
 * Page Detail Component
 */
@Component({
    selector: 'app-page-detail',
    templateUrl: './page-detail.component.html',
    styleUrls: ['./page-detail.component.scss']
})
export class PageDetailComponent implements OnInit {
    /** current page object */
    page$: Observable<PageModel>;
    /** current page name */
    pageID = '';

    /**
     * constructor of PageDetailComponent
     * @param afs: AngularFirestore
     * @param seo: SeoService
     * @param route: ActivatedRoute
     * @param state: TransferState
     */
    constructor(
        private afs: AngularFirestore,
        private seo: SeoService,
        private route: ActivatedRoute,
        private state: TransferState
    ) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.pageID = params['id'];
        });
        this.page$ = this.ssrFirestoreDoc(`pages/${this.pageID}`);

        // this will create a split second flash
        // this.page$ = this.afs.doc(`pages/${id}`).valueChanges();
    }

    /**
     * Get page object from firestore by path
     * @param path: page path
     */
    ssrFirestoreDoc(path: string): Observable<PageModel> {
        const exists = this.state.get(BLOG_KEY, new PageModel());

        return this.afs.doc<PageModel>(path)
            .valueChanges()
            .pipe(
            tap(page => {
                this.state.set(BLOG_KEY, page);
                this.seo.generateTags({
                    title: page.title,
                    description: page.content
                });
            }),
            startWith(exists)
        );
    }

}
