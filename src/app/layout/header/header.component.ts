import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { WishlistService } from '../../services/wishlist.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatTooltipModule
  ],
  template: `
    <!-- Classy Modern Header -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          
          <!-- Logo Section -->
          <div class="flex items-center space-x-8">
            <a routerLink="/" class="flex items-center space-x-3 group">
              <div class="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <mat-icon class="!text-white !text-2xl !w-6 !h-6">directions_car</mat-icon>
              </div>
              <div class="hidden sm:block">
                <span class="text-xl font-bold text-gray-900 dark:text-white">CarMarket</span>
                <div class="text-xs text-gray-500 dark:text-gray-400 -mt-0.5">Find Your Dream Car</div>
              </div>
            </a>

            <!-- Desktop Navigation -->
            <nav class="hidden lg:flex items-center space-x-1">
              <a
                routerLink="/"
                routerLinkActive="active-link"
                [routerLinkActiveOptions]="{exact: true}"
                class="nav-link"
              >
                <mat-icon class="nav-icon">home</mat-icon>
                <span>Home</span>
              </a>

              <a
                routerLink="/buy-car"
                [queryParams]="{filter: 'new'}"
                routerLinkActive="active-link"
                class="nav-link"
              >
                <mat-icon class="nav-icon">new_releases</mat-icon>
                <span>New Cars</span>
              </a>

              <a
                routerLink="/buy-car"
                routerLinkActive="active-link"
                class="nav-link"
              >
                <mat-icon class="nav-icon">local_taxi</mat-icon>
                <span>Used Cars</span>
              </a>

              <a
                routerLink="/compare"
                routerLinkActive="active-link"
                class="nav-link"
              >
                <mat-icon class="nav-icon">compare_arrows</mat-icon>
                <span>Compare</span>
              </a>

              <button
                mat-button
                [matMenuTriggerFor]="dealersMenu"
                class="nav-link"
              >
                <mat-icon class="nav-icon">store</mat-icon>
                <span>Dealers</span>
                <mat-icon class="!text-base !ml-1">expand_more</mat-icon>
              </button>
            </nav>
          </div>

          <!-- Search Bar - Center -->
          <div class="hidden md:flex flex-1 max-w-md mx-4">
            <div class="relative w-full">
              <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 !text-xl">search</mat-icon>
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (keyup.enter)="onSearch()"
                placeholder="Search by brand, model, or location..."
                class="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm transition-all"
              />
            </div>
          </div>

          <!-- Right Actions -->
          <div class="flex items-center space-x-1">
            
            <!-- Wishlist -->
            <button
              mat-icon-button
              routerLink="/wishlist"
              class="action-btn"
              [matTooltip]="'Wishlist'"
            >
              <mat-icon
                [matBadge]="wishlistService.wishlistCount()"
                matBadgeColor="warn"
                [matBadgeHidden]="wishlistService.wishlistCount() === 0"
                matBadgeSize="small"
              >
                favorite_border
              </mat-icon>
            </button>

            <!-- Theme Toggle -->
            <button
              mat-icon-button
              (click)="toggleTheme()"
              class="action-btn"
              [matTooltip]="'Toggle theme'"
            >
              <mat-icon>{{ themeService.theme() === 'light' ? 'dark_mode' : 'light_mode' }}</mat-icon>
            </button>

            <!-- User Menu -->
            @if (authService.isAuthenticated()) {
              <button
                mat-button
                [matMenuTriggerFor]="profileMenu"
                class="!ml-2 !rounded-lg hover:!bg-gray-100 dark:hover:!bg-gray-800"
              >
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-xs font-semibold">
                    {{ authService.currentUser()?.firstName?.charAt(0) }}{{ authService.currentUser()?.lastName?.charAt(0) }}
                  </div>
                  <span class="hidden xl:inline-block text-sm font-medium">{{ authService.currentUser()?.firstName }}</span>
                  <mat-icon class="!text-lg">expand_more</mat-icon>
                </div>
              </button>
            } @else {
              <button
                mat-button
                routerLink="/login"
                class="!ml-2 !bg-red-500 hover:!bg-red-600 !text-white !rounded-lg !px-6 !font-medium !transition-all"
              >
                <mat-icon class="!text-lg mr-1">login</mat-icon>
                Login
              </button>
            }

            <!-- Mobile Menu Toggle -->
            <button
              mat-icon-button
              (click)="mobileMenuOpen.set(!mobileMenuOpen())"
              class="lg:!hidden action-btn"
            >
              <mat-icon>{{ mobileMenuOpen() ? 'close' : 'menu' }}</mat-icon>
            </button>
          </div>

        </div>

        <!-- Mobile Search Bar -->
        <div class="md:hidden pb-3">
          <div class="relative">
            <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 !text-xl">search</mat-icon>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (keyup.enter)="onSearch()"
              placeholder="Search cars..."
              class="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      <!-- Mobile Menu Dropdown -->
      @if (mobileMenuOpen()) {
        <div class="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div class="max-w-7xl mx-auto px-4 py-4">
            <nav class="space-y-1">
              <a
                routerLink="/"
                (click)="closeMobileMenu()"
                routerLinkActive="mobile-active"
                [routerLinkActiveOptions]="{exact: true}"
                class="mobile-nav-link"
              >
                <mat-icon class="!text-xl">home</mat-icon>
                <span>Home</span>
              </a>

              <a
                routerLink="/buy-car"
                [queryParams]="{filter: 'new'}"
                (click)="closeMobileMenu()"
                class="mobile-nav-link"
              >
                <mat-icon class="!text-xl">new_releases</mat-icon>
                <span>New Cars</span>
              </a>

              <a
                routerLink="/buy-car"
                (click)="closeMobileMenu()"
                routerLinkActive="mobile-active"
                class="mobile-nav-link"
              >
                <mat-icon class="!text-xl">local_taxi</mat-icon>
                <span>Used Cars</span>
              </a>

              <a
                routerLink="/compare"
                (click)="closeMobileMenu()"
                routerLinkActive="mobile-active"
                class="mobile-nav-link"
              >
                <mat-icon class="!text-xl">compare_arrows</mat-icon>
                <span>Compare</span>
              </a>

              <a
                routerLink="/buy-car"
                (click)="closeMobileMenu()"
                class="mobile-nav-link"
              >
                <mat-icon class="!text-xl">store</mat-icon>
                <span>Find Dealers</span>
              </a>

              <a
                routerLink="/wishlist"
                (click)="closeMobileMenu()"
                routerLinkActive="mobile-active"
                class="mobile-nav-link"
              >
                <mat-icon 
                  [matBadge]="wishlistService.wishlistCount()" 
                  matBadgeSize="small" 
                  [matBadgeHidden]="wishlistService.wishlistCount() === 0"
                  class="!text-xl"
                >
                  favorite_border
                </mat-icon>
                <span>Wishlist</span>
              </a>

              @if (authService.hasRole('dealer')) {
                <div class="border-t border-gray-200 dark:border-gray-700 my-2 pt-2">
                  <a
                    routerLink="/dealer/dashboard"
                    (click)="closeMobileMenu()"
                    class="mobile-nav-link"
                  >
                    <mat-icon class="!text-xl">dashboard</mat-icon>
                    <span>Dealer Dashboard</span>
                  </a>
                </div>
              }

              @if (authService.hasRole('admin')) {
                <a
                  routerLink="/admin/dashboard"
                  (click)="closeMobileMenu()"
                  class="mobile-nav-link"
                >
                  <mat-icon class="!text-xl">admin_panel_settings</mat-icon>
                  <span>Admin Panel</span>
                </a>
              }
            </nav>

            @if (!authService.isAuthenticated()) {
              <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  mat-raised-button
                  routerLink="/login"
                  (click)="closeMobileMenu()"
                  class="w-full !bg-red-500 hover:!bg-red-600 !text-white !rounded-lg !py-2.5"
                >
                  <mat-icon>login</mat-icon>
                  Login / Register
                </button>
              </div>
            }
          </div>
        </div>
      }
    </header>

    <!-- Spacer -->
    <div class="h-16"></div>

    <!-- Dealers Menu -->
    <mat-menu #dealersMenu="matMenu" class="dealers-menu">
      <button mat-menu-item routerLink="/buy-car">
        <mat-icon>search</mat-icon>
        <span>Find Dealers</span>
      </button>
      <button mat-menu-item routerLink="/dealer/dashboard">
        <mat-icon>dashboard</mat-icon>
        <span>Dealer Dashboard</span>
      </button>
      <mat-divider></mat-divider>
      <button mat-menu-item>
        <mat-icon>verified</mat-icon>
        <span>Verified Dealers</span>
      </button>
      <button mat-menu-item>
        <mat-icon>workspace_premium</mat-icon>
        <span>Premium Dealers</span>
      </button>
    </mat-menu>

    <!-- Profile Menu -->
    <mat-menu #profileMenu="matMenu" class="profile-menu">
      <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <p class="text-sm font-semibold text-gray-900 dark:text-white">
          {{ authService.currentUser()?.firstName }} {{ authService.currentUser()?.lastName }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ authService.currentUser()?.email }}</p>
      </div>

      <button mat-menu-item routerLink="/profile">
        <mat-icon>person_outline</mat-icon>
        <span>My Profile</span>
      </button>

      <button mat-menu-item routerLink="/wishlist">
        <mat-icon [matBadge]="wishlistService.wishlistCount()" matBadgeSize="small" [matBadgeHidden]="wishlistService.wishlistCount() === 0">
          favorite_border
        </mat-icon>
        <span>My Wishlist</span>
      </button>

      <button mat-menu-item>
        <mat-icon>settings</mat-icon>
        <span>Settings</span>
      </button>

      @if (authService.hasRole('dealer')) {
        <mat-divider></mat-divider>
        <button mat-menu-item routerLink="/dealer/dashboard">
          <mat-icon>dashboard</mat-icon>
          <span>Dealer Dashboard</span>
        </button>
      }

      @if (authService.hasRole('admin')) {
        <mat-divider></mat-divider>
        <button mat-menu-item routerLink="/admin/dashboard">
          <mat-icon>admin_panel_settings</mat-icon>
          <span>Admin Panel</span>
        </button>
      }

      <mat-divider></mat-divider>
      
      <button mat-menu-item>
        <mat-icon>help_outline</mat-icon>
        <span>Help & Support</span>
      </button>

      <button mat-menu-item (click)="logout()" class="!text-red-600 dark:!text-red-400">
        <mat-icon>logout</mat-icon>
        <span>Logout</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    :host {
      display: block;
    }

    /* Navigation Links */
    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.375rem 0.75rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      transition: all 0.2s ease;
      cursor: pointer;
      text-decoration: none;
    }

    .nav-link:hover {
      background-color: #f3f4f6;
      color: #111827;
    }

    .nav-link.active-link {
      background-color: #fef2f2;
      color: #dc2626;
    }

    .nav-icon {
      font-size: 1.125rem !important;
      width: 1.125rem !important;
      height: 1.125rem !important;
      line-height: 1.125rem !important;
    }

    /* Action Buttons */
    .action-btn {
      color: #374151 !important;
      transition: all 0.2s ease !important;
    }

    .action-btn:hover {
      background-color: #f3f4f6 !important;
    }

    /* Mobile Navigation */
    .mobile-nav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      transition: all 0.2s ease;
      text-decoration: none;
    }

    .mobile-nav-link:hover {
      background-color: #f3f4f6;
    }

    .mobile-nav-link.mobile-active {
      background-color: #fef2f2;
      color: #dc2626;
    }

    /* Dropdown Menus */
    ::ng-deep .mat-mdc-menu-panel {
      border-radius: 0.75rem !important;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04) !important;
      border: 1px solid #e5e7eb !important;
      min-width: 220px !important;
    }

    ::ng-deep .mat-mdc-menu-content {
      padding: 0.5rem !important;
    }

    ::ng-deep .mat-mdc-menu-item {
      border-radius: 0.5rem !important;
      font-size: 0.875rem !important;
      min-height: 44px !important;
    }

    ::ng-deep .mat-mdc-menu-item .mat-icon {
      color: #6b7280 !important;
      margin-right: 0.75rem !important;
    }

    ::ng-deep .mat-mdc-menu-item:hover {
      background-color: #f3f4f6 !important;
    }

    /* Smooth Mobile Menu Animation */
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Badge Styling */
    ::ng-deep .mat-badge-content {
      background-color: #ef4444 !important;
      color: #ffffff !important;
    }

    /* Focus States */
    button:focus-visible,
    a:focus-visible {
      outline: 2px solid #ef4444;
      outline-offset: 2px;
    }
  `]
})
export class HeaderComponent {
  themeService = inject(ThemeService);
  authService = inject(AuthService);
  wishlistService = inject(WishlistService);
  router = inject(Router);

  searchQuery = '';
  mobileMenuOpen = signal(false);

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/buy-car'], {
        queryParams: { search: this.searchQuery }
      });
      this.searchQuery = '';
      this.closeMobileMenu();
    }
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
