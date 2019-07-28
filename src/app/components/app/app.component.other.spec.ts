import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Angulartics2GoogleGlobalSiteTag } from 'angulartics2/gst';
import { environment } from '../../../environments/environment';
import { angulartics2GoogleGlobalSiteTagStub } from '../../testing/angulartics-stub.spec';
import { activatedRouteStub, TestHelperModule } from '../../testing/test.helper.module.spec';
import { CarouselComponent } from '../carousel/carousel.component';
import { NavMenuComponent } from '../nav-menu/nav-menu.component';
import { AppComponent } from './app.component';

describe('AppComponentSeoService', () => {
    let fixture: ComponentFixture<AppComponent>;
    let comp: AppComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                NavMenuComponent,
                CarouselComponent
            ],
            providers: [
                {provide: Angulartics2GoogleGlobalSiteTag, useValue: angulartics2GoogleGlobalSiteTagStub}
            ],
            imports: [
                TestHelperModule,
                RouterTestingModule.withRoutes([
                    {path: '', component: AppComponent},
                    {path: 'unit-test', component: AppComponent}
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
        comp.seo.setSEOData({
            title: 'My Unit Test Title'
        });
        fixture.detectChanges();
        expect(comp.seo.getTitle())
            .toContain('My Unit Test Title');
    }));

    it("should set meta og:type as 'article'", async(() => {
        comp.seo.setSEOData({
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
        comp.seo.setSEOData({
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
        comp.seo.setSEOData({
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
        comp.seo.setSEOData({
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
        comp.seo.setSEOData({
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
        comp.seo.setSEOData({
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
        comp.seo.setSEOData({});
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
        comp.seo.setSEOData({
            seo: {}
        });
        fixture.detectChanges();
        expect(comp.seo.getMeta()
            .getTag('name="twitter:site"').content)
            .toContain('@UnitTest');
        environment.defaultData = currentDefaultData;
    }));

    it('should insert JsonLD data to body', async(() => {
        comp.seo.setSEOData({
            jsonLDs: [{
                '@context': 'http://schema.org/',
                '@type': 'Person',
                jobTitle: 'Software Developer',
                name: 'Murat Demir',
                url: 'https://supermurat.com'
            }]
        });
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('script[type="application/ld+json"]').textContent)
            .toContain('Software Developer');
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
                CarouselComponent
            ],
            providers: [
                {provide: Angulartics2GoogleGlobalSiteTag, useValue: angulartics2GoogleGlobalSiteTagStub}
            ],
            imports: [
                TestHelperModule,
                RouterTestingModule.withRoutes([
                    {path: '', component: AppComponent},
                    {path: 'unit-test', component: AppComponent}
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
        activatedRouteStub.navigate(fixture, comp.router, ['unit-test']);
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
        activatedRouteStub.navigate(fixture, comp.router, ['unit-test']);
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
        activatedRouteStub.navigate(fixture, comp.router, ['unit-test']);
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
        activatedRouteStub.navigate(fixture, comp.router, ['unit-test']);
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(fixture.nativeElement.querySelector('app-alert .alert-danger').textContent)
            .toBe('My error message');
    }));

});
