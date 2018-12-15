import { async, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';

import { AlertService, SeoService } from '../../services';

describe('HomeComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                HomeComponent
            ],
            providers: [
                AlertService, SeoService
            ],
            imports: [
                RouterTestingModule.withRoutes([{path: '', component: HomeComponent}])
            ]
        })
            .compileComponents();
    }));

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(HomeComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app)
            .toBeTruthy();
    }));

    it("should have as title 'home'", async(() => {
        const fixture = TestBed.createComponent(HomeComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title)
            .toEqual('home');
    }));

    it("should render 'Welcome!' in a h1", async(() => {
        const fixture = TestBed.createComponent(HomeComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(fixture.nativeElement.querySelector('h1').textContent)
            .toContain('Welcome!');
    }));

});
