import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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

  featuredCars = signal<Car[]>([]);
  loading = signal(true);
  popularBrands: string[] = [];
  searchBrand = '';
  searchBudget = '';

  ngOnInit(): void {
    this.loadFeaturedCars();
    this.popularBrands = this.carService.getPopularBrands();
  }

  loadFeaturedCars(): void {
    this.loading.set(true);
    this.carService.getFeaturedCars().subscribe({
      next: (cars) => {
        this.featuredCars.set(cars);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
