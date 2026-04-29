import 'server-only';

import { getAdminClient } from '@/lib/supabase/admin';
import { createRepositoryLogger } from '@/lib/logger';
import type {
  Manufacturer,
  User,
  UserRole,
  Workshop,
  WorkshopCapacity,
} from '@/types/user';

const logger = createRepositoryLogger('userRepository');

interface UserRow {
  id: string;
  role: UserRole;
  email: string;
  name: string;
  phone: string;
  location: string;
  description: string;
  avatar: string | null;
  created_at: string;
}

interface ManufacturerRow {
  user_id: string;
  company_name: string;
  industry: string;
  orders_count: number;
}

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
}

const mapUser = (row: UserRow): User => ({
  id: row.id,
  role: row.role,
  email: row.email,
  name: row.name,
  phone: row.phone,
  location: row.location,
  description: row.description,
  avatar: row.avatar ?? undefined,
  createdAt: row.created_at,
});

const mapManufacturer = (userRow: UserRow, mfr: ManufacturerRow): Manufacturer => ({
  ...mapUser(userRow),
  role: 'manufacturer',
  companyName: mfr.company_name,
  industry: mfr.industry,
  ordersCount: mfr.orders_count,
});

const mapWorkshop = (userRow: UserRow, ws: WorkshopRow): Workshop => ({
  ...mapUser(userRow),
  role: 'workshop',
  workshopName: ws.workshop_name,
  services: ws.services,
  specialties: ws.specialties,
  capacity: ws.capacity,
  rating: Number(ws.rating),
  reviewsCount: ws.reviews_count,
  minOrderQuantity: ws.min_order_quantity,
  leadTimeDays: ws.lead_time_days,
});

export const getUserById = async (id: string): Promise<User | null> => {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle<UserRow>();

  if (error) {
    logger.error({ err: error, userId: id }, 'Error fetching user by id');
    throw new Error(`Failed to fetch user: ${error.message}`);
  }

  return data ? mapUser(data) : null;
};

export const getManufacturerById = async (id: string): Promise<Manufacturer | null> => {
  const supabase = getAdminClient();

  const [{ data: userRow, error: userErr }, { data: mfrRow, error: mfrErr }] = await Promise.all([
    supabase.from('users').select('*').eq('id', id).eq('role', 'manufacturer').maybeSingle<UserRow>(),
    supabase.from('manufacturers').select('*').eq('user_id', id).maybeSingle<ManufacturerRow>(),
  ]);

  if (userErr || mfrErr) {
    logger.error({ userErr, mfrErr, userId: id }, 'Error fetching manufacturer');
    throw new Error('Failed to fetch manufacturer');
  }

  if (!userRow || !mfrRow) return null;
  return mapManufacturer(userRow, mfrRow);
};

export const getWorkshopUserById = async (id: string): Promise<Workshop | null> => {
  const supabase = getAdminClient();

  const [{ data: userRow, error: userErr }, { data: wsRow, error: wsErr }] = await Promise.all([
    supabase.from('users').select('*').eq('id', id).eq('role', 'workshop').maybeSingle<UserRow>(),
    supabase.from('workshops').select('*').eq('user_id', id).maybeSingle<WorkshopRow>(),
  ]);

  if (userErr || wsErr) {
    logger.error({ userErr, wsErr, userId: id }, 'Error fetching workshop user');
    throw new Error('Failed to fetch workshop user');
  }

  if (!userRow || !wsRow) return null;
  return mapWorkshop(userRow, wsRow);
};

export interface UpdateManufacturerRow {
  name: string;
  email: string;
  phone: string;
  location: string;
  description: string;
  companyName: string;
  industry: string;
}

export const updateManufacturer = async (
  userId: string,
  input: UpdateManufacturerRow,
): Promise<Manufacturer> => {
  const supabase = getAdminClient();

  const { error: userErr } = await supabase
    .from('users')
    .update({
      name: input.name,
      email: input.email,
      phone: input.phone,
      location: input.location,
      description: input.description,
    })
    .eq('id', userId)
    .eq('role', 'manufacturer');

  if (userErr) {
    logger.error({ err: userErr, userId }, 'Error updating user row for manufacturer');
    throw new Error(`Failed to update manufacturer user: ${userErr.message}`);
  }

  const { error: mfrErr } = await supabase
    .from('manufacturers')
    .update({
      company_name: input.companyName,
      industry: input.industry,
    })
    .eq('user_id', userId);

  if (mfrErr) {
    logger.error({ err: mfrErr, userId }, 'Error updating manufacturer row');
    throw new Error(`Failed to update manufacturer: ${mfrErr.message}`);
  }

  const updated = await getManufacturerById(userId);
  if (!updated) throw new Error('Manufacturer not found after update');
  return updated;
};

export interface UpdateWorkshopRow {
  name: string;
  email: string;
  phone: string;
  location: string;
  description: string;
  workshopName: string;
  services: string[];
  specialties: string[];
  capacity: WorkshopCapacity;
  minOrderQuantity: number;
  leadTimeDays: number;
}

export const updateWorkshopUser = async (
  userId: string,
  input: UpdateWorkshopRow,
): Promise<Workshop> => {
  const supabase = getAdminClient();

  const { error: userErr } = await supabase
    .from('users')
    .update({
      name: input.name,
      email: input.email,
      phone: input.phone,
      location: input.location,
      description: input.description,
    })
    .eq('id', userId)
    .eq('role', 'workshop');

  if (userErr) {
    logger.error({ err: userErr, userId }, 'Error updating user row for workshop');
    throw new Error(`Failed to update workshop user: ${userErr.message}`);
  }

  const { error: wsErr } = await supabase
    .from('workshops')
    .update({
      workshop_name: input.workshopName,
      services: input.services,
      specialties: input.specialties,
      capacity: input.capacity,
      min_order_quantity: input.minOrderQuantity,
      lead_time_days: input.leadTimeDays,
    })
    .eq('user_id', userId);

  if (wsErr) {
    logger.error({ err: wsErr, userId }, 'Error updating workshop row');
    throw new Error(`Failed to update workshop: ${wsErr.message}`);
  }

  const updated = await getWorkshopUserById(userId);
  if (!updated) throw new Error('Workshop not found after update');
  return updated;
};
