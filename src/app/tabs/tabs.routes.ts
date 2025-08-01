import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'login',      
    loadComponent: () => import('../pages/onboard/onboard.page').then( m => m.OnboardPage),
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
          import('../modals/ai-plan/ai-plan.page').then( m => m.AiPlanPage),
      },
      {
        path: 'account/profile/edit-profile',
        loadComponent: () =>
          import('../pages/account/profile/edit-profile/edit-profile.page').then( m => m.EditProfilePage),
      },
      {
        path: 'home/view-recommendation/:name',
        loadComponent: () => import('../pages/home/view-recommendation/view-recommendation.page').then(m => m.ViewRecommendationPage),
      },
      {
        path: 'home/view-place/:name',
        loadComponent: () => import('../pages/home/view-place/view-place.page').then(m => m.ViewPlacePage),
      },
      {
        path: 'trips/trip-view/:tripName',
        loadComponent: () =>
          import('../pages/trip-view/trip-view.page').then( m => m.TripViewPage),
      },
      {
        path: '',
        redirectTo: 'tabs/home',
        pathMatch: 'full',
      },
      {
        path: '**',
        loadComponent: () => import('../pages/not-found/not-found.page').then((m) => m.NotFoundPage),
      },
    ],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'prefix',  
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'prefix',  
  },
];
