import { async, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';

import { AlertService, AuthService, SeoService } from '../../services';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, from } from 'rxjs';

const testData: Array<any> = [
    {uid: 'ABC123', email: 'abc@123.com'}
];

const angularFirestoreStub = {
    doc: jasmine.createSpy('doc').and
        .returnValue(
            {
                valueChanges: jasmine.createSpy('valueChanges').and
                    .returnValue(from(testData))
            })
};

const credentialsMock = {
    email: 'abc@123.com',
    password: 'password'
};

const userMock = {
    uid: 'ABC123',
    email: credentialsMock.email
};

const fakeAuthState = new BehaviorSubject(undefined);

const fakeSignInHandler = (email, password): Promise<any> => {
    fakeAuthState.next(userMock);

    return Promise.resolve(userMock);
};

const fakeSignOutHandler = (): Promise<any> => {
    fakeAuthState.next(undefined);

    return Promise.resolve();
};

const angularFireAuthStub = {
    authState: fakeAuthState,
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
