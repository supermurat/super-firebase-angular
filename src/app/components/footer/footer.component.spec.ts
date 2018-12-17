import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
    let fixture: ComponentFixture<FooterComponent>;
    let comp: FooterComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FooterComponent]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(FooterComponent);
                comp = fixture.componentInstance;
                fixture.detectChanges();
            });
    }));

    it('should create', () => {
        expect(comp)
            .toBeTruthy();
    });
});
