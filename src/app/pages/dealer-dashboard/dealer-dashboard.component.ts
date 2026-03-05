import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-dealer-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule],
  template: `
    <div class="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div class="container mx-auto px-4">
        <div class="mb-8">
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Dealer Dashboard
          </h1>
          <p class="text-gray-600 dark:text-gray-300">
            Manage your car listings and track performance
          </p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <mat-card class="!p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 dark:text-gray-300 mb-2">Total Listings</p>
                <h3 class="text-3xl font-bold text-gray-900 dark:text-white">24</h3>
              </div>
              <mat-icon class="!text-5xl !w-12 !h-12 text-primary-600">directions_car</mat-icon>
            </div>
          </mat-card>

          <mat-card class="!p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 dark:text-gray-300 mb-2">Active Listings</p>
                <h3 class="text-3xl font-bold text-gray-900 dark:text-white">18</h3>
              </div>
              <mat-icon class="!text-5xl !w-12 !h-12 text-green-600">check_circle</mat-icon>
            </div>
          </mat-card>

          <mat-card class="!p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 dark:text-gray-300 mb-2">Sold This Month</p>
                <h3 class="text-3xl font-bold text-gray-900 dark:text-white">8</h3>
              </div>
              <mat-icon class="!text-5xl !w-12 !h-12 text-blue-600">trending_up</mat-icon>
            </div>
          </mat-card>

          <mat-card class="!p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 dark:text-gray-300 mb-2">Total Revenue</p>
                <h3 class="text-3xl font-bold text-gray-900 dark:text-white">₹2.4 Cr</h3>
              </div>
              <mat-icon class="!text-5xl !w-12 !h-12 text-yellow-600">payments</mat-icon>
            </div>
          </mat-card>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <mat-card class="!p-6 text-center hover:shadow-xl transition-shadow cursor-pointer">
            <mat-icon class="!text-6xl !w-16 !h-16 text-primary-600 mx-auto mb-4">add_circle</mat-icon>
            <h3 class="text-xl font-bold mb-2">Add New Listing</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4">Post a new car for sale</p>
            <button mat-raised-button color="primary">Add Listing</button>
          </mat-card>

          <mat-card class="!p-6 text-center hover:shadow-xl transition-shadow cursor-pointer">
            <mat-icon class="!text-6xl !w-16 !h-16 text-blue-600 mx-auto mb-4">analytics</mat-icon>
            <h3 class="text-xl font-bold mb-2">View Analytics</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4">Track your performance</p>
            <button mat-raised-button color="primary">View Stats</button>
          </mat-card>

          <mat-card class="!p-6 text-center hover:shadow-xl transition-shadow cursor-pointer">
            <mat-icon class="!text-6xl !w-16 !h-16 text-green-600 mx-auto mb-4">message</mat-icon>
            <h3 class="text-xl font-bold mb-2">Messages</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4">12 new inquiries</p>
            <button mat-raised-button color="primary">View Messages</button>
          </mat-card>
        </div>

        <!-- Recent Listings -->
        <mat-card class="!p-6">
          <h2 class="text-2xl font-bold mb-6">Recent Listings</h2>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th class="px-6 py-3 text-left">Car</th>
                  <th class="px-6 py-3 text-left">Price</th>
                  <th class="px-6 py-3 text-left">Status</th>
                  <th class="px-6 py-3 text-left">Views</th>
                  <th class="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b dark:border-gray-700">
                  <td class="px-6 py-4">Maruti Swift 2022</td>
                  <td class="px-6 py-4">₹6.5 L</td>
                  <td class="px-6 py-4">
                    <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Active</span>
                  </td>
                  <td class="px-6 py-4">245</td>
                  <td class="px-6 py-4">
                    <button mat-icon-button><mat-icon>edit</mat-icon></button>
                    <button mat-icon-button><mat-icon>delete</mat-icon></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class DealerDashboardComponent {}
