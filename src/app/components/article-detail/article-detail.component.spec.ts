
import { from } from 'rxjs';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { ArticleDetailComponent } from './article-detail.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { TransferState } from '@angular/platform-browser';

import { AlertService, SeoService } from '../../services';
import { ArticleModel } from '../../models';
import { FooterComponent } from '../footer/footer.component';
import { SideBarComponent } from '../side-bar/side-bar.component';

import { ActivatedRoute, ActivatedRouteStub } from '../../testing/activated-route-stub';

const testData: any = [[
    {payload: {doc: {id: 'first-article', data(): ArticleModel {
                    return { orderNo: -1,
                        id: 'first-article',
                        title: 'First Article',
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

describe('ArticleDetailComponent', () => {
    let fixture: ComponentFixture<ArticleDetailComponent>;
    let comp: ArticleDetailComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ArticleDetailComponent,
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
                    {path: 'article/:id', component: ArticleDetailComponent},
                    {path: 'articles/:pageNo', component: ArticleDetailComponent},
                    {path: 'en/article/:id', component: ArticleDetailComponent},
                    {path: 'tr/article/:id', component: ArticleDetailComponent},
                    {path: 'en/article', component: ArticleDetailComponent},
                    {path: 'tr/article', component: ArticleDetailComponent}
                    ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(ArticleDetailComponent);
                comp = fixture.componentInstance;
                fixture.detectChanges();
            });
    }));

    it('should create the app', async(() => {
        expect(comp)
            .toBeTruthy();
    }));

    it('should load first-article', async(() => {
        activatedRouteStub.setParamMap({ id: 'first-article' });
        fixture.detectChanges();
        let lastArticle = new ArticleModel();
        comp.article$.subscribe(article => {
            lastArticle = article;
        }, undefined, () => {
            expect(lastArticle.id)
                .toEqual('first-article');
        });
    }));

    it('should redirection to translation of page', fakeAsync(() => {
        activatedRouteStub.setParamMap({ id: 'first-article' });
        fixture.detectChanges();
        comp.checkTranslation(undefined);
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/tr/article/first-article');
        fixture.detectChanges();
    }));

    it("should redirection to '/article/first-article' if id is -1", fakeAsync(() => {
        fixture.detectChanges();
        activatedRouteStub.setParamMap({ id: '-1' });
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/article/first-article');
        fixture.detectChanges();
    }));

});
