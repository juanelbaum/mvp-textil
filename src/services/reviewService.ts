import 'server-only';

import { listReviewsByWorkshop as repoListReviewsByWorkshop } from '@/repositories/reviewRepository';
import type { WorkshopReview } from '@/types/workshop';

export const listReviewsByWorkshop = async (
  workshopId: string,
): Promise<WorkshopReview[]> => {
  return repoListReviewsByWorkshop(workshopId);
};
