import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  Mail,
  MapPin,
  Package,
  Phone,
  Star,
} from 'lucide-react';
import { getWorkshopById } from '@/services/workshopService';
import { listReviewsByWorkshop } from '@/services/reviewService';
import { WorkshopReviewCard } from '@/components/workshops/WorkshopReviewCard';
import { WorkshopContactButton } from '@/components/workshops/WorkshopContactButton';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { CAPACITY_OPTIONS } from '@/constants/workshop';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface WorkshopDetailPageProps {
  params: Promise<{ id: string }>;
}

const WorkshopDetailPage = async ({ params }: WorkshopDetailPageProps) => {
  const { id } = await params;

  const [workshop, reviews] = await Promise.all([
    getWorkshopById(id),
    listReviewsByWorkshop(id),
  ]);

  if (!workshop) notFound();

  const fullStars = Math.min(5, Math.max(0, Math.round(workshop.rating)));
  const capacityLabel =
    CAPACITY_OPTIONS.find((c) => c.value === workshop.capacity)?.label ?? workshop.capacity;

  return (
    <div className="space-y-8 pb-8">
      <div>
        <Link
          href="/workshops"
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'sm' }),
            '-ml-2 gap-1 text-muted-foreground',
          )}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Volver
        </Link>
      </div>

      <header className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-start">
        <Avatar fallback={workshop.workshopName} size="lg" className="shrink-0" />
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {workshop.workshopName}
            </h1>
            <p className="text-muted-foreground">{workshop.ownerName}</p>
          </div>
          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            {workshop.location}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <div
              className="flex items-center gap-0.5"
              aria-label={`Calificación ${workshop.rating} de 5`}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-5 w-5',
                    i < fullStars
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-none text-muted-foreground',
                  )}
                  aria-hidden
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {workshop.rating.toFixed(1)} · {workshop.reviewsCount} reseñas
            </span>
          </div>
          <WorkshopContactButton />
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Sobre el taller</h2>
        <p className="text-sm leading-relaxed text-foreground">{workshop.description}</p>
        <div className="space-y-2">
          <p className="text-sm font-medium">Servicios</p>
          <div className="flex flex-wrap gap-2">
            {workshop.services.map((s) => (
              <Badge key={s} variant="secondary">
                {s}
              </Badge>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Especialidades</p>
          <div className="flex flex-wrap gap-2">
            {workshop.specialties.map((s) => (
              <Badge key={s} variant="outline">
                {s}
              </Badge>
            ))}
          </div>
        </div>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <dt className="text-muted-foreground">Capacidad</dt>
            <dd className="font-medium">{capacityLabel}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Pedido mínimo</dt>
            <dd className="font-medium">{workshop.minOrderQuantity} uds.</dd>
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <Clock className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <dt className="text-muted-foreground">Tiempo de entrega</dt>
            <dd className="font-medium">~{workshop.leadTimeDays} días</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Pedidos completados</dt>
            <dd className="font-medium">{workshop.completedOrders}</dd>
          </div>
        </dl>
        <div className="space-y-2 border-t border-border pt-4">
          <p className="text-sm font-medium">Contacto</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              <a
                href={`mailto:${workshop.email}`}
                className="text-primary underline-offset-4 hover:underline"
              >
                {workshop.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              <a
                href={`tel:${workshop.phone.replace(/\s/g, '')}`}
                className="hover:underline"
              >
                {workshop.phone}
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Reseñas</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aún no hay reseñas para este taller.
          </p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li key={review.id}>
                <WorkshopReviewCard review={review} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default WorkshopDetailPage;
