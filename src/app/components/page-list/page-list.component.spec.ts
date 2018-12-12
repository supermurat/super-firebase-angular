
import { BehaviorSubject, from } from 'rxjs';
import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { PageListComponent } from './page-list.component';
import { AngularFirestore } from '@angular/fire/firestore';

import { AlertService, PagerService, SeoService } from '../../services';
import { PageModel } from '../../models';
import { FooterComponent } from '../footer/footer.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { PagerComponent } from '../pager/pager.component';
import { ActivatedRoute } from '@angular/router';
import { forEach } from '@angular/router/src/utils/collection';

const testDataPL: any = [[
    {payload: {doc: {id: 'first-page', data(): PageModel {
        return { orderNo: -2,
            id: 'first-page',
            title: 'First Page',
            content: 'this is good sample',
            created: { seconds: 1544207668 }};
    }}}},
    {payload: {doc: {id: 'second-page', data(): PageModel {
        return { orderNo: -1,
            id: 'second-page',
            title: 'Second Page',
            content: 'this is better sample',
            created: { seconds: 1544207669 },
            contentSummary: 'this is better'};
    }}}}
]];

const angularFirestoreStub = {
    collection(path: string, queryFn?: any): any {
        queryFn({orderBy(fieldPath): any {
            return {
                limit(size): any { return {fieldPath}; },
                startAt(sat): any { return {limit(size): any { return {fieldPath}; }}; }
            };
        }});

        return {
            snapshotChanges(): any {
                return from(testDataPL);
            },
            valueChanges(): any {
                const retVal = [];
                testDataPL[0].forEach(element => {
                    retVal.push(element.payload.doc.data());
                });

                return from([retVal]);
            }
        };
    }
};

const activatedRouteStub = {
    params: new BehaviorSubject<any>({ pageNo: 1 })
};

describe('PageListComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                PageListComponent,
                FooterComponent,
                SideBarComponent,
                PagerComponent
            ],
            providers: [
                AlertService, SeoService, PagerService,
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: AngularFirestore, useValue: angularFirestoreStub }
            ],
            imports: [
                RouterTestingModule.withRoutes([
                    {path: 'pages', component: PageListComponent},
                    {path: 'pages/:pageNo', component: PageListComponent}
                    ])
            ]
        })
            .compileComponents();
    }));

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(PageListComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app)
            .toBeTruthy();
    }));

    it("should have as title 'This is temporary page list'", async(() => {
        const fixture = TestBed.createComponent(PageListComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title)
            .toEqual('This is temporary page list');
    }));

    it('count of page should be 2', async(() => {
        const fixture = TestBed.createComponent(PageListComponent);
        const app = fixture.debugElement.componentInstance;
        fixture.detectChanges();
        app.pages$.subscribe(result => {
            expect(result.length)
                .toEqual(2);
        });
        fixture.detectChanges();
    }));

    it('should redirection to page 1 if page is not exist', fakeAsync(() => {
        const fixture = TestBed.createComponent(PageListComponent);
        const app = fixture.debugElement.componentInstance;
        fixture.detectChanges();
        // app.router.navigate([ '/pages', 9]);
        app.route.params.next({ pageNo: 9 }); // page 9 not exist
        tick();
        fixture.detectChanges();
        expect(app.router.url)
            .toEqual('/pages/1');
        fixture.detectChanges();
    }));

    it('trackByPage(2) should return 2', async(() => {
        const fixture = TestBed.createComponent(PageListComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.trackByPage(2, {}))
            .toBe(2);
    }));

    it('count of page should be 5', fakeAsync(() => {
        const fixture = TestBed.createComponent(PageListComponent);
        const app = fixture.debugElement.componentInstance;
        testDataPL[0].unshift({payload: {doc: {id: 'fifth-page', data(): PageModel {
                            return { orderNo: -5,
                                id: 'fifth-page',
                                title: 'Fifth Page',
                                content: 'this is better sample 5',
                                created: { seconds: 1544207665 }};
                        }}}},
            {payload: {doc: {id: 'fourth-page', data(): PageModel {
                            return { orderNo: -4,
                                id: 'fourth-page',
                                title: 'Fourth Page',
                                content: 'this is better sample 4',
                                created: { seconds: 1544207666 },
                                contentSummary: 'this is better'};
                        }}}},
            {payload: {doc: {id: 'third-page', data(): PageModel {
                            return { orderNo: -3,
                                id: 'third-page',
                                title: 'Third Page',
                                content: 'this is better sample 3',
                                created: { seconds: 1544207667 },
                                contentSummary: 'this is better'};
                        }}}});
        fixture.detectChanges();
        app.route.params.next({ pageNo: 1 });
        tick();
        fixture.detectChanges();
        app.pages$.subscribe(result => {
            expect(result.length)
                .toEqual(5);
            testDataPL[0].splice(0, 3);
        });
        fixture.detectChanges();
        tick();
    }));

});
