import { PLATFORM_ID } from '@angular/core';
import { async, ComponentFixture, ComponentFixtureAutoDetect, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { TransferState } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Angulartics2GoogleGlobalSiteTag } from 'angulartics2/gst';
import { environment } from '../../../environments/environment';
import { APP_CONFIG, APP_UNIT_TEST_CONFIG } from '../../app-config';
import { NotFoundComponent } from '../../pages/not-found/not-found.component';
import { AlertService, CarouselService, ConfigService, PageService, PaginationService, SeoService } from '../../services';
import { angularFirestoreStub } from '../../testing/angular-firestore-stub.spec';
import { angulartics2GoogleGlobalSiteTagStub } from '../../testing/angulartics-stub.spec';
import { AlertComponent } from '../alert/alert.component';
import { CarouselComponent } from '../carousel/carousel.component';
import { FooterComponent } from '../footer/footer.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { NavMenuComponent } from '../nav-menu/nav-menu.component';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
    let fixture: ComponentFixture<AppComponent>;
    let comp: AppComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                NavMenuComponent,
                AlertComponent,
                LoadingSpinnerComponent,
                FooterComponent,
                NotFoundComponent,
                CarouselComponent
            ],
            providers: [
                AlertService, SeoService, PaginationService, TransferState, CarouselService, PageService, ConfigService,
                {provide: ComponentFixtureAutoDetect, useValue: true},
                {provide: AngularFirestore, useValue: angularFirestoreStub},
                {provide: Angulartics2GoogleGlobalSiteTag, useValue: angulartics2GoogleGlobalSiteTagStub},
                {provide: APP_CONFIG, useValue: APP_UNIT_TEST_CONFIG}
            ],
            imports: [
                RouterTestingModule.withRoutes([
                    {path: '', component: AppComponent},
                    {path: 'unit-test', component: NavMenuComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(AppComponent);
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

    it('should render "Super Murat" in a nav.a', async(() => {
        expect(fixture.nativeElement.querySelector('nav a').textContent)
            .toContain('Super Murat');
    }));

    it('should load main menu items', fakeAsync(() => {
        // tslint:disable-next-line:no-life-cycle-call
        comp.ngOnInit();
        tick();
        fixture.detectChanges();
        expect(comp)
            .toBeTruthy();
        expect(fixture.nativeElement.querySelector('.navbar-nav .nav-link span').textContent)
            .toContain('Home');
    }));

});

describe('AppComponentSeoService', () => {
    let fixture: ComponentFixture<AppComponent>;
    let comp: AppComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                NavMenuComponent,
                AlertComponent,
                LoadingSpinnerComponent,
                FooterComponent,
                NotFoundComponent,
                CarouselComponent
            ],
            providers: [
                AlertService, SeoService, PaginationService, TransferState, CarouselService, PageService, ConfigService,
                {provide: ComponentFixtureAutoDetect, useValue: true},
                {provide: AngularFirestore, useValue: angularFirestoreStub},
                {provide: Angulartics2GoogleGlobalSiteTag, useValue: angulartics2GoogleGlobalSiteTagStub},
                {provide: APP_CONFIG, useValue: APP_UNIT_TEST_CONFIG}
            ],
            imports: [
                RouterTestingModule.withRoutes([
                    {path: '', component: AppComponent},
                    {path: 'unit-test', component: NavMenuComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(AppComponent);
                comp = fixture.componentInstance;
                fixture.detectChanges();
            })
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
    }));

    it("should set title as 'My Unit Test Title'", async(() => {
        comp.seo.setHtmlTags({
            title: 'My Unit Test Title'
        });
        fixture.detectChanges();
        expect(comp.seo.getTitle())
            .toContain('My Unit Test Title');
    }));

    it("should set meta og:type as 'article'", async(() => {
        comp.seo.setHtmlTags({
            title: 'My Unit Test Title',
            seo: {
                properties: {
                    'og:type': 'article'
                }
            }
        });
        fixture.detectChanges();
        expect(comp.seo.getMeta()
            .getTag('property="og:type"').content)
            .toContain('article');
    }));

    it("should set meta og:title as 'My Unit Test Title'", async(() => {
        comp.seo.setHtmlTags({
            title: 'My Unit Test Title',
            locales: [{cultureCode: 'tr-TR', slug: '/tr/unit-test'}],
            seo: {
                properties: {
                    'og:title': 'My Unit Test Title',
                    'og:type': 'article',
                    'og:site_name': 'Unit Test Site'
                }
            },
            image: {src: '/favicon.ico'}
        });
        fixture.detectChanges();
        expect(comp.seo.getMeta()
            .getTag('property="og:title"').content)
            .toContain('My Unit Test Title');
    }));

    it("should set meta twitter:card as 'summary'", async(() => {
        comp.seo.setHtmlTags({
            title: 'My Unit Test Title',
            seo: {
                names: {
                    'twitter:card': 'summary'
                }
            }
        });
        fixture.detectChanges();
        expect(comp.seo.getMeta()
            .getTag('name="twitter:card"').content)
            .toContain('summary');
    }));

    it("should set meta twitter:title as 'My Unit Test Title'", async(() => {
        comp.seo.setHtmlTags({
            title: 'My Unit Test Title',
            seo: {
                names: {
                    'twitter:title': 'My Unit Test Title',
                    'twitter:card': 'summary',
                    'twitter:site': '@UnitTest',
                    'twitter:creator': '@UnitTest'
                }
            },
            image: {src: '/favicon.ico'}
        });
        fixture.detectChanges();
        expect(comp.seo.getMeta()
            .getTag('name="twitter:title"').content)
            .toContain('My Unit Test Title');
    }));

    it("should set meta robots as 'index,follow'", async(() => {
        comp.seo.setHtmlTags({
            locales: [{cultureCode: 'tr-TR', slug: '/tr/unit-test'}],
            seo: {
                names: {
                    robots: 'index, follow',
                    author: 'unit-test',
                    owner: 'unit-test',
                    copyright: 'Unit Test 2018'
                },
                properties: {
                    'fb:app_id': '123456',
                    'fb:admins': '000001'
                }
            }
        });
        fixture.detectChanges();
        expect(comp.seo.getMeta()
            .getTag('name="robots"').content)
            .toContain('index, follow');
    }));

    it("should set meta robots as 'index,follow' and remove them next meta tag set even if new data is empty", async(() => {
        comp.seo.setHtmlTags({
            locales: [{cultureCode: 'tr-TR', slug: '/tr/unit-test'}],
            seo: {
                names: {
                    robots: 'index, follow',
                    author: 'unit-test',
                    owner: 'unit-test',
                    copyright: 'Unit Test 2018'
                },
                properties: {
                    'fb:app_id': '123456',
                    'fb:admins': '000001'
                }
            }
        });
        fixture.detectChanges();
        expect(comp.seo.getMeta()
            .getTag('name="robots"').content)
            .toContain('index, follow');
        comp.seo.setHtmlTags({});
        fixture.detectChanges();
        expect(comp.seo.getMeta()
            .getTag('name="robots"'))
            .toBeNull();
    }));

    it('should work properly with different defaultData on environment', async(() => {
        const currentDefaultData = {...environment.defaultData};
        environment.defaultData = {
            defaultTitle: 'My Unit Test Title',
            defaultDescription: 'My Unit Test Description',
            'twitter:site': '@UnitTest',
            'twitter:creator': '@UnitTest',
            'fb:app_id': '123456',
            'fb:admins': '000001'
        };
        comp.seo.setHtmlTags({
            seo: {}
        });
        fixture.detectChanges();
        expect(comp.seo.getMeta()
            .getTag('name="twitter:site"').content)
            .toContain('@UnitTest');
        environment.defaultData = currentDefaultData;
    }));

});

describe('AppComponentAlertService', () => {
    let fixture: ComponentFixture<AppComponent>;
    let comp: AppComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                NavMenuComponent,
                AlertComponent,
                LoadingSpinnerComponent,
                FooterComponent,
                NotFoundComponent,
                CarouselComponent
            ],
            providers: [
                AlertService, SeoService, PaginationService, TransferState, CarouselService, PageService, ConfigService,
                {provide: ComponentFixtureAutoDetect, useValue: true},
                {provide: AngularFirestore, useValue: angularFirestoreStub},
                {provide: Angulartics2GoogleGlobalSiteTag, useValue: angulartics2GoogleGlobalSiteTagStub},
                {provide: APP_CONFIG, useValue: APP_UNIT_TEST_CONFIG}
            ],
            imports: [
                RouterTestingModule.withRoutes([
                    {path: '', component: AppComponent},
                    {path: 'unit-test', component: NavMenuComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(AppComponent);
                comp = fixture.componentInstance;
                fixture.detectChanges();
            })
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
    }));

    it("should add 'My success message' to alert.service and get 'My success message' from alert.service", async(() => {
        comp.alert.getMessage()
            .subscribe(message => {
                expect(message.text)
                    .toContain('My success message');
            });
        comp.alert.success('My success message', true);
        fixture.detectChanges();
    }));

    it("should render 'My success message' in alert component", async(() => {
        comp.alert.success('My success message', false);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('app-alert .alert-success').textContent)
            .toContain('My success message');
    }));

    it("should render 'My success message' in alert component and should be cleared after redirect", fakeAsync(() => {
        comp.router.initialNavigation();
        comp.alert.success('My success message', false);
        fixture.detectChanges();
        comp.router.navigate(['unit-test'])
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(fixture.nativeElement.querySelector('app-alert .alert-success'))
            .toBeNull();
    }));

    it("should render 'My success message' in alert component and should not be cleared after redirect", fakeAsync(() => {
        comp.router.initialNavigation();
        comp.alert.success('My success message', true);
        fixture.detectChanges();
        comp.router.navigate(['unit-test'])
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(fixture.nativeElement.querySelector('app-alert .alert-success').textContent)
            .toBe('My success message');
    }));

    it("should add 'My error message' to alert.service and get 'My error message' from alert.service", async(() => {
        comp.alert.getMessage()
            .subscribe(message => {
                expect(message.text)
                    .toContain('My error message');
            });
        comp.alert.error('My error message', true);
        fixture.detectChanges();
    }));

    it("should render 'My error message' in alert component", async(() => {
        comp.alert.error('My error message', false);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('app-alert .alert-danger').textContent)
            .toContain('My error message');
    }));

    it("should render 'My error message' in alert component and should be cleared after redirect", fakeAsync(() => {
        comp.router.initialNavigation();
        comp.alert.error('My error message', false);
        fixture.detectChanges();
        comp.router.navigate(['unit-test'])
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(fixture.nativeElement.querySelector('app-alert .alert-danger'))
            .toBeNull();
    }));

    it("should render 'My error message' in alert component and should not be cleared after redirect", fakeAsync(() => {
        comp.router.initialNavigation();
        comp.alert.error('My error message', true);
        fixture.detectChanges();
        comp.router.navigate(['unit-test'])
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(fixture.nativeElement.querySelector('app-alert .alert-danger').textContent)
            .toBe('My error message');
    }));

});

describe('AppComponentServer', () => {
    let fixture: ComponentFixture<AppComponent>;
    let comp: AppComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                NavMenuComponent,
                AlertComponent,
                LoadingSpinnerComponent,
                FooterComponent,
                NotFoundComponent,
                CarouselComponent
            ],
            providers: [
                AlertService, SeoService, PaginationService, TransferState, CarouselService, PageService, ConfigService,
                {provide: ComponentFixtureAutoDetect, useValue: true},
                {provide: AngularFirestore, useValue: angularFirestoreStub},
                {provide: Angulartics2GoogleGlobalSiteTag, useValue: angulartics2GoogleGlobalSiteTagStub},
                {provide: APP_CONFIG, useValue: APP_UNIT_TEST_CONFIG},
                {provide: PLATFORM_ID, useValue: 'server'}
            ],
            imports: [
                RouterTestingModule.withRoutes([
                    {path: '', component: AppComponent},
                    {path: 'unit-test', component: NavMenuComponent},
                    {path: 'http-404', component: NotFoundComponent},
                    {path: '**', component: NotFoundComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(AppComponent);
                comp = fixture.componentInstance;
                fixture.detectChanges();
            })
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
    }));

    it('should contain page not found key if redirected to http-404', fakeAsync(() => {
        comp.seo.http404();
        tick();
        fixture.detectChanges();
        // tslint:disable:max-line-length
        const element = fixture.nativeElement.querySelector('div#do-not-remove-me-this-is-for-only-get-404-error-on-ssr-with-unique-and-hidden-key');
        expect(element.tagName)
            .toBe('DIV');
        expect(element.id)
            .toBe('do-not-remove-me-this-is-for-only-get-404-error-on-ssr-with-unique-and-hidden-key');
    }));

    it('should contain html redirection key and url if redirected to http-301', fakeAsync(() => {
        comp.seo.http301('/go-to-next-page');
        tick();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('div#only-for-http-status').textContent)
            .toBe('--http-redirect-301--/go-to-next-page--end-of-http-redirect-301--');
    }));

});
