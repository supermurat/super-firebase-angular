import { NgModule } from '@angular/core';

import { AppComponent } from './components/app/app.component';
import {appDeclarations, appRoutes} from './app.module.routes';
import {CommonModule} from '@angular/common';
import {BrowserModule, BrowserTransferStateModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AlertService, SeoService} from './services';

@NgModule({
    declarations: appDeclarations,
    imports: [
        CommonModule,
        BrowserModule.withServerTransition({
            appId: 'super-firebase-angular'
        }),
        BrowserTransferStateModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,

        appRoutes
    ],
    providers: [
        AlertService,
        SeoService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
