import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Dev proxy
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { NgxMastermockModule, MastermockInterceptor } from 'ngx-mastermock';

import { environment } from '../environments/environment';
// End Dev proxy

declare var require: any;
export function devProxyContextFactory(): any {
    return require.context('./', true, /\.dev\.ts/);
}



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    NgxMastermockModule.forRoot(environment.useMockData, devProxyContextFactory)
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MastermockInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
