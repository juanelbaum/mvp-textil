'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Star,
} from 'lucide-react';
import { MOCK_REVIEWS, MOCK_WORKSHOP_PROFILES } from '@/lib/mocks/workshops';
import { WorkshopReviewCard } from '@/components/workshops/WorkshopReviewCard';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { CAPACITY_OPTIONS } from '@/constants/workshop';
import { cn } from '@/lib/utils';

const WorkshopDetailPage = () => {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';

  const workshop = MOCK_WORKSHOP_PROFILES.find((w) => w.id === id);

  const reviews = useMemo(
    () => MOCK_REVIEWS.filter((r) => r.workshopId === id),
    [id]
  );

  if (!workshop) {
    return (
      <div className="mx-auto max-w-md space-y-6 py-12 text-center">
        <h1 className="text-xl font-semibold">Taller no encontrado</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          El taller que buscás no existe o fue dado de baja.
        </p>
        <Link href="/workshops" className={cn(buttonVariants({ variant: 'outline' }))}>
          Volver a talleres
        </Link>
      </div>
    );
  }

  const fullStars = Math.min(5, Math.max(0, Math.round(workshop.rating)));
  const capacityLabel =
    CAPACITY_OPTIONS.find((c) => c.value === workshop.capacity)?.label ?? workshop.capacity;

  const handleContact = () => {
    window.alert('Contacto demo: en producción aquí iría mensajería o email.');
  };

  return (
    <div className="space-y-8 pb-8">
      <div>
        <Link
          href="/workshops"
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'sm' }),
            '-ml-2 gap-1 text-[var(--muted-foreground)]'
          )}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Volver
        </Link>
      </div>

      <header className="flex flex-col gap-6 border-b border-[var(--border)] pb-8 sm:flex-row sm:items-start">
        <Avatar fallback={workshop.workshopName} size="lg" className="shrink-0" />
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{workshop.workshopName}</h1>
            <p className="text-[var(--muted-foreground)]">{workshop.ownerName}</p>
          </div>
          <p className="flex items-start gap-2 text-sm text-[var(--muted-foreground)]">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            {workshop.location}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-0.5" aria-label={`Calificación ${workshop.rating} de 5`}>
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-5 w-5',
                    i < fullStars
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-none text-[var(--muted-foreground)]'
                  )}
                  aria-hidden
                />
              ))}
            </div>
            <span className="text-sm text-[var(--muted-foreground)]">
              {workshop.rating.toFixed(1)} · {workshop.reviewsCount} reseñas
            </span>
          </div>
          <Button className="gap-2" onClick={handleContact}>
            <MessageSquare className="h-4 w-4" aria-hidden />
            Contactar Taller
          </Button>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Sobre el taller</h2>
        <p className="text-sm leading-relaxed text-[var(--foreground)]">{workshop.description}</p>
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
            <Package className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" aria-hidden />
            <dt className="text-[var(--muted-foreground)]">Capacidad</dt>
            <dd className="font-medium">{capacityLabel}</dd>
          </div>
          <div>
            <dt className="text-[var(--muted-foreground)]">Pedido mínimo</dt>
            <dd className="font-medium">{workshop.minOrderQuantity} uds.</dd>
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <Clock className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" aria-hidden />
            <dt className="text-[var(--muted-foreground)]">Tiempo de entrega</dt>
            <dd className="font-medium">~{workshop.leadTimeDays} días</dd>
          </div>
          <div>
            <dt className="text-[var(--muted-foreground)]">Pedidos completados</dt>
            <dd className="font-medium">{workshop.completedOrders}</dd>
          </div>
        </dl>
        <div className="space-y-2 border-t border-[var(--border)] pt-4">
          <p className="text-sm font-medium">Contacto</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" aria-hidden />
              <a href={`mailto:${workshop.email}`} className="text-[var(--primary)] underline-offset-4 hover:underline">
                {workshop.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" aria-hidden />
              <a href={`tel:${workshop.phone.replace(/\s/g, '')}`} className="hover:underline">
                {workshop.phone}
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Reseñas</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">Aún no hay reseñas para este taller.</p>
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
