import { async, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { BlogListComponent } from './blog-list.component';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';

import { AlertService, SeoService } from '../../services';
import { AngularFireModule } from '@angular/fire';
import { firebaseConfig } from '../../../environments/firebase.config';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

describe('BlogListComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                BlogListComponent
            ],
            providers: [
                AlertService, SeoService, AngularFirestore
            ],
            imports: [
                RouterTestingModule.withRoutes([{path: 'blog', component: BlogListComponent}]),
                AngularFireModule.initializeApp(firebaseConfig),
                AngularFirestoreModule, // imports firebase/firestore, only needed for database features
                AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
                AngularFireStorageModule // imports firebase/storage only needed for storage features
            ]
        })
            .compileComponents();
    }));

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(BlogListComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app)
            .toBeTruthy();
    }));

    it("should have as title 'Blog App'", async(() => {
        const fixture = TestBed.createComponent(BlogListComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title)
            .toEqual('Blog App');
    }));

    it("should render 'Blog Entries' in a h2", async(() => {
        const fixture = TestBed.createComponent(BlogListComponent);
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h2').textContent)
            .toContain('Blog Entries');
    }));

});
