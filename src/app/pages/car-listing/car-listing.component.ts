import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { CarCardComponent } from '../../components/car-card/car-card.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { CarService } from '../../services/car.service';
import { Car, CarFilter } from '../../models/car.model';

@Component({
  selector: 'app-car-listing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSliderModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatChipsModule,
    CarCardComponent,
    LoadingComponent
  ],
  template: `
    <div class="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div class="container mx-auto px-4">
        <div class="mb-8">
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Find Your Perfect Car
          </h1>
          <p class="text-gray-600 dark:text-gray-300">
            {{ filteredCars().length }} cars available
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Filters Sidebar -->
          <aside class="lg:col-span-1">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold">Filters</h2>
                <button mat-button color="primary" (click)="clearFilters()">
                  Clear All
                </button>
              </div>

              <!-- Sort By -->
              <mat-form-field appearance="outline" class="w-full mb-4">
                <mat-label>Sort By</mat-label>
                <mat-select [(ngModel)]="filters.sortBy" (ngModelChange)="applyFilters()">
                  <mat-option value="popularity">Popularity</mat-option>
                  <mat-option value="price-asc">Price: Low to High</mat-option>
                  <mat-option value="price-desc">Price: High to Low</mat-option>
                  <mat-option value="year-desc">Year: Newest First</mat-option>
                  <mat-option value="mileage-asc">Mileage: Best First</mat-option>
                </mat-select>
              </mat-form-field>

              <!-- Price Range -->
              <mat-expansion-panel expanded class="!mb-4">
                <mat-expansion-panel-header>
                  <mat-panel-title>Price Range</mat-panel-title>
                </mat-expansion-panel-header>
                <div class="py-4">
                  <div class="mb-4">
                    <label class="text-sm text-gray-600 dark:text-gray-300">
                      ₹{{ formatPrice(filters.priceRange.min) }} - ₹{{ formatPrice(filters.priceRange.max) }}
                    </label>
                  </div>
                  <div class="grid grid-cols-2 gap-2">
                    <input 
                      type="number" 
                      [(ngModel)]="filters.priceRange.min"
                      (ngModelChange)="applyFilters()"
                      placeholder="Min"
                      class="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    />
                    <input 
                      type="number" 
                      [(ngModel)]="filters.priceRange.max"
                      (ngModelChange)="applyFilters()"
                      placeholder="Max"
                      class="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
              </mat-expansion-panel>

              <!-- Fuel Type -->
              <mat-expansion-panel expanded class="!mb-4">
                <mat-expansion-panel-header>
                  <mat-panel-title>Fuel Type</mat-panel-title>
                </mat-expansion-panel-header>
                <div class="py-4 space-y-2">
                  @for (type of fuelTypes; track type) {
                    <mat-checkbox 
                      [checked]="filters.fuelType.includes(type)"
                      (change)="toggleFilter('fuelType', type)"
                      class="block"
                    >
                      {{ type }}
                    </mat-checkbox>
                  }
                </div>
              </mat-expansion-panel>

              <!-- Transmission -->
              <mat-expansion-panel expanded class="!mb-4">
                <mat-expansion-panel-header>
                  <mat-panel-title>Transmission</mat-panel-title>
                </mat-expansion-panel-header>
                <div class="py-4 space-y-2">
                  @for (type of transmissionTypes; track type) {
                    <mat-checkbox 
                      [checked]="filters.transmission.includes(type)"
                      (change)="toggleFilter('transmission', type)"
                      class="block"
                    >
                      {{ type }}
                    </mat-checkbox>
                  }
                </div>
              </mat-expansion-panel>

              <!-- Body Type -->
              <mat-expansion-panel expanded class="!mb-4">
                <mat-expansion-panel-header>
                  <mat-panel-title>Body Type</mat-panel-title>
                </mat-expansion-panel-header>
                <div class="py-4 space-y-2">
                  @for (type of bodyTypes; track type) {
                    <mat-checkbox 
                      [checked]="filters.bodyType.includes(type)"
                      (change)="toggleFilter('bodyType', type)"
                      class="block"
                    >
                      {{ type }}
                    </mat-checkbox>
                  }
                </div>
              </mat-expansion-panel>
            </div>
          </aside>

          <!-- Car Listings -->
          <div class="lg:col-span-3">
            <!-- Active Filters -->
            @if (hasActiveFilters()) {
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-6">
                <div class="flex flex-wrap gap-2">
                  @for (filter of getActiveFilters(); track filter) {
                    <mat-chip (removed)="removeFilter(filter)">
                      {{ filter }}
                      <button matChipRemove>
                        <mat-icon>cancel</mat-icon>
                      </button>
                    </mat-chip>
                  }
                </div>
              </div>
            }

            @if (loading()) {
              <app-loading></app-loading>
            } @else if (filteredCars().length === 0) {
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                <mat-icon class="!text-6xl !w-16 !h-16 text-gray-400 mx-auto mb-4">search_off</mat-icon>
                <h3 class="text-2xl font-bold mb-2">No cars found</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-6">
                  Try adjusting your filters to see more results
                </p>
                <button mat-raised-button color="primary" (click)="clearFilters()">
                  Clear Filters
                </button>
              </div>
            } @else {
              <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                @for (car of filteredCars(); track car.id) {
                  <app-car-card [car]="car"></app-car-card>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class CarListingComponent implements OnInit {
  private carService = inject(CarService);
  private route = inject(ActivatedRoute);

  filteredCars = signal<Car[]>([]);
  loading = signal(true);

  filters: any = {
    brand: [],
    priceRange: { min: 0, max: 10000000 },
    yearRange: { min: 2015, max: 2024 },
    fuelType: [],
    transmission: [],
    bodyType: [],
    location: [],
    kmRange: { min: 0, max: 200000 },
    sortBy: 'popularity'
  };

  fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];
  transmissionTypes = ['Manual', 'Automatic'];
  bodyTypes = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Wagon', 'Truck'];

  ngOnInit(): void {
    // Check for query params
    this.route.queryParams.subscribe(params => {
      if (params['brand']) {
        this.filters.brand = [params['brand']];
      }
      if (params['budget']) {
        const [min, max] = params['budget'].split('-').map(Number);
        this.filters.priceRange = { min, max };
      }
      this.loadCars();
    });
  }

  loadCars(): void {
    this.loading.set(true);
    this.carService.getCars(this.filters).subscribe({
      next: (cars) => {
        this.filteredCars.set(cars);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  applyFilters(): void {
    this.loadCars();
  }

  toggleFilter(filterType: string, value: string): void {
    const filterArray = this.filters[filterType] as string[];
    const index = filterArray.indexOf(value);
    
    if (index > -1) {
      filterArray.splice(index, 1);
    } else {
      filterArray.push(value);
    }
    
    this.applyFilters();
  }

  clearFilters(): void {
    this.filters = {
      brand: [],
      priceRange: { min: 0, max: 10000000 },
      yearRange: { min: 2015, max: 2024 },
      fuelType: [],
      transmission: [],
      bodyType: [],
      location: [],
      kmRange: { min: 0, max: 200000 },
      sortBy: 'popularity'
    };
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return this.filters.fuelType.length > 0 || 
           this.filters.transmission.length > 0 || 
           this.filters.bodyType.length > 0 ||
           this.filters.brand.length > 0;
  }

  getActiveFilters(): string[] {
    const active: string[] = [];
    
    this.filters.fuelType.forEach((f: string) => active.push(f));
    this.filters.transmission.forEach((t: string) => active.push(t));
    this.filters.bodyType.forEach((b: string) => active.push(b));
    this.filters.brand.forEach((b: string) => active.push(b));
    
    return active;
  }

  removeFilter(filterValue: string): void {
    ['fuelType', 'transmission', 'bodyType', 'brand'].forEach(filterType => {
      const index = this.filters[filterType].indexOf(filterValue);
      if (index > -1) {
        this.filters[filterType].splice(index, 1);
      }
    });
    this.applyFilters();
  }

  formatPrice(price: number): string {
    if (price >= 10000000) {
      return (price / 10000000).toFixed(1) + ' Cr';
    } else if (price >= 100000) {
      return (price / 100000).toFixed(1) + ' L';
    }
    return price.toLocaleString();
  }
}
