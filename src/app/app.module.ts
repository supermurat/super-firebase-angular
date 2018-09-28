import { NgModule } from '@angular/core';

import {CommonModule} from '@angular/common';
import {BrowserModule, BrowserTransferStateModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFireAuthModule} from '@angular/fire/auth';

import {AlertService, SeoService} from './services';
import {AppComponent} from './components/app/app.component';
import {appDeclarations, appRoutes} from './app.module.routes';

import { firebaseConfig } from '../environments/firebase.config';

@NgModule({
    declarations: appDeclarations,
    imports: [
        CommonModule,
        BrowserModule.withServerTransition({
            appId: 'super-firebase-angular'
        }),
        BrowserTransferStateModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        NgbModule,

        AngularFireModule.initializeApp(firebaseConfig),
        AngularFirestoreModule, // imports firebase/firestore, only needed for database features
        AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
        AngularFireStorageModule, // imports firebase/storage only needed for storage features

        appRoutes
    ],
    providers: [
        AlertService,
        SeoService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
