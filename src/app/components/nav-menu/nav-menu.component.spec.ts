import { Location } from '@angular/common';
import { async, ComponentFixture, ComponentFixtureAutoDetect, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
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
                {provide: ComponentFixtureAutoDetect, useValue: true}
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
        const injector = fixture.debugElement.injector;
        const location = injector.get(Location);
        const router = injector.get(Router);
        router.initialNavigation();
        router.navigate(['unit-test'])
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
        tick();
        fixture.detectChanges();
        tick();
        expect(location.path())
            .toBe('/unit-test');
    }));

});
