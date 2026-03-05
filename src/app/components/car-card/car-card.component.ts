import { Component, Input, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Car } from '../../models/car.model';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-car-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './car-card.component.html',
  styleUrl:    './car-card.component.scss',
})
export class CarCardComponent implements OnInit {

  // ─── Primary object input (backward-compatible) ───────────────────────────
  @Input() car?: Car;

  // ─── Individual flat inputs (new API) ─────────────────────────────────────
  @Input() carImage?:      string;
  @Input() title?:         string;
  @Input() price?:         number;
  @Input() fuelType?:      string;
  @Input() transmission?:  string;
  @Input() year?:          number;
  @Input() kmDriven?:      number;
  @Input() rating?:        number;
  @Input() location?:      string;
  @Input() isNew?:         boolean;
  @Input() isFeatured?:    boolean;
  /** Explicit ID override — used when no `car` object is provided */
  @Input() cardId?:        string;

  // ─── Output ───────────────────────────────────────────────────────────────
  @Output() compareToggled = new EventEmitter<{ id: string; checked: boolean }>();

  // ─── Services ─────────────────────────────────────────────────────────────
  private wishlistService = inject(WishlistService);

  // ─── Component state ──────────────────────────────────────────────────────
  wishlisted     = signal(false);
  compareChecked = signal(false);
  imgError       = signal(false);

  // ─── Lifecycle ────────────────────────────────────────────────────────────
  ngOnInit(): void {
    if (this.car) {
      this.wishlisted.set(this.wishlistService.isInWishlist(this.car.id));
    }
  }

  // ─── Resolved display values (individual inputs override car object) ───────
  get _id():           string          { return this.cardId       ?? this.car?.id                                  ?? ''; }
  get _image():        string          { return this.carImage     ?? this.car?.images?.[0]                         ?? ''; }
  get _title():        string          { return this.title        ?? (this.car ? `${this.car.brand} ${this.car.model}` : '—'); }
  get _price():        number          { return this.price        ?? this.car?.price                               ?? 0; }
  get _fuel():         string          { return this.fuelType     ?? this.car?.fuelType                            ?? ''; }
  get _transmission(): string          { return this.transmission ?? this.car?.transmission                        ?? ''; }
  get _year():         number          { return this.year         ?? this.car?.year                                ?? 0; }
  get _km():           number          { return this.kmDriven     ?? this.car?.kmDriven                            ?? 0; }
  get _rating():       number | undefined { return this.rating    ?? this.car?.rating; }
  get _location():     string          { return this.location     ?? this.car?.location                            ?? ''; }
  get _isNew():        boolean         { return this.isNew        ?? this.car?.isNew                               ?? false; }
  get _isFeatured():   boolean         { return this.isFeatured   ?? this.car?.isFeatured                          ?? false; }

  // ─── Helpers ──────────────────────────────────────────────────────────────
  formatPrice(p: number): string {
    if (p >= 10_000_000) return (p / 10_000_000).toFixed(2) + ' Cr';
    if (p >= 100_000)    return (p / 100_000).toFixed(2) + ' L';
    return p.toLocaleString();
  }

  fuelIcon(fuel: string): string {
    return fuel === 'Electric' ? 'electric_bolt' : 'local_gas_station';
  }

  transmissionIcon(trx: string): string {
    return trx === 'Automatic' ? 'autorenew' : 'settings';
  }

  // ─── Actions ──────────────────────────────────────────────────────────────
  toggleWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const next = !this.wishlisted();
    this.wishlisted.set(next);
    if (this.car) {
      next
        ? this.wishlistService.addToWishlist(this.car.id).subscribe()
        : this.wishlistService.removeFromWishlist(this.car.id).subscribe();
    }
  }

  onCompareChange(event: Event): void {
    event.stopPropagation();
    const next = !this.compareChecked();
    this.compareChecked.set(next);
    this.compareToggled.emit({ id: this._id, checked: next });
  }

  onImgError(): void {
    this.imgError.set(true);
  }
}
