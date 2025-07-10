import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'splash', pathMatch: 'full' },
  { path: 'splash', loadComponent: () => import('./splash/splash.page').then(m => m.SplashPage ) },
  {
    path: 'main',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
];
