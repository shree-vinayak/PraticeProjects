import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Required for Logging on console
import { Log } from 'ng2-logger';


if (environment.production) {

  // Disable Logging Information
  Log.setProductionMode();

  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
