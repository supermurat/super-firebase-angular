import { RouterModule, PreloadAllModules } from '@angular/router';

import { AlertComponent } from './components/alert/alert.component';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

import { HomeComponent } from './components/home/home.component';

export const appRoutes = RouterModule.forRoot([
    {
        path: '', component: HomeComponent
    },
    {
        path: 'home', component: HomeComponent
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
    HomeComponent
];

