import { LOCALE_ID } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JokeModel } from '../../models';
import { activatedRouteStub, TestHelperModule } from '../../testing/test.helper.module.spec';
import { NotFoundComponent } from '../not-found/not-found.component';
import { JokeDetailComponent } from './joke-detail.component';

describe('JokeDetailComponent', () => {
    let fixture: ComponentFixture<JokeDetailComponent>;
    let comp: JokeDetailComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                JokeDetailComponent
            ],
            providers: [],
            imports: [
                TestHelperModule,
                RouterTestingModule.withRoutes([
                    {path: 'joke/:id', component: JokeDetailComponent},
                    {path: 'jokes', component: JokeDetailComponent},
                    {path: 'jokes/:pageNo', component: JokeDetailComponent},
                    {path: 'en/joke/:id', component: JokeDetailComponent},
                    {path: 'tr/saka/:id', component: JokeDetailComponent},
                    {path: 'en/joke', component: JokeDetailComponent},
                    {path: 'tr/saka', component: JokeDetailComponent},
                    {path: 'http-404', component: NotFoundComponent},
                    {path: '**', component: NotFoundComponent}
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

    it("should redirect to '/joke/first-joke' if id is -1", fakeAsync(() => {
        activatedRouteStub.setParamMap({id: '-1'});
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/joke/first-joke');
    }));

    it("should redirect to '/joke/third-joke' if id is -4", fakeAsync(() => {
        const sNavEvent = activatedRouteStub.initNavigation(fixture, comp.router, 'jokes', 'joke');
        activatedRouteStub.setParamMap({id: '-4'});
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        sNavEvent.unsubscribe();
        expect(comp.router.url)
            .toEqual('/joke/third-joke');
    }));

    it('should redirect to translation of ilk-saka', fakeAsync(() => {
        const sNavEvent = activatedRouteStub.initNavigation(fixture, comp.router, 'jokes', 'joke');
        activatedRouteStub.navigate(fixture, comp.router, ['/joke', 'ilk-saka']);
        fixture.detectChanges();
        tick();
        sNavEvent.unsubscribe();
        expect(comp.router.url)
            .toEqual('/en/joke/first-joke');
    }));

    it('should redirect to http-404 for not-found-page', fakeAsync(() => {
        const sNavEvent = activatedRouteStub.initNavigation(fixture, comp.router, 'jokes', 'joke');
        activatedRouteStub.navigate(fixture, comp.router, ['/joke', 'not-found-page']);
        fixture.detectChanges();
        tick();
        sNavEvent.unsubscribe();
        expect(comp.router.url)
            .toEqual('/joke/not-found-page/http-404');
    }));

    it('should redirect to translation of sadece-turkce-fikra', fakeAsync(() => {
        const sNavEvent = activatedRouteStub.initNavigation(fixture, comp.router, 'jokes', 'joke');
        activatedRouteStub.navigate(fixture, comp.router, ['/joke', 'sadece-turkce-fikra']);
        fixture.detectChanges();
        tick();
        sNavEvent.unsubscribe();
        expect(comp.router.url)
            .toEqual('/tr/fikra/sadece-turkce-fikra');
    }));

});

describe('JokeDetailComponent_tr-TR', () => {
    let fixture: ComponentFixture<JokeDetailComponent>;
    let comp: JokeDetailComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                JokeDetailComponent
            ],
            providers: [
                {provide: LOCALE_ID, useValue: 'tr-TR'}
            ],
            imports: [
                TestHelperModule,
                RouterTestingModule.withRoutes([
                    {path: 'joke/:id', component: JokeDetailComponent},
                    {path: 'jokes', component: JokeDetailComponent},
                    {path: 'jokes/:pageNo', component: JokeDetailComponent},
                    {path: 'saka/:id', component: JokeDetailComponent},
                    {path: 'sakalar', component: JokeDetailComponent},
                    {path: 'sakalar/:pageNo', component: JokeDetailComponent},
                    {path: 'en/joke/:id', component: JokeDetailComponent},
                    {path: 'tr/saka/:id', component: JokeDetailComponent},
                    {path: 'en/joke', component: JokeDetailComponent},
                    {path: 'tr/saka', component: JokeDetailComponent},
                    {path: 'http-404', component: NotFoundComponent},
                    {path: '**', component: NotFoundComponent}
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

    it('should redirect to translation of first-joke', fakeAsync(() => {
        const sNavEvent = activatedRouteStub.initNavigation(fixture, comp.router, 'sakalar', 'saka');
        activatedRouteStub.navigate(fixture, comp.router, ['/saka', 'first-joke']);
        fixture.detectChanges();
        tick();
        sNavEvent.unsubscribe();
        expect(comp.router.url)
            .toEqual('/tr/saka/ilk-saka');
    }));

    it('should redirect to origin route of ilk-saka', fakeAsync(() => {
        const sNavEvent = activatedRouteStub.initNavigation(fixture, comp.router, 'fikralar', 'fikra');
        activatedRouteStub.navigate(fixture, comp.router, ['/fikra', 'ilk-saka']);
        fixture.detectChanges();
        tick();
        sNavEvent.unsubscribe();
        expect(comp.router.url)
            .toEqual('/tr/saka/ilk-saka');
    }));

});
