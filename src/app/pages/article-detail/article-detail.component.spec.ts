import { LOCALE_ID } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ArticleModel } from '../../models';
import { activatedRouteStub, TestHelperModule } from '../../testing/test.helper.module.spec';
import { NotFoundComponent } from '../not-found/not-found.component';
import { ArticleDetailComponent } from './article-detail.component';

describe('ArticleDetailComponent', () => {
    let fixture: ComponentFixture<ArticleDetailComponent>;
    let comp: ArticleDetailComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ArticleDetailComponent
            ],
            providers: [],
            imports: [
                TestHelperModule,
                RouterTestingModule.withRoutes([
                    {path: 'article/:id', component: ArticleDetailComponent},
                    {path: 'articles', component: ArticleDetailComponent},
                    {path: 'articles/:pageNo', component: ArticleDetailComponent},
                    {path: 'en/article/:id', component: ArticleDetailComponent},
                    {path: 'tr/makale/:id', component: ArticleDetailComponent},
                    {path: 'en/article', component: ArticleDetailComponent},
                    {path: 'tr/makale', component: ArticleDetailComponent},
                    {path: 'http-404', component: NotFoundComponent},
                    {path: '**', component: NotFoundComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(ArticleDetailComponent);
                comp = fixture.componentInstance;
                fixture.detectChanges();
            })
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
    }));

    it('should create the app', async(() => {
        expect(comp)
            .toBeTruthy();
    }));

    it('should load first-article', fakeAsync(() => {
        let lastArticle = new ArticleModel();
        comp.pageService.getPage()
            .subscribe(article => {
                lastArticle = article;
            });
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'articles', 'article',
            ['/article', 'first-article']);
        expect(lastArticle.id)
            .toEqual('first-article');
    }));

    it('should load second-article', fakeAsync(() => {
        let lastArticle = new ArticleModel();
        comp.pageService.getPage()
            .subscribe(article => {
                lastArticle = article;
            });
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'articles', 'article',
            ['/article', 'second-article']);
        expect(lastArticle.id)
            .toEqual('second-article');
    }));

    it("should redirect to '/article/first-article' if id is -1", fakeAsync(() => {
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'articles', 'article',
            ['/article', '-1']);
        expect(comp.router.url)
            .toEqual('/article/first-article');
    }));

    it("should redirect to '/article/fifth-article' if id is -6", fakeAsync(() => {
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'articles', 'article',
            ['/article', '-6']);
        expect(comp.router.url)
            .toEqual('/article/fifth-article');
    }));

    it('should redirect to translation of ilk-makale', fakeAsync(() => {
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'articles', 'article',
            ['/article', 'ilk-makale']);
        expect(comp.router.url)
            .toEqual('/en/article/first-article');
    }));

    it('should redirect to http-404 for not-found-page', fakeAsync(() => {
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'articles', 'article',
            ['/article', 'not-found-page']);
        expect(comp.router.url)
            .toEqual('/article/not-found-page/http-404');
    }));

    it('should redirect to translation of sadece-turkce-makale', fakeAsync(() => {
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'articles', 'article',
            ['/article', 'sadece-turkce-makale']);
        expect(comp.router.url)
            .toEqual('/tr/makale/sadece-turkce-makale');
    }));

});

describe('ArticleDetailComponent_tr-TR', () => {
    let fixture: ComponentFixture<ArticleDetailComponent>;
    let comp: ArticleDetailComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ArticleDetailComponent
            ],
            providers: [
                {provide: LOCALE_ID, useValue: 'tr-TR'}
            ],
            imports: [
                TestHelperModule,
                RouterTestingModule.withRoutes([
                    {path: 'article/:id', component: ArticleDetailComponent},
                    {path: 'articles', component: ArticleDetailComponent},
                    {path: 'articles/:pageNo', component: ArticleDetailComponent},
                    {path: 'makale/:id', component: ArticleDetailComponent},
                    {path: 'makaleler', component: ArticleDetailComponent},
                    {path: 'makaleler/:pageNo', component: ArticleDetailComponent},
                    {path: 'en/article/:id', component: ArticleDetailComponent},
                    {path: 'tr/makale/:id', component: ArticleDetailComponent},
                    {path: 'en/article', component: ArticleDetailComponent},
                    {path: 'tr/makale', component: ArticleDetailComponent},
                    {path: 'http-404', component: NotFoundComponent},
                    {path: '**', component: NotFoundComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(ArticleDetailComponent);
                comp = fixture.componentInstance;
                fixture.detectChanges();
            })
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
    }));

    it('should create the app', async(() => {
        expect(comp)
            .toBeTruthy();
    }));

    it('should redirect to translation of first-article', fakeAsync(() => {
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'makaleler', 'makale',
            ['/makale', 'first-article']);
        expect(comp.router.url)
            .toEqual('/tr/makale/ilk-makale');
    }));

});
