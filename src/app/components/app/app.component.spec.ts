import { async, ComponentFixtureAutoDetect, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';

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
                AlertService, SeoService,
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ],
            imports: [
                RouterTestingModule.withRoutes([
                    {path: '', component: AppComponent},
                    {path: 'unit-test', component: NavMenuComponent}
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

    it("should set title as 'My Unit Test Title'", async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        app.seo.generateTags({
            title: 'My Unit Test Title'
        });
        fixture.detectChanges();
        expect(app.seo.getTitle())
            .toContain('My Unit Test Title');
    }));

    it("should set meta og:title as 'My Unit Test Title'", async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        app.seo.generateTags({
            title: 'My Unit Test Title'
        });
        fixture.detectChanges();
        expect(app.seo.getMeta()
            .getTag('property="og:title"').content)
            .toContain('My Unit Test Title');
    }));

});

describe('AppComponentAlertService', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                NavMenuComponent,
                AlertComponent
            ],
            providers: [
                AlertService, SeoService,
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ],
            imports: [
                RouterTestingModule.withRoutes([
                    {path: '', component: AppComponent},
                    {path: 'unit-test', component: NavMenuComponent}
                ])
            ]
        })
            .compileComponents();
    }));

    it("should add 'My success message' to alert.service and get 'My success message' from alert.service", async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        app.alert.getMessage()
            .subscribe(message => {
                expect(message.text)
                    .toContain('My success message');
            });
        app.alert.success('My success message', true);
        fixture.detectChanges();
    }));

    it("should render 'My success message' in alert component", async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        app.alert.success('My success message', false);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('app-alert .alert-success').textContent)
            .toContain('My success message');
    }));

    it("should render 'My success message' in alert component and should be cleared after redirect", fakeAsync(() => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const injector = fixture.debugElement.injector;
        const router = injector.get(Router);
        router.initialNavigation();
        const app = fixture.debugElement.componentInstance;
        app.alert.success('My success message', false);
        fixture.detectChanges();
        router.navigate(['unit-test']);
        tick();
        fixture.detectChanges();
        tick();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('app-alert .alert-success'))
            .toBeNull();
    }));

    it("should render 'My success message' in alert component and should not be cleared after redirect", fakeAsync(() => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const injector = fixture.debugElement.injector;
        const router = injector.get(Router);
        router.initialNavigation();
        const app = fixture.debugElement.componentInstance;
        app.alert.success('My success message', true);
        fixture.detectChanges();
        router.navigate(['unit-test']);
        tick();
        fixture.detectChanges();
        tick();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('app-alert .alert-success').textContent)
            .toBe('My success message');
    }));

    it("should add 'My error message' to alert.service and get 'My error message' from alert.service", async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        app.alert.getMessage()
            .subscribe(message => {
                expect(message.text)
                    .toContain('My error message');
            });
        app.alert.error('My error message', true);
        fixture.detectChanges();
    }));

    it("should render 'My error message' in alert component", async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        app.alert.error('My error message', false);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('app-alert .alert-danger').textContent)
            .toContain('My error message');
    }));

    it("should render 'My error message' in alert component and should be cleared after redirect", fakeAsync(() => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const injector = fixture.debugElement.injector;
        const router = injector.get(Router);
        router.initialNavigation();
        const app = fixture.debugElement.componentInstance;
        app.alert.error('My error message', false);
        fixture.detectChanges();
        router.navigate(['unit-test']);
        tick();
        fixture.detectChanges();
        tick();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('app-alert .alert-danger'))
            .toBeNull();
    }));

    it("should render 'My error message' in alert component and should not be cleared after redirect", fakeAsync(() => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const injector = fixture.debugElement.injector;
        const router = injector.get(Router);
        router.initialNavigation();
        const app = fixture.debugElement.componentInstance;
        app.alert.error('My error message', true);
        fixture.detectChanges();
        router.navigate(['unit-test']);
        tick();
        fixture.detectChanges();
        tick();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('app-alert .alert-danger').textContent)
            .toBe('My error message');
    }));

});
