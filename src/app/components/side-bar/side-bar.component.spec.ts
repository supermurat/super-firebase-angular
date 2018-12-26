import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SideBarComponent } from './side-bar.component';

describe('SideBarComponent', () => {
    let fixture: ComponentFixture<SideBarComponent>;
    let comp: SideBarComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SideBarComponent]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(SideBarComponent);
                comp = fixture.componentInstance;
                fixture.detectChanges();
            });
    }));

    it('should create', () => {
        expect(comp)
            .toBeTruthy();
    });
});
