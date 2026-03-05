import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  newsletterEmail = '';

  popularBrands = [
    { name: 'Maruti Suzuki', count: '820+' },
    { name: 'Hyundai',       count: '640+' },
    { name: 'Tata Motors',   count: '510+' },
    { name: 'Honda',         count: '430+' },
    { name: 'Toyota',        count: '390+' },
    { name: 'Mahindra',      count: '360+' },
    { name: 'Kia',           count: '280+' },
    { name: 'BMW',           count: '190+' },
  ];

  services = [
    { label: 'Buy a Car',        route: '/buy-car',            icon: 'directions_car'   },
    { label: 'Compare Cars',     route: '/compare',            icon: 'compare_arrows'   },
    { label: 'My Wishlist',      route: '/wishlist',           icon: 'favorite_border'  },
    { label: 'Dealer Dashboard', route: '/dealer/dashboard',   icon: 'storefront'       },
    { label: 'EMI Calculator',   route: '/',                   icon: 'calculate'        },
    { label: 'Car Valuation',    route: '/',                   icon: 'price_check'      },
    { label: 'Insurance',        route: '/',                   icon: 'shield'           },
    { label: 'RC Transfer',      route: '/',                   icon: 'assignment'       },
  ];

  socials = [
    { label: 'Facebook',  icon: 'facebook',  url: '#' },
    { label: 'Instagram', icon: 'camera_alt', url: '#' },
    { label: 'YouTube',   icon: 'play_circle', url: '#' },
    { label: 'LinkedIn',  icon: 'work',       url: '#' },
  ];

  subscribeNewsletter(): void {
    if (this.newsletterEmail.trim()) {
      // TODO: wire to a real newsletter service
      console.log('Newsletter subscription:', this.newsletterEmail);
      this.newsletterEmail = '';
    }
  }
}
