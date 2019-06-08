import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// tslint:disable:no-import-side-effect
import '@fortawesome/fontawesome-free';
// tslint:disable:no-import-side-effect
import 'bootstrap';
import { AppBrowserModule } from './app/modules/app.browser.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

// This event listener is for loading TransferState on Client. Without this; browser does not load state
document.addEventListener('DOMContentLoaded', () => {
    platformBrowserDynamic()
        .bootstrapModule(AppBrowserModule)
        .catch(reason => {
            console.error(reason);
        });
});
