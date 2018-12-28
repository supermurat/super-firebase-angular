import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_CONFIG, APP_UNIT_TEST_CONFIG } from '../../app-config';
import { AlertService, PagerService, SeoService } from '../../services';
import { ActivatedRoute, ActivatedRouteStub, angularFirestoreStub } from '../../testing/index.spec';
import { AlertComponent } from '../alert/alert.component';
import { FooterComponent } from '../footer/footer.component';
import { PagerComponent } from '../pager/pager.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { QuoteListComponent } from './quote-list.component';

const activatedRouteStub = new ActivatedRouteStub();

describe('QuoteListComponent', () => {
    let fixture: ComponentFixture<QuoteListComponent>;
    let comp: QuoteListComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                QuoteListComponent,
                FooterComponent,
                SideBarComponent,
                PagerComponent,
                AlertComponent
            ],
            providers: [
                AlertService, SeoService, PagerService,
                {provide: ActivatedRoute, useValue: activatedRouteStub},
                {provide: AngularFirestore, useValue: angularFirestoreStub},
                {provide: APP_CONFIG, useValue: APP_UNIT_TEST_CONFIG}
            ],
            imports: [
                FormsModule,
                RouterTestingModule.withRoutes([
                    {path: 'quotes', redirectTo: 'quotes/1', pathMatch: 'full'},
                    {path: 'quotes/:pageNo', component: QuoteListComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(QuoteListComponent);
                comp = fixture.componentInstance;
                fixture.detectChanges();
            })
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
    }));

    it('should create the app', async(() => {
        expect(comp)
            .toBeTruthy();
    }));

    it("should have as title 'Quotes'", async(() => {
        expect(comp.title)
            .toEqual('My Quotes');
    }));

    it('count of record should be 3', async(() => {
        activatedRouteStub.setParamMap({pageNo: 1});
        comp.quotes$.subscribe(result => {
            expect(result.length)
                .toEqual(3);
        });
        fixture.detectChanges();
    }));

    it('trackByIndex(2) should return 2', async(() => {
        expect(comp.trackByIndex(2, {}))
            .toBe(2);
    }));

    it('should redirect to page 1 if page is not exist', fakeAsync(() => {
        activatedRouteStub.setParamMap({pageNo: 9}); // page 9 not exist
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/quotes/1');
        fixture.detectChanges();
    }));

});
