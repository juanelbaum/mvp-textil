import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ORDER_STATUS_CONFIG } from '@/constants/order';
import type { OrderTimelineEvent } from '@/types/order';

type OrderTimelineProps = {
  events: OrderTimelineEvent[];
};

const formatTs = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' });
};

export const OrderTimeline = ({ events }: OrderTimelineProps) => {
  const sorted = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  if (sorted.length === 0) {
    return <p className="text-sm text-muted-foreground">Sin eventos en el historial.</p>;
  }

  return (
    <ol className="relative flex flex-col">
      {sorted.map((event, index) => {
        const cfg = ORDER_STATUS_CONFIG[event.status];
        const isCompleted = event.status === 'completed';
        const Icon = isCompleted ? CheckCircle2 : Circle;

        return (
          <li key={event.id} className="relative flex gap-3 pb-8 last:pb-0">
            {index < sorted.length - 1 ? (
              <span
                className="absolute left-[11px] top-6 h-[calc(100%-0.5rem)] w-px bg-border"
                aria-hidden
              />
            ) : null}
            <div className="relative z-10 flex shrink-0 flex-col items-center">
              <Icon
                className={cn('size-6 shrink-0', isCompleted ? 'text-green-600' : 'text-muted-foreground')}
                aria-hidden
              />
            </div>
            <div className="min-w-0 flex-1 space-y-1 pt-0.5">
              <div
                className={cn(
                  'inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold',
                  cfg.color,
                  cfg.bgColor
                )}
              >
                {cfg.label}
              </div>
              <p className="text-sm text-foreground">{event.description}</p>
              <time className="text-xs text-muted-foreground" dateTime={event.timestamp}>
                {formatTs(event.timestamp)}
              </time>
            </div>
          </li>
        );
      })}
    </ol>
  );
};
