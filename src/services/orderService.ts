import 'server-only';

import { createServiceLogger } from '@/lib/logger';
import {
  createOrderRow,
  createTimelineEvent,
  getOrderById as repoGetOrderById,
  getOrdersByManufacturer,
  getOrdersForWorkshop,
  getPendingOrders,
  getTimelineByOrder,
  updateOrderStatusRow,
} from '@/repositories/orderRepository';
import {
  getManufacturerById,
  getWorkshopUserById,
} from '@/repositories/userRepository';
import type { OrderCreateInput } from '@/lib/validation/schemas';
import type { Order, OrderStatus, OrderTimelineEvent } from '@/types/order';
import type { UserRole } from '@/types/user';

const logger = createServiceLogger('orderService');

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['accepted', 'cancelled'],
  accepted: ['in_production', 'cancelled'],
  in_production: ['quality_check', 'cancelled'],
  quality_check: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

const TRANSITION_DESCRIPTIONS: Record<OrderStatus, string> = {
  pending: 'Orden creada y publicada',
  accepted: 'Orden aceptada por el taller',
  in_production: 'Producción iniciada',
  quality_check: 'Orden en control de calidad',
  completed: 'Orden completada y entregada',
  cancelled: 'Orden cancelada',
};

export const listOrdersForUser = async (
  userId: string,
  role: UserRole,
): Promise<Order[]> => {
  // TODO: replace userId/role params with auth session once real auth lands.
  if (role === 'manufacturer') {
    return getOrdersByManufacturer(userId);
  }
  return getOrdersForWorkshop(userId);
};

export const listPendingOrders = async (): Promise<Order[]> => {
  return getPendingOrders();
};

export const getOrderWithTimeline = async (
  orderId: string,
): Promise<{ order: Order; timeline: OrderTimelineEvent[] } | null> => {
  const [order, timeline] = await Promise.all([
    repoGetOrderById(orderId),
    getTimelineByOrder(orderId),
  ]);

  if (!order) return null;
  return { order, timeline };
};

export const createOrder = async (
  manufacturerId: string,
  input: OrderCreateInput,
): Promise<Order> => {
  // TODO: verify auth.uid() === manufacturerId when real auth is wired.
  const manufacturer = await getManufacturerById(manufacturerId);
  if (!manufacturer) {
    logger.warn({ manufacturerId }, 'Only manufacturers can create orders');
    throw new Error('Solo los fabricantes pueden crear órdenes');
  }

  const order = await createOrderRow({
    title: input.title,
    description: input.description,
    manufacturerId,
    garmentType: input.garmentType,
    quantity: input.quantity,
    material: input.material,
    deadline: input.deadline,
    budget: input.budget,
    specifications: input.specifications,
  });

  await createTimelineEvent(order.id, 'pending', TRANSITION_DESCRIPTIONS.pending);
  logger.info({ orderId: order.id, manufacturerId }, 'Order created');
  return order;
};

export const acceptOrder = async (
  workshopId: string,
  orderId: string,
): Promise<Order> => {
  // TODO: verify auth.uid() === workshopId when real auth is wired.
  const workshop = await getWorkshopUserById(workshopId);
  if (!workshop) {
    logger.warn({ workshopId }, 'Only workshops can accept orders');
    throw new Error('Solo los talleres pueden aceptar órdenes');
  }

  const existing = await repoGetOrderById(orderId);
  if (!existing) throw new Error('Orden no encontrada');
  if (existing.status !== 'pending') {
    throw new Error('Solo se pueden aceptar órdenes pendientes');
  }

  const updated = await updateOrderStatusRow(orderId, 'accepted', workshopId);
  await createTimelineEvent(
    orderId,
    'accepted',
    `${workshop.workshopName} aceptó la orden`,
  );
  logger.info({ orderId, workshopId }, 'Order accepted');
  return updated;
};

export const updateOrderStatus = async (
  userId: string,
  orderId: string,
  nextStatus: OrderStatus,
): Promise<Order> => {
  // TODO: replace userId param with auth.uid() once real auth is wired.
  const order = await repoGetOrderById(orderId);
  if (!order) throw new Error('Orden no encontrada');

  const isOwnerManufacturer = order.manufacturerId === userId;
  const isAssignedWorkshop = order.workshopId === userId;
  if (!isOwnerManufacturer && !isAssignedWorkshop) {
    logger.warn({ userId, orderId }, 'Unauthorized order status update');
    throw new Error('No tenés permiso para cambiar el estado de esta orden');
  }

  const allowed = ALLOWED_TRANSITIONS[order.status];
  if (!allowed.includes(nextStatus)) {
    throw new Error(
      `Transición inválida: ${order.status} → ${nextStatus}`,
    );
  }

  // Only manufacturers can cancel; only assigned workshops can progress the
  // production lifecycle (accepted/in_production/quality_check/completed).
  if (nextStatus === 'cancelled' && !isOwnerManufacturer) {
    throw new Error('Solo el fabricante puede cancelar la orden');
  }
  if (nextStatus !== 'cancelled' && !isAssignedWorkshop) {
    throw new Error('Solo el taller asignado puede avanzar el estado de la orden');
  }

  const updated = await updateOrderStatusRow(orderId, nextStatus);
  await createTimelineEvent(orderId, nextStatus, TRANSITION_DESCRIPTIONS[nextStatus]);
  logger.info({ orderId, userId, nextStatus }, 'Order status updated');
  return updated;
};
