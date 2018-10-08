import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { BlogDetailComponent } from './blog-detail.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { TransferState } from '@angular/platform-browser';

import { AlertService, SeoService } from '../../services';
import { ActivatedRoute, Data } from '@angular/router';
import { Blog } from '../../models/blog';
import { Observable } from 'rxjs';
import 'rxjs-compat/add/observable/from';

const testData: Array<Blog> = [
    { name: 'first-block', bio: 'this is good sample', imgName: 'bad, very bad angel.gif', imgURL: undefined}
];

const angularFirestoreStub = {
    doc: jasmine.createSpy('doc').and
        .returnValue(
        {
            valueChanges: jasmine.createSpy('valueChanges').and
                .returnValue(Observable.from(testData))
        })
};

const angularFireStorageStub = {
    ref: jasmine.createSpy('ref').and
        .returnValue(
        {
            getDownloadURL: jasmine.createSpy('getDownloadURL').and
                .returnValue(
                Observable.from(['https://firebasestorage.googleapis.com/v0/b/supermurat-com.appspot.com' +
                '/o/blogs%2Fbad%2C%20very%20bad%20angel.gif?alt=media&token=382c3835-1ee6-4d2f-81b3-570e0a1f3086']))
        })
};

describe('BlogDetailComponent', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                BlogDetailComponent
            ],
            providers: [
                AlertService, SeoService, TransferState,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: {
                            subscribe: (fn: (value: Data) => void) => fn({
                                name: 'unit-test'
                            })
                        }
                    }
                },
                { provide: AngularFirestore, useValue: angularFirestoreStub },
                { provide: AngularFireStorage, useValue: angularFireStorageStub }
            ],
            imports: [
                RouterTestingModule.withRoutes([{path: 'blog/:name', component: BlogDetailComponent}])
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
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('a').textContent)
            .toContain('Back to Blog List');
    }));

    it('imgURL of blog should be predefined', fakeAsync(() => {
        const fixture = TestBed.createComponent(BlogDetailComponent);
        const app = fixture.debugElement.componentInstance;
        fixture.detectChanges();
        app.blog$.subscribe(blog => {
            tick();
            fixture.detectChanges();
            expect(app.imgURL)
                .toEqual('https://firebasestorage.googleapis.com/v0/b/supermurat-com.appspot.com' +
                    '/o/blogs%2Fbad%2C%20very%20bad%20angel.gif?alt=media&token=382c3835-1ee6-4d2f-81b3-570e0a1f3086');
        });
        tick();
        fixture.detectChanges();
    }));

});
