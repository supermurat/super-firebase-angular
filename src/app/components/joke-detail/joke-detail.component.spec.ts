import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { AngularFirestore } from '@angular/fire/firestore';
import { TransferState } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
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
                {provide: AngularFirestore, useValue: angularFirestoreStub}
            ],
            imports: [
                RouterTestingModule.withRoutes([
                    {path: 'joke/:id', component: JokeDetailComponent},
                    {path: 'jokes', component: JokeDetailComponent},
                    {path: 'jokes/:pageNo', component: JokeDetailComponent},
                    {path: 'en/joke/:id', component: JokeDetailComponent},
                    {path: 'tr/joke/:id', component: JokeDetailComponent},
                    {path: 'en/joke', component: JokeDetailComponent},
                    {path: 'tr/joke', component: JokeDetailComponent}
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

    it('should redirection to translation of page', fakeAsync(() => {
        activatedRouteStub.setParamMap({id: 'first-joke'});
        fixture.detectChanges();
        comp.checkTranslation(undefined);
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/tr/joke/first-joke');
    }));

    it("should redirection to '/joke/first-joke' if id is -1", fakeAsync(() => {
        activatedRouteStub.setParamMap({id: '-1'});
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/joke/first-joke');
    }));

});
