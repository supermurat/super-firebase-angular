import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { PlaygroundComponent } from './components/playground/playground.component';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { BlogDetailComponent } from './components/blog-detail/blog-detail.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

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
        path: 'blog/:name', component: BlogDetailComponent
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
