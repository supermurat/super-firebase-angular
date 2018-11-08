import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

/**
 * Authentication Service
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
    /** current user */
    user$: Observable<any>;

    /**
     * constructor of AuthService
     * @param afAuth: AngularFireAuth
     * @param afs: AngularFirestore
     * @param router: Router
     */
    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router
    ) {
        this.user$ = this.afAuth.authState.pipe(
            switchMap(user => {
                if (user)
                    return this.afs.doc<any>(`users/${user.uid}`)
                        .valueChanges();
                else
                    return of(undefined);
            })
        );
    }

    /**
     * sign in with google
     */
    googleSignIn(): Promise<void> {
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
     * @param uid: uid
     * @param email: email
     * @param displayName: display name
     * @param photoURL: photo URL
     */
    private updateUserData({uid, email, displayName, photoURL}): Promise<void> {
        const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);

        const data = {
            uid,
            email,
            displayName,
            photoURL
        };

        return userRef.set(data, {merge: true});
    }
}
