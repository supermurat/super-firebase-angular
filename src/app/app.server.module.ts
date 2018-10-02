import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { AppModule } from './app.module';
import { AppComponent } from './components/app/app.component';

@NgModule({
    imports: [
        ServerModule,
        AppModule,
        ServerTransferStateModule
    ],
    bootstrap: [AppComponent]
})
export class AppServerModule { }
