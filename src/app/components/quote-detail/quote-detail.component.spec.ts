import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { TransferState } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { QuoteModel } from '../../models';
import { AlertService, SeoService } from '../../services';
import { ActivatedRoute, ActivatedRouteStub, angularFirestoreStub } from '../../testing/index.spec';
import { AlertComponent } from '../alert/alert.component';
import { FooterComponent } from '../footer/footer.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { QuoteDetailComponent } from './quote-detail.component';

const activatedRouteStub = new ActivatedRouteStub();

describe('QuoteDetailComponent', () => {
    let fixture: ComponentFixture<QuoteDetailComponent>;
    let comp: QuoteDetailComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                QuoteDetailComponent,
                FooterComponent,
                SideBarComponent,
                AlertComponent
            ],
            providers: [
                AlertService, SeoService, TransferState,
                {provide: ActivatedRoute, useValue: activatedRouteStub},
                {provide: AngularFirestore, useValue: angularFirestoreStub}
            ],
            imports: [
                FormsModule,
                RouterTestingModule.withRoutes([
                    {path: 'quote/:id', component: QuoteDetailComponent},
                    {path: 'quotes', component: QuoteDetailComponent},
                    {path: 'quotes/:pageNo', component: QuoteDetailComponent},
                    {path: 'en/quote/:id', component: QuoteDetailComponent},
                    {path: 'tr/quote/:id', component: QuoteDetailComponent},
                    {path: 'en/quote', component: QuoteDetailComponent},
                    {path: 'tr/quote', component: QuoteDetailComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(QuoteDetailComponent);
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

    it('should load first-quote', fakeAsync(() => {
        activatedRouteStub.setParamMap({id: 'first-quote'});
        fixture.detectChanges();
        let lastQuote = new QuoteModel();
        comp.quote$.subscribe(quote => {
            lastQuote = quote;
        });
        tick();
        expect(lastQuote.id)
            .toEqual('first-quote');
    }));

    it('should redirection to translation of page', fakeAsync(() => {
        activatedRouteStub.setParamMap({id: 'first-quote'});
        fixture.detectChanges();
        comp.checkTranslation(undefined);
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/tr/quote/first-quote');
    }));

    it("should redirection to '/quote/first-quote' if id is -1", fakeAsync(() => {
        activatedRouteStub.setParamMap({id: '-1'});
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/quote/first-quote');
    }));

    it('trackByIndex(2) should return 2', async(() => {
        expect(comp.trackByIndex(2, {}))
            .toBe(2);
    }));

});
