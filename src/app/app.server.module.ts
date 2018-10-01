import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppModule } from './app.module';
import { AppComponent } from './components/app/app.component';

@NgModule({
  imports: [
    ServerModule,
    AppModule
  ],
  bootstrap: [AppComponent]
})
export class AppServerModule { }
