import Link from 'next/link';
import { Calendar, DollarSign, Package, Scissors } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ORDER_STATUS_CONFIG } from '@/constants/order';
import type { Order } from '@/types/order';

type OrderCardProps = {
  order: Order;
};

const formatArs = (value: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);

const formatDeadline = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('es-AR', { dateStyle: 'medium' });
};

export const OrderCard = ({ order }: OrderCardProps) => {
  const statusCfg = ORDER_STATUS_CONFIG[order.status];

  return (
    <Link href={`/orders/${order.id}`} className="block outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg">
      <Card className="h-full cursor-pointer">
        <CardHeader className="space-y-3 pb-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <CardTitle className="text-lg leading-tight">{order.title}</CardTitle>
            <Badge variant="outline" className={cn('shrink-0 border', statusCfg.color, statusCfg.bgColor)}>
              {statusCfg.label}
            </Badge>
          </div>
          {order.workshopName ? (
            <p className="text-sm text-muted-foreground">Taller: {order.workshopName}</p>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Scissors className="size-4 shrink-0 text-foreground" aria-hidden />
            <span>
              <span className="font-medium text-foreground">Prenda:</span> {order.garmentType}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="size-4 shrink-0 text-foreground" aria-hidden />
            <span>
              <span className="font-medium text-foreground">Cantidad:</span> {order.quantity}
            </span>
          </div>
          <p>
            <span className="font-medium text-foreground">Material:</span> {order.material}
          </p>
          <div className="flex items-center gap-2">
            <DollarSign className="size-4 shrink-0 text-foreground" aria-hidden />
            <span>
              <span className="font-medium text-foreground">Presupuesto:</span> {formatArs(order.budget)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="size-4 shrink-0 text-foreground" aria-hidden />
            <span>
              <span className="font-medium text-foreground">Entrega:</span> {formatDeadline(order.deadline)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
