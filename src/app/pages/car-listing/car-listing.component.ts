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
  templateUrl: './car-listing.component.html',
  styleUrl: './car-listing.component.scss'
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
