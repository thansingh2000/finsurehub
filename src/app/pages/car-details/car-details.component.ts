import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { LoadingComponent } from '../../components/loading/loading.component';
import { CarService } from '../../services/car.service';
import { WishlistService } from '../../services/wishlist.service';
import { Car } from '../../models/car.model';

@Component({
  selector: 'app-car-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatCardModule,
    MatDividerModule,
    LoadingComponent
  ],
  template: `
    @if (loading()) {
      <app-loading></app-loading>
    } @else if (car()) {
      <div class="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <!-- Image Gallery -->
        <section class="bg-white dark:bg-gray-800 py-8">
          <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Main Image -->
              <div class="space-y-4">
                <div class="rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    [src]="selectedImage()" 
                    [alt]="car()!.brand + ' ' + car()!.model"
                    class="w-full h-96 object-cover"
                  />
                </div>
                
                <!-- Thumbnail Gallery -->
                <div class="grid grid-cols-4 gap-4">
                  @for (image of car()!.images; track image; let i = $index) {
                    <div 
                      class="rounded-lg overflow-hidden cursor-pointer border-2 transition-all"
                      [class.border-primary-600]="selectedImage() === image"
                      [class.border-transparent]="selectedImage() !== image"
                      (click)="selectImage(image)"
                    >
                      <img [src]="image" [alt]="'Image ' + (i + 1)" class="w-full h-20 object-cover" />
                    </div>
                  }
                </div>
              </div>

              <!-- Car Info -->
              <div>
                <div class="flex gap-2 mb-4">
                  @if (car()!.isFeatured) {
                    <mat-chip class="!bg-yellow-500 !text-white">Featured</mat-chip>
                  }
                  @if (car()!.isNew) {
                    <mat-chip class="!bg-green-500 !text-white">New</mat-chip>
                  }
                </div>

                <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {{ car()!.brand }} {{ car()!.model }}
                </h1>

                <div class="flex items-center gap-4 mb-6">
                  <div class="flex items-center">
                    <mat-icon class="text-yellow-500 mr-1">star</mat-icon>
                    <span class="text-lg font-semibold">{{ car()!.rating || 'N/A' }}</span>
                  </div>
                  <div class="flex items-center text-gray-600 dark:text-gray-300">
                    <mat-icon class="mr-1">location_on</mat-icon>
                    <span>{{ car()!.location }}</span>
                  </div>
                </div>

                <div class="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-8">
                  ₹{{ formatPrice(car()!.price) }}
                </div>

                <!-- Quick Specs -->
                <div class="grid grid-cols-2 gap-4 mb-8">
                  <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div class="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                      <mat-icon class="mr-2">calendar_today</mat-icon>
                      <span class="text-sm">Year</span>
                    </div>
                    <div class="text-xl font-bold">{{ car()!.year }}</div>
                  </div>

                  <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div class="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                      <mat-icon class="mr-2">speed</mat-icon>
                      <span class="text-sm">Km Driven</span>
                    </div>
                    <div class="text-xl font-bold">{{ car()!.kmDriven.toLocaleString() }}</div>
                  </div>

                  <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div class="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                      <mat-icon class="mr-2">local_gas_station</mat-icon>
                      <span class="text-sm">Fuel Type</span>
                    </div>
                    <div class="text-xl font-bold">{{ car()!.fuelType }}</div>
                  </div>

                  <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div class="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                      <mat-icon class="mr-2">settings</mat-icon>
                      <span class="text-sm">Transmission</span>
                    </div>
                    <div class="text-xl font-bold">{{ car()!.transmission }}</div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-4">
                  <button mat-raised-button color="primary" class="flex-1 !py-6 !text-lg">
                    <mat-icon>phone</mat-icon>
                    Contact Dealer
                  </button>
                  <button 
                    mat-raised-button 
                    [color]="isInWishlist() ? 'warn' : 'accent'"
                    (click)="toggleWishlist()"
                    class="!py-6"
                  >
                    <mat-icon>{{ isInWishlist() ? 'favorite' : 'favorite_border' }}</mat-icon>
                  </button>
                  <button 
                    mat-raised-button 
                    color="accent"
                    routerLink="/compare"
                    [queryParams]="{car: car()!.id}"
                    class="!py-6"
                  >
                    <mat-icon>compare</mat-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Details Tabs -->
        <section class="py-8">
          <div class="container mx-auto px-4">
            <mat-tab-group class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <!-- Overview -->
              <mat-tab label="Overview">
                <div class="p-6">
                  <h3 class="text-2xl font-bold mb-4">Description</h3>
                  <p class="text-gray-600 dark:text-gray-300 mb-8">{{ car()!.description }}</p>

                  <h3 class="text-2xl font-bold mb-4">Specifications</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="flex justify-between py-3 border-b dark:border-gray-700">
                      <span class="font-semibold">Brand</span>
                      <span>{{ car()!.brand }}</span>
                    </div>
                    <div class="flex justify-between py-3 border-b dark:border-gray-700">
                      <span class="font-semibold">Model</span>
                      <span>{{ car()!.model }}</span>
                    </div>
                    <div class="flex justify-between py-3 border-b dark:border-gray-700">
                      <span class="font-semibold">Year</span>
                      <span>{{ car()!.year }}</span>
                    </div>
                    <div class="flex justify-between py-3 border-b dark:border-gray-700">
                      <span class="font-semibold">Registration Year</span>
                      <span>{{ car()!.registrationYear }}</span>
                    </div>
                    <div class="flex justify-between py-3 border-b dark:border-gray-700">
                      <span class="font-semibold">Body Type</span>
                      <span>{{ car()!.bodyType }}</span>
                    </div>
                    <div class="flex justify-between py-3 border-b dark:border-gray-700">
                      <span class="font-semibold">Color</span>
                      <span>{{ car()!.color }}</span>
                    </div>
                    <div class="flex justify-between py-3 border-b dark:border-gray-700">
                      <span class="font-semibold">Mileage</span>
                      <span>{{ car()!.mileage }}</span>
                    </div>
                    <div class="flex justify-between py-3 border-b dark:border-gray-700">
                      <span class="font-semibold">Engine Capacity</span>
                      <span>{{ car()!.engineCapacity }}</span>
                    </div>
                    <div class="flex justify-between py-3 border-b dark:border-gray-700">
                      <span class="font-semibold">Seating Capacity</span>
                      <span>{{ car()!.seatingCapacity }}</span>
                    </div>
                    <div class="flex justify-between py-3 border-b dark:border-gray-700">
                      <span class="font-semibold">Owners</span>
                      <span>{{ car()!.owners }}</span>
                    </div>
                    <div class="flex justify-between py-3 border-b dark:border-gray-700">
                      <span class="font-semibold">Insurance</span>
                      <span>{{ car()!.insuranceValidity }}</span>
                    </div>
                  </div>
                </div>
              </mat-tab>

              <!-- Features -->
              <mat-tab label="Features">
                <div class="p-6">
                  <h3 class="text-2xl font-bold mb-6">Key Features</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    @for (feature of car()!.features; track feature) {
                      <div class="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <mat-icon class="text-primary-600 dark:text-primary-400">check_circle</mat-icon>
                        <span>{{ feature }}</span>
                      </div>
                    }
                  </div>
                </div>
              </mat-tab>

              <!-- Dealer Info -->
              <mat-tab label="Dealer Info">
                <div class="p-6">
                  <mat-card class="!p-6">
                    <h3 class="text-2xl font-bold mb-4">{{ car()!.dealerName }}</h3>
                    <div class="space-y-3">
                      <div class="flex items-center space-x-2">
                        <mat-icon>location_on</mat-icon>
                        <span>{{ car()!.location }}</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <mat-icon>verified</mat-icon>
                        <span>Verified Dealer</span>
                      </div>
                    </div>
                    <mat-divider class="my-6"></mat-divider>
                    <button mat-raised-button color="primary" class="w-full">
                      <mat-icon>phone</mat-icon>
                      Contact Dealer
                    </button>
                  </mat-card>
                </div>
              </mat-tab>
            </mat-tab-group>
          </div>
        </section>
      </div>
    } @else {
      <div class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <mat-icon class="!text-6xl !w-16 !h-16 text-gray-400 mx-auto mb-4">error_outline</mat-icon>
          <h2 class="text-2xl font-bold mb-2">Car not found</h2>
          <button mat-raised-button color="primary" routerLink="/buy-car">
            Browse Cars
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class CarDetailsComponent implements OnInit {
  private carService = inject(CarService);
  private wishlistService = inject(WishlistService);
  private route = inject(ActivatedRoute);

  car = signal<Car | null>(null);
  loading = signal(true);
  selectedImage = signal('');

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const carId = params['id'];
      if (carId) {
        this.loadCar(carId);
      }
    });
  }

  loadCar(id: string): void {
    this.loading.set(true);
    this.carService.getCarById(id).subscribe({
      next: (car) => {
        if (car) {
          this.car.set(car);
          this.selectedImage.set(car.images[0]);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  selectImage(image: string): void {
    this.selectedImage.set(image);
  }

  formatPrice(price: number): string {
    if (price >= 10000000) {
      return (price / 10000000).toFixed(2) + ' Cr';
    } else if (price >= 100000) {
      return (price / 100000).toFixed(2) + ' L';
    }
    return price.toLocaleString();
  }

  isInWishlist(): boolean {
    return this.car() ? this.wishlistService.isInWishlist(this.car()!.id) : false;
  }

  toggleWishlist(): void {
    if (!this.car()) return;

    if (this.isInWishlist()) {
      this.wishlistService.removeFromWishlist(this.car()!.id).subscribe();
    } else {
      this.wishlistService.addToWishlist(this.car()!.id).subscribe();
    }
  }
}
