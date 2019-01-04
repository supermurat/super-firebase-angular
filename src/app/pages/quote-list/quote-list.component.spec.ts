import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { TransferState } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_CONFIG, APP_UNIT_TEST_CONFIG } from '../../app-config';
import { AlertComponent } from '../../components/alert/alert.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { PagerComponent } from '../../components/pager/pager.component';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { AlertService, CarouselService, PagerService, PageService, SeoService } from '../../services';
import { ActivatedRoute, ActivatedRouteStub, angularFirestoreStub, angularFirestoreStubNoData } from '../../testing/index.spec';
import { ActiveTagsComponent } from '../../widgets/active-tags/active-tags.component';
import { LastJokesComponent } from '../../widgets/last-jokes/last-jokes.component';
import { SearchBarComponent } from '../../widgets/search-bar/search-bar.component';
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
                AlertComponent,
                ActiveTagsComponent,
                LastJokesComponent,
                SearchBarComponent
            ],
            providers: [
                AlertService, SeoService, PagerService, TransferState, CarouselService, PageService,
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

    it('count of record should be 3', async(() => {
        activatedRouteStub.setParamMap({pageNo: 1});
        comp.quotes$.subscribe(result => {
            expect(result.length)
                .toEqual(3);
        });
        fixture.detectChanges();
    }));

    it('should redirect to page 1 if page is not exist', fakeAsync(() => {
        activatedRouteStub.setParamMap({pageNo: 9}); // page 9 not exist
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/quotes/1');
        fixture.detectChanges();
    }));

    it('should redirect to page 1 if pageNo is lower than 0', fakeAsync(() => {
        activatedRouteStub.setParamMap({pageNo: -2});
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/quotes/1');
        fixture.detectChanges();
    }));

    it('should redirect to page 1 if pageNo is not Number', fakeAsync(() => {
        activatedRouteStub.setParamMap({pageNo: 'not-number'});
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/quotes/1');
        fixture.detectChanges();
    }));

});

describe('QuoteListComponentNoData', () => {
    let fixture: ComponentFixture<QuoteListComponent>;
    let comp: QuoteListComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                QuoteListComponent,
                FooterComponent,
                SideBarComponent,
                PagerComponent,
                AlertComponent,
                ActiveTagsComponent,
                LastJokesComponent,
                SearchBarComponent
            ],
            providers: [
                AlertService, SeoService, PagerService, TransferState, CarouselService, PageService,
                {provide: ActivatedRoute, useValue: activatedRouteStub},
                {provide: AngularFirestore, useValue: angularFirestoreStubNoData},
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
});
