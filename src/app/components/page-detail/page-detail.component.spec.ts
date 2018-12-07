
import { BehaviorSubject, from } from 'rxjs';
import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { PageDetailComponent } from './page-detail.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { TransferState } from '@angular/platform-browser';

import { AlertService, SeoService } from '../../services';
import { ActivatedRoute, Data } from '@angular/router';
import { PageModel } from '../../models';
import { FooterComponent } from '../footer/footer.component';
import { SideBarComponent } from '../side-bar/side-bar.component';

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

const activatedRouteStub = {
    params: new BehaviorSubject<any>({ id: 'first-page' })
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
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: AngularFirestore, useValue: angularFirestoreStub }
            ],
            imports: [
                RouterTestingModule.withRoutes([
                    {path: 'page/:id', component: PageDetailComponent},
                    {path: 'pages/:pageNo', component: PageDetailComponent}
                    ])
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
        const app = fixture.debugElement.componentInstance;
        fixture.detectChanges();
        let lastPage = new PageModel();
        app.page$.subscribe(page => {
            lastPage = page;
        }, undefined, () => {
            expect(lastPage.id)
                .toEqual('first-page');
        });
    }));

    it("should redirection to '/page/first-page' if id is -1", fakeAsync(() => {
        const fixture = TestBed.createComponent(PageDetailComponent);
        const app = fixture.debugElement.componentInstance;
        fixture.detectChanges();
        app.route.params.next({ id: '-1' });
        tick();
        fixture.detectChanges();
        expect(app.router.url)
            .toEqual('/page/first-page');
        fixture.detectChanges();
    }));

});
