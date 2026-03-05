import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule
  ],
  template: `
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <mat-toolbar class="!bg-transparent !px-4 md:!px-8">
        <div class="flex items-center justify-between w-full">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center space-x-2">
            <mat-icon class="text-primary-600 dark:text-primary-400 !text-3xl !w-8 !h-8">directions_car</mat-icon>
            <span class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">CarMarket</span>
          </a>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center space-x-1">
            <a routerLink="/buy-car" routerLinkActive="!text-primary-600" 
               class="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Buy Car
            </a>
            <a routerLink="/compare" routerLinkActive="!text-primary-600"
               class="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Compare
            </a>
            <a routerLink="/wishlist" routerLinkActive="!text-primary-600"
               class="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
              <mat-icon [matBadge]="wishlistService.wishlistCount()" 
                        matBadgeColor="warn" 
                        [matBadgeHidden]="wishlistService.wishlistCount() === 0"
                        class="!text-2xl">favorite</mat-icon>
            </a>
          </nav>

          <!-- Right Section -->
          <div class="flex items-center space-x-2">
            <!-- Theme Toggle -->
            <button mat-icon-button (click)="toggleTheme()" class="!text-gray-700 dark:!text-gray-200">
              <mat-icon>{{ themeService.theme() === 'light' ? 'dark_mode' : 'light_mode' }}</mat-icon>
            </button>

            <!-- User Menu -->
            @if (authService.isAuthenticated()) {
              <button mat-button [matMenuTriggerFor]="userMenu" class="!capitalize">
                <mat-icon>account_circle</mat-icon>
                <span class="ml-1 hidden md:inline">{{ authService.currentUser()?.firstName }}</span>
              </button>
              <mat-menu #userMenu="matMenu">
                @if (authService.hasRole('dealer')) {
                  <button mat-menu-item routerLink="/dealer/dashboard">
                    <mat-icon>dashboard</mat-icon>
                    <span>Dashboard</span>
                  </button>
                }
                @if (authService.hasRole('admin')) {
                  <button mat-menu-item routerLink="/admin/dashboard">
                    <mat-icon>admin_panel_settings</mat-icon>
                    <span>Admin Panel</span>
                  </button>
                }
                <button mat-menu-item routerLink="/profile">
                  <mat-icon>person</mat-icon>
                  <span>Profile</span>
                </button>
                <button mat-menu-item (click)="logout()">
                  <mat-icon>logout</mat-icon>
                  <span>Logout</span>
                </button>
              </mat-menu>
            } @else {
              <button mat-raised-button color="primary" routerLink="/login" class="!ml-2">
                Login
              </button>
            }

            <!-- Mobile Menu -->
            <button mat-icon-button [matMenuTriggerFor]="mobileMenu" class="md:!hidden">
              <mat-icon>menu</mat-icon>
            </button>
            <mat-menu #mobileMenu="matMenu">
              <button mat-menu-item routerLink="/buy-car">
                <mat-icon>directions_car</mat-icon>
                <span>Buy Car</span>
              </button>
              <button mat-menu-item routerLink="/compare">
                <mat-icon>compare</mat-icon>
                <span>Compare</span>
              </button>
              <button mat-menu-item routerLink="/wishlist">
                <mat-icon [matBadge]="wishlistService.wishlistCount()" matBadgeColor="warn">favorite</mat-icon>
                <span>Wishlist</span>
              </button>
            </mat-menu>
          </div>
        </div>
      </mat-toolbar>
    </header>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HeaderComponent {
  themeService = inject(ThemeService);
  authService = inject(AuthService);
  wishlistService = inject(WishlistService);

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.authService.logout();
  }
}
