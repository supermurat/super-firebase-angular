import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService, PagerService } from '../../services';
import { AlertComponent } from '../alert/alert.component';
import { PagerComponent } from './pager.component';

describe('PagerComponent', () => {
    let fixture: ComponentFixture<PagerComponent>;
    let comp: PagerComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                PagerComponent,
                AlertComponent
            ],
            providers: [
                AlertService, PagerService
            ],
            imports: [
                RouterTestingModule.withRoutes([{path: '', component: PagerComponent}])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(PagerComponent);
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
});
