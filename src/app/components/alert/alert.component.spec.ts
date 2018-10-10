import { async, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { AlertComponent } from './alert.component';
import { AlertService } from '../../services';

describe('AlertComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AlertComponent
            ],
            providers: [
                AlertService,
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ],
            imports: [
                RouterTestingModule.withRoutes([{path: '', component: AlertComponent}])
            ]
        })
            .compileComponents();
    }));

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AlertComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app)
            .toBeTruthy();
    }));

    it('should create the app and destroy with undefined subscription', async(() => {
        const fixture = TestBed.createComponent(AlertComponent);
        const app = fixture.debugElement.componentInstance;
        app.subscription = undefined;
        expect(app)
            .toBeTruthy();
    }));

    it("should add 'My success message' to alert.service and get 'My success message' from alert.service", async(() => {
        const fixture = TestBed.createComponent(AlertComponent);
        const app = fixture.debugElement.componentInstance;
        app.alertService.getMessage()
            .subscribe(message => {
                expect(message.text)
                    .toContain('My success message');
            });
        app.alertService.success('My success message', false);
        fixture.detectChanges();
    }));

    it("should add 'My error message' to alert.service and get 'My error message' from alert.service", async(() => {
        const fixture = TestBed.createComponent(AlertComponent);
        const app = fixture.debugElement.componentInstance;
        app.alertService.getMessage()
            .subscribe(message => {
                expect(message.text)
                    .toContain('My error message');
            });
        app.alertService.error('My error message', false);
        fixture.detectChanges();
    }));

});
