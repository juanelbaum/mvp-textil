import { cn } from '@/lib/utils';
import { ORDER_STATUS_CONFIG } from '@/constants/order';
import type { OrderStatus } from '@/types/order';

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const config = ORDER_STATUS_CONFIG[status];

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        config.color,
        config.bgColor
      )}
    >
      {config.label}
    </div>
  );
};
