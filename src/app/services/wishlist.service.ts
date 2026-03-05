import { Injectable, signal } from '@angular/core';
import { Wishlist, WishlistItem } from '../models/wishlist.model';
import { Car } from '../models/car.model';
import { Observable, of, delay } from 'rxjs';
import { AuthService } from './auth.service';
import { CarService } from './car.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly WISHLIST_KEY = 'user-wishlist';
  public wishlistCount = signal<number>(this.getWishlist().length);

  constructor(
    private authService: AuthService,
    private carService: CarService
  ) {}

  private getWishlist(): Wishlist[] {
    const wishlistStr = localStorage.getItem(this.WISHLIST_KEY);
    return wishlistStr ? JSON.parse(wishlistStr) : [];
  }

  private saveWishlist(wishlist: Wishlist[]): void {
    localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(wishlist));
    this.wishlistCount.set(wishlist.length);
  }

  addToWishlist(carId: string): Observable<boolean> {
    const user = this.authService.currentUser();
    if (!user) {
      return of(false);
    }

    const wishlist = this.getWishlist();
    const exists = wishlist.some(item => item.carId === carId && item.userId === user.id);

    if (!exists) {
      const newItem: Wishlist = {
        id: Date.now().toString(),
        userId: user.id,
        carId: carId,
        addedAt: new Date()
      };
      wishlist.push(newItem);
      this.saveWishlist(wishlist);
      return of(true).pipe(delay(200));
    }

    return of(false).pipe(delay(200));
  }

  removeFromWishlist(carId: string): Observable<boolean> {
    const user = this.authService.currentUser();
    if (!user) {
      return of(false);
    }

    let wishlist = this.getWishlist();
    const initialLength = wishlist.length;
    wishlist = wishlist.filter(item => !(item.carId === carId && item.userId === user.id));
    
    if (wishlist.length < initialLength) {
      this.saveWishlist(wishlist);
      return of(true).pipe(delay(200));
    }

    return of(false).pipe(delay(200));
  }

  isInWishlist(carId: string): boolean {
    const user = this.authService.currentUser();
    if (!user) {
      return false;
    }

    const wishlist = this.getWishlist();
    return wishlist.some(item => item.carId === carId && item.userId === user.id);
  }

  getWishlistItems(): Observable<WishlistItem[]> {
    const user = this.authService.currentUser();
    if (!user) {
      return of([]);
    }

    const wishlist = this.getWishlist().filter(item => item.userId === user.id);
    const items: WishlistItem[] = [];

    // This is simplified - in a real app, you'd fetch car data from API
    wishlist.forEach(item => {
      this.carService.getCarById(item.carId).subscribe(car => {
        if (car) {
          items.push({
            wishlistId: item.id,
            car: car,
            addedAt: item.addedAt
          });
        }
      });
    });

    return of(items).pipe(delay(300));
  }

  clearWishlist(): Observable<boolean> {
    const user = this.authService.currentUser();
    if (!user) {
      return of(false);
    }

    let wishlist = this.getWishlist();
    wishlist = wishlist.filter(item => item.userId !== user.id);
    this.saveWishlist(wishlist);
    return of(true).pipe(delay(200));
  }
}
