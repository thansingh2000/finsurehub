import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { CarCardComponent } from '../../components/car-card/car-card.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { CarService } from '../../services/car.service';
import { WishlistService } from '../../services/wishlist.service';
import { Car } from '../../models/car.model';

// ── Local interface for the Trending Cars section ────────────────────────────
export interface TrendingCar {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'CNG';
  transmission: 'Manual' | 'Automatic';
  bodyType: 'SUV' | 'Sedan' | 'Hatchback' | 'Coupe' | 'Electric';
  kmDriven: number;
  rating: number;
  location: string;
  image: string;
  badge: 'Trending' | 'New' | 'Hot Deal' | 'Top Rated' | 'Best Seller';
  isNew: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    CarCardComponent,
    LoadingComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private carService     = inject(CarService);
  private wishlistService = inject(WishlistService);
  private router         = inject(Router);

  // ── Signals ──────────────────────────────────────────────────────────────
  featuredCars = signal<Car[]>([]);
  loading = signal(true);

  // ── Search state ─────────────────────────────────────────────────────────
  searchBrand  = '';
  searchBudget = '';
  searchFuel   = '';
  activeTab    = 'all';

  // ── Static data ──────────────────────────────────────────────────────────
  popularBrands: string[] = [];

  carTypeTabs = [
    { label: 'All Cars',     value: 'all',      icon: 'directions_car' },
    { label: 'New Cars',     value: 'new',      icon: 'new_releases'   },
    { label: 'Used Cars',    value: 'used',     icon: 'history'        },
    { label: 'Electric',     value: 'electric', icon: 'electric_car'   },
  ];

  fuelTypes = [
    { label: 'Petrol',   value: 'Petrol'   },
    { label: 'Diesel',   value: 'Diesel'   },
    { label: 'Electric', value: 'Electric' },
    { label: 'Hybrid',   value: 'Hybrid'   },
    { label: 'CNG',      value: 'CNG'      },
  ];

  quickSearchTags = [
    'Under ₹5L', 'Automatic SUV', 'Diesel Sedan',
    'Maruti Swift', 'Hyundai Creta', 'Toyota Fortuner'
  ];

  heroStats = [
    { icon: 'directions_car', value: '5,000+',  label: 'Cars Listed'       },
    { icon: 'storefront',     value: '500+',    label: 'Verified Dealers'  },
    { icon: 'location_city',  value: '50+',     label: 'Cities Covered'    },
    { icon: 'star',           value: '4.8 / 5', label: 'Customer Rating'   },
  ];

  // ── Popular Brands ────────────────────────────────────────────────────────
  brandsList = [
    {
      name:        'Toyota',
      slug:        'Toyota',
      tagline:     "Let's Go Places",
      cars:        '850+',
      logoUrl:     'https://logo.clearbit.com/toyota.com',
      accentColor: '#EB0A1E',
      bgFrom:      '#fff5f5',
      bgTo:        '#fee2e2',
    },
    {
      name:        'BMW',
      slug:        'BMW',
      tagline:     'The Ultimate Driving Machine',
      cars:        '420+',
      logoUrl:     'https://logo.clearbit.com/bmw.com',
      accentColor: '#0066B1',
      bgFrom:      '#eff6ff',
      bgTo:        '#dbeafe',
    },
    {
      name:        'Audi',
      slug:        'Audi',
      tagline:     'Vorsprung durch Technik',
      cars:        '380+',
      logoUrl:     'https://logo.clearbit.com/audi.com',
      accentColor: '#BB0A21',
      bgFrom:      '#f9fafb',
      bgTo:        '#f3f4f6',
    },
    {
      name:        'Hyundai',
      slug:        'Hyundai',
      tagline:     'New Thinking. New Possibilities.',
      cars:        '720+',
      logoUrl:     'https://logo.clearbit.com/hyundai.com',
      accentColor: '#002C5F',
      bgFrom:      '#f0f9ff',
      bgTo:        '#e0f2fe',
    },
    {
      name:        'Tata',
      slug:        'Tata',
      tagline:     'Connecting Aspirations',
      cars:        '650+',
      logoUrl:     'https://logo.clearbit.com/tatamotors.com',
      accentColor: '#00448A',
      bgFrom:      '#eff6ff',
      bgTo:        '#dbeafe',
    },
    {
      name:        'Honda',
      slug:        'Honda',
      tagline:     'The Power of Dreams',
      cars:        '540+',
      logoUrl:     'https://logo.clearbit.com/honda.com',
      accentColor: '#E40521',
      bgFrom:      '#fff5f5',
      bgTo:        '#fee2e2',
    },
  ];

  /** Tracks brands whose logo image failed to load → show monogram fallback */
  imageErrors = new Set<string>();

  onBrandImageError(slug: string): void {
    this.imageErrors.add(slug);
  }

  // ── Trending Cars ─────────────────────────────────────────────────────────
  trendingFilter = signal<string>('all');

  trendingFilterChips = [
    { label: 'All',       value: 'all',       icon: 'apps'              },
    { label: 'SUV',       value: 'SUV',        icon: 'directions_car'    },
    { label: 'Sedan',     value: 'Sedan',      icon: 'airport_shuttle'   },
    { label: 'Hatchback', value: 'Hatchback',  icon: 'directions_car'    },
    { label: 'Electric',  value: 'Electric',   icon: 'electric_car'      },
    { label: 'New',       value: 'new',        icon: 'new_releases'      },
  ];

  readonly trendingCars: TrendingCar[] = [
    {
      id: 'tr1', brand: 'Hyundai', model: 'Creta N Line',
      year: 2024, price: 1850000, fuelType: 'Petrol',
      transmission: 'Automatic', bodyType: 'SUV',
      kmDriven: 4200, rating: 4.8, location: 'Mumbai',
      badge: 'Trending', isNew: true,
      image: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=640&q=80&auto=format&fit=crop',
    },
    {
      id: 'tr2', brand: 'Tata', model: 'Nexon EV Max',
      year: 2024, price: 2095000, fuelType: 'Electric',
      transmission: 'Automatic', bodyType: 'Electric',
      kmDriven: 1800, rating: 4.7, location: 'Bangalore',
      badge: 'New', isNew: true,
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=640&q=80&auto=format&fit=crop',
    },
    {
      id: 'tr3', brand: 'Toyota', model: 'Fortuner Legender',
      year: 2023, price: 4799000, fuelType: 'Diesel',
      transmission: 'Automatic', bodyType: 'SUV',
      kmDriven: 18000, rating: 4.9, location: 'Delhi',
      badge: 'Top Rated', isNew: false,
      image: 'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=640&q=80&auto=format&fit=crop',
    },
    {
      id: 'tr4', brand: 'Honda', model: 'City e:HEV',
      year: 2024, price: 1999000, fuelType: 'Hybrid',
      transmission: 'Automatic', bodyType: 'Sedan',
      kmDriven: 3000, rating: 4.6, location: 'Pune',
      badge: 'New', isNew: true,
      image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=640&q=80&auto=format&fit=crop',
    },
    {
      id: 'tr5', brand: 'Maruti Suzuki', model: 'Baleno Alpha',
      year: 2023, price: 895000, fuelType: 'Petrol',
      transmission: 'Manual', bodyType: 'Hatchback',
      kmDriven: 22000, rating: 4.4, location: 'Hyderabad',
      badge: 'Best Seller', isNew: false,
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=640&q=80&auto=format&fit=crop',
    },
    {
      id: 'tr6', brand: 'BMW', model: '3 Series Gran Limousine',
      year: 2024, price: 5499000, fuelType: 'Petrol',
      transmission: 'Automatic', bodyType: 'Sedan',
      kmDriven: 5500, rating: 4.9, location: 'Chennai',
      badge: 'Top Rated', isNew: false,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=640&q=80&auto=format&fit=crop',
    },
    {
      id: 'tr7', brand: 'Kia', model: 'Seltos X-Line',
      year: 2024, price: 2085000, fuelType: 'Diesel',
      transmission: 'Automatic', bodyType: 'SUV',
      kmDriven: 7200, rating: 4.7, location: 'Kolkata',
      badge: 'Trending', isNew: false,
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=640&q=80&auto=format&fit=crop',
    },
    {
      id: 'tr8', brand: 'Mahindra', model: 'XUV 700 AX7',
      year: 2023, price: 2499000, fuelType: 'Diesel',
      transmission: 'Automatic', bodyType: 'SUV',
      kmDriven: 12000, rating: 4.6, location: 'Ahmedabad',
      badge: 'Hot Deal', isNew: false,
      image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=640&q=80&auto=format&fit=crop',
    },
    {
      id: 'tr9', brand: 'Volkswagen', model: 'Virtus GT',
      year: 2023, price: 1699000, fuelType: 'Petrol',
      transmission: 'Automatic', bodyType: 'Sedan',
      kmDriven: 9500, rating: 4.5, location: 'Jaipur',
      badge: 'Hot Deal', isNew: false,
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=640&q=80&auto=format&fit=crop',
    },
    {
      id: 'tr10', brand: 'MG', model: 'ZS EV Excite Pro',
      year: 2024, price: 2588000, fuelType: 'Electric',
      transmission: 'Automatic', bodyType: 'Electric',
      kmDriven: 2100, rating: 4.5, location: 'Surat',
      badge: 'New', isNew: true,
      image: 'https://images.unsplash.com/photo-1571987502227-9231b837d92a?w=640&q=80&auto=format&fit=crop',
    },
  ];

  get filteredTrendingCars(): TrendingCar[] {
    const f = this.trendingFilter();
    if (f === 'all')      return this.trendingCars;
    if (f === 'new')      return this.trendingCars.filter(c => c.isNew);
    if (f === 'Electric') return this.trendingCars.filter(c => c.fuelType === 'Electric');
    return this.trendingCars.filter(c => c.bodyType === f);
  }

  // ── Trending wishlist (local set for instant feedback) ─────────────────────
  trendingWishlist = new Set<string>();

  toggleTrendingWish(event: Event, carId: string): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.trendingWishlist.has(carId)) {
      this.trendingWishlist.delete(carId);
      this.wishlistService.removeFromWishlist(carId).subscribe();
    } else {
      this.trendingWishlist.add(carId);
      this.wishlistService.addToWishlist(carId).subscribe();
    }
  }

  isTrendingWished(carId: string): boolean {
    return this.trendingWishlist.has(carId);
  }

  formatTrendingPrice(price: number): string {
    if (price >= 10000000) return (price / 10000000).toFixed(2) + ' Cr';
    if (price >= 100000)   return (price / 100000).toFixed(2) + ' L';
    return '₹' + price.toLocaleString();
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadFeaturedCars();
    this.popularBrands = this.carService.getPopularBrands();
  }

  // ── Methods ───────────────────────────────────────────────────────────────
  loadFeaturedCars(): void {
    this.loading.set(true);
    this.carService.getFeaturedCars().subscribe({
      next: (cars) => { this.featuredCars.set(cars); this.loading.set(false); },
      error: ()     => { this.loading.set(false); }
    });
  }

  onHeroSearch(): void {
    const params: Record<string, string> = {};
    if (this.searchBrand)  params['brand']    = this.searchBrand;
    if (this.searchBudget) params['budget']   = this.searchBudget;
    if (this.searchFuel)   params['fuelType'] = this.searchFuel;
    if (this.activeTab !== 'all') params['filter'] = this.activeTab;

    this.router.navigate(['/buy-car'], { queryParams: params });
  }

  quickSearch(tag: string): void {
    const tagMap: Record<string, Record<string, string>> = {
      'Under ₹5L':        { budget: '0-500000'          },
      'Automatic SUV':    { bodyType: 'SUV'              },
      'Diesel Sedan':     { fuelType: 'Diesel', bodyType: 'Sedan' },
      'Maruti Swift':     { brand: 'Maruti Suzuki'       },
      'Hyundai Creta':    { brand: 'Hyundai'             },
      'Toyota Fortuner':  { brand: 'Toyota'              },
    };
    this.router.navigate(['/buy-car'], { queryParams: tagMap[tag] ?? {} });
  }
}
