import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TestHelperModule } from '../../testing/test.helper.module.spec';
import { ActiveTagsComponent } from './active-tags.component';

describe('ActiveTagsComponent', () => {
    let fixture: ComponentFixture<ActiveTagsComponent>;
    let comp: ActiveTagsComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [],
            providers: [],
            imports: [
                TestHelperModule,
                RouterTestingModule.withRoutes([
                    {path: '', component: ActiveTagsComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(ActiveTagsComponent);
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

    it('trackByIndex(2) should return 2', async(() => {
        expect(comp.trackByIndex(2, {}))
            .toBe(2);
    }));

    it('should load taxonomy list', fakeAsync(() => {
        comp.taxonomyList$.subscribe(result => {
            expect(result.length)
                .toEqual(3);
        });
        fixture.detectChanges();
    }));

});
