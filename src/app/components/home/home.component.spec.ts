import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';

import { AlertService, SeoService } from '../../services';

describe('HomeComponent', () => {
    let fixture: ComponentFixture<HomeComponent>;
    let comp: HomeComponent;

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
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(HomeComponent);
                comp = fixture.componentInstance;
                fixture.detectChanges();
            });
    }));

    it('should create the app', async(() => {
        expect(comp)
            .toBeTruthy();
    }));

    it("should have as title 'home'", async(() => {
        expect(comp.title)
            .toEqual('home');
    }));

    it("should render 'Welcome!' in a h1", async(() => {
        expect(fixture.nativeElement.querySelector('h1').textContent)
            .toContain('Welcome!');
    }));

});
