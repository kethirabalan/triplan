import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../pages/home/home').then((m) => m.Home),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('../pages/search/search').then((m) => m.Search),
      },
      {
        path: 'trips',
        loadComponent: () =>
          import('../pages/trips/trips').then((m) => m.Trips),
      },
      {
        path: 'review',
        loadComponent: () =>
          import('../pages/review/review').then((m) => m.Review),
      },
      {
        path: 'account',
        loadComponent: () =>
          import('../pages/account/account').then((m) => m.Account),
      },
      {
        path: '',
        redirectTo: 'tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full',
  },
];
