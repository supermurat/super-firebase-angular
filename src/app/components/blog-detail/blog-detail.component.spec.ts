import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Location } from '@angular/common';

import { RouterTestingModule } from '@angular/router/testing';
import { BlogDetailComponent } from './blog-detail.component';
import { BlogListComponent } from '../blog-list/blog-list.component';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { TransferState } from '@angular/platform-browser';

import { AlertService, SeoService } from '../../services';
import { AngularFireModule } from '@angular/fire';
import { firebaseConfig } from '../../../environments/firebase.config';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { ActivatedRoute, Data, Router } from '@angular/router';

describe('BlogDetailComponent', () => {
    let location: Location;
    let router: Router;
    let fixture;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                BlogDetailComponent,
                BlogListComponent
            ],
            providers: [
                AlertService, SeoService, AngularFirestore, TransferState,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: {
                            subscribe: (fn: (value: Data) => void) => fn({
                                name: 'unit-test'
                            })
                        }
                    }
                }
            ],
            imports: [
                RouterTestingModule.withRoutes([{path: 'blog/:name', component: BlogDetailComponent}]),
                AngularFireModule.initializeApp(firebaseConfig),
                AngularFirestoreModule, // imports firebase/firestore, only needed for database features
                AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
                AngularFireStorageModule // imports firebase/storage only needed for storage features
            ]
        })
            .compileComponents();

        router = TestBed.get(Router);
        location = TestBed.get(Location);

        fixture = TestBed.createComponent(BlogDetailComponent);
        router.initialNavigation();
    }));

    it('navigate to /blog/unit-test', fakeAsync(() => {
        router.navigate(['blog/unit-test']);
        tick(50);
        expect(location.path())
            .toBe('/blog/unit-test');
    }));

    it('fakeAsync works', fakeAsync(() => {
        const promise = new Promise(resolve => {
            setTimeout(resolve, 10);
        });
        let done = false;
        promise.then(() => done = true);
        tick(50);
        expect(done)
            .toBeTruthy();
    }));

    it('should create the app', fakeAsync(() => {
        router.navigate(['blog/unit-test']);
        tick(50);
        const app = fixture.debugElement.componentInstance;
        expect(app)
            .toBeTruthy();
    }));

    it("should render 'Back to Blog List' in an a", fakeAsync(() => {
        router.navigate(['blog/unit-test']);
        tick(50);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('a').textContent)
            .toContain('Back to Blog List');
    }));

});
