import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
    AngularFirestore,
    AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserCredentialsModel, UserModel } from '../models';

/**
 * Authentication Service
 */
@Injectable({providedIn: 'root'})
export class AuthService {
    /** current user */
    user$: Observable<UserModel>;

    /**
     * constructor of AuthService
     * @param afAuth: AngularFireAuth
     * @param afs: AngularFirestore
     * @param router: Router
     */
    constructor(
        private readonly afAuth: AngularFireAuth,
        private readonly afs: AngularFirestore,
        private readonly router: Router
    ) {
        this.user$ = this.afAuth.authState.pipe(
            switchMap(user => {
                // istanbul ignore else
                if (user) {
                    return this.afs.doc<any>(`users/${user.uid}`)
                        .valueChanges();
                } else {
                    return of(undefined);
                }
            })
        );
    }

    /**
     * register user
     * @param credentials: user credentials
     */
    async register(credentials: UserCredentialsModel): Promise<any> {
        return this.afAuth.auth.createUserWithEmailAndPassword(
                credentials.email,
                credentials.password
            );
    }

    /**
     * log in with credentials
     * @param credentials: user credentials
     */
    async logIn(credentials: UserCredentialsModel): Promise<any> {
        return this.afAuth.auth.signInWithEmailAndPassword(
                credentials.email,
                credentials.password
            );
    }

    /**
     * sign in with google
     */
    async googleSignIn(): Promise<void> {
        const provider = new auth.GoogleAuthProvider();

        return this.oAuthLogin(provider);
    }

    /**
     * sign out
     */
    async signOut(): Promise<boolean> {
        await this.afAuth.auth.signOut();

        return this.router.navigate(['/']);
    }

    /**
     * attempt to login
     * @param provider: Firebase Auth Provider
     */
    private async oAuthLogin(provider): Promise<void> {
        const credential = await this.afAuth.auth.signInWithPopup(provider);

        return this.updateUserData(credential.user);
    }

    /**
     * update current user data
     * @param userData: uid, email, display name, photo URL, etc
     */
    private async updateUserData(userData: UserModel): Promise<void> {
        const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${userData.uid}`);

        return userRef.set(userData, {merge: true});
    }
}
