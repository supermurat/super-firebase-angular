import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService, SeoService } from '../../services';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
    let fixture: ComponentFixture<SearchComponent>;
    let comp: SearchComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SearchComponent,
                SideBarComponent
            ],
            providers: [
                AlertService, SeoService
            ],
            imports: [
                FormsModule,
                RouterTestingModule.withRoutes([{path: '', component: SearchComponent}])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(SearchComponent);
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

});
