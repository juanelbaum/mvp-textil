import 'server-only';

import { getAdminClient } from '@/lib/supabase/admin';
import { createRepositoryLogger } from '@/lib/logger';
import type { WorkshopReview } from '@/types/workshop';

const logger = createRepositoryLogger('reviewRepository');

interface ReviewRow {
  id: string;
  workshop_id: string;
  manufacturer_id: string;
  order_id: string;
  rating: number;
  comment: string;
  created_at: string;
  manufacturers: {
    company_name: string;
  };
}

const REVIEW_SELECT = `
  id,
  workshop_id,
  manufacturer_id,
  order_id,
  rating,
  comment,
  created_at,
  manufacturers!inner (
    company_name
  )
`;

const mapReview = (row: ReviewRow): WorkshopReview => ({
  id: row.id,
  workshopId: row.workshop_id,
  manufacturerId: row.manufacturer_id,
  manufacturerName: row.manufacturers.company_name,
  rating: row.rating,
  comment: row.comment,
  orderId: row.order_id,
  createdAt: row.created_at,
});

export const listReviewsByWorkshop = async (
  workshopId: string,
): Promise<WorkshopReview[]> => {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from('workshop_reviews')
    .select(REVIEW_SELECT)
    .eq('workshop_id', workshopId)
    .order('created_at', { ascending: false });

  if (error) {
    logger.error({ err: error, workshopId }, 'Error listing reviews');
    throw new Error(`Failed to list reviews: ${error.message}`);
  }

  const rows = ((data ?? []) as unknown) as ReviewRow[];
  return rows.map(mapReview);
};
