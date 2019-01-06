import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { TransferState } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_CONFIG, APP_UNIT_TEST_CONFIG } from '../../app-config';
import { AlertService, CarouselService, PagerService, PageService, SeoService } from '../../services';
import { AlertComponent } from '../alert/alert.component';
import { PagerComponent } from './pager.component';

describe('PagerComponent', () => {
    let fixture: ComponentFixture<PagerComponent>;
    let comp: PagerComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                PagerComponent,
                AlertComponent
            ],
            providers: [
                AlertService, PagerService, SeoService, TransferState, CarouselService, PageService,
                {provide: AngularFirestore, useValue: {}},
                {provide: APP_CONFIG, useValue: APP_UNIT_TEST_CONFIG}
            ],
            imports: [
                RouterTestingModule.withRoutes([{path: '', component: PagerComponent}])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(PagerComponent);
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

    it('destroying should work properly', async(() => {
        comp.subscription.unsubscribe();
        comp.subscription = undefined;
        fixture.detectChanges();
        expect(comp)
            .toBeTruthy();
    }));

});
