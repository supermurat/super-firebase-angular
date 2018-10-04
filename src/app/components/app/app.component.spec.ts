import { async, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { NavMenuComponent } from '../nav-menu/nav-menu.component';
import { AlertComponent } from '../alert/alert.component';

import { AlertService, SeoService } from '../../services';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                NavMenuComponent,
                AlertComponent
            ],
            providers: [
                AlertService, SeoService
            ],
            imports: [
                RouterTestingModule.withRoutes([{path: '', component: AppComponent}
                ])
            ]
        })
            .compileComponents();
    }));

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app)
            .toBeTruthy();
    }));

    it("should have as title 'app'", async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title)
            .toEqual('app');
    }));

    it('should render Navbar in a nav.a', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('nav a').textContent)
            .toContain('Navbar');
    }));

});
