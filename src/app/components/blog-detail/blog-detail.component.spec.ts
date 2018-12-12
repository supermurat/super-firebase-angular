
import { from } from 'rxjs';
import { async, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { BlogDetailComponent } from './blog-detail.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { TransferState } from '@angular/platform-browser';

import { AlertService, SeoService } from '../../services';
import { ActivatedRoute, Data } from '@angular/router';
import { BlogModel } from '../../models';
import { FooterComponent } from '../footer/footer.component';
import { SideBarComponent } from '../side-bar/side-bar.component';

const testData: Array<BlogModel> = [
    { id: 'first-blog', title: 'First Blog', content: 'this is good sample'}
];

const angularFirestoreStub = {
    doc: jasmine.createSpy('doc').and
        .returnValue(
        {
            valueChanges: jasmine.createSpy('valueChanges').and
                .returnValue(from(testData))
        })
};

describe('BlogDetailComponent', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                BlogDetailComponent,
                FooterComponent,
                SideBarComponent
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
                { provide: AngularFirestore, useValue: angularFirestoreStub }
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

    it("should render 'Blog' in an a", async(() => {
        const fixture = TestBed.createComponent(BlogDetailComponent);
        const compiled = fixture.debugElement.nativeElement;
        fixture.detectChanges();
        expect(compiled.querySelector('a').textContent)
            .toContain('Blog');
    }));

});
