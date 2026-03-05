import { Injectable, signal } from '@angular/core';
import { Car, CarFilter } from '../models/car.model';
import { MOCK_CARS } from '../mock-data/cars.data';
import { Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private cars = signal<Car[]>(MOCK_CARS);

  getCars(filter?: CarFilter): Observable<Car[]> {
    let filteredCars = [...this.cars()];

    if (filter) {
      // Apply brand filter
      if (filter.brand && filter.brand.length > 0) {
        filteredCars = filteredCars.filter(car => filter.brand!.includes(car.brand));
      }

      // Apply price range filter
      if (filter.priceRange) {
        filteredCars = filteredCars.filter(car => 
          car.price >= filter.priceRange!.min && car.price <= filter.priceRange!.max
        );
      }

      // Apply year range filter
      if (filter.yearRange) {
        filteredCars = filteredCars.filter(car => 
          car.year >= filter.yearRange!.min && car.year <= filter.yearRange!.max
        );
      }

      // Apply fuel type filter
      if (filter.fuelType && filter.fuelType.length > 0) {
        filteredCars = filteredCars.filter(car => filter.fuelType!.includes(car.fuelType));
      }

      // Apply transmission filter
      if (filter.transmission && filter.transmission.length > 0) {
        filteredCars = filteredCars.filter(car => filter.transmission!.includes(car.transmission));
      }

      // Apply body type filter
      if (filter.bodyType && filter.bodyType.length > 0) {
        filteredCars = filteredCars.filter(car => filter.bodyType!.includes(car.bodyType));
      }

      // Apply location filter
      if (filter.location && filter.location.length > 0) {
        filteredCars = filteredCars.filter(car => filter.location!.includes(car.location));
      }

      // Apply km range filter
      if (filter.kmRange) {
        filteredCars = filteredCars.filter(car => 
          car.kmDriven >= filter.kmRange!.min && car.kmDriven <= filter.kmRange!.max
        );
      }

      // Apply sorting
      if (filter.sortBy) {
        switch (filter.sortBy) {
          case 'price-asc':
            filteredCars.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            filteredCars.sort((a, b) => b.price - a.price);
            break;
          case 'year-desc':
            filteredCars.sort((a, b) => b.year - a.year);
            break;
          case 'mileage-asc':
            filteredCars.sort((a, b) => parseFloat(a.mileage) - parseFloat(b.mileage));
            break;
        }
      }
    }

    return of(filteredCars).pipe(delay(300));
  }

  getCarById(id: string): Observable<Car | undefined> {
    const car = this.cars().find(c => c.id === id);
    return of(car).pipe(delay(200));
  }

  getFeaturedCars(): Observable<Car[]> {
    const featured = this.cars().filter(car => car.isFeatured).slice(0, 6);
    return of(featured).pipe(delay(200));
  }

  getNewCars(): Observable<Car[]> {
    const newCars = this.cars().filter(car => car.isNew).slice(0, 8);
    return of(newCars).pipe(delay(200));
  }

  searchCars(query: string): Observable<Car[]> {
    const lowerQuery = query.toLowerCase();
    const results = this.cars().filter(car => 
      car.brand.toLowerCase().includes(lowerQuery) ||
      car.model.toLowerCase().includes(lowerQuery) ||
      car.description.toLowerCase().includes(lowerQuery)
    );
    return of(results).pipe(delay(200));
  }

  getPopularBrands(): string[] {
    const brandCount = new Map<string, number>();
    this.cars().forEach(car => {
      brandCount.set(car.brand, (brandCount.get(car.brand) || 0) + 1);
    });
    return Array.from(brandCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([brand]) => brand);
  }
}
