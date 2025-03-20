import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {  provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './interceptors/auth.interceptor';
import { QRCodeModule, QRCodeComponent } from 'angularx-qrcode';



export const appConfig: ApplicationConfig = {

  providers: [  provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
     provideClientHydration(), provideHttpClient(withInterceptors([authInterceptor])), provideToastr(),provideAnimations(), QRCodeModule, QRCodeComponent,  ]
};
