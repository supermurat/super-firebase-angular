import { RouterModule, PreloadAllModules } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { AlertComponent } from './components/alert/alert.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

import { HomeComponent } from './components/home/home.component';
import { PlaygroundComponent } from './components/playground/playground.component';

import { BlogListComponent } from './components/blog-list/blog-list.component';
import { BlogDetailComponent } from './components/blog-detail/blog-detail.component';

export const appRoutes = RouterModule.forRoot([
    {
        path: '', component: HomeComponent
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
], {
    // Router options
    useHash: false,
    preloadingStrategy: PreloadAllModules,
    initialNavigation: 'enabled'
});

export const appDeclarations: any[] = [
    AppComponent,
    NavMenuComponent,
    AlertComponent,
    NotFoundComponent,

    HomeComponent,
    PlaygroundComponent,

    BlogListComponent,
    BlogDetailComponent
];

