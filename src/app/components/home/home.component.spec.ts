import { async, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';

import { AlertService, AuthService, SeoService } from '../../services';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
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

describe('HomeComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                HomeComponent
            ],
            providers: [
                AlertService, SeoService, AuthService,
                { provide: AngularFirestore, useValue: angularFirestoreStub },
                { provide: AngularFireAuth, useValue: angularFireAuthStub }
            ],
            imports: [
                RouterTestingModule.withRoutes([{path: '', component: HomeComponent}])
            ]
        })
            .compileComponents();
    }));

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(HomeComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app)
            .toBeTruthy();
    }));

    it("should have as title 'home'", async(() => {
        const fixture = TestBed.createComponent(HomeComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title)
            .toEqual('home');
    }));

    it("should render 'Welcome!' in a h1", async(() => {
        const fixture = TestBed.createComponent(HomeComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h1').textContent)
            .toContain('Welcome!');
    }));

});

describe('HomeComponentAuthService', () => {
    let afAuth: AngularFireAuth;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                HomeComponent
            ],
            providers: [
                AlertService, SeoService, AuthService,
                { provide: AngularFirestore, useValue: angularFirestoreStub },
                { provide: AngularFireAuth, useValue: angularFireAuthStub }
            ],
            imports: [
                RouterTestingModule.withRoutes([{path: '', component: HomeComponent}])
            ]
        })
            .compileComponents();

        afAuth = TestBed.get(AngularFireAuth);
        fakeAuthState = new Subject();
    });

    it('should be created', () => {
        const fixture = TestBed.createComponent(HomeComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.auth)
            .toBeTruthy();
    });

    it('should not be initially authenticated', () => {
        const fixture = TestBed.createComponent(HomeComponent);
        const app = fixture.debugElement.componentInstance;
        app.auth.user$.subscribe(user => {
            expect(user)
                .toBe(undefined);
        });
    });

    it('should be authenticated after register', () => {
        const fixture = TestBed.createComponent(HomeComponent);
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

    it('should be authenticated after logging in', () => {
        const fixture = TestBed.createComponent(HomeComponent);
        const app = fixture.debugElement.componentInstance;
        app.auth.logIn(credentialsMock);

        expect(afAuth.auth.signInWithEmailAndPassword)
            .toHaveBeenCalledWith(credentialsMock.email, credentialsMock.password);

        app.auth.user$.subscribe(user => {
            expect(user)
                .toBeDefined();
            expect(user.email)
                .toEqual(credentialsMock.email);
        });
    });

    it('should not be authenticated after logging out', () => {
        const fixture = TestBed.createComponent(HomeComponent);
        const app = fixture.debugElement.componentInstance;
        fakeAuthState.next(userMock);
        // fixing this would be better
        /*app.auth.user$.subscribe(user => {
            expect(user)
                .toBeDefined();
            expect(user.email)
                .toEqual(credentialsMock.email);
        });*/

        app.auth.signOut();

        app.auth.user$.subscribe(user => {
            expect(user)
                .toBe(undefined);
        });
    });
});
