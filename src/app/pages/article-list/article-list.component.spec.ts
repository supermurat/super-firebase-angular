import { LOCALE_ID } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { TransferState } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_CONFIG, APP_UNIT_TEST_CONFIG } from '../../app-config';
import { AlertComponent } from '../../components/alert/alert.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { PagerComponent } from '../../components/pager/pager.component';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { AlertService, CarouselService, ConfigService, PagerService, PageService, SeoService } from '../../services';
import { ActivatedRoute, ActivatedRouteStub, angularFirestoreStub, angularFirestoreStubNoData } from '../../testing/index.spec';
import { ActiveTagsComponent } from '../../widgets/active-tags/active-tags.component';
import { CustomHtmlComponent } from '../../widgets/custom-html/custom-html.component';
import { LastJokesComponent } from '../../widgets/last-jokes/last-jokes.component';
import { SearchBarComponent } from '../../widgets/search-bar/search-bar.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { ArticleListComponent } from './article-list.component';

const activatedRouteStub = new ActivatedRouteStub();

describe('ArticleListComponent', () => {
    let fixture: ComponentFixture<ArticleListComponent>;
    let comp: ArticleListComponent;

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                ArticleListComponent,
                FooterComponent,
                SideBarComponent,
                PagerComponent,
                AlertComponent,
                ActiveTagsComponent,
                LastJokesComponent,
                SearchBarComponent,
                NotFoundComponent,
                CustomHtmlComponent
            ],
            providers: [
                AlertService, SeoService, PagerService, TransferState, CarouselService, PageService, ConfigService,
                {provide: ActivatedRoute, useValue: activatedRouteStub},
                {provide: AngularFirestore, useValue: angularFirestoreStub},
                {provide: APP_CONFIG, useValue: APP_UNIT_TEST_CONFIG}
            ],
            imports: [
                FormsModule,
                RouterTestingModule.withRoutes([
                    {path: '', redirectTo: 'articles/1', pathMatch: 'full'},
                    {path: 'articles', redirectTo: 'articles/1', pathMatch: 'full'},
                    {path: 'articles/:pageNo', component: ArticleListComponent},
                    {path: 'http-404', component: NotFoundComponent},
                    {path: '**', component: NotFoundComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(ArticleListComponent);
                comp = fixture.componentInstance;
                comp.router.initialNavigation();
                tick();
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

    it('count of record should be 3', async(() => {
        activatedRouteStub.setParamMap({pageNo: 1});
        comp.articles$.subscribe(result => {
            expect(result.length)
                .toEqual(3);
        });
        fixture.detectChanges();
    }));

    it('should redirect to page 2 if page is not exist', fakeAsync(() => {
        activatedRouteStub.setParamMap({pageNo: 9}); // page 9 not exist
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/articles/2');
        fixture.detectChanges();
    }));

    it('should redirect to page 1 if pageNo is lower than 0', fakeAsync(() => {
        activatedRouteStub.setParamMap({pageNo: -2});
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/articles/1');
        fixture.detectChanges();
    }));

    it('should redirect to page 1 if pageNo is not Number', fakeAsync(() => {
        activatedRouteStub.setParamMap({pageNo: 'not-number'});
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/articles/1');
        fixture.detectChanges();
    }));

    it('count of records should be 2 on page 2', fakeAsync(() => {
        activatedRouteStub.setParamMap({pageNo: 2});
        tick();
        fixture.detectChanges();
        comp.articles$.subscribe(result => {
            expect(result.length)
                .toEqual(2);
        });
        fixture.detectChanges();
        tick();
    }));

    it('pagerService should work properly even if we set "pagerModel.pagePath" manually', fakeAsync(() => {
        comp.pagerModel.pagePath = '/articles';
        activatedRouteStub.setParamMap({pageNo: 9}); // page 9 not exist
        comp.checkPageNo();
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/articles/2');
        fixture.detectChanges();
    }));

});

describe('ArticleListComponentNoData', () => {
    let fixture: ComponentFixture<ArticleListComponent>;
    let comp: ArticleListComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ArticleListComponent,
                FooterComponent,
                SideBarComponent,
                PagerComponent,
                AlertComponent,
                ActiveTagsComponent,
                LastJokesComponent,
                SearchBarComponent,
                NotFoundComponent,
                CustomHtmlComponent
            ],
            providers: [
                AlertService, SeoService, PagerService, TransferState, CarouselService, PageService, ConfigService,
                {provide: ActivatedRoute, useValue: activatedRouteStub},
                {provide: AngularFirestore, useValue: angularFirestoreStubNoData},
                {provide: APP_CONFIG, useValue: APP_UNIT_TEST_CONFIG}
            ],
            imports: [
                FormsModule,
                RouterTestingModule.withRoutes([
                    {path: '', redirectTo: 'articles/1', pathMatch: 'full'},
                    {path: 'articles', redirectTo: 'articles/1', pathMatch: 'full'},
                    {path: 'articles/:pageNo', component: ArticleListComponent},
                    {path: 'http-404', component: NotFoundComponent},
                    {path: '**', component: NotFoundComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(ArticleListComponent);
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

});

describe('ArticleListComponent_tr-TR', () => {
    let fixture: ComponentFixture<ArticleListComponent>;
    let comp: ArticleListComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ArticleListComponent,
                FooterComponent,
                SideBarComponent,
                PagerComponent,
                AlertComponent,
                ActiveTagsComponent,
                LastJokesComponent,
                SearchBarComponent,
                NotFoundComponent,
                CustomHtmlComponent
            ],
            providers: [
                AlertService, SeoService, PagerService, TransferState, CarouselService, PageService, ConfigService,
                {provide: ActivatedRoute, useValue: activatedRouteStub},
                {provide: AngularFirestore, useValue: angularFirestoreStub},
                {provide: APP_CONFIG, useValue: APP_UNIT_TEST_CONFIG},
                {provide: LOCALE_ID, useValue: 'tr-TR'}
            ],
            imports: [
                FormsModule,
                RouterTestingModule.withRoutes([
                    {path: '', redirectTo: 'articles/1', pathMatch: 'full'},
                    {path: 'articles', redirectTo: 'articles/1', pathMatch: 'full'},
                    {path: 'articles/:pageNo', component: ArticleListComponent},
                    {path: 'makaleler', redirectTo: 'makaleler/1', pathMatch: 'full'},
                    {path: 'makaleler/:pageNo', component: ArticleListComponent},
                    {path: 'http-404', component: NotFoundComponent},
                    {path: '**', component: NotFoundComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(ArticleListComponent);
                comp = fixture.componentInstance;
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

    it('should redirect to translation of articles', fakeAsync(() => {
        activatedRouteStub.navigate(fixture, comp.router, ['/articles']);
        comp.router.initialNavigation();
        tick();
        fixture.detectChanges();
        tick();
        expect(comp.router.url)
            .toEqual('/tr/makaleler');
    }));

});
