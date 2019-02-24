import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
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

const routes: Routes = [
    // region home paths
    {
        path: '', redirectTo: 'home', pathMatch: 'full'
    },
    {
        path: 'home', component: HomeComponent
    },
    // endregion
    // region en-US paths
    {
        path: 'blogs', redirectTo: 'blogs/1', pathMatch: 'full'
    },
    {
        path: 'blogs/:pageNo', component: BlogListComponent
    },
    {
        path: 'blog', redirectTo: 'blogs/1', pathMatch: 'full'
    },
    {
        path: 'blog/:id', component: BlogDetailComponent
    },
    {
        path: 'articles', redirectTo: 'articles/1', pathMatch: 'full'
    },
    {
        path: 'articles/:pageNo', component: ArticleListComponent
    },
    {
        path: 'article', redirectTo: 'articles/1', pathMatch: 'full'
    },
    {
        path: 'article/:id', component: ArticleDetailComponent
    },
    {
        path: 'jokes', redirectTo: 'jokes/1', pathMatch: 'full'
    },
    {
        path: 'jokes/:pageNo', component: JokeListComponent
    },
    {
        path: 'joke', redirectTo: 'jokes/1', pathMatch: 'full'
    },
    {
        path: 'joke/:id', component: JokeDetailComponent
    },
    {
        path: 'quotes', redirectTo: 'quotes/1', pathMatch: 'full'
    },
    {
        path: 'quotes/:pageNo', component: QuoteListComponent
    },
    {
        path: 'quote', redirectTo: 'quotes/1', pathMatch: 'full'
    },
    {
        path: 'quote/:id', component: QuoteDetailComponent
    },
    {
        path: 'tag/:id', component: TaxonomyComponent
    },
    // endregion
    // region tr-TR paths
    {
        path: 'gunlukler', redirectTo: 'gunlukler/1', pathMatch: 'full'
    },
    {
        path: 'gunlukler/:pageNo', component: BlogListComponent
    },
    {
        path: 'gunluk', redirectTo: 'gunlukler/1', pathMatch: 'full'
    },
    {
        path: 'gunluk/:id', component: BlogDetailComponent
    },
    {
        path: 'makaleler', redirectTo: 'makaleler/1', pathMatch: 'full'
    },
    {
        path: 'makaleler/:pageNo', component: ArticleListComponent
    },
    {
        path: 'makale', redirectTo: 'makaleler/1', pathMatch: 'full'
    },
    {
        path: 'makale/:id', component: ArticleDetailComponent
    },
    {
        path: 'eglence', redirectTo: 'eglence/1', pathMatch: 'full'
    },
    {
        path: 'eglence/:pageNo', component: JokeListComponent
    },
    {
        path: 'fikralar', redirectTo: 'fikralar/1', pathMatch: 'full'
    },
    {
        path: 'fikralar/:pageNo', component: JokeListComponent
    },
    {
        path: 'fikra', redirectTo: 'eglence/1', pathMatch: 'full'
    },
    {
        path: 'fikra/:id', component: JokeDetailComponent
    },
    {
        path: 'saka', redirectTo: 'eglence/1', pathMatch: 'full'
    },
    {
        path: 'saka/:id', component: JokeDetailComponent
    },
    {
        path: 'espri', redirectTo: 'eglence/1', pathMatch: 'full'
    },
    {
        path: 'espri/:id', component: JokeDetailComponent
    },
    {
        path: 'soguk-espri', redirectTo: 'eglence/1', pathMatch: 'full'
    },
    {
        path: 'soguk-espri/:id', component: JokeDetailComponent
    },
    {
        path: 'alintilar', redirectTo: 'alintilar/1', pathMatch: 'full'
    },
    {
        path: 'alintilar/:pageNo', component: QuoteListComponent
    },
    {
        path: 'alinti', redirectTo: 'alintilar/1', pathMatch: 'full'
    },
    {
        path: 'alinti/:id', component: QuoteDetailComponent
    },
    {
        path: 'guzel-sozler', redirectTo: 'guzel-sozler/1', pathMatch: 'full'
    },
    {
        path: 'guzel-sozler/:pageNo', component: QuoteListComponent
    },
    {
        path: 'guzel-soz', redirectTo: 'guzel-sozler/1', pathMatch: 'full'
    },
    {
        path: 'guzel-soz/:id', component: QuoteDetailComponent
    },
    {
        path: 'etiket/:id', component: TaxonomyComponent
    },
    // endregion
    // region system-admin paths
    {
        path: 'search', component: SearchComponent
    },
    {
        path: 'playground', component: PlaygroundComponent
    },
    {
        path: 'admin-login', component: AdminLoginComponent
    },
    {
        path: 'http-404', component: NotFoundComponent
    },
    {
        path: '**', component: NotFoundComponent // maybe keeping current url is more cool, redirectTo: '404', pathMatch: 'full'
    }
    // endregion
];

/**
 * App Routing Module
 */
@NgModule({
    imports: [RouterModule.forRoot(routes, {
        // router options
        useHash: false,
        preloadingStrategy: PreloadAllModules,
        initialNavigation: 'enabled'
        // enableTracing: true // debugging purposes only
    })],
    exports: [RouterModule]
})
// istanbul ignore next
export class AppRoutingModule {
}
