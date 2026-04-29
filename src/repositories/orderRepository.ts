import 'server-only';

import { getAdminClient } from '@/lib/supabase/admin';
import { createRepositoryLogger } from '@/lib/logger';
import type { Order, OrderStatus, OrderTimelineEvent } from '@/types/order';

const logger = createRepositoryLogger('orderRepository');

interface OrderRow {
  id: string;
  title: string;
  description: string;
  manufacturer_id: string;
  workshop_id: string | null;
  status: OrderStatus;
  garment_type: string;
  quantity: number;
  material: string;
  deadline: string;
  budget: number;
  specifications: string[];
  created_at: string;
  updated_at: string;
  manufacturer: { company_name: string } | null;
  workshop: { workshop_name: string } | null;
}

interface TimelineRow {
  id: string;
  order_id: string;
  status: OrderStatus;
  description: string;
  timestamp: string;
}

const ORDER_SELECT = `
  id,
  title,
  description,
  manufacturer_id,
  workshop_id,
  status,
  garment_type,
  quantity,
  material,
  deadline,
  budget,
  specifications,
  created_at,
  updated_at,
  manufacturer:manufacturers!orders_manufacturer_id_fkey ( company_name ),
  workshop:workshops!orders_workshop_id_fkey ( workshop_name )
`;

const mapOrder = (row: OrderRow): Order => ({
  id: row.id,
  title: row.title,
  description: row.description,
  manufacturerId: row.manufacturer_id,
  manufacturerName: row.manufacturer?.company_name ?? '',
  workshopId: row.workshop_id ?? undefined,
  workshopName: row.workshop?.workshop_name ?? undefined,
  status: row.status,
  garmentType: row.garment_type,
  quantity: row.quantity,
  material: row.material,
  deadline: row.deadline,
  budget: Number(row.budget),
  specifications: row.specifications,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapTimelineEvent = (row: TimelineRow): OrderTimelineEvent => ({
  id: row.id,
  orderId: row.order_id,
  status: row.status,
  description: row.description,
  timestamp: row.timestamp,
});

export const getOrdersByManufacturer = async (
  manufacturerId: string,
): Promise<Order[]> => {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .eq('manufacturer_id', manufacturerId)
    .order('created_at', { ascending: false });

  if (error) {
    logger.error({ err: error, manufacturerId }, 'Error listing orders by manufacturer');
    throw new Error(`Failed to list manufacturer orders: ${error.message}`);
  }

  return (((data ?? []) as unknown) as OrderRow[]).map(mapOrder);
};

export const getOrdersForWorkshop = async (workshopId: string): Promise<Order[]> => {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .or(`workshop_id.eq.${workshopId},status.eq.pending`)
    .order('created_at', { ascending: false });

  if (error) {
    logger.error({ err: error, workshopId }, 'Error listing orders for workshop');
    throw new Error(`Failed to list workshop orders: ${error.message}`);
  }

  return (((data ?? []) as unknown) as OrderRow[]).map(mapOrder);
};

export const getPendingOrders = async (): Promise<Order[]> => {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    logger.error({ err: error }, 'Error listing pending orders');
    throw new Error(`Failed to list pending orders: ${error.message}`);
  }

  return (((data ?? []) as unknown) as OrderRow[]).map(mapOrder);
};

export const getOrderById = async (id: string): Promise<Order | null> => {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    logger.error({ err: error, id }, 'Error fetching order by id');
    throw new Error(`Failed to fetch order: ${error.message}`);
  }

  return data ? mapOrder((data as unknown) as OrderRow) : null;
};

export const getTimelineByOrder = async (
  orderId: string,
): Promise<OrderTimelineEvent[]> => {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('order_timeline_events')
    .select('*')
    .eq('order_id', orderId)
    .order('timestamp', { ascending: true });

  if (error) {
    logger.error({ err: error, orderId }, 'Error fetching timeline');
    throw new Error(`Failed to fetch timeline: ${error.message}`);
  }

  return (((data ?? []) as unknown) as TimelineRow[]).map(mapTimelineEvent);
};

export interface CreateOrderRow {
  title: string;
  description: string;
  manufacturerId: string;
  garmentType: string;
  quantity: number;
  material: string;
  deadline: string;
  budget: number;
  specifications: string[];
}

export const createOrderRow = async (input: CreateOrderRow): Promise<Order> => {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('orders')
    .insert({
      title: input.title,
      description: input.description,
      manufacturer_id: input.manufacturerId,
      workshop_id: null,
      status: 'pending',
      garment_type: input.garmentType,
      quantity: input.quantity,
      material: input.material,
      deadline: input.deadline,
      budget: input.budget,
      specifications: input.specifications,
    })
    .select(ORDER_SELECT)
    .single();

  if (error || !data) {
    logger.error({ err: error, input }, 'Error creating order');
    throw new Error(`Failed to create order: ${error?.message ?? 'unknown'}`);
  }

  return mapOrder((data as unknown) as OrderRow);
};

export const updateOrderStatusRow = async (
  orderId: string,
  status: OrderStatus,
  workshopId?: string,
): Promise<Order> => {
  const supabase = getAdminClient();
  const patch: Record<string, unknown> = { status };
  if (typeof workshopId !== 'undefined') {
    patch.workshop_id = workshopId;
  }

  const { data, error } = await supabase
    .from('orders')
    .update(patch)
    .eq('id', orderId)
    .select(ORDER_SELECT)
    .single();

  if (error || !data) {
    logger.error({ err: error, orderId, status }, 'Error updating order status');
    throw new Error(`Failed to update order: ${error?.message ?? 'unknown'}`);
  }

  return mapOrder((data as unknown) as OrderRow);
};

export const createTimelineEvent = async (
  orderId: string,
  status: OrderStatus,
  description: string,
): Promise<OrderTimelineEvent> => {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('order_timeline_events')
    .insert({ order_id: orderId, status, description })
    .select('*')
    .single();

  if (error || !data) {
    logger.error({ err: error, orderId, status }, 'Error creating timeline event');
    throw new Error(`Failed to create timeline event: ${error?.message ?? 'unknown'}`);
  }

  return mapTimelineEvent((data as unknown) as TimelineRow);
};
