import { LOCALE_ID } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { QuoteModel } from '../../models';
import { activatedRouteStub, TestHelperModule } from '../../testing/test.helper.module.spec';
import { NotFoundComponent } from '../not-found/not-found.component';
import { QuoteDetailComponent } from './quote-detail.component';

describe('QuoteDetailComponent', () => {
    let fixture: ComponentFixture<QuoteDetailComponent>;
    let comp: QuoteDetailComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                QuoteDetailComponent
            ],
            providers: [],
            imports: [
                TestHelperModule,
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
        let lastQuote = new QuoteModel();
        comp.pageService.getPage()
            .subscribe(quote => {
                lastQuote = quote;
            });
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'quotes', 'quote',
            ['/quote', 'first-quote']);
        expect(lastQuote.id)
            .toEqual('first-quote');
    }));

    it('should load second-quote', fakeAsync(() => {
        let lastQuote = new QuoteModel();
        comp.pageService.getPage()
            .subscribe(quote => {
                lastQuote = quote;
            });
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'quotes', 'quote',
            ['/quote', 'second-quote']);
        expect(lastQuote.id)
            .toEqual('second-quote');
    }));

    it("should redirect to '/quote/first-quote' if id is -1", fakeAsync(() => {
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'quotes', 'quote',
            ['/quote', '-1']);
        expect(comp.router.url)
            .toEqual('/quote/first-quote');
    }));

    it("should redirect to '/quote/third-quote' if id is -4", fakeAsync(() => {
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'quotes', 'quote',
            ['/quote', '-4']);
        expect(comp.router.url)
            .toEqual('/quote/third-quote');
    }));

    it('should redirect to translation of ilk-alinti', fakeAsync(() => {
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'quotes', 'quote',
            ['/quote', 'ilk-alinti']);
        expect(comp.router.url)
            .toEqual('/en/quote/first-quote');
    }));

    it('should redirect to http-404 for not-found-page', fakeAsync(() => {
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'quotes', 'quote',
            ['/quote', 'not-found-page']);
        expect(comp.router.url)
            .toEqual('/quote/not-found-page/http-404');
    }));

    it('should redirect to translation of sadece-turkce-alinti', fakeAsync(() => {
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'quotes', 'quote',
            ['/quote', 'sadece-turkce-alinti']);
        expect(comp.router.url)
            .toEqual('/tr/alinti/sadece-turkce-alinti');
    }));

});

describe('QuoteDetailComponent_tr-TR', () => {
    let fixture: ComponentFixture<QuoteDetailComponent>;
    let comp: QuoteDetailComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                QuoteDetailComponent
            ],
            providers: [
                {provide: LOCALE_ID, useValue: 'tr'}
            ],
            imports: [
                TestHelperModule,
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
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'alintilar', 'alinti',
            ['/alinti', 'first-quote']);
        expect(comp.router.url)
            .toEqual('/tr/alinti/ilk-alinti');
    }));

    it('should redirect to origin route of ilk-alinti', fakeAsync(() => {
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'guzel-sozler', 'guzel-soz',
            ['/guzel-soz', 'ilk-alinti']);
        expect(comp.router.url)
            .toEqual('/tr/alinti/ilk-alinti');
    }));

});
