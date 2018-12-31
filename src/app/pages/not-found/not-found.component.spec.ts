import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_CONFIG, APP_UNIT_TEST_CONFIG } from '../../app-config';
import { SeoService } from '../../services';
import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
    let fixture: ComponentFixture<NotFoundComponent>;
    let comp: NotFoundComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                NotFoundComponent
            ],
            providers: [
                SeoService,
                {provide: APP_CONFIG, useValue: APP_UNIT_TEST_CONFIG}
            ],
            imports: [
                RouterTestingModule.withRoutes([{path: '', component: NotFoundComponent}])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(NotFoundComponent);
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

    it("should render 'Page not found' in a h1", async(() => {
        expect(fixture.nativeElement.querySelector('h1').textContent)
            .toContain('Page not found');
    }));

});