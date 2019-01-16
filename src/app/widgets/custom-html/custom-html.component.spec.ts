import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TestHelperModule } from '../../testing/test.helper.module.spec';
import { CustomHtmlComponent } from './custom-html.component';

describe('CustomHtmlComponent', () => {
    let fixture: ComponentFixture<CustomHtmlComponent>;
    let comp: CustomHtmlComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [],
            providers: [],
            imports: [
                TestHelperModule,
                RouterTestingModule.withRoutes([
                    {path: '', component: CustomHtmlComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(CustomHtmlComponent);
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
