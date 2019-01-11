import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { TransferState } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_CONFIG, APP_UNIT_TEST_CONFIG } from '../../app-config';
import { AlertService, AuthService, CarouselService, PageService, SeoService } from '../../services';
import { angularFireAuthStub, angularFirestoreStub, credentialsMock } from '../../testing/index.spec';
import { AdminLoginComponent } from './admin-login.component';

describe('AdminLoginComponent', () => {
    let fixture: ComponentFixture<AdminLoginComponent>;
    let comp: AdminLoginComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AdminLoginComponent
            ],
            providers: [
                AlertService, SeoService, TransferState, CarouselService, PageService, AuthService,
                {provide: AngularFirestore, useValue: angularFirestoreStub},
                {provide: AngularFireAuth, useValue: angularFireAuthStub},
                {provide: APP_CONFIG, useValue: APP_UNIT_TEST_CONFIG}
            ],
            imports: [
                RouterTestingModule.withRoutes([{path: '', component: AdminLoginComponent}])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(AdminLoginComponent);
                comp = fixture.componentInstance;
                fixture.detectChanges();
            })
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
    }));

    it('should create', async(() => {
        expect(comp)
            .toBeTruthy();
    }));
});

describe('AdminLoginComponentAuthService', () => {
    let fixture: ComponentFixture<AdminLoginComponent>;
    let comp: AdminLoginComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AdminLoginComponent
            ],
            providers: [
                AlertService, SeoService, TransferState, CarouselService, PageService, AuthService,
                {provide: AngularFirestore, useValue: angularFirestoreStub},
                {provide: AngularFireAuth, useValue: angularFireAuthStub},
                {provide: APP_CONFIG, useValue: APP_UNIT_TEST_CONFIG}
            ],
            imports: [
                RouterTestingModule.withRoutes([{path: '', component: AdminLoginComponent}])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(AdminLoginComponent);
                comp = fixture.componentInstance;
                fixture.detectChanges();
            })
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
    }));

    it('should be created', fakeAsync(() => {
        expect(comp.auth)
            .toBeTruthy();
    }));

    it('should not be initially authenticated', fakeAsync(() => {
        let lastUser;
        comp.auth.user$.subscribe(user => {
            lastUser = user;
        });
        tick();
        expect(lastUser)
            .toBe(undefined);
    }));

    it('should be authenticated after register', fakeAsync(() => {
        let lastUser;
        comp.auth.user$.subscribe(user => {
            lastUser = user;
        });
        comp.auth.register(credentialsMock)
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
        tick();

        expect(lastUser)
            .toBeDefined();
        expect(lastUser.email)
            .toEqual(credentialsMock.email);
    }));

    it('should be authenticated after logging in', fakeAsync(() => {
        let lastUser;
        comp.auth.user$.subscribe(user => {
            lastUser = user;
        });
        comp.auth.logIn(credentialsMock)
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
        tick();

        expect(lastUser)
            .toBeDefined();
        expect(lastUser.email)
            .toEqual(credentialsMock.email);
    }));

    it('should be authenticated after googleSignIn()', fakeAsync(() => {
        let lastUser;
        comp.auth.user$.subscribe(user => {
            lastUser = user;
        });
        comp.auth.googleSignIn()
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
        tick();

        expect(lastUser)
            .toBeDefined();
        expect(lastUser.email)
            .toEqual(credentialsMock.email);
    }));

    it('should not be authenticated after logging out', fakeAsync(() => {
        let lastUser;
        comp.auth.user$.subscribe(user => {
            lastUser = user;
        });
        comp.auth.logIn(credentialsMock)
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
        tick();
        comp.auth.signOut()
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
        tick();
        expect(lastUser)
            .toBe(undefined);
    }));
});
