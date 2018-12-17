
import { from } from 'rxjs';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { PageDetailComponent } from './page-detail.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { TransferState } from '@angular/platform-browser';

import { AlertService, SeoService } from '../../services';
import { PageModel } from '../../models';
import { FooterComponent } from '../footer/footer.component';
import { SideBarComponent } from '../side-bar/side-bar.component';

import { ActivatedRoute, ActivatedRouteStub } from '../../testing/activated-route-stub';

const testData: any = [[
    {payload: {doc: {id: 'first-page', data(): PageModel {
                    return { orderNo: -1,
                        id: 'first-page',
                        title: 'First Page',
                        content: 'this is good sample',
                        created: { seconds: 1544207668 }};
                }}}}
]];

const angularFirestoreStub = {
    doc: jasmine.createSpy('doc').and
        .returnValue(
        {
            valueChanges: jasmine.createSpy('valueChanges').and
                .returnValue(from([testData[0][0].payload.doc.data()]))
        }),
    collection(path: string, queryFn?: any): any {
        return {
            snapshotChanges(): any {
                return from(testData);
            },
            valueChanges(): any {
                return from([testData[0][0].payload.doc.data()]);
            }
        };
    }
};

const activatedRouteStub = new ActivatedRouteStub();

describe('PageDetailComponent', () => {
    let fixture: ComponentFixture<PageDetailComponent>;
    let comp: PageDetailComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                PageDetailComponent,
                FooterComponent,
                SideBarComponent
            ],
            providers: [
                AlertService, SeoService, TransferState,
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: AngularFirestore, useValue: angularFirestoreStub }
            ],
            imports: [
                RouterTestingModule.withRoutes([
                    {path: 'page/:id', component: PageDetailComponent},
                    {path: 'pages/:pageNo', component: PageDetailComponent},
                    {path: 'en/page/:id', component: PageDetailComponent},
                    {path: 'tr/page/:id', component: PageDetailComponent},
                    {path: 'en/page', component: PageDetailComponent},
                    {path: 'tr/page', component: PageDetailComponent}
                    ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(PageDetailComponent);
                comp = fixture.componentInstance;
                fixture.detectChanges();
            });
    }));

    it('should create the app', async(() => {
        expect(comp)
            .toBeTruthy();
    }));

    it('should load first-page', async(() => {
        activatedRouteStub.setParamMap({ id: 'first-page' });
        fixture.detectChanges();
        let lastPage = new PageModel();
        comp.page$.subscribe(page => {
            lastPage = page;
        }, undefined, () => {
            expect(lastPage.id)
                .toEqual('first-page');
        });
    }));

    it('should redirection to translation of page', fakeAsync(() => {
        activatedRouteStub.setParamMap({ id: 'first-page' });
        fixture.detectChanges();
        comp.checkTranslation(undefined);
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/tr/page/first-page');
        fixture.detectChanges();
    }));

    it("should redirection to '/page/first-page' if id is -1", fakeAsync(() => {
        fixture.detectChanges();
        activatedRouteStub.setParamMap({ id: '-1' });
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/page/first-page');
        fixture.detectChanges();
    }));

});
