import { LOCALE_ID } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { TransferState } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_CONFIG, APP_UNIT_TEST_CONFIG } from '../../app-config';
import { AlertComponent } from '../../components/alert/alert.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { ArticleModel } from '../../models';
import { AlertService, CarouselService, ConfigService, PageService, SeoService } from '../../services';
import { ActivatedRoute, ActivatedRouteStub, angularFirestoreStub } from '../../testing/index.spec';
import { ActiveTagsComponent } from '../../widgets/active-tags/active-tags.component';
import { CustomHtmlComponent } from '../../widgets/custom-html/custom-html.component';
import { LastJokesComponent } from '../../widgets/last-jokes/last-jokes.component';
import { SearchBarComponent } from '../../widgets/search-bar/search-bar.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { ArticleDetailComponent } from './article-detail.component';

const activatedRouteStub = new ActivatedRouteStub();

describe('ArticleDetailComponent', () => {
    let fixture: ComponentFixture<ArticleDetailComponent>;
    let comp: ArticleDetailComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ArticleDetailComponent,
                FooterComponent,
                SideBarComponent,
                AlertComponent,
                NotFoundComponent,
                ActiveTagsComponent,
                LastJokesComponent,
                SearchBarComponent,
                CustomHtmlComponent
            ],
            providers: [
                AlertService, SeoService, TransferState, CarouselService, PageService, ConfigService,
                {provide: ActivatedRoute, useValue: activatedRouteStub},
                {provide: AngularFirestore, useValue: angularFirestoreStub},
                {provide: APP_CONFIG, useValue: APP_UNIT_TEST_CONFIG}
            ],
            imports: [
                FormsModule,
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
        activatedRouteStub.setParamMap({id: 'first-article'});
        fixture.detectChanges();
        let lastArticle = new ArticleModel();
        comp.article$.subscribe(article => {
            lastArticle = article;
        });
        tick();
        expect(lastArticle.id)
            .toEqual('first-article');
    }));

    it("should redirect to '/article/first-article' if id is -1", fakeAsync(() => {
        activatedRouteStub.setParamMap({id: '-1'});
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/article/first-article');
    }));

    it("should redirect to '/article/fifth-article' if id is -6", fakeAsync(() => {
        const sNavEvent = activatedRouteStub.initNavigation(fixture, comp.router, 'articles', 'article');
        activatedRouteStub.setParamMap({id: '-6'});
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        sNavEvent.unsubscribe();
        expect(comp.router.url)
            .toEqual('/article/fifth-article');
    }));

    it('should redirect to translation of ilk-makale', fakeAsync(() => {
        const sNavEvent = activatedRouteStub.initNavigation(fixture, comp.router, 'articles', 'article');
        activatedRouteStub.navigate(fixture, comp.router, ['/article', 'ilk-makale']);
        fixture.detectChanges();
        tick();
        sNavEvent.unsubscribe();
        expect(comp.router.url)
            .toEqual('/en/article/first-article');
    }));

    it('should redirect to http-404 for not-found-page', fakeAsync(() => {
        const sNavEvent = activatedRouteStub.initNavigation(fixture, comp.router, 'articles', 'article');
        activatedRouteStub.navigate(fixture, comp.router, ['/article', 'not-found-page']);
        fixture.detectChanges();
        tick();
        sNavEvent.unsubscribe();
        expect(comp.router.url)
            .toEqual('/article/not-found-page/http-404');
    }));

    it('should redirect to translation of sadece-turkce-makale', fakeAsync(() => {
        const sNavEvent = activatedRouteStub.initNavigation(fixture, comp.router, 'articles', 'article');
        activatedRouteStub.navigate(fixture, comp.router, ['/article', 'sadece-turkce-makale']);
        fixture.detectChanges();
        tick();
        sNavEvent.unsubscribe();
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
                ArticleDetailComponent,
                FooterComponent,
                SideBarComponent,
                AlertComponent,
                NotFoundComponent,
                ActiveTagsComponent,
                LastJokesComponent,
                SearchBarComponent,
                CustomHtmlComponent
            ],
            providers: [
                AlertService, SeoService, TransferState, CarouselService, PageService, ConfigService,
                {provide: ActivatedRoute, useValue: activatedRouteStub},
                {provide: AngularFirestore, useValue: angularFirestoreStub},
                {provide: APP_CONFIG, useValue: APP_UNIT_TEST_CONFIG},
                {provide: LOCALE_ID, useValue: 'tr-TR'}
            ],
            imports: [
                FormsModule,
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
        const sNavEvent = activatedRouteStub.initNavigation(fixture, comp.router, 'makaleler', 'makale');
        activatedRouteStub.navigate(fixture, comp.router, ['/makale', 'first-article']);
        fixture.detectChanges();
        tick();
        sNavEvent.unsubscribe();
        expect(comp.router.url)
            .toEqual('/tr/makale/ilk-makale');
    }));

});
