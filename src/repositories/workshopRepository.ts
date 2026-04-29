import 'server-only';

import { getAdminClient } from '@/lib/supabase/admin';
import { createRepositoryLogger } from '@/lib/logger';
import type { WorkshopCapacity } from '@/types/user';
import type { WorkshopFilter, WorkshopProfile } from '@/types/workshop';

const logger = createRepositoryLogger('workshopRepository');

interface WorkshopRow {
  user_id: string;
  workshop_name: string;
  services: string[];
  specialties: string[];
  capacity: WorkshopCapacity;
  rating: number;
  reviews_count: number;
  completed_orders: number;
  min_order_quantity: number;
  lead_time_days: number;
  images: string[];
  users: {
    email: string;
    name: string;
    phone: string;
    location: string;
    description: string;
    avatar: string | null;
    created_at: string;
  };
}

const WORKSHOP_SELECT = `
  user_id,
  workshop_name,
  services,
  specialties,
  capacity,
  rating,
  reviews_count,
  completed_orders,
  min_order_quantity,
  lead_time_days,
  images,
  users!inner (
    email,
    name,
    phone,
    location,
    description,
    avatar,
    created_at
  )
`;

const mapWorkshopProfile = (row: WorkshopRow): WorkshopProfile => ({
  id: row.user_id,
  workshopName: row.workshop_name,
  ownerName: row.users.name,
  email: row.users.email,
  phone: row.users.phone,
  location: row.users.location,
  description: row.users.description,
  services: row.services,
  specialties: row.specialties,
  capacity: row.capacity,
  rating: Number(row.rating),
  reviewsCount: row.reviews_count,
  completedOrders: row.completed_orders,
  minOrderQuantity: row.min_order_quantity,
  leadTimeDays: row.lead_time_days,
  avatar: row.users.avatar ?? undefined,
  images: row.images,
  createdAt: row.users.created_at,
});

export const listWorkshops = async (
  filters: WorkshopFilter,
): Promise<WorkshopProfile[]> => {
  const supabase = getAdminClient();

  let query = supabase
    .from('workshops')
    .select(WORKSHOP_SELECT)
    .gte('rating', filters.minRating);

  if (filters.capacity) {
    query = query.eq('capacity', filters.capacity);
  }

  if (filters.services.length > 0) {
    query = query.overlaps('services', filters.services);
  }

  const { data, error } = await query;

  if (error) {
    logger.error({ err: error, filters }, 'Error listing workshops');
    throw new Error(`Failed to list workshops: ${error.message}`);
  }

  const rows = ((data ?? []) as unknown) as WorkshopRow[];
  const items = rows.map(mapWorkshopProfile);

  // Text search + location filter applied in-memory to keep the query simple
  // and case-insensitive. Dataset is small; when it grows move to ilike/full-text.
  const search = filters.search.trim().toLowerCase();
  const location = filters.location.trim();

  return items.filter((item) => {
    if (location && item.location !== location) return false;
    if (search) {
      const searchable = [
        item.workshopName,
        item.ownerName,
        item.location,
        ...item.services,
        ...item.specialties,
      ]
        .join(' ')
        .toLowerCase();
      if (!searchable.includes(search)) return false;
    }
    return true;
  });
};

export const getWorkshopProfileById = async (
  id: string,
): Promise<WorkshopProfile | null> => {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from('workshops')
    .select(WORKSHOP_SELECT)
    .eq('user_id', id)
    .maybeSingle();

  if (error) {
    logger.error({ err: error, id }, 'Error fetching workshop by id');
    throw new Error(`Failed to fetch workshop: ${error.message}`);
  }

  return data ? mapWorkshopProfile((data as unknown) as WorkshopRow) : null;
};
