import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TestHelperModule } from '../../testing/test.helper.module.spec';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
    let fixture: ComponentFixture<FooterComponent>;
    let comp: FooterComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [],
            providers: [],
            imports: [
                TestHelperModule,
                RouterTestingModule.withRoutes([
                    {path: '', component: FooterComponent},
                    {path: 'unit-test', component: FooterComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(FooterComponent);
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
