export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'customer' | 'dealer' | 'admin';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'customer' | 'dealer';
}

export interface AuthResponse {
  user: User;
  token: string;
}
