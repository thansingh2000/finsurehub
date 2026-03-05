import {
  Component, OnInit, inject, signal, computed, HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CarCardComponent } from '../../components/car-card/car-card.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { CarService } from '../../services/car.service';
import { Car } from '../../models/car.model';

interface BrandItem { name: string; count: number; }

@Component({
  selector: 'app-car-listing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    MatFormFieldModule,
    CarCardComponent,
    LoadingComponent,
  ],
  templateUrl: './car-listing.component.html',
  styleUrl:    './car-listing.component.scss',
})
export class CarListingComponent implements OnInit {

  private carService    = inject(CarService);
  private route         = inject(ActivatedRoute);

  // ── Raw data ──────────────────────────────────────────────────────────────
  allCars  = signal<Car[]>([]);
  loading  = signal(true);

  // ── Filter state ──────────────────────────────────────────────────────────
  filterBrands     = signal<string[]>([]);
  filterFuels      = signal<string[]>([]);
  filterTrx        = signal<string[]>([]);
  filterBodyTypes  = signal<string[]>([]);
  filterPriceMin   = signal(0);
  filterPriceMax   = signal(10000000);
  filterYearMin    = signal(2015);
  filterYearMax    = signal(2025);

  // ── Sort, pagination & UI ─────────────────────────────────────────────────
  sortBy       = signal<string>('popularity');
  viewMode     = signal<'grid' | 'list'>('grid');
  currentPage  = signal(1);
  readonly PAGE_SIZE = 12;

  sidebarOpen  = signal(false);   // mobile drawer

  // ── Sidebar section open/close state ──────────────────────────────────────
  openSections = signal<Record<string, boolean>>({
    price: true, brand: true, fuel: true,
    transmission: true, year: true, body: true,
  });

  // ── Static option lists ───────────────────────────────────────────────────
  readonly FUEL_TYPES  = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];
  readonly TRX_TYPES   = ['Manual', 'Automatic'];
  readonly BODY_TYPES  = [
    { value: 'Hatchback', icon: 'directions_car' },
    { value: 'Sedan',     icon: 'commute'        },
    { value: 'SUV',       icon: 'directions_car' },
    { value: 'Coupe',     icon: 'sports_car'     },
    { value: 'Wagon',     icon: 'airport_shuttle'},
    { value: 'Truck',     icon: 'local_shipping' },
  ];

  readonly SORT_OPTIONS = [
    { value: 'popularity', label: 'Popularity'              },
    { value: 'price-asc',  label: 'Price: Low to High'      },
    { value: 'price-desc', label: 'Price: High to Low'      },
    { value: 'year-desc',  label: 'Year: Newest First'      },
    { value: 'km-asc',     label: 'KM Driven: Least First'  },
    { value: 'rating',     label: 'Top Rated'               },
  ];

  readonly PRICE_MIN = 0;
  readonly PRICE_MAX = 10000000;
  readonly YEAR_MIN  = 2015;
  readonly YEAR_MAX  = 2025;

  // ── Derived brand list with counts ────────────────────────────────────────
  brandList = computed<BrandItem[]>(() => {
    const map = new Map<string, number>();
    this.allCars().forEach(c => map.set(c.brand, (map.get(c.brand) ?? 0) + 1));
    return [...map.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  });

  // ── Main computed: filter + sort ──────────────────────────────────────────
  filteredCars = computed<Car[]>(() => {
    let cars = [...this.allCars()];

    const brands    = this.filterBrands();
    const fuels     = this.filterFuels();
    const trx       = this.filterTrx();
    const bodies    = this.filterBodyTypes();
    const priceMin  = this.filterPriceMin();
    const priceMax  = this.filterPriceMax();
    const yearMin   = this.filterYearMin();
    const yearMax   = this.filterYearMax();

    if (brands.length)  cars = cars.filter(c => brands.includes(c.brand));
    if (fuels.length)   cars = cars.filter(c => fuels.includes(c.fuelType));
    if (trx.length)     cars = cars.filter(c => trx.includes(c.transmission));
    if (bodies.length)  cars = cars.filter(c => bodies.includes(c.bodyType));
    cars = cars.filter(c => c.price >= priceMin && c.price <= priceMax);
    cars = cars.filter(c => c.year >= yearMin && c.year <= yearMax);

    switch (this.sortBy()) {
      case 'price-asc':  cars.sort((a, b) => a.price - b.price);           break;
      case 'price-desc': cars.sort((a, b) => b.price - a.price);           break;
      case 'year-desc':  cars.sort((a, b) => b.year - a.year);             break;
      case 'km-asc':     cars.sort((a, b) => a.kmDriven - b.kmDriven);     break;
      case 'rating':     cars.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
    }
    return cars;
  });

  // ── Pagination ────────────────────────────────────────────────────────────
  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredCars().length / this.PAGE_SIZE))
  );

  paginatedCars = computed(() => {
    const start = (this.currentPage() - 1) * this.PAGE_SIZE;
    return this.filteredCars().slice(start, start + this.PAGE_SIZE);
  });

  pageNumbers = computed<(number | '...')[]>(() => {
    const total   = this.totalPages();
    const current = this.currentPage();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: (number | '...')[] = [];
    if (current <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', total);
    } else if (current >= total - 3) {
      pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total);
    }
    return pages;
  });

  // ── Active filter chips ───────────────────────────────────────────────────
  activeChips = computed<{ label: string; type: string; value: string }[]>(() => {
    const chips: { label: string; type: string; value: string }[] = [];

    this.filterBrands().forEach(b   => chips.push({ label: b,   type: 'brand', value: b }));
    this.filterFuels().forEach(f    => chips.push({ label: f,   type: 'fuel',  value: f }));
    this.filterTrx().forEach(t      => chips.push({ label: t,   type: 'trx',   value: t }));
    this.filterBodyTypes().forEach(b => chips.push({ label: b,  type: 'body',  value: b }));

    if (this.filterPriceMin() > 0 || this.filterPriceMax() < this.PRICE_MAX) {
      chips.push({
        label: `₹${this.fmt(this.filterPriceMin())} – ₹${this.fmt(this.filterPriceMax())}`,
        type:  'price', value: 'price',
      });
    }
    if (this.filterYearMin() > this.YEAR_MIN || this.filterYearMax() < this.YEAR_MAX) {
      chips.push({
        label: `${this.filterYearMin()} – ${this.filterYearMax()}`,
        type: 'year', value: 'year',
      });
    }
    return chips;
  });

  activeFilterCount = computed(() => this.activeChips().length);

  // ── Price range percentage (for the visual track) ─────────────────────────
  priceMinPct = computed(() =>
    (this.filterPriceMin() / this.PRICE_MAX) * 100
  );
  priceMaxPct = computed(() =>
    (this.filterPriceMax() / this.PRICE_MAX) * 100
  );

  // ── Year arrays for selects ───────────────────────────────────────────────
  yearOptions = Array.from({ length: this.YEAR_MAX - this.YEAR_MIN + 1 },
    (_, i) => this.YEAR_MIN + i);

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.carService.getCars().subscribe(cars => {
      this.allCars.set(cars);
      this.loading.set(false);
    });

    this.route.queryParams.subscribe(params => {
      if (params['brand'])    this.filterBrands.set([params['brand']]);
      if (params['fuelType']) this.filterFuels.set([params['fuelType']]);
      if (params['bodyType']) this.filterBodyTypes.set([params['bodyType']]);
      if (params['search'])   { /* TODO: text search */ }
      if (params['budget']) {
        const [min, max] = params['budget'].split('-').map(Number);
        this.filterPriceMin.set(min);
        this.filterPriceMax.set(max);
      }
    });
  }

  // ── Toggle helpers ────────────────────────────────────────────────────────
  toggle(sig: ReturnType<typeof signal<string[]>>, value: string): void {
    const curr = sig();
    sig.set(curr.includes(value) ? curr.filter(v => v !== value) : [...curr, value]);
    this.currentPage.set(1);
  }

  toggleBrand(b: string)    { this.toggle(this.filterBrands,    b); }
  toggleFuel(f: string)     { this.toggle(this.filterFuels,     f); }
  toggleTrx(t: string)      { this.toggle(this.filterTrx,       t); }
  toggleBody(b: string)     { this.toggle(this.filterBodyTypes, b); }

  removeChip(chip: { type: string; value: string }): void {
    switch (chip.type) {
      case 'brand': this.toggleBrand(chip.value);    break;
      case 'fuel':  this.toggleFuel(chip.value);     break;
      case 'trx':   this.toggleTrx(chip.value);      break;
      case 'body':  this.toggleBody(chip.value);     break;
      case 'price': this.filterPriceMin.set(0); this.filterPriceMax.set(this.PRICE_MAX); break;
      case 'year':  this.filterYearMin.set(this.YEAR_MIN); this.filterYearMax.set(this.YEAR_MAX); break;
    }
  }

  clearAll(): void {
    this.filterBrands.set([]);
    this.filterFuels.set([]);
    this.filterTrx.set([]);
    this.filterBodyTypes.set([]);
    this.filterPriceMin.set(0);
    this.filterPriceMax.set(this.PRICE_MAX);
    this.filterYearMin.set(this.YEAR_MIN);
    this.filterYearMax.set(this.YEAR_MAX);
    this.sortBy.set('popularity');
    this.currentPage.set(1);
  }

  // ── Sidebar sections ──────────────────────────────────────────────────────
  toggleSection(key: string): void {
    const curr = this.openSections();
    this.openSections.set({ ...curr, [key]: !curr[key] });
  }
  isOpen(key: string): boolean { return !!this.openSections()[key]; }

  // ── Pagination ────────────────────────────────────────────────────────────
  goToPage(p: number | '...'): void {
    if (p === '...' || p === this.currentPage()) return;
    this.currentPage.set(p as number);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // ── Sort change ───────────────────────────────────────────────────────────
  onSortChange(value: string): void {
    this.sortBy.set(value);
    this.currentPage.set(1);
  }

  // ── Price range helpers ───────────────────────────────────────────────────
  onPriceMinChange(e: Event): void {
    const v = +(e.target as HTMLInputElement).value;
    this.filterPriceMin.set(Math.min(v, this.filterPriceMax() - 100000));
    this.currentPage.set(1);
  }
  onPriceMaxChange(e: Event): void {
    const v = +(e.target as HTMLInputElement).value;
    this.filterPriceMax.set(Math.max(v, this.filterPriceMin() + 100000));
    this.currentPage.set(1);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  fmt(price: number): string {
    if (price >= 10_000_000) return (price / 10_000_000).toFixed(1) + ' Cr';
    if (price >= 100_000)    return (price / 100_000).toFixed(1) + ' L';
    return price.toLocaleString();
  }

  isPage(n: number | '...'): n is number { return typeof n === 'number'; }

  // ── Template helpers ──────────────────────────────────────────────────────
  /** Exposes Math.min to the template */
  minVal(a: number, b: number): number { return Math.min(a, b); }

  /** Close mobile sidebar when window grows past lg breakpoint */
  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth >= 1024) this.sidebarOpen.set(false);
  }
}
