import { async, ComponentFixture, ComponentFixtureAutoDetect, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService, PaginationService, SeoService } from '../../services';
import { AlertComponent } from '../alert/alert.component';
import { FooterComponent } from '../footer/footer.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { NavMenuComponent } from '../nav-menu/nav-menu.component';
import { NotFoundComponent } from '../not-found/not-found.component';
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
                NotFoundComponent
            ],
            providers: [
                AlertService, SeoService, PaginationService,
                {provide: ComponentFixtureAutoDetect, useValue: true},
                {provide: AngularFirestore, useValue: {}}
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

    it('should render Navbar in a nav.a', async(() => {
        expect(fixture.nativeElement.querySelector('nav a').textContent)
            .toContain('Navbar');
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
                NotFoundComponent
            ],
            providers: [
                AlertService, SeoService, PaginationService,
                {provide: ComponentFixtureAutoDetect, useValue: true},
                {provide: AngularFirestore, useValue: {}}
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
            ogType: 'article'
        });
        fixture.detectChanges();
        expect(comp.seo.getMeta()
            .getTag('property="og:type"').content)
            .toContain('article');
    }));

    it("should set meta og:title as 'My Unit Test Title'", async(() => {
        comp.seo.setHtmlTags({
            title: 'My Unit Test Title',
            ogType: 'article',
            image: '/favicon.ico',
            ogSiteName: 'Unit Test Site',
            langAlternates: [{languageCode: 'tr', cultureCode: 'tr-TR', slug: '/tr/unit-test'}]
        });
        fixture.detectChanges();
        expect(comp.seo.getMeta()
            .getTag('property="og:title"').content)
            .toContain('My Unit Test Title');
    }));

    it("should set meta twitter:card as 'summary'", async(() => {
        comp.seo.setHtmlTags({
            title: 'My Unit Test Title',
            twitterCard: 'summary'
        });
        fixture.detectChanges();
        expect(comp.seo.getMeta()
            .getTag('name="twitter:card"').content)
            .toContain('summary');
    }));

    it("should set meta twitter:title as 'My Unit Test Title'", async(() => {
        comp.seo.setHtmlTags({
            title: 'My Unit Test Title',
            twitterCard: 'summary',
            image: '/favicon.ico',
            twitterSite: '@UnitTest',
            twitterCreator: '@UnitTest'
        });
        fixture.detectChanges();
        expect(comp.seo.getMeta()
            .getTag('name="twitter:title"').content)
            .toContain('My Unit Test Title');
    }));

    it("should set meta robots as 'index,follow'", async(() => {
        comp.seo.setHtmlTags({
            robots: 'index,follow',
            author: 'unit-test',
            owner: 'unit-test',
            copyright: 'Unit Test 2018',
            articleAuthorURL: 'https://unit-test-owner.com',
            articlePublisherURL: 'https://unit-test-publiser.com',
            facebookAppID: '123456',
            facebookAdmins: '000001',
            googlePublisher: 'https://plus.google.com/unit-test',
            langAlternates: [{languageCode: 'tr', cultureCode: 'tr-TR', slug: '/tr/unit-test'}]
        });
        fixture.detectChanges();
        expect(comp.seo.getMeta()
            .getTag('name="robots"').content)
            .toContain('index,follow');
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
                NotFoundComponent
            ],
            providers: [
                AlertService, SeoService, PaginationService,
                {provide: ComponentFixtureAutoDetect, useValue: true},
                {provide: AngularFirestore, useValue: {}}
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
        const injector = fixture.debugElement.injector;
        const router = injector.get(Router);
        router.initialNavigation();
        comp.alert.success('My success message', false);
        fixture.detectChanges();
        router.navigate(['unit-test'])
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
        tick();
        fixture.detectChanges();
        tick();
        expect(fixture.nativeElement.querySelector('app-alert .alert-success'))
            .toBeNull();
    }));

    it("should render 'My success message' in alert component and should not be cleared after redirect", fakeAsync(() => {
        const injector = fixture.debugElement.injector;
        const router = injector.get(Router);
        router.initialNavigation();
        comp.alert.success('My success message', true);
        fixture.detectChanges();
        router.navigate(['unit-test'])
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
        tick();
        fixture.detectChanges();
        tick();
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
        const injector = fixture.debugElement.injector;
        const router = injector.get(Router);
        router.initialNavigation();
        comp.alert.error('My error message', false);
        fixture.detectChanges();
        router.navigate(['unit-test'])
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
        tick();
        fixture.detectChanges();
        tick();
        expect(fixture.nativeElement.querySelector('app-alert .alert-danger'))
            .toBeNull();
    }));

    it("should render 'My error message' in alert component and should not be cleared after redirect", fakeAsync(() => {
        const injector = fixture.debugElement.injector;
        const router = injector.get(Router);
        router.initialNavigation();
        comp.alert.error('My error message', true);
        fixture.detectChanges();
        router.navigate(['unit-test'])
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
        tick();
        fixture.detectChanges();
        tick();
        expect(fixture.nativeElement.querySelector('app-alert .alert-danger').textContent)
            .toBe('My error message');
    }));

});
