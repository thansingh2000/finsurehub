import { Injectable, signal } from '@angular/core';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';
import { Observable, of, throwError, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_KEY = 'current-user';
  private readonly TOKEN_KEY = 'auth-token';
  
  public currentUser = signal<User | null>(this.getStoredUser());
  public isAuthenticated = signal<boolean>(!!this.getStoredUser());

  private getStoredUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    // Mock login - in real app, this would call an API
    if (credentials.email && credentials.password) {
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        firstName: 'John',
        lastName: 'Doe',
        phone: '+91 9876543210',
        role: 'customer',
        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified: true
      };

      const mockResponse: AuthResponse = {
        user: mockUser,
        token: 'mock-jwt-token-' + Date.now()
      };

      this.setAuthData(mockResponse);
      return of(mockResponse).pipe(delay(500));
    }

    return throwError(() => new Error('Invalid credentials')).pipe(delay(500));
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    // Mock registration - in real app, this would call an API
    const mockUser: User = {
      id: Date.now().toString(),
      email: request.email,
      firstName: request.firstName,
      lastName: request.lastName,
      phone: request.phone,
      role: request.role,
      createdAt: new Date(),
      updatedAt: new Date(),
      isVerified: false
    };

    const mockResponse: AuthResponse = {
      user: mockUser,
      token: 'mock-jwt-token-' + Date.now()
    };

    this.setAuthData(mockResponse);
    return of(mockResponse).pipe(delay(500));
  }

  logout(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  private setAuthData(response: AuthResponse): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    localStorage.setItem(this.TOKEN_KEY, response.token);
    this.currentUser.set(response.user);
    this.isAuthenticated.set(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  hasRole(role: string): boolean {
    return this.currentUser()?.role === role;
  }
}
