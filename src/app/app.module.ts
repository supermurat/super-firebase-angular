import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { CookieLawModule } from 'angular2-cookie-law';
import { Angulartics2Module } from 'angulartics2';

import { environment } from '../environments/environment';

import { APP_CONFIG, APP_DI_CONFIG } from './app-config';
import { AppRoutingModule } from './app-routing.module';
import { AlertComponent } from './components/alert/alert.component';
import { AppComponent } from './components/app/app.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { PagerComponent } from './components/pager/pager.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { ScrollableDirective } from './directives';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component';
import { ArticleListComponent } from './pages/article-list/article-list.component';
import { BlogDetailComponent } from './pages/blog-detail/blog-detail.component';
import { BlogListComponent } from './pages/blog-list/blog-list.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HomeComponent } from './pages/home/home.component';
import { JokeDetailComponent } from './pages/joke-detail/joke-detail.component';
import { JokeListComponent } from './pages/joke-list/joke-list.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PlaygroundComponent } from './pages/playground/playground.component';
import { QuoteDetailComponent } from './pages/quote-detail/quote-detail.component';
import { QuoteListComponent } from './pages/quote-list/quote-list.component';
import { SearchComponent } from './pages/search/search.component';
import { TaxonomyComponent } from './pages/taxonomy/taxonomy.component';
import {
    AlertService, CarouselService, ConfigService, JsonLDService,
    PagerService, PageService, PaginationService, SeoService
} from './services';
import { ActiveTagsComponent } from './widgets/active-tags/active-tags.component';
import { CustomHtmlComponent } from './widgets/custom-html/custom-html.component';
import { LastJokesComponent } from './widgets/last-jokes/last-jokes.component';
import { SearchBarComponent } from './widgets/search-bar/search-bar.component';

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
        FooterComponent,
        SideBarComponent,
        PagerComponent,
        TaxonomyComponent,
        JokeListComponent,
        JokeDetailComponent,
        QuoteListComponent,
        QuoteDetailComponent,
        SearchComponent,
        CarouselComponent,
        ActiveTagsComponent,
        LastJokesComponent,
        SearchBarComponent,
        CustomHtmlComponent,
        ContactComponent
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

        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule.enablePersistence(),
        AngularFirestoreModule, // imports firebase/firestore, only needed for database features
        AngularFireStorageModule, // imports firebase/storage only needed for storage features

        AppRoutingModule,
        Angulartics2Module.forRoot(environment.Angulartics2),
        LoadingBarRouterModule,
        LoadingBarModule,
        CookieLawModule,

        ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production})
    ],
    providers: [
        AlertService,
        SeoService,
        JsonLDService,
        PaginationService,
        PagerService,
        CarouselService,
        PageService,
        ConfigService,
        {provide: APP_CONFIG, useValue: APP_DI_CONFIG}
    ],
    bootstrap: [AppComponent]
})
// istanbul ignore next
export class AppModule {
}
