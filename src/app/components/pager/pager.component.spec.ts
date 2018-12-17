import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagerComponent } from './pager.component';
import { RouterTestingModule } from '@angular/router/testing';
import { PagerService } from '../../services';

describe('PagerComponent', () => {
    let fixture: ComponentFixture<PagerComponent>;
    let comp: PagerComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PagerComponent],
            providers: [PagerService],
            imports: [
                RouterTestingModule.withRoutes([{path: '', component: PagerComponent}])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(PagerComponent);
                comp = fixture.componentInstance;
                fixture.detectChanges();
            });
    }));

    it('should create', () => {
        expect(comp)
            .toBeTruthy();
    });
});
