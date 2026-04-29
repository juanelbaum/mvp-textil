import 'server-only';

import {
  getWorkshopProfileById,
  listWorkshops as repoListWorkshops,
} from '@/repositories/workshopRepository';
import type { WorkshopFilterInput } from '@/lib/validation/schemas';
import type { WorkshopProfile } from '@/types/workshop';

export const listWorkshops = async (
  filters: WorkshopFilterInput,
): Promise<WorkshopProfile[]> => {
  return repoListWorkshops({
    search: filters.search,
    location: filters.location,
    services: filters.services,
    minRating: filters.minRating,
    capacity: filters.capacity,
  });
};

export const getWorkshopById = async (id: string): Promise<WorkshopProfile | null> => {
  return getWorkshopProfileById(id);
};
