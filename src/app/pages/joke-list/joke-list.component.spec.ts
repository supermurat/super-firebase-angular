import { LOCALE_ID } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';
import { angularFirestoreStubNoData } from '../../testing/index.spec';
import { activatedRouteStub, TestHelperModule } from '../../testing/test.helper.module.spec';
import { NotFoundComponent } from '../not-found/not-found.component';
import { JokeListComponent } from './joke-list.component';

describe('JokeListComponent', () => {
    let fixture: ComponentFixture<JokeListComponent>;
    let comp: JokeListComponent;

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                JokeListComponent
            ],
            providers: [],
            imports: [
                TestHelperModule,
                RouterTestingModule.withRoutes([
                    {path: '', redirectTo: 'jokes/1', pathMatch: 'full'},
                    {path: 'jokes', redirectTo: 'jokes/1', pathMatch: 'full'},
                    {path: 'jokes/:pageNo', component: JokeListComponent},
                    {path: 'http-404', component: NotFoundComponent},
                    {path: '**', component: NotFoundComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(JokeListComponent);
                comp = fixture.componentInstance;
                comp.router.initialNavigation();
                tick();
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
        comp.jokes$.subscribe(result => {
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
            .toEqual('/jokes/2');
    }));

    it('should redirect to page 1 if pageNo is lower than 0', fakeAsync(() => {
        activatedRouteStub.setParamMap({pageNo: -2});
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/jokes/1');
    }));

    it('should redirect to page 1 if pageNo is not Number', fakeAsync(() => {
        activatedRouteStub.setParamMap({pageNo: 'not-number'});
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/jokes/1');
    }));

    it('pagerService should work properly even if we set "pagerModel.pagePath" manually', fakeAsync(() => {
        comp.pagerModel.pagePath = '/jokes';
        activatedRouteStub.setParamMap({pageNo: 9}); // page 9 not exist
        comp.checkPageNo();
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/jokes/2');
    }));

});

describe('JokeListComponentNoData', () => {
    let fixture: ComponentFixture<JokeListComponent>;
    let comp: JokeListComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                JokeListComponent
            ],
            providers: [
                {provide: AngularFirestore, useValue: angularFirestoreStubNoData}
            ],
            imports: [
                TestHelperModule,
                RouterTestingModule.withRoutes([
                    {path: '', redirectTo: 'jokes/1', pathMatch: 'full'},
                    {path: 'jokes', redirectTo: 'jokes/1', pathMatch: 'full'},
                    {path: 'jokes/:pageNo', component: JokeListComponent},
                    {path: 'http-404', component: NotFoundComponent},
                    {path: '**', component: NotFoundComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(JokeListComponent);
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

describe('JokeListComponent_tr-TR', () => {
    let fixture: ComponentFixture<JokeListComponent>;
    let comp: JokeListComponent;

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                JokeListComponent
            ],
            providers: [
                {provide: LOCALE_ID, useValue: 'tr'}
            ],
            imports: [
                TestHelperModule,
                RouterTestingModule.withRoutes([
                    {path: '', redirectTo: 'jokes/1', pathMatch: 'full'},
                    {path: 'jokes', redirectTo: 'jokes/1', pathMatch: 'full'},
                    {path: 'jokes/:pageNo', component: JokeListComponent},
                    {path: 'eglence', redirectTo: 'eglence/1', pathMatch: 'full'},
                    {path: 'eglence/:pageNo', component: JokeListComponent},
                    {path: 'http-404', component: NotFoundComponent},
                    {path: '**', component: NotFoundComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(JokeListComponent);
                comp = fixture.componentInstance;
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

    it('should redirect to translation of jokes', fakeAsync(() => {
        activatedRouteStub.navigate(fixture, comp.router, ['/jokes']);
        comp.router.initialNavigation();
        tick();
        fixture.detectChanges();
        tick();
        expect(comp.router.url)
            .toEqual('/tr/eglence');
    }));

});
