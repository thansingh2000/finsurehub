import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CarCardComponent } from '../../components/car-card/car-card.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { CarService } from '../../services/car.service';
import { Car } from '../../models/car.model';

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
    CarCardComponent,
    LoadingComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private carService = inject(CarService);
  private router = inject(Router);

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
