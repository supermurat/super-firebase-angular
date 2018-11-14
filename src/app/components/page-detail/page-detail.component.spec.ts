
import { from } from 'rxjs';
import { async, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { PageDetailComponent } from './page-detail.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { TransferState } from '@angular/platform-browser';

import { AlertService, SeoService } from '../../services';
import { ActivatedRoute, Data } from '@angular/router';
import { PageModel } from '../../models';
import { FooterComponent } from '../footer/footer.component';
import { SideBarComponent } from '../side-bar/side-bar.component';

const testData: Array<PageModel> = [
    { id: 'first-page', title: 'First Page', content: 'this is good sample'}
];

const angularFirestoreStub = {
    doc: jasmine.createSpy('doc').and
        .returnValue(
        {
            valueChanges: jasmine.createSpy('valueChanges').and
                .returnValue(from(testData))
        })
};

describe('PageDetailComponent', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                PageDetailComponent,
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
                RouterTestingModule.withRoutes([{path: 'page/:name', component: PageDetailComponent}])
            ]
        })
            .compileComponents();
    }));

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(PageDetailComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app)
            .toBeTruthy();
    }));

    it("should render 'Page' in an a", async(() => {
        const fixture = TestBed.createComponent(PageDetailComponent);
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('a').textContent)
            .toContain('Page');
    }));

});
