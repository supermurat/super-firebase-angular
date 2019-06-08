import { registerLocaleData } from '@angular/common';
import localeTrExtra from '@angular/common/locales/extra/tr';
import localeTr from '@angular/common/locales/tr';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { AppModule } from '../app.module';
import { AppComponent } from '../components/app/app.component';

registerLocaleData(localeTr, 'tr', localeTrExtra);

/**
 * App Server Module
 */
@NgModule({
    imports: [
        ServerModule,
        AppModule,
        ServerTransferStateModule,
        NoopAnimationsModule
    ],
    bootstrap: [AppComponent]
})
export class AppServerModule {
}
