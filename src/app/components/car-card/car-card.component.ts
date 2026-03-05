import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Car } from '../../models/car.model';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-car-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <mat-card class="group hover:shadow-2xl transition-all duration-300 !rounded-xl overflow-hidden h-full flex flex-col">
      <!-- Image Section -->
      <div class="relative overflow-hidden h-48">
        <img 
          [src]="car.images[0]" 
          [alt]="car.brand + ' ' + car.model"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div class="absolute top-3 left-3 flex gap-2">
          @if (car.isFeatured) {
            <mat-chip class="!bg-yellow-500 !text-white !text-xs !h-6">Featured</mat-chip>
          }
          @if (car.isNew) {
            <mat-chip class="!bg-green-500 !text-white !text-xs !h-6">New</mat-chip>
          }
        </div>
        <button 
          mat-icon-button 
          class="!absolute top-2 right-2 !bg-white !bg-opacity-90 hover:!bg-opacity-100"
          (click)="toggleWishlist($event)"
        >
          <mat-icon [class.text-red-500]="isInWishlist()">
            {{ isInWishlist() ? 'favorite' : 'favorite_border' }}
          </mat-icon>
        </button>
      </div>

      <mat-card-content class="flex-1 flex flex-col p-4">
        <!-- Year Badge -->
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-500 dark:text-gray-400">{{ car.year }}</span>
          @if (car.rating) {
            <div class="flex items-center space-x-1">
              <mat-icon class="!text-lg text-yellow-500">star</mat-icon>
              <span class="text-sm font-medium">{{ car.rating }}</span>
            </div>
          }
        </div>

        <!-- Car Name -->
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">
          {{ car.brand }} {{ car.model }}
        </h3>

        <!-- Price -->
        <p class="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-3">
          ₹{{ formatPrice(car.price) }}
        </p>

        <!-- Details Grid -->
        <div class="grid grid-cols-2 gap-3 text-sm mb-4 flex-1">
          <div class="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
            <mat-icon class="!text-lg">speed</mat-icon>
            <span>{{ car.kmDriven.toLocaleString() }} km</span>
          </div>
          <div class="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
            <mat-icon class="!text-lg">local_gas_station</mat-icon>
            <span>{{ car.fuelType }}</span>
          </div>
          <div class="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
            <mat-icon class="!text-lg">settings</mat-icon>
            <span>{{ car.transmission }}</span>
          </div>
          <div class="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
            <mat-icon class="!text-lg">location_on</mat-icon>
            <span>{{ car.location }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2 mt-auto pt-3 border-t dark:border-gray-700">
          <button 
            mat-raised-button 
            color="primary" 
            class="flex-1"
            [routerLink]="['/car-details', car.id]"
          >
            View Details
          </button>
          <button 
            mat-stroked-button 
            color="primary"
            [routerLink]="['/compare']"
            [queryParams]="{car: car.id}"
          >
            <mat-icon>compare</mat-icon>
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class CarCardComponent {
  @Input({ required: true }) car!: Car;
  
  private wishlistService = inject(WishlistService);

  formatPrice(price: number): string {
    if (price >= 10000000) {
      return (price / 10000000).toFixed(2) + ' Cr';
    } else if (price >= 100000) {
      return (price / 100000).toFixed(2) + ' L';
    }
    return price.toLocaleString();
  }

  isInWishlist(): boolean {
    return this.wishlistService.isInWishlist(this.car.id);
  }

  toggleWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (this.isInWishlist()) {
      this.wishlistService.removeFromWishlist(this.car.id).subscribe();
    } else {
      this.wishlistService.addToWishlist(this.car.id).subscribe();
    }
  }
}
