import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <footer class="bg-gray-900 text-gray-300 mt-auto">
      <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Company Info -->
          <div>
            <div class="flex items-center space-x-2 mb-4">
              <mat-icon class="text-primary-400 !text-3xl">directions_car</mat-icon>
              <span class="text-xl font-bold text-white">CarMarket</span>
            </div>
            <p class="text-sm text-gray-400 mb-4">
              Your trusted platform for buying and selling quality used cars. 
              Find your perfect car at the best price.
            </p>
            <div class="flex space-x-3">
              <a href="#" class="hover:text-primary-400 transition-colors">
                <mat-icon>facebook</mat-icon>
              </a>
              <a href="#" class="hover:text-primary-400 transition-colors">
                <mat-icon>instagram</mat-icon>
              </a>
              <a href="#" class="hover:text-primary-400 transition-colors">
                <mat-icon>twitter</mat-icon>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-white font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2 text-sm">
              <li><a routerLink="/" class="hover:text-primary-400 transition-colors">Home</a></li>
              <li><a routerLink="/buy-car" class="hover:text-primary-400 transition-colors">Buy Car</a></li>
              <li><a routerLink="/compare" class="hover:text-primary-400 transition-colors">Compare Cars</a></li>
              <li><a routerLink="/wishlist" class="hover:text-primary-400 transition-colors">Wishlist</a></li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h3 class="text-white font-semibold mb-4">Support</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-primary-400 transition-colors">Help Center</a></li>
              <li><a href="#" class="hover:text-primary-400 transition-colors">Contact Us</a></li>
              <li><a href="#" class="hover:text-primary-400 transition-colors">FAQs</a></li>
              <li><a href="#" class="hover:text-primary-400 transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h3 class="text-white font-semibold mb-4">Contact</h3>
            <ul class="space-y-3 text-sm">
              <li class="flex items-start space-x-2">
                <mat-icon class="!text-lg">phone</mat-icon>
                <span>+91 1800-XXX-XXXX</span>
              </li>
              <li class="flex items-start space-x-2">
                <mat-icon class="!text-lg">email</mat-icon>
                <span>support&#64;carmarket.com</span>
              </li>
              <li class="flex items-start space-x-2">
                <mat-icon class="!text-lg">location_on</mat-icon>
                <span>Mumbai, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {{ currentYear }} CarMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
