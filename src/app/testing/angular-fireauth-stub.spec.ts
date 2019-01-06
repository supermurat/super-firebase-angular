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
                                    const retVal: Array<any> = [];
                                    fakeAuthState.subscribe(item => {
                                        retVal.push(queryFnSwitchMap(item));
                                    });

                                    return retVal;
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
        async signInWithPopup(provider): Promise<any> {
            const pUser = await angularFirestoreStub.doc('users/super-user')
                .valueChanges();
            let lastUser;
            await pUser.subscribe(user => {
                fakeAuthState.next(user);
                lastUser = user;
            });

            return {user: lastUser};
        },
        async signOut(): Promise<any> {
            fakeAuthState.next(undefined);

            return Promise.resolve();
        }
    }
};
