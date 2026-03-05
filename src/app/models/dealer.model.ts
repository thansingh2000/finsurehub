export interface Dealer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  logo?: string;
  rating: number;
  totalCars: number;
  verified: boolean;
  description: string;
  establishedYear: number;
  createdAt: Date;
}

export interface DealerStats {
  totalListings: number;
  activeListing: number;
  soldThisMonth: number;
  totalRevenue: number;
  pendingInquiries: number;
  recentViews: number;
}
