import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AlertService, AuthService, PaginationService, SeoService } from './services';
import { ScrollableDirective } from './directives';
import { AppComponent } from './components/app/app.component';
import { AppRoutingModule } from './app-routing.module';

import { firebaseConfig } from '../environments/firebase.config';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { AlertComponent } from './components/alert/alert.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomeComponent } from './components/home/home.component';
import { PlaygroundComponent } from './components/playground/playground.component';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { BlogDetailComponent } from './components/blog-detail/blog-detail.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';

/**
 * App Module
 */
@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        AlertComponent,
        NotFoundComponent,
        HomeComponent,
        PlaygroundComponent,
        BlogListComponent,
        BlogDetailComponent,
        ScrollableDirective,
        LoadingSpinnerComponent
    ],
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
        AngularFirestoreModule.enablePersistence(),
        AngularFirestoreModule, // imports firebase/firestore, only needed for database features
        AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
        AngularFireStorageModule, // imports firebase/storage only needed for storage features

        AppRoutingModule,

        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    ],
    providers: [
        AlertService,
        SeoService,
        AuthService,
        PaginationService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
