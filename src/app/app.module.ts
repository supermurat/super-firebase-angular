import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../environments/environment';
import { firebaseConfig } from '../environments/firebase.config';
import { AppRoutingModule } from './app-routing.module';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AlertComponent } from './components/alert/alert.component';
import { AppComponent } from './components/app/app.component';
import { ArticleDetailComponent } from './components/article-detail/article-detail.component';
import { ArticleListComponent } from './components/article-list/article-list.component';
import { BlogDetailComponent } from './components/blog-detail/blog-detail.component';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PagerComponent } from './components/pager/pager.component';
import { PlaygroundComponent } from './components/playground/playground.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { TaxonomyComponent } from './components/taxonomy/taxonomy.component';
import { ScrollableDirective } from './directives';
import { AlertService, AuthService, PagerService, PaginationService, SeoService } from './services';

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
        ArticleListComponent,
        ArticleDetailComponent,
        ScrollableDirective,
        LoadingSpinnerComponent,
        AdminLoginComponent,
        FooterComponent,
        SideBarComponent,
        PagerComponent,
        TaxonomyComponent
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

        ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production})
    ],
    providers: [
        AlertService,
        SeoService,
        AuthService,
        PaginationService,
        PagerService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
