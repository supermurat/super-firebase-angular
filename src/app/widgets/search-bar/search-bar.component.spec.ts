import { async, ComponentFixture, ComponentFixtureAutoDetect, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_CONFIG, APP_UNIT_TEST_CONFIG } from '../../app-config';
import { AlertComponent } from '../../components/alert/alert.component';
import { AlertService } from '../../services';
import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
    let fixture: ComponentFixture<SearchBarComponent>;
    let comp: SearchBarComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SearchBarComponent,
                AlertComponent
            ],
            providers: [
                AlertService,
                {provide: ComponentFixtureAutoDetect, useValue: true},
                {provide: APP_CONFIG, useValue: APP_UNIT_TEST_CONFIG}
            ],
            imports: [
                FormsModule,
                RouterTestingModule.withRoutes([
                    {path: '', component: SearchBarComponent},
                    {path: 'search', component: SearchBarComponent},
                    {path: 'search/**', component: SearchBarComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(SearchBarComponent);
                comp = fixture.componentInstance;
                fixture.detectChanges();
            })
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
    }));

    it('should create', () => {
        expect(comp)
            .toBeTruthy();
    });

    it('should redirect to "/search" for "Searched For Me"', fakeAsync(() => {
        comp.searchFor = 'Searched For Me';
        comp.onClickSearch();
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/search?q=Searched%20For%20Me');
    }));

});
