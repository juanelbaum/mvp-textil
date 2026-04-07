import type { WorkshopCapacity } from '@/types/user';

export type ManufacturerProfileFormState = {
  companyName: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  industry: string;
  description: string;
};

export type WorkshopProfileFormState = {
  workshopName: string;
  ownerName: string;
  email: string;
  phone: string;
  location: string;
  services: string;
  specialties: string;
  capacity: WorkshopCapacity;
  minOrderQuantity: string;
  leadTimeDays: string;
  description: string;
};
