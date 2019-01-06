import { Subject } from 'rxjs';
import { angularFirestoreStub } from './angular-firestore-stub.spec';

const fakeAuthState = new Subject();

export const credentialsMock = {
    email: 'super-user@example.com',
    password: 'password'
};

export const angularFireAuthStub = {
    authState: {
        pipe(queryFnPipe?: any): any {
            queryFnPipe({
                lift(queryFnLift?: any): any {
                    queryFnLift.call({}, {
                        subscribe(queryFnSubscribe): any {
                            queryFnSubscribe._next({
                                switchMap(queryFnSwitchMap): any {
                                    return queryFnSwitchMap({uid: 'super-user'});
                                }
                            });
                        }
                    });

                    return fakeAuthState;
                }
            });

            return fakeAuthState;
        }
    },
    auth: {
        async createUserWithEmailAndPassword(email, password): Promise<any> {
            const pUser = angularFirestoreStub.doc('users/super-user')
                .valueChanges();
            pUser.subscribe(user => {
                fakeAuthState.next(user);
            });

            return pUser;
        },
        async signInWithEmailAndPassword(email, password): Promise<any> {
            const pUser = angularFirestoreStub.doc('users/super-user')
                .valueChanges();
            pUser.subscribe(user => {
                fakeAuthState.next(user);
            });

            return pUser;
        },
        async signOut(): Promise<any> {
            fakeAuthState.next(undefined);

            return Promise.resolve();
        }
    }
};
