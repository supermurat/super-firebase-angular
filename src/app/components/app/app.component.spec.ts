import { PLATFORM_ID } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Angulartics2GoogleGlobalSiteTag } from 'angulartics2/gst';
import { NotFoundComponent } from '../../pages/not-found/not-found.component';
import { angulartics2GoogleGlobalSiteTagStub } from '../../testing/angulartics-stub.spec';
import { activatedRouteStub, TestHelperModule } from '../../testing/test.helper.module.spec';
import { CarouselComponent } from '../carousel/carousel.component';
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
                CarouselComponent
            ],
            providers: [
                {provide: Angulartics2GoogleGlobalSiteTag, useValue: angulartics2GoogleGlobalSiteTagStub}
            ],
            imports: [
                TestHelperModule,
                RouterTestingModule.withRoutes([
                    {path: '', component: AppComponent},
                    {path: 'unit-test', component: AppComponent},
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

    it('should create the app', async(() => {
        expect(comp)
            .toBeTruthy();
    }));

    it('should render "Super Murat" in a nav.a', async(() => {
        expect(fixture.nativeElement.querySelector('nav a').textContent)
            .toContain('Super Murat');
    }));

    it('should load main menu items', fakeAsync(() => {
        // tslint:disable-next-line:no-lifecycle-call
        comp.ngOnInit();
        tick();
        fixture.detectChanges();
        tick();
        expect(comp)
            .toBeTruthy();
        expect(fixture.nativeElement.querySelector('.navbar-nav .nav-link span').textContent)
            .toContain('Home');
    }));

    it('should redirect to http-404 for not-found-page', fakeAsync(() => {
        activatedRouteStub.navigate(fixture, comp.router, ['not-found-page']);
        fixture.detectChanges();
        tick(1000);

        expect(comp.router.url)
            .toEqual('/not-found-page/http-404');
    }));

    it('should not redirect to http-404 is already http-404', fakeAsync(() => {
        activatedRouteStub.navigate(fixture, comp.router, ['http-404']);
        fixture.detectChanges();
        tick(1000);

        expect(comp.router.url)
            .toEqual('/http-404');
    }));

    it('window.onScroll should dismiss cookieLaw', fakeAsync(() => {
        tick();
        expect(comp.cookieLawEl)
            .toBeDefined();
        const container = fixture.debugElement.query(By.css('main.container'));
        const newDiv = document.createElement('div');
        newDiv.style.width = '100px';
        newDiv.style.height = '3000px';
        container.nativeElement.parentElement.appendChild(newDiv);
        window.scrollTo(0, 600);
        expect(window.pageYOffset)
            .toBe(600);
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
                CarouselComponent
            ],
            providers: [
                {provide: Angulartics2GoogleGlobalSiteTag, useValue: angulartics2GoogleGlobalSiteTagStub},
                {provide: PLATFORM_ID, useValue: 'server'}
            ],
            imports: [
                TestHelperModule,
                RouterTestingModule.withRoutes([
                    {path: '', component: AppComponent},
                    {path: 'unit-test', component: AppComponent},
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
        const element = fixture.nativeElement.querySelector(
            'div#do-not-remove-me-this-is-for-only-get-404-error-on-ssr-with-unique-and-hidden-key');
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

    it('should contain page not found key for not-found-page', fakeAsync(() => {
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'not-found-pages', 'not-found-page',
            ['not-found-page']);
        const element = fixture.nativeElement.querySelector(
            'div#do-not-remove-me-this-is-for-only-get-404-error-on-ssr-with-unique-and-hidden-key');
        expect(element.tagName)
            .toBe('DIV');
        expect(element.id)
            .toBe('do-not-remove-me-this-is-for-only-get-404-error-on-ssr-with-unique-and-hidden-key');
    }));

});
