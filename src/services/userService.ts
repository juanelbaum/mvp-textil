import 'server-only';

import { createServiceLogger } from '@/lib/logger';
import {
  getManufacturerById,
  getUserById,
  getWorkshopUserById,
  updateManufacturer,
  updateWorkshopUser,
} from '@/repositories/userRepository';
import type {
  ManufacturerProfileUpdateInput,
  WorkshopProfileUpdateInput,
} from '@/lib/validation/schemas';
import type { Manufacturer, User, Workshop } from '@/types/user';

const logger = createServiceLogger('userService');

export const getCurrentUser = async (userId: string): Promise<User | null> => {
  // TODO: once real auth is wired, replace userId param with auth.uid().
  return getUserById(userId);
};

export const getManufacturerProfile = async (
  userId: string,
): Promise<Manufacturer | null> => {
  // TODO: replace userId param with auth.uid() when Supabase Auth lands.
  return getManufacturerById(userId);
};

export const getWorkshopProfile = async (userId: string): Promise<Workshop | null> => {
  // TODO: replace userId param with auth.uid() when Supabase Auth lands.
  return getWorkshopUserById(userId);
};

export const updateManufacturerProfile = async (
  userId: string,
  input: ManufacturerProfileUpdateInput,
): Promise<Manufacturer> => {
  // TODO: verify auth.uid() === userId once real auth is wired.
  const current = await getManufacturerById(userId);
  if (!current) {
    logger.warn({ userId }, 'Attempt to update missing manufacturer profile');
    throw new Error('Perfil de fabricante no encontrado');
  }

  const updated = await updateManufacturer(userId, input);
  logger.info({ userId }, 'Manufacturer profile updated');
  return updated;
};

export const updateWorkshopProfile = async (
  userId: string,
  input: WorkshopProfileUpdateInput,
): Promise<Workshop> => {
  // TODO: verify auth.uid() === userId once real auth is wired.
  const current = await getWorkshopUserById(userId);
  if (!current) {
    logger.warn({ userId }, 'Attempt to update missing workshop profile');
    throw new Error('Perfil de taller no encontrado');
  }

  const updated = await updateWorkshopUser(userId, {
    name: input.ownerName,
    email: input.email,
    phone: input.phone,
    location: input.location,
    description: input.description,
    workshopName: input.workshopName,
    services: input.services,
    specialties: input.specialties,
    capacity: input.capacity,
    minOrderQuantity: input.minOrderQuantity,
    leadTimeDays: input.leadTimeDays,
  });
  logger.info({ userId }, 'Workshop profile updated');
  return updated;
};
