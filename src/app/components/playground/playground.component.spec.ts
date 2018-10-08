import { async, TestBed } from '@angular/core/testing';

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
                AlertService, SeoService
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

    it("should render 'Browser side rendering with Firebase 🔥 Build Test' in a hr", async(() => {
        const fixture = TestBed.createComponent(PlaygroundComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h2').textContent)
            .toContain('Browser side rendering with Firebase 🔥 Build Test');
    }));

});
