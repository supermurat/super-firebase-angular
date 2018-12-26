import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// tslint:disable:no-import-side-effect
import '@fortawesome/fontawesome-free';
// tslint:disable:no-import-side-effect
import 'bootstrap';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(AppModule);
