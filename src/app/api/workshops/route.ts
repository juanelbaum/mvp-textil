import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { workshopFilterSchema } from '@/lib/validation/schemas';
import { listWorkshops } from '@/services/workshopService';
import { createApiLogger } from '@/lib/logger';

const logger = createApiLogger('GET /api/workshops');

export const GET = async (req: NextRequest) => {
  const params = req.nextUrl.searchParams;

  const raw = {
    search: params.get('search') ?? '',
    location: params.get('location') ?? '',
    services: params.getAll('services'),
    minRating: params.get('minRating') ?? 0,
    capacity: params.get('capacity') ?? '',
  };

  const parsed = workshopFilterSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Parámetros inválidos' },
      { status: 400 },
    );
  }

  try {
    const data = await listWorkshops(parsed.data);
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    logger.error({ err }, 'Failed to list workshops');
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
};
