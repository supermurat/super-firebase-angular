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
        let lastJoke = new JokeModel();
        comp.pageService.getPage()
            .subscribe(joke => {
                lastJoke = joke;
            });
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'jokes', 'joke',
            ['/joke', 'first-joke']);
        expect(lastJoke.id)
            .toEqual('first-joke');
    }));

    it('should load second-joke', fakeAsync(() => {
        let lastJoke = new JokeModel();
        comp.pageService.getPage()
            .subscribe(joke => {
                lastJoke = joke;
            });
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'jokes', 'joke',
            ['/joke', 'second-joke']);
        expect(lastJoke.id)
            .toEqual('second-joke');
    }));

    it("should redirect to '/joke/first-joke' if id is -1", fakeAsync(() => {
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'jokes', 'joke',
            ['/joke', '-1']);
        expect(comp.router.url)
            .toEqual('/joke/first-joke');
    }));

    it("should redirect to '/joke/third-joke' if id is -4", fakeAsync(() => {
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'jokes', 'joke',
            ['/joke', '-4']);
        expect(comp.router.url)
            .toEqual('/joke/third-joke');
    }));

    it('should redirect to translation of ilk-saka', fakeAsync(() => {
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'jokes', 'joke',
            ['/joke', 'ilk-saka']);
        expect(comp.router.url)
            .toEqual('/en/joke/first-joke');
    }));

    it('should redirect to http-404 for not-found-page', fakeAsync(() => {
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'jokes', 'joke',
            ['/joke', 'not-found-page']);
        expect(comp.router.url)
            .toEqual('/joke/not-found-page/http-404');
    }));

    it('should redirect to translation of sadece-turkce-fikra', fakeAsync(() => {
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'jokes', 'joke',
            ['/joke', 'sadece-turkce-fikra']);
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
                {provide: LOCALE_ID, useValue: 'tr'}
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
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'sakalar', 'saka',
            ['/saka', 'first-joke']);
        expect(comp.router.url)
            .toEqual('/tr/saka/ilk-saka');
    }));

    it('should redirect to origin route of ilk-saka', fakeAsync(() => {
        activatedRouteStub.initAndNavigate(fixture, comp.router, 'fikralar', 'fikra',
            ['/fikra', 'ilk-saka']);
        expect(comp.router.url)
            .toEqual('/tr/saka/ilk-saka');
    }));

});
