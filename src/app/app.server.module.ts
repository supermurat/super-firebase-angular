import { NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { AppModule } from './app.module';
import { AppComponent } from './components/app/app.component';

import localeTr from '@angular/common/locales/tr';
import localeTrExtra from '@angular/common/locales/extra/tr';
registerLocaleData(localeTr, 'tr', localeTrExtra);

@NgModule({
    imports: [
        ServerModule,
        AppModule,
        ServerTransferStateModule
    ],
    bootstrap: [AppComponent]
})
export class AppServerModule { }
