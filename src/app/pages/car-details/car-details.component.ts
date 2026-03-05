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
  templateUrl: './car-details.component.html',
  styleUrl: './car-details.component.scss'
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
