import Link from 'next/link';
import { Clock, MapPin, Package, Star } from 'lucide-react';
import type { WorkshopProfile } from '@/types/workshop';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CAPACITY_OPTIONS } from '@/constants/workshop';
import { cn } from '@/lib/utils';

type WorkshopCardProps = {
  workshop: WorkshopProfile;
};

export const WorkshopCard = ({ workshop }: WorkshopCardProps) => {
  const capacityLabel =
    CAPACITY_OPTIONS.find((c) => c.value === workshop.capacity)?.label ?? workshop.capacity;
  const fullStars = Math.min(5, Math.max(0, Math.round(workshop.rating)));
  const visibleServices = workshop.services.slice(0, 4);
  const extraServices = workshop.services.length - visibleServices.length;

  return (
    <Link
      href={`/workshops/${workshop.id}`}
      className="block h-full transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 rounded-lg"
    >
      <Card className="flex h-full flex-col">
        <CardHeader>
          <CardTitle className="line-clamp-2 text-lg">{workshop.workshopName}</CardTitle>
          <CardDescription className="flex items-start gap-1.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span className="line-clamp-2">{workshop.location}</span>
          </CardDescription>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <div className="flex items-center gap-0.5" aria-label={`Calificación ${workshop.rating} de 5`}>
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
            </div>
            <span className="text-sm text-[var(--muted-foreground)]">
              {workshop.rating.toFixed(1)} ({workshop.reviewsCount} reseñas)
            </span>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {visibleServices.map((s) => (
              <Badge key={s} variant="secondary">
                {s}
              </Badge>
            ))}
            {extraServices > 0 ? (
              <Badge variant="outline">+{extraServices}</Badge>
            ) : null}
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">
            <span className="font-medium text-[var(--foreground)]">Capacidad:</span> {capacityLabel}
          </p>
          <ul className="space-y-1.5 text-sm text-[var(--muted-foreground)]">
            <li className="flex items-center gap-2">
              <Package className="h-4 w-4 shrink-0" aria-hidden />
              <span>{workshop.completedOrders} pedidos completados</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="font-medium text-[var(--foreground)]">Mín. pedido:</span>{' '}
              {workshop.minOrderQuantity} uds.
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" aria-hidden />
              <span>Entrega aprox. {workshop.leadTimeDays} días</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter className="text-xs text-[var(--muted-foreground)]">Ver taller</CardFooter>
      </Card>
    </Link>
  );
};
