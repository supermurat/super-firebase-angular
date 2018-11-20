import { async, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { NotFoundComponent } from './not-found.component';
import { SeoService } from '../../services';

describe('NotFoundComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                NotFoundComponent
            ],
            providers: [
                SeoService
            ],
            imports: [
                RouterTestingModule.withRoutes([{path: '', component: NotFoundComponent}])
            ]
        })
            .compileComponents();
    }));

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(NotFoundComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app)
            .toBeTruthy();
    }));

    it("should render 'Page not found' in a h1", async(() => {
        const fixture = TestBed.createComponent(NotFoundComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h1').textContent)
            .toContain('Page not found');
    }));

});
