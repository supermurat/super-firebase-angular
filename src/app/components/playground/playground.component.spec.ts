import { async, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { PlaygroundComponent } from './playground.component';

import { AlertService, SeoService } from '../../services';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('PlaygroundComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                PlaygroundComponent
            ],
            providers: [
                AlertService, SeoService,
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ],
            imports: [
                RouterTestingModule.withRoutes([{path: '', component: PlaygroundComponent}]),
                NgbModule
            ]
        })
            .compileComponents();
    }));

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(PlaygroundComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app)
            .toBeTruthy();
    }));

    it("should have as title 'Play Ground'", async(() => {
        const fixture = TestBed.createComponent(PlaygroundComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title)
            .toEqual('Play Ground');
    }));

    it("should render 'Browser side rendering with Firebase 🔥 Build Test' in a h2", async(() => {
        const fixture = TestBed.createComponent(PlaygroundComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h2').textContent)
            .toContain('Browser side rendering with Firebase 🔥 Build Test');
    }));

    it('male() should set gender as male', async(() => {
        const fixture = TestBed.createComponent(PlaygroundComponent);
        const app = fixture.debugElement.componentInstance;
        app.male();
        fixture.detectChanges();
        expect(app.gender)
            .toBe('male');
    }));

    it('female() should set gender as female', async(() => {
        const fixture = TestBed.createComponent(PlaygroundComponent);
        const app = fixture.debugElement.componentInstance;
        app.female();
        fixture.detectChanges();
        expect(app.gender)
            .toBe('female');
    }));

    it('other() should set gender as other', async(() => {
        const fixture = TestBed.createComponent(PlaygroundComponent);
        const app = fixture.debugElement.componentInstance;
        app.other();
        fixture.detectChanges();
        expect(app.gender)
            .toBe('other');
    }));

    it('inc(2) should set minutes as 2', async(() => {
        const fixture = TestBed.createComponent(PlaygroundComponent);
        const app = fixture.debugElement.componentInstance;
        app.inc(2);
        fixture.detectChanges();
        expect(app.minutes)
            .toBe(2);
    }));

    it('openAlert() should alert user', async(() => {
        const fixture = TestBed.createComponent(PlaygroundComponent);
        const app = fixture.debugElement.componentInstance;
        app.alert.getMessage()
            .subscribe(message => {
                expect(message.text)
                    .toContain('This is alert test');
            });
        app.openAlert();
        fixture.detectChanges();
    }));

});
