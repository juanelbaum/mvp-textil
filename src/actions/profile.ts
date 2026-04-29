'use server';

import { revalidatePath } from 'next/cache';
import {
  manufacturerProfileUpdateSchema,
  workshopProfileUpdateSchema,
} from '@/lib/validation/schemas';
import { createActionLogger } from '@/lib/logger';
import {
  updateManufacturerProfile,
  updateWorkshopProfile,
} from '@/services/userService';
import type { Manufacturer, Workshop } from '@/types/user';

const logger = createActionLogger('profileActions');

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export const updateManufacturerProfileAction = async (
  userId: string,
  rawInput: unknown,
): Promise<ActionResult<Manufacturer>> => {
  const parsed = manufacturerProfileUpdateSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Datos inválidos',
    };
  }

  try {
    const data = await updateManufacturerProfile(userId, parsed.data);
    revalidatePath('/profile');
    return { success: true, data };
  } catch (err) {
    logger.error({ err, userId }, 'updateManufacturerProfileAction failed');
    const message = err instanceof Error ? err.message : 'Error actualizando el perfil';
    return { success: false, error: message };
  }
};

export const updateWorkshopProfileAction = async (
  userId: string,
  rawInput: unknown,
): Promise<ActionResult<Workshop>> => {
  const parsed = workshopProfileUpdateSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Datos inválidos',
    };
  }

  try {
    const data = await updateWorkshopProfile(userId, parsed.data);
    revalidatePath('/profile');
    return { success: true, data };
  } catch (err) {
    logger.error({ err, userId }, 'updateWorkshopProfileAction failed');
    const message = err instanceof Error ? err.message : 'Error actualizando el perfil';
    return { success: false, error: message };
  }
};
