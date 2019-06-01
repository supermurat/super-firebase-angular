import { NgZone } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { RouterTestingModule } from '@angular/router/testing';
import { angularFireAuthStub, credentialsMock } from '../../testing/index.spec';
import { TestHelperModule } from '../../testing/test.helper.module.spec';
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
                {provide: AngularFireAuth, useValue: angularFireAuthStub}
            ],
            imports: [
                TestHelperModule,
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
                {provide: AngularFireAuth, useValue: angularFireAuthStub}
            ],
            imports: [
                TestHelperModule,
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
        fixture.debugElement.injector.get(NgZone)
            .run(() => {
                comp.auth.signOut()
                    .catch(reason => {
                        expect(reason)
                            .toBeUndefined();
                    });
            });
        tick();
        expect(lastUser)
            .toBe(undefined);
    }));
});
