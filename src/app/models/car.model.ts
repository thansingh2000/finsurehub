export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: string;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'CNG';
  transmission: 'Manual' | 'Automatic';
  bodyType: 'Sedan' | 'SUV' | 'Hatchback' | 'Coupe' | 'Convertible' | 'Wagon' | 'Truck';
  color: string;
  owners: number;
  location: string;
  images: string[];
  features: string[];
  description: string;
  dealerId: string;
  dealerName: string;
  registrationYear: number;
  insuranceValidity: string;
  kmDriven: number;
  rating?: number;
  isFeatured: boolean;
  isNew: boolean;
  engineCapacity?: string;
  seatingCapacity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CarFilter {
  brand?: string[];
  priceRange?: { min: number; max: number };
  yearRange?: { min: number; max: number };
  fuelType?: string[];
  transmission?: string[];
  bodyType?: string[];
  location?: string[];
  kmRange?: { min: number; max: number };
  sortBy?: 'price-asc' | 'price-desc' | 'year-desc' | 'mileage-asc' | 'popularity';
}

export interface CarComparison {
  cars: Car[];
  comparisonDate: Date;
}
