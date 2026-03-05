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
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
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
