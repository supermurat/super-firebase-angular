import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { SeoService } from '../../services';
import { BlogModel } from '../../models/blog-model';
import { startWith, tap } from 'rxjs/operators';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Observable } from 'rxjs';

/** State key of current blog */
const BLOG_KEY = makeStateKey<any>('blog');

/**
 * Blog Detail Component
 */
@Component({
    selector: 'app-blog-detail',
    templateUrl: './blog-detail.component.html',
    styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {
    /** current blog object */
    blog$: Observable<BlogModel>;
    /** current blog name */
    blogID = '';

    /**
     * constructor of BlogDetailComponent
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
            this.blogID = params['id'];
        });
        this.blog$ = this.ssrFirestoreDoc(`blogs_en-US/${this.blogID}`);

        // this will create a split second flash
        // this.blog$ = this.afs.doc(`blogs/${id}`).valueChanges();
    }

    /**
     * Get blog object from firestore by path
     * @param path: blog path
     */
    ssrFirestoreDoc(path: string): Observable<BlogModel> {
        const exists = this.state.get(BLOG_KEY, new BlogModel());

        return this.afs.doc<BlogModel>(path)
            .valueChanges()
            .pipe(
            tap(blog => {
                this.state.set(BLOG_KEY, blog);
                this.seo.generateTags({
                    title: blog.title,
                    description: blog.content
                });
            }),
            startWith(exists)
        );
    }

}
