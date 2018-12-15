import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { AdminLoginComponent } from './admin-login.component';
import { AuthService, SeoService } from '../../services';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { RouterTestingModule } from '@angular/router/testing';
import { from, Subject } from 'rxjs';

const credentialsMock = {
    email: 'abc@123.com',
    password: 'password'
};

const userMock = {
    uid: 'ABC123',
    email: credentialsMock.email
};

const angularFirestoreStub = {
    doc: jasmine.createSpy('doc').and
        .returnValue(
            {
                valueChanges: jasmine.createSpy('valueChanges').and
                    .returnValue(from([userMock]))
            })
};

let fakeAuthState = new Subject();

const fakeSignInHandler = (email, password): Promise<any> => {
    fakeAuthState.next(userMock);

    return Promise.resolve(userMock);
};

const fakeSignOutHandler = (): Promise<any> => {
    fakeAuthState.next(undefined);

    return Promise.resolve();
};

const angularFireAuthStub = {
    authState: {
        pipe(): any {
            return fakeAuthState;
        }
    },
    auth: {
        createUserWithEmailAndPassword: jasmine
            .createSpy('createUserWithEmailAndPassword')
            .and
            .callFake(fakeSignInHandler),
        signInWithEmailAndPassword: jasmine
            .createSpy('signInWithEmailAndPassword')
            .and
            .callFake(fakeSignInHandler),
        signOut: jasmine
            .createSpy('signOut')
            .and
            .callFake(fakeSignOutHandler)
    }
};

describe('AdminLoginComponent', () => {
    let component: AdminLoginComponent;
    let fixture: ComponentFixture<AdminLoginComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AdminLoginComponent
            ],
            providers: [
                SeoService, AuthService,
                { provide: AngularFirestore, useValue: angularFirestoreStub },
                { provide: AngularFireAuth, useValue: angularFireAuthStub }
            ],
            imports: [
                RouterTestingModule.withRoutes([{path: '', component: AdminLoginComponent}])
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminLoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component)
            .toBeTruthy();
    });
});

describe('AdminLoginComponentAuthService', () => {
    let afAuth: AngularFireAuth;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                AdminLoginComponent
            ],
            providers: [
                SeoService, AuthService,
                { provide: AngularFirestore, useValue: angularFirestoreStub },
                { provide: AngularFireAuth, useValue: angularFireAuthStub }
            ],
            imports: [
                RouterTestingModule.withRoutes([{path: '', component: AdminLoginComponent}])
            ]
        })
            .compileComponents();

        afAuth = TestBed.get(AngularFireAuth);
        fakeAuthState = new Subject();
    });

    it('should be created', () => {
        const fixture = TestBed.createComponent(AdminLoginComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.auth)
            .toBeTruthy();
    });

    it('should not be initially authenticated', fakeAsync(() => {
        const fixture = TestBed.createComponent(AdminLoginComponent);
        const app = fixture.debugElement.componentInstance;
        let lastUser;
        app.auth.user$.subscribe(user => {
            lastUser = user;
        });
        tick();
        expect(lastUser)
            .toBe(undefined);
    }));

    it('should be authenticated after register', () => {
        const fixture = TestBed.createComponent(AdminLoginComponent);
        const app = fixture.debugElement.componentInstance;
        app.auth.register(credentialsMock);

        expect(afAuth.auth.createUserWithEmailAndPassword)
            .toHaveBeenCalledWith(credentialsMock.email, credentialsMock.password);

        app.auth.user$.subscribe(user => {
            expect(user)
                .toBeDefined();
            expect(user.email)
                .toEqual(credentialsMock.email);
        });
    });

    it('should be authenticated after logging in', fakeAsync(() => {
        const fixture = TestBed.createComponent(AdminLoginComponent);
        const app = fixture.debugElement.componentInstance;
        let lastUser;
        app.auth.user$.subscribe(user => {
            lastUser = user;
        });
        app.auth.logIn(credentialsMock);
        tick();

        expect(afAuth.auth.signInWithEmailAndPassword)
            .toHaveBeenCalledWith(credentialsMock.email, credentialsMock.password);
        expect(lastUser)
            .toBeDefined();
        expect(lastUser.email)
            .toEqual(credentialsMock.email);
    }));

    it('should not be authenticated after logging out', fakeAsync(() => {
        const fixture = TestBed.createComponent(AdminLoginComponent);
        const app = fixture.debugElement.componentInstance;
        let lastUser;
        app.auth.user$.subscribe(user => {
            lastUser = user;
        });
        fakeAuthState.next(userMock);
        // fixing this would be better
        /*app.auth.user$.subscribe(user => {
            expect(user)
                .toBeDefined();
            expect(user.email)
                .toEqual(credentialsMock.email);
        });*/

        app.auth.signOut();
        tick();
        expect(lastUser)
            .toBe(undefined);
    }));
});
