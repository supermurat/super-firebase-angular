import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { PlaygroundComponent } from './components/playground/playground.component';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { BlogDetailComponent } from './components/blog-detail/blog-detail.component';
import { ArticleListComponent } from './components/article-list/article-list.component';
import { ArticleDetailComponent } from './components/article-detail/article-detail.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { TaxonomyComponent } from './components/taxonomy/taxonomy.component';

const routes: Routes = [
    {
        path: '', redirectTo: 'home', pathMatch: 'full'
    },
    {
        path: 'home', component: HomeComponent
    },
    {
        path: 'playground', component: PlaygroundComponent
    },
    // en-US
    {
        path: 'blog', component: BlogListComponent
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
        path: 'tag/:id', component: TaxonomyComponent
    },
    // end of en-US
    // tr-TR
    {
        path: 'gunluk', component: BlogListComponent
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
        path: 'etiket/:id', component: TaxonomyComponent
    },
    // end of tr-TR
    {
        path: 'admin-login', component: AdminLoginComponent
    },
    {
        path: 'http-404', component: NotFoundComponent
    },
    {
        path: '**', component: NotFoundComponent // maybe keeping current url is more cool, redirectTo: '404', pathMatch: 'full'
    }
];

/**
 * App Routing Module
 */
@NgModule({
    imports: [ RouterModule.forRoot(routes, {
        // router options
        useHash: false,
        preloadingStrategy: PreloadAllModules,
        initialNavigation: 'enabled'
        // enableTracing: true // debugging purposes only
    }) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule { }
