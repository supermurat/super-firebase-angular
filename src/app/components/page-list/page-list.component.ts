import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { SeoService } from '../../services';
import { PageModel } from '../../models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Page List Component
 */
@Component({
    selector: 'app-page-list',
    templateUrl: './page-list.component.html',
    styleUrls: ['./page-list.component.scss']
})
export class PageListComponent implements OnInit {
    /** page object array */
    pages$: Observable<Array<PageModel>>;
    /** current page`s title */
    title = 'This is temporary page list';
    /** current page`s description */
    description = 'This App is in development!';
    /** count of pages */
    countItems: number;

    /**
     * constructor of PageListComponent
     * @param afs: AngularFirestore
     * @param seo: SeoService
     */
    constructor(private afs: AngularFirestore,
                private seo: SeoService) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.pages$ = this.afs.collection('pages', ref => ref.orderBy('created', 'desc'))
            .snapshotChanges()
            .pipe(map(actions => {
                return actions.map(action => {
                    this.countItems = actions.length;
                    const id = action.payload.doc.id;
                    const data = action.payload.doc.data();
                    if (!data.hasOwnProperty('contentSummary'))
                        data['contentSummary'] = data['content'];

                    return { id, ...data as PageModel };
                });
            }));

        this.seo.generateTags({
            title: this.title,
            description: this.description
        });
    }

    /**
     * track page object array by page
     * @param index: page index no
     * @param item: page object
     */
    trackByPage(index, item): number {
        return index;
    }
}
