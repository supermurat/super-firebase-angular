import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CarouselService } from '../../services';
import { CarouselComponent } from './carousel.component';

describe('CarouselComponent', () => {
    let fixture: ComponentFixture<CarouselComponent>;
    let comp: CarouselComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CarouselComponent],
            providers: [
                CarouselService,
                {provide: ComponentFixtureAutoDetect, useValue: true}
            ],
            imports: [
                RouterTestingModule.withRoutes([
                    {path: '', component: CarouselComponent},
                    {path: 'unit-test', component: CarouselComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(CarouselComponent);
                comp = fixture.componentInstance;
                fixture.detectChanges();
            })
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
    }));

    it('should create', async(() => {
        expect(comp)
            .toBeTruthy();
    }));

    it('destroying should work properly', async(() => {
        comp.subscription.unsubscribe();
        comp.subscription = undefined;
        fixture.detectChanges();
        expect(comp)
            .toBeTruthy();
    }));

    it('trackByIndex(2) should return 2', async(() => {
        expect(comp.trackByIndex(2, {}))
            .toBe(2);
    }));

});
