import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';

import { routes } from './app.routes';

/**
 * Global providers of the app.
 * Route parameters are bound to component inputs (e.g. `:id` → `SurveyDetailPage.id`).
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Hash URLs (#/survey/3): works on any FTP host and folder without server rewrites
    provideRouter(routes, withComponentInputBinding(), withHashLocation()),
  ],
};
