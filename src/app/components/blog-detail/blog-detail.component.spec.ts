import { async, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { BlogDetailComponent } from './blog-detail.component';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { TransferState } from '@angular/platform-browser';

import { AlertService, SeoService } from '../../services';
import { AngularFireModule } from '@angular/fire';
import { firebaseConfig } from '../../../environments/firebase.config';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { ActivatedRoute, Data, Router } from '@angular/router';

describe('BlogDetailComponent', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                BlogDetailComponent
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
    }));

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(BlogDetailComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app)
            .toBeTruthy();
    }));

    it("should render 'Back to Blog List' in an a", async(() => {
        const fixture = TestBed.createComponent(BlogDetailComponent);
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('a').textContent)
            .toContain('Back to Blog List');
    }));

});
