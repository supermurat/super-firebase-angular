import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppModule } from '../app.module';
import { AppComponent } from '../components/app/app.component';

/**
 * App Browser Module
 */
@NgModule({
    imports: [
        AppModule,
        BrowserAnimationsModule
    ],
    bootstrap: [AppComponent]
})
export class AppBrowserModule {
}
