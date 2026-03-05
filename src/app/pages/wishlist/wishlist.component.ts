import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from '../../components/loading/loading.component';
import { WishlistService } from '../../services/wishlist.service';
import { CarService } from '../../services/car.service';
import { Car } from '../../models/car.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    LoadingComponent
  ],
  template: `
    <div class="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div class="container mx-auto px-4">
        <div class="mb-8 flex items-center justify-between">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              My Wishlist
            </h1>
            <p class="text-gray-600 dark:text-gray-300">
              {{ wishlistCars().length }} cars in your wishlist
            </p>
          </div>
          
          @if (wishlistCars().length > 0) {
            <button mat-raised-button color="warn" (click)="clearWishlist()">
              <mat-icon>delete</mat-icon>
              Clear All
            </button>
          }
        </div>

        @if (loading()) {
          <app-loading></app-loading>
        } @else if (wishlistCars().length === 0) {
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <mat-icon class="!text-6xl !w-16 !h-16 text-gray-400 mx-auto mb-4">favorite_border</mat-icon>
            <h3 class="text-2xl font-bold mb-2">Your wishlist is empty</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              Start adding cars you love to keep track of them!
            </p>
            <button mat-raised-button color="primary" routerLink="/buy-car">
              <mat-icon>search</mat-icon>
              Browse Cars
            </button>
          </div>
        } @else {
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            @for (car of wishlistCars(); track car.id) {
              <mat-card class="!rounded-xl overflow-hidden hover:shadow-2xl transition-shadow">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Image -->
                  <div class="relative h-64 md:h-auto">
                    <img 
                      [src]="car.images[0]" 
                      [alt]="car.brand + ' ' + car.model"
                      class="w-full h-full object-cover"
                    />
                  </div>

                  <!-- Details -->
                  <div class="p-6 flex flex-col">
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {{ car.brand }} {{ car.model }}
                    </h3>

                    <p class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-4">
                      ₹{{ formatPrice(car.price) }}
                    </p>

                    <div class="space-y-2 mb-6 flex-1">
                      <div class="flex items-center text-gray-600 dark:text-gray-300">
                        <mat-icon class="!text-lg mr-2">calendar_today</mat-icon>
                        <span>{{ car.year }}</span>
                      </div>
                      <div class="flex items-center text-gray-600 dark:text-gray-300">
                        <mat-icon class="!text-lg mr-2">speed</mat-icon>
                        <span>{{ car.kmDriven.toLocaleString() }} km</span>
                      </div>
                      <div class="flex items-center text-gray-600 dark:text-gray-300">
                        <mat-icon class="!text-lg mr-2">local_gas_station</mat-icon>
                        <span>{{ car.fuelType }}</span>
                      </div>
                      <div class="flex items-center text-gray-600 dark:text-gray-300">
                        <mat-icon class="!text-lg mr-2">location_on</mat-icon>
                        <span>{{ car.location }}</span>
                      </div>
                    </div>

                    <div class="flex gap-2">
                      <button 
                        mat-raised-button 
                        color="primary" 
                        class="flex-1"
                        [routerLink]="['/car-details', car.id]"
                      >
                        View Details
                      </button>
                      <button 
                        mat-icon-button 
                        color="warn"
                        (click)="removeFromWishlist(car.id)"
                      >
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                  </div>
                </div>
              </mat-card>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class WishlistComponent implements OnInit {
  private wishlistService = inject(WishlistService);
  private carService = inject(CarService);

  wishlistCars = signal<Car[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.loading.set(true);
    this.wishlistService.getWishlistItems().subscribe({
      next: (items) => {
        const carIds = items.map(item => item.car.id);
        const cars: Car[] = [];
        
        carIds.forEach(id => {
          this.carService.getCarById(id).subscribe(car => {
            if (car) cars.push(car);
            if (cars.length === carIds.length) {
              this.wishlistCars.set(cars);
              this.loading.set(false);
            }
          });
        });

        if (carIds.length === 0) {
          this.loading.set(false);
        }
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  removeFromWishlist(carId: string): void {
    this.wishlistService.removeFromWishlist(carId).subscribe(() => {
      this.loadWishlist();
    });
  }

  clearWishlist(): void {
    this.wishlistService.clearWishlist().subscribe(() => {
      this.loadWishlist();
    });
  }

  formatPrice(price: number): string {
    if (price >= 10000000) {
      return (price / 10000000).toFixed(2) + ' Cr';
    } else if (price >= 100000) {
      return (price / 100000).toFixed(2) + ' L';
    }
    return price.toLocaleString();
  }
}
