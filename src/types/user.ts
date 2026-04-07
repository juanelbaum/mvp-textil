export type UserRole = 'manufacturer' | 'workshop';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone: string;
  location: string;
  description: string;
  createdAt: string;
}

export interface Manufacturer extends User {
  role: 'manufacturer';
  companyName: string;
  industry: string;
  ordersCount: number;
}

export interface Workshop extends User {
  role: 'workshop';
  workshopName: string;
  services: string[];
  capacity: WorkshopCapacity;
  rating: number;
  reviewsCount: number;
  specialties: string[];
  minOrderQuantity: number;
  leadTimeDays: number;
}

export type WorkshopCapacity = 'low' | 'medium' | 'high';
