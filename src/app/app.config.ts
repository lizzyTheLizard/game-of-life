import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners()],
};

export const clientConfig = {
  speed: 100,
  initialColumns: 10,
  initialRows: 10,
  preserveGridOnStop: true,
};
