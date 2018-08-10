import { enableProdMode, InjectionToken } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { getMockEnvironment } from 'ngx-mastermock';

declare var require: any;

if (environment.production) {
  enableProdMode();
}

const context = require.context('./', true, /\.dev\.ts/);
getMockEnvironment().initTestEnvironment(context);

platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.log(err));
