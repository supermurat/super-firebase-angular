import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { SeoService } from '../../services';
import { Router } from '@angular/router';
import {Blog} from '../../models/blog';

@Component({
    selector: 'app-blog-list',
    templateUrl: './blog-list.component.html',
    styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {

    blogs$;

    title = 'Blog App';
    description = 'This App is in development!';

    constructor(private afs: AngularFirestore,
                private seo: SeoService,
                private router: Router) {
    }

    ngOnInit() {
        this.blogs$ = this.afs.collection('blogs', ref => ref.orderBy('imgName')).valueChanges();

        this.seo.generateTags({
            title: this.title,
            description: this.description
        });
    }

}
