import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { TransferState } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_CONFIG, APP_UNIT_TEST_CONFIG } from '../../app-config';
import { JokeModel } from '../../models';
import { AlertService, SeoService } from '../../services';
import { ActivatedRoute, ActivatedRouteStub, angularFirestoreStub } from '../../testing/index.spec';
import { AlertComponent } from '../alert/alert.component';
import { FooterComponent } from '../footer/footer.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { JokeDetailComponent } from './joke-detail.component';

const activatedRouteStub = new ActivatedRouteStub();

describe('JokeDetailComponent', () => {
    let fixture: ComponentFixture<JokeDetailComponent>;
    let comp: JokeDetailComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                JokeDetailComponent,
                FooterComponent,
                SideBarComponent,
                AlertComponent
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
                    {path: 'joke/:id', component: JokeDetailComponent},
                    {path: 'jokes', component: JokeDetailComponent},
                    {path: 'jokes/:pageNo', component: JokeDetailComponent},
                    {path: 'en/joke/:id', component: JokeDetailComponent},
                    {path: 'tr/saka/:id', component: JokeDetailComponent},
                    {path: 'en/joke', component: JokeDetailComponent},
                    {path: 'tr/saka', component: JokeDetailComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(JokeDetailComponent);
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

    it('should load first-joke', fakeAsync(() => {
        activatedRouteStub.setParamMap({id: 'first-joke'});
        fixture.detectChanges();
        let lastJoke = new JokeModel();
        comp.joke$.subscribe(joke => {
            lastJoke = joke;
        });
        tick();
        expect(lastJoke.id)
            .toEqual('first-joke');
    }));

    it("should redirection to '/joke/first-joke' if id is -1", fakeAsync(() => {
        activatedRouteStub.setParamMap({id: '-1'});
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/joke/first-joke');
    }));

    it('trackByIndex(2) should return 2', async(() => {
        expect(comp.trackByIndex(2, {}))
            .toBe(2);
    }));

    it("should redirection to '/joke/third-joke' if id is -4", fakeAsync(() => {
        const sNavEvent = activatedRouteStub.initNavigation(fixture, comp.router, 'jokes', 'joke');
        activatedRouteStub.setParamMap({id: '-4'});
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        sNavEvent.unsubscribe();
        expect(comp.router.url)
            .toEqual('/joke/third-joke');
    }));

    it('should redirection to translation of ilk-saka', fakeAsync(() => {
        const sNavEvent = activatedRouteStub.initNavigation(fixture, comp.router, 'jokes', 'joke');
        activatedRouteStub.navigate(fixture, comp.router, ['/joke', 'ilk-saka']);
        fixture.detectChanges();
        tick();
        sNavEvent.unsubscribe();
        expect(comp.router.url)
            .toEqual('/tr/saka/ilk-saka');
    }));

});
