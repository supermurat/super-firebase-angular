import { async, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { NavMenuComponent } from './nav-menu.component';

describe('NavMenuComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                NavMenuComponent
            ],
            imports: [
                RouterTestingModule.withRoutes([{path: '', component: NavMenuComponent}])
            ]
        })
            .compileComponents();
    }));

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(NavMenuComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app)
            .toBeTruthy();
    }));

    it("should render 'Navbar' in an a.navbar-brand", async(() => {
        const fixture = TestBed.createComponent(NavMenuComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('a.navbar-brand').textContent)
            .toContain('Navbar');
    }));

    it('count of locales should be greater than 1', async(() => {
        const fixture = TestBed.createComponent(NavMenuComponent);
        fixture.detectChanges();
        const app = fixture.debugElement.componentInstance;
        expect(app.locales.length)
            .toBeGreaterThan(1);
    }));

    it('trackByLocale(2) should return 2', async(() => {
        const fixture = TestBed.createComponent(NavMenuComponent);
        fixture.detectChanges();
        const app = fixture.debugElement.componentInstance;
        expect(app.trackByLocale(2, {}))
            .toBe(2);
    }));

});
