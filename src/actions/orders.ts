'use server';

import { revalidatePath } from 'next/cache';
import {
  orderAcceptanceSchema,
  orderCreateSchema,
  orderStatusUpdateSchema,
} from '@/lib/validation/schemas';
import { createActionLogger } from '@/lib/logger';
import {
  acceptOrder,
  createOrder,
  updateOrderStatus,
} from '@/services/orderService';
import { getServerCurrentUser } from '@/lib/currentUser';
import type { Order } from '@/types/order';

const logger = createActionLogger('orderActions');

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export const createOrderAction = async (
  rawInput: unknown,
): Promise<ActionResult<Order>> => {
  const parsed = orderCreateSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Datos inválidos',
    };
  }

  try {
    const { role, userId } = await getServerCurrentUser();
    if (role !== 'manufacturer') {
      return { success: false, error: 'Solo los fabricantes pueden crear órdenes' };
    }

    const data = await createOrder(userId, parsed.data);
    revalidatePath('/orders');
    revalidatePath('/dashboard');
    return { success: true, data };
  } catch (err) {
    logger.error({ err }, 'createOrderAction failed');
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Error creando la orden',
    };
  }
};

export const acceptOrderAction = async (
  rawInput: unknown,
): Promise<ActionResult<Order>> => {
  const parsed = orderAcceptanceSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Datos inválidos',
    };
  }

  try {
    const { role, userId } = await getServerCurrentUser();
    if (role !== 'workshop') {
      return { success: false, error: 'Solo los talleres pueden aceptar órdenes' };
    }

    const data = await acceptOrder(userId, parsed.data.orderId);
    revalidatePath('/orders');
    revalidatePath(`/orders/${parsed.data.orderId}`);
    revalidatePath('/dashboard');
    return { success: true, data };
  } catch (err) {
    logger.error({ err }, 'acceptOrderAction failed');
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Error aceptando la orden',
    };
  }
};

export const updateOrderStatusAction = async (
  rawInput: unknown,
): Promise<ActionResult<Order>> => {
  const parsed = orderStatusUpdateSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Datos inválidos',
    };
  }

  try {
    const { userId } = await getServerCurrentUser();
    const data = await updateOrderStatus(userId, parsed.data.orderId, parsed.data.nextStatus);
    revalidatePath('/orders');
    revalidatePath(`/orders/${parsed.data.orderId}`);
    revalidatePath('/dashboard');
    return { success: true, data };
  } catch (err) {
    logger.error({ err }, 'updateOrderStatusAction failed');
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Error actualizando la orden',
    };
  }
};
