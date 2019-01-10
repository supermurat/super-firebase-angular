import { Location } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { async, ComponentFixture, ComponentFixtureAutoDetect, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { By, TransferState } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_CONFIG, APP_UNIT_TEST_CONFIG } from '../../app-config';
import { AlertService, CarouselService, PageService, SeoService } from '../../services';
import { NavMenuComponent } from './nav-menu.component';

describe('NavMenuComponent', () => {
    let fixture: ComponentFixture<NavMenuComponent>;
    let comp: NavMenuComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                NavMenuComponent
            ],
            providers: [
                AlertService, SeoService, TransferState, CarouselService, PageService,
                {provide: ComponentFixtureAutoDetect, useValue: true},
                {provide: AngularFirestore, useValue: {}},
                {provide: APP_CONFIG, useValue: APP_UNIT_TEST_CONFIG}
            ],
            imports: [
                RouterTestingModule.withRoutes([
                    {path: '', component: NavMenuComponent},
                    {path: 'unit-test', component: NavMenuComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(NavMenuComponent);
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

    it("should render 'Super Murat' in an a.navbar-brand", async(() => {
        expect(fixture.nativeElement.querySelector('a.navbar-brand').textContent)
            .toContain('Super Murat');
    }));

    it('count of locales should be greater than 1', async(() => {
        expect(comp.locales.length)
            .toBeGreaterThan(1);
    }));

    it('trackByLocale(2) should return 2', async(() => {
        expect(comp.trackByLocale(2, {}))
            .toBe(2);
    }));

    it("should redirect to '/unit-test'", fakeAsync(() => {
        comp.router.initialNavigation();
        comp.router.navigate(['unit-test'])
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(comp.router.url)
            .toBe('/unit-test');
    }));

    it('should move to top of page after route changes', fakeAsync(() => {
        const navbar = fixture.debugElement.query(By.css('.navbar'));
        const newDiv = document.createElement('div');
        newDiv.style.width = '100px';
        newDiv.style.height = '3000px';
        navbar.nativeElement.parentElement.appendChild(newDiv);
        window.scrollTo(0, 600);
        expect(window.pageYOffset)
            .toBe(600);
        comp.router.initialNavigation();
        comp.router.navigate(['unit-test'])
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(comp.router.url)
            .toBe('/unit-test');
        expect(window.pageYOffset)
            .toBe(0);
    }));

});

describe('NavMenuComponentServer', () => {
    let fixture: ComponentFixture<NavMenuComponent>;
    let comp: NavMenuComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                NavMenuComponent
            ],
            providers: [
                AlertService, SeoService, TransferState, CarouselService, PageService,
                {provide: ComponentFixtureAutoDetect, useValue: true},
                {provide: AngularFirestore, useValue: {}},
                {provide: APP_CONFIG, useValue: APP_UNIT_TEST_CONFIG},
                {provide: PLATFORM_ID, useValue: 'server'}
            ],
            imports: [
                RouterTestingModule.withRoutes([
                    {path: '', component: NavMenuComponent},
                    {path: 'unit-test', component: NavMenuComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(NavMenuComponent);
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

    it('should not make a scroll movement after route changes for ssr', fakeAsync(() => {
        comp.router.initialNavigation();
        comp.router.navigate(['unit-test'])
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
        tick(1000);
        fixture.detectChanges();
        tick(1000);
        expect(comp.router.url)
            .toBe('/unit-test');
    }));

});
