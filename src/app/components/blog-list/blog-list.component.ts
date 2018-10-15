import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { SeoService } from '../../services';

/**
 * Blog List Component
 */
@Component({
    selector: 'app-blog-list',
    templateUrl: './blog-list.component.html',
    styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
    /** blog object array */
    blogs$;
    /** current page`s title */
    title = 'Blog App';
    /** current page`s description */
    description = 'This App is in development!';

    /**
     * constructor of BlogListComponent
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
        this.blogs$ = this.afs.collection('blogs', ref => ref.orderBy('imgName'))
            .valueChanges();

        this.seo.generateTags({
            title: this.title,
            description: this.description
        });
    }

    /**
     * track blog object array by blog
     * @param index: blog index no
     * @param item: blog object
     */
    trackByBlog(index, item): number {
        return index;
    }
}
