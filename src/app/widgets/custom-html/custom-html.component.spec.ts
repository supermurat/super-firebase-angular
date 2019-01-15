import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_CONFIG, APP_UNIT_TEST_CONFIG } from '../../app-config';
import { AlertService } from '../../services';
import { CustomHtmlComponent } from './custom-html.component';

describe('CustomHtmlComponent', () => {
    let fixture: ComponentFixture<CustomHtmlComponent>;
    let comp: CustomHtmlComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                CustomHtmlComponent
            ],
            providers: [
                AlertService,
                {provide: ComponentFixtureAutoDetect, useValue: true},
                {provide: APP_CONFIG, useValue: APP_UNIT_TEST_CONFIG}
            ],
            imports: [
                FormsModule,
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
