import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800 py-12 px-4">
      <mat-card class="w-full max-w-md !p-8">
        <div class="text-center mb-8">
          <div class="flex items-center justify-center space-x-2 mb-4">
            <mat-icon class="!text-5xl !w-12 !h-12 text-primary-600">directions_car</mat-icon>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
          <p class="text-gray-600 dark:text-gray-300">Login to your account</p>
        </div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <mat-form-field appearance="outline" class="w-full mb-4">
            <mat-label>Email</mat-label>
            <mat-icon matPrefix>email</mat-icon>
            <input 
              matInput 
              type="email" 
              [(ngModel)]="credentials.email" 
              name="email"
              required
              placeholder="Enter your email"
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full mb-4">
            <mat-label>Password</mat-label>
            <mat-icon matPrefix>lock</mat-icon>
            <input 
              matInput 
              [type]="hidePassword ? 'password' : 'text'"
              [(ngModel)]="credentials.password"
              name="password"
              required
              placeholder="Enter your password"
            />
            <button 
              mat-icon-button 
              matSuffix 
              type="button"
              (click)="hidePassword = !hidePassword"
            >
              <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </mat-form-field>

          <div class="text-right mb-6">
            <a href="#" class="text-primary-600 hover:text-primary-700">Forgot Password?</a>
          </div>

          <button 
            mat-raised-button 
            color="primary" 
            type="submit"
            class="w-full !py-3 !text-lg mb-4"
            [disabled]="!loginForm.valid"
          >
            Login
          </button>

          <div class="text-center">
            <span class="text-gray-600 dark:text-gray-300">Don't have an account? </span>
            <a routerLink="/register" class="text-primary-600 hover:text-primary-700 font-semibold">
              Sign Up
            </a>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials = {
    email: '',
    password: ''
  };

  hidePassword = true;

  onSubmit(): void {
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }
}
