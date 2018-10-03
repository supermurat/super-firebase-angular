import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { SeoService } from '../../services';
import { Blog } from '../../models/blog';
import { startWith, tap } from 'rxjs/operators';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Observable } from 'rxjs';

const BLOG_KEY = makeStateKey<any>('blog');

@Component({
    selector: 'app-blog-detail',
    templateUrl: './blog-detail.component.html',
    styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {
    blog$;

    constructor(
        private afs: AngularFirestore,
        private storage: AngularFireStorage,
        private seo: SeoService,
        private route: ActivatedRoute,
        private state: TransferState
    ) {
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('name')
            .toLowerCase();
        this.blog$ = this.ssrFirestoreDoc(`blogs/${id}`);

        // this will create a split second flash
        // this.blog$ = this.afs.doc(`blogs/${id}`).valueChanges();
    }

    ssrFirestoreDoc(path: string): Observable<Blog> {
        const exists = this.state.get(BLOG_KEY, new Blog());

        return this.afs.doc<Blog>(path)
            .valueChanges()
            .pipe(
            tap(blog => {
                const ref = this.storage.ref(`blogs/${blog.imgName}`);
                blog.imgURL = ref.getDownloadURL();

                this.state.set(BLOG_KEY, blog);
                this.seo.generateTags({
                    title: blog.name,
                    description: blog.bio,
                    image: blog.imgName
                });
            }),
            startWith(exists)
        );
    }

}
