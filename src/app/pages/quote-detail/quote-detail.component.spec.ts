import { LOCALE_ID } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { TransferState } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_CONFIG, APP_UNIT_TEST_CONFIG } from '../../app-config';
import { AlertComponent } from '../../components/alert/alert.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { QuoteModel } from '../../models';
import { AlertService, SeoService } from '../../services';
import { ActivatedRoute, ActivatedRouteStub, angularFirestoreStub } from '../../testing/index.spec';
import { NotFoundComponent } from '../not-found/not-found.component';
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
                AlertComponent,
                NotFoundComponent
            ],
            providers: [
                AlertService, SeoService, TransferState,
                {provide: ActivatedRoute, useValue: activatedRouteStub},
                {provide: AngularFirestore, useValue: angularFirestoreStub},
                {provide: APP_CONFIG, useValue: APP_UNIT_TEST_CONFIG}
            ],
            imports: [
                FormsModule,
                RouterTestingModule.withRoutes([
                    {path: 'quote/:id', component: QuoteDetailComponent},
                    {path: 'quotes', component: QuoteDetailComponent},
                    {path: 'quotes/:pageNo', component: QuoteDetailComponent},
                    {path: 'en/quote/:id', component: QuoteDetailComponent},
                    {path: 'tr/alinti/:id', component: QuoteDetailComponent},
                    {path: 'en/quote', component: QuoteDetailComponent},
                    {path: 'tr/alinti', component: QuoteDetailComponent},
                    {path: 'http-404', component: NotFoundComponent},
                    {path: '**', component: NotFoundComponent}
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

    it("should redirect to '/quote/first-quote' if id is -1", fakeAsync(() => {
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

    it("should redirect to '/quote/third-quote' if id is -4", fakeAsync(() => {
        const sNavEvent = activatedRouteStub.initNavigation(fixture, comp.router, 'quotes', 'quote');
        activatedRouteStub.setParamMap({id: '-4'});
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        sNavEvent.unsubscribe();
        expect(comp.router.url)
            .toEqual('/quote/third-quote');
    }));

    it('should redirect to translation of ilk-alinti', fakeAsync(() => {
        const sNavEvent = activatedRouteStub.initNavigation(fixture, comp.router, 'quotes', 'quote');
        activatedRouteStub.navigate(fixture, comp.router, ['/quote', 'ilk-alinti']);
        fixture.detectChanges();
        tick();
        sNavEvent.unsubscribe();
        expect(comp.router.url)
            .toEqual('/tr/alinti/ilk-alinti');
    }));

    it('should redirect to http-404 for not-found-page', fakeAsync(() => {
        const sNavEvent = activatedRouteStub.initNavigation(fixture, comp.router, 'quotes', 'quote');
        activatedRouteStub.navigate(fixture, comp.router, ['/quote', 'not-found-page']);
        fixture.detectChanges();
        tick();
        sNavEvent.unsubscribe();
        expect(comp.router.url)
            .toEqual('/quote/not-found-page/http-404');
    }));

});

describe('QuoteDetailComponent_tr-TR', () => {
    let fixture: ComponentFixture<QuoteDetailComponent>;
    let comp: QuoteDetailComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                QuoteDetailComponent,
                FooterComponent,
                SideBarComponent,
                AlertComponent,
                NotFoundComponent
            ],
            providers: [
                AlertService, SeoService, TransferState,
                {provide: ActivatedRoute, useValue: activatedRouteStub},
                {provide: AngularFirestore, useValue: angularFirestoreStub},
                {provide: APP_CONFIG, useValue: APP_UNIT_TEST_CONFIG},
                {provide: LOCALE_ID, useValue: 'tr-TR'}
            ],
            imports: [
                FormsModule,
                RouterTestingModule.withRoutes([
                    {path: 'quote/:id', component: QuoteDetailComponent},
                    {path: 'quotes', component: QuoteDetailComponent},
                    {path: 'quotes/:pageNo', component: QuoteDetailComponent},
                    {path: 'alinti/:id', component: QuoteDetailComponent},
                    {path: 'alintilar', component: QuoteDetailComponent},
                    {path: 'alintilar/:pageNo', component: QuoteDetailComponent},
                    {path: 'en/quote/:id', component: QuoteDetailComponent},
                    {path: 'tr/alinti/:id', component: QuoteDetailComponent},
                    {path: 'en/quote', component: QuoteDetailComponent},
                    {path: 'tr/alinti', component: QuoteDetailComponent},
                    {path: 'http-404', component: NotFoundComponent},
                    {path: '**', component: NotFoundComponent}
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

    it('should redirect to translation of first-quote', fakeAsync(() => {
        const sNavEvent = activatedRouteStub.initNavigation(fixture, comp.router, 'alintilar', 'alinti');
        activatedRouteStub.navigate(fixture, comp.router, ['/alinti', 'first-quote']);
        fixture.detectChanges();
        tick();
        sNavEvent.unsubscribe();
        expect(comp.router.url)
            .toEqual('/en/quote/first-quote');
    }));

});
