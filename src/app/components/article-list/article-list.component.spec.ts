
import { BehaviorSubject, from } from 'rxjs';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { ArticleListComponent } from './article-list.component';
import { AngularFirestore } from '@angular/fire/firestore';

import { AlertService, PagerService, SeoService } from '../../services';
import { ArticleModel } from '../../models';
import { FooterComponent } from '../footer/footer.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { PagerComponent } from '../pager/pager.component';

import { ActivatedRoute, ActivatedRouteStub } from '../../testing/activated-route-stub';

const testDataPL: any = [[
    {payload: {doc: {id: 'first-article', data(): ArticleModel {
        return { orderNo: -2,
            id: 'first-article',
            title: 'First Article',
            content: 'this is good sample',
            created: { seconds: 1544207668 }};
    }}}},
    {payload: {doc: {id: 'second-article', data(): ArticleModel {
        return { orderNo: -1,
            id: 'second-article',
            title: 'Second Article',
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

const activatedRouteStub = new ActivatedRouteStub();

describe('ArticleListComponent', () => {
    let fixture: ComponentFixture<ArticleListComponent>;
    let comp: ArticleListComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ArticleListComponent,
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
                    {path: 'articles', component: ArticleListComponent},
                    {path: 'articles/:pageNo', component: ArticleListComponent}
                    ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(ArticleListComponent);
                comp = fixture.componentInstance;
                fixture.detectChanges();
            });
    }));

    it('should create the app', async(() => {
        expect(comp)
            .toBeTruthy();
    }));

    it("should have as title 'Articles'", async(() => {
        expect(comp.title)
            .toEqual('My Articles');
    }));

    it('count of page should be 2', async(() => {
        comp.articles$.subscribe(result => {
            expect(result.length)
                .toEqual(2);
        });
        fixture.detectChanges();
    }));

    it('should redirection to page 1 if page is not exist', fakeAsync(() => {
        // app.router.navigate([ '/articles', 9]);
        activatedRouteStub.setParamMap({ pageNo: 9 }); // page 9 not exist
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/articles/1');
        fixture.detectChanges();
    }));

    it('trackByArticle(2) should return 2', async(() => {
        expect(comp.trackByArticle(2, {}))
            .toBe(2);
    }));

    it('count of page should be 5', fakeAsync(() => {
        testDataPL[0].unshift({payload: {doc: {id: 'fifth-article', data(): ArticleModel {
                            return { orderNo: -5,
                                id: 'fifth-article',
                                title: 'Fifth Article',
                                content: 'this is better sample 5',
                                created: { seconds: 1544207665 }};
                        }}}},
            {payload: {doc: {id: 'fourth-article', data(): ArticleModel {
                            return { orderNo: -4,
                                id: 'fourth-article',
                                title: 'Fourth Article',
                                content: 'this is better sample 4',
                                created: { seconds: 1544207666 },
                                contentSummary: 'this is better'};
                        }}}},
            {payload: {doc: {id: 'third-article', data(): ArticleModel {
                            return { orderNo: -3,
                                id: 'third-article',
                                title: 'Third Article',
                                content: 'this is better sample 3',
                                created: { seconds: 1544207667 },
                                contentSummary: 'this is better'};
                        }}}});
        fixture.detectChanges();
        activatedRouteStub.setParamMap({ pageNo: 1 });
        tick();
        fixture.detectChanges();
        comp.articles$.subscribe(result => {
            expect(result.length)
                .toEqual(5);
            testDataPL[0].splice(0, 3);
        });
        fixture.detectChanges();
        tick();
    }));

});
