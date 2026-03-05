export interface Wishlist {
  id: string;
  userId: string;
  carId: string;
  addedAt: Date;
}

export interface WishlistItem {
  wishlistId: string;
  car: any; // Will be populated with Car data
  addedAt: Date;
}
