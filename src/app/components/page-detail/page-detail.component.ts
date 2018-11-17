import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
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
     * @param router: Router
     * @param route: ActivatedRoute
     * @param state: TransferState
     */
    constructor(
        private afs: AngularFirestore,
        private seo: SeoService,
        private router: Router,
        private route: ActivatedRoute,
        private state: TransferState
    ) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.route.params.subscribe(params => {
            if (Number(params['id']) || Number(params['id']) === 0) {
                this.afs.collection('pages',
                    ref => ref.where('orderNo', '==', Number(params['id']))
                        .limit(1)
                )
                    .snapshotChanges()
                    .subscribe(data => {
                        if (data && data.length > 0)
                            data.map(pld => {
                                this.router.navigate(['/page', pld.payload.doc.id]);
                            });
                        else if (Number(params['id']) === 0)
                            this.router.navigate(['/pages']);
                        else
                            this.router.navigate(['/page', Number(params['id']) + 1]);
                    })
                    /*.forEach(user => {
                        user.forEach(userData => {
                            this.router.navigate(['/page', userData.payload.doc.id]);
                        });
                    })*/;

                return;
            }
            this.pageID = params['id'];
            this.initPage();
        });
        // this will create a split second flash
        // this.page$ = this.afs.doc(`pages/${id}`).valueChanges();
    }

    /**
     * init page
     */
    initPage(): void {
        this.page$ = this.ssrFirestoreDoc(`pages/${this.pageID}`);
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
