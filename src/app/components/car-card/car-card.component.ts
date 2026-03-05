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
  templateUrl: './car-card.component.html',
  styleUrl: './car-card.component.scss'
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
