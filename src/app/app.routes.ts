import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'buy-car',
        loadComponent: () => import('./pages/car-listing/car-listing.component').then(m => m.CarListingComponent)
      },
      {
        path: 'car-details/:id',
        loadComponent: () => import('./pages/car-details/car-details.component').then(m => m.CarDetailsComponent)
      },
      {
        path: 'compare',
        loadComponent: () => import('./pages/compare-cars/compare-cars.component').then(m => m.CompareCarsComponent)
      },
      {
        path: 'wishlist',
        loadComponent: () => import('./pages/wishlist/wishlist.component').then(m => m.WishlistComponent)
      },
      {
        path: 'dealer/dashboard',
        loadComponent: () => import('./pages/dealer-dashboard/dealer-dashboard.component').then(m => m.DealerDashboardComponent)
      },
      {
        path: 'admin/dashboard',
        loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
