import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { map } from 'rxjs';

const isLoggedIn = () => {
  const userService = inject(UserService);
  return userService.getCurrentUser$().pipe(map((user) => {
    if (user) {
      return false;
    }
    return true;
  }));
}

export const routes: Routes = [
  {
    path: 'onboard-welcome',
    loadComponent: () => import('../pages/onboard/onboard.page').then( m => m.OnboardPage),
    // canActivate: [isLoggedIn],
  },
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
        path: 'home/notifications',
        loadComponent: () => import('../modals/notifications/notifications.page').then( m => m.NotificationsPage)
      },
      {
        path: 'home/search',
        loadComponent: () =>
          import('../pages/search/search').then((m) => m.Search),
      },
      {
        path: 'search/trips',
        loadComponent: () =>
          import('../pages/trips/trips').then((m) => m.Trips),
      },
      {
        path: 'account/profile',
        loadComponent: () => import('../pages/account/profile/profile.page').then( m => m.ProfilePage)
      },
      {
        path: 'account/bookings',
        loadComponent: () => import('../modals/bookings/bookings.page').then( m => m.BookingsPage)
      },
      {
        path: 'account/rewards',
        loadComponent: () => import('../pages/account/rewards/rewards.page').then( m => m.RewardsPage)
      },
      {
        path: 'account/notifications',
        loadComponent: () => import('../modals/notifications/notifications.page').then( m => m.NotificationsPage)
      },
      {
        path: 'account/preferences',
        loadComponent: () => import('../pages/account/preferences/preferences.page').then( m => m.PreferencesPage)
      },
      {
        path: 'account/support',
        loadComponent: () => import('../pages/account/support/support.page').then( m => m.SupportPage)
      },
      {
        path: 'trips/trip-view',
        loadComponent: () =>
          import('../pages/trip-view/trip-view.page').then( m => m.TripViewPage),
      },
      {
        path: 'trips/ai-plan',
        loadComponent: () =>
          import('../pages/ai-plan/ai-plan.page').then( m => m.AiPlanPage),
      },
      {
        path: 'account/profile/edit-profile',
        loadComponent: () =>
          import('../pages/account/profile/edit-profile/edit-profile.page').then( m => m.EditProfilePage),
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
