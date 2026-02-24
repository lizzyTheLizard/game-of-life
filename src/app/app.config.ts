import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

export interface ClientConfig {
  speed: number;
  initialColumns: number;
  initialRows: number;
  preserveGridOnStop: boolean;
}

export const appConfig: ApplicationConfig & { client: ClientConfig } = {
  providers: [provideBrowserGlobalErrorListeners()],
  client: {
    speed: 100,
    initialColumns: 10,
    initialRows: 10,
    preserveGridOnStop: true,
  },
};
