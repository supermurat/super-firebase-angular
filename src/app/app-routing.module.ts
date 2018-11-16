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
        path: '', component: HomeComponent // path: '', redirectTo: 'home', pathMatch: 'full'
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
        path: 'pages', component: PageListComponent
    },
    {
        path: 'pages/:id', component: PageListComponent
    },
    {
        path: 'page', component: PageListComponent
    },
    {
        path: 'page/:id', component: PageDetailComponent
    },
    {
        path: 'admin-login', component: AdminLoginComponent
    },
    {
        path: '**', component: NotFoundComponent
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
    }) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule { }
