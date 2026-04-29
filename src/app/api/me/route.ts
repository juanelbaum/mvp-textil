import { NextResponse } from 'next/server';
import { createApiLogger } from '@/lib/logger';
import { getServerCurrentUser } from '@/lib/currentUser';
import {
  getManufacturerProfile,
  getWorkshopProfile,
} from '@/services/userService';

const logger = createApiLogger('GET /api/me');

export const GET = async () => {
  try {
    const { role, userId } = await getServerCurrentUser();

    const profile =
      role === 'manufacturer'
        ? await getManufacturerProfile(userId)
        : await getWorkshopProfile(userId);

    if (!profile) {
      return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: { role, profile } });
  } catch (err) {
    logger.error({ err }, 'Failed to load current user');
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
};
