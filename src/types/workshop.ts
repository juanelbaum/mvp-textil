import type { WorkshopCapacity } from '@/types/user';

export interface WorkshopProfile {
  id: string;
  workshopName: string;
  ownerName: string;
  email: string;
  phone: string;
  location: string;
  description: string;
  services: string[];
  specialties: string[];
  capacity: WorkshopCapacity;
  rating: number;
  reviewsCount: number;
  completedOrders: number;
  minOrderQuantity: number;
  leadTimeDays: number;
  avatar?: string;
  images: string[];
  createdAt: string;
}

export interface WorkshopReview {
  id: string;
  workshopId: string;
  manufacturerId: string;
  manufacturerName: string;
  rating: number;
  comment: string;
  orderId: string;
  createdAt: string;
}

export interface WorkshopFilter {
  search: string;
  location: string;
  services: string[];
  minRating: number;
  capacity: WorkshopCapacity | '';
}
