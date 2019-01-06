import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { TransferState } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_CONFIG, APP_UNIT_TEST_CONFIG } from '../../app-config';
import { AlertService, CarouselService, PageService, SeoService } from '../../services';
import { angularFirestoreStub, angularFirestoreStubNoData } from '../../testing/angular-firestore-stub.spec';
import { ActiveTagsComponent } from '../../widgets/active-tags/active-tags.component';
import { LastJokesComponent } from '../../widgets/last-jokes/last-jokes.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
    let fixture: ComponentFixture<HomeComponent>;
    let comp: HomeComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                HomeComponent,
                ActiveTagsComponent,
                LastJokesComponent,
                NotFoundComponent
            ],
            providers: [
                AlertService, SeoService, TransferState, CarouselService, PageService,
                {provide: AngularFirestore, useValue: angularFirestoreStub},
                {provide: APP_CONFIG, useValue: APP_UNIT_TEST_CONFIG}
            ],
            imports: [
                RouterTestingModule.withRoutes([
                    {path: '', component: HomeComponent},
                    {path: 'http-404', component: NotFoundComponent},
                    {path: '**', component: NotFoundComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(HomeComponent);
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

    it('trackByIndex(2) should return 2', async(() => {
        expect(comp.pageService.trackByIndex(2, {}))
            .toBe(2);
    }));

});

describe('HomeComponentNoData', () => {
    let fixture: ComponentFixture<HomeComponent>;
    let comp: HomeComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                HomeComponent,
                ActiveTagsComponent,
                LastJokesComponent,
                NotFoundComponent
            ],
            providers: [
                AlertService, SeoService, TransferState, CarouselService, PageService,
                {provide: AngularFirestore, useValue: angularFirestoreStubNoData},
                {provide: APP_CONFIG, useValue: APP_UNIT_TEST_CONFIG}
            ],
            imports: [
                RouterTestingModule.withRoutes([
                    {path: '', component: HomeComponent},
                    {path: 'http-404', component: NotFoundComponent},
                    {path: '**', component: NotFoundComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(HomeComponent);
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
