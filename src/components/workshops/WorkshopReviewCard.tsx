import { Star } from 'lucide-react';
import type { WorkshopReview } from '@/types/workshop';
import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type WorkshopReviewCardProps = {
  review: WorkshopReview;
};

const formatReviewDate = (iso: string) =>
  new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium' }).format(new Date(iso));

export const WorkshopReviewCard = ({ review }: WorkshopReviewCardProps) => {
  const fullStars = Math.min(5, Math.max(0, Math.round(review.rating)));

  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-2">
        <Avatar fallback={review.manufacturerName} size="md" />
        <div className="min-w-0 flex-1">
          <p className="font-medium leading-tight">{review.manufacturerName}</p>
          <div
            className="mt-1 flex items-center gap-0.5"
            aria-label={`${review.rating} de 5 estrellas`}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-4 w-4',
                  i < fullStars
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-none text-[var(--muted-foreground)]'
                )}
                aria-hidden
              />
            ))}
            <span className="ml-2 text-sm text-[var(--muted-foreground)]">
              {review.rating.toFixed(1)}
            </span>
          </div>
        </div>
        <time
          dateTime={review.createdAt}
          className="shrink-0 text-xs text-[var(--muted-foreground)]"
        >
          {formatReviewDate(review.createdAt)}
        </time>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-sm text-[var(--foreground)]">{review.comment}</p>
      </CardContent>
    </Card>
  );
};
