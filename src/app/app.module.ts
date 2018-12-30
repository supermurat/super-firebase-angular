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
import { APP_CONFIG, APP_DI_CONFIG } from './app-config';
import { AppRoutingModule } from './app-routing.module';
import { AlertComponent } from './components/alert/alert.component';
import { AppComponent } from './components/app/app.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { PagerComponent } from './components/pager/pager.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { ScrollableDirective } from './directives';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component';
import { ArticleListComponent } from './pages/article-list/article-list.component';
import { BlogDetailComponent } from './pages/blog-detail/blog-detail.component';
import { BlogListComponent } from './pages/blog-list/blog-list.component';
import { HomeComponent } from './pages/home/home.component';
import { JokeDetailComponent } from './pages/joke-detail/joke-detail.component';
import { JokeListComponent } from './pages/joke-list/joke-list.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PlaygroundComponent } from './pages/playground/playground.component';
import { QuoteDetailComponent } from './pages/quote-detail/quote-detail.component';
import { QuoteListComponent } from './pages/quote-list/quote-list.component';
import { SearchComponent } from './pages/search/search.component';
import { TaxonomyComponent } from './pages/taxonomy/taxonomy.component';
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
        TaxonomyComponent,
        JokeListComponent,
        JokeDetailComponent,
        QuoteListComponent,
        QuoteDetailComponent,
        SearchComponent
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
        PagerService,
        {provide: APP_CONFIG, useValue: APP_DI_CONFIG}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
