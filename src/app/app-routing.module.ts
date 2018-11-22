import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { PlaygroundComponent } from './components/playground/playground.component';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { BlogDetailComponent } from './components/blog-detail/blog-detail.component';
import { PageListComponent } from './components/page-list/page-list.component';
import { PageDetailComponent } from './components/page-detail/page-detail.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';

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
    {
        path: 'blog', component: BlogListComponent
    },
    {
        path: 'blog/:id', component: BlogDetailComponent
    },
    {
        path: 'pages', redirectTo: 'pages/1', pathMatch: 'full'
    },
    {
        path: 'pages/:pageNo', component: PageListComponent
    },
    {
        path: 'page', redirectTo: 'pages/1', pathMatch: 'full'
    },
    {
        path: 'page/:id', component: PageDetailComponent
    },
    {
        path: 'admin-login', component: AdminLoginComponent
    },
    // tr-TR
    {
        path: 'gunluk', component: BlogListComponent
    },
    {
        path: 'gunluk/:id', component: BlogDetailComponent
    },
    {
        path: 'sayfalar', redirectTo: 'sayfalar/1', pathMatch: 'full'
    },
    {
        path: 'sayfalar/:pageNo', component: PageListComponent
    },
    {
        path: 'sayfa', redirectTo: 'sayfalar/1', pathMatch: 'full'
    },
    {
        path: 'sayfa/:id', component: PageDetailComponent
    },
    // end of tr-TR
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
