'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  DollarSign,
  Factory,
  Package,
  Scissors,
  User,
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { OrderTimeline } from '@/components/orders/OrderTimeline';
import { MOCK_ORDERS, MOCK_TIMELINE_EVENTS } from '@/lib/mocks/orders';
import { useRole } from '@/providers/RoleProvider';

const formatArs = (value: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('es-AR', { dateStyle: 'long' });
};

const OrderDetailPage = () => {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const { role } = useRole();

  const order = useMemo(() => MOCK_ORDERS.find((o) => o.id === id) ?? null, [id]);

  const timelineEvents = useMemo(
    () => MOCK_TIMELINE_EVENTS.filter((e) => e.orderId === id),
    [id]
  );

  if (!order) {
    return (
      <div className="mx-auto max-w-lg space-y-6 text-center">
        <h1 className="text-xl font-semibold text-[var(--foreground)]">Orden no encontrada</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          No existe una orden con el identificador solicitado.
        </p>
        <Link href="/orders" className={cn(buttonVariants(), 'gap-2')}>
          <ArrowLeft className="size-4" aria-hidden />
          Volver a órdenes
        </Link>
      </div>
    );
  }

  const showAccept = role === 'workshop' && order.status === 'pending';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Link href="/orders" aria-label="Volver a órdenes" className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'shrink-0')}>
            <ArrowLeft className="size-4" />
          </Link>
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Package className="size-6 shrink-0 text-[var(--muted-foreground)]" aria-hidden />
              <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                {order.title}
              </h1>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
        {showAccept ? (
          <Button
            type="button"
            onClick={() => alert('Orden aceptada (demo)')}
            className="shrink-0"
          >
            <CheckCircle className="mr-2 size-4" aria-hidden />
            Aceptar Orden
          </Button>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Descripción</CardTitle>
          <CardDescription>Detalle de la solicitud de producción</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-[var(--foreground)]">{order.description}</p>
          <div>
            <p className="mb-2 text-sm font-medium text-[var(--foreground)]">Especificaciones</p>
            <ul className="list-inside list-disc space-y-1 text-sm text-[var(--muted-foreground)]">
              {order.specifications.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Datos de la orden</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="flex gap-3">
            <Factory className="mt-0.5 size-5 shrink-0 text-[var(--muted-foreground)]" aria-hidden />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                Fabricante
              </p>
              <p className="text-sm text-[var(--foreground)]">{order.manufacturerName}</p>
            </div>
          </div>
          {order.workshopId ? (
            <div className="flex gap-3">
              <User className="mt-0.5 size-5 shrink-0 text-[var(--muted-foreground)]" aria-hidden />
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                  Taller
                </p>
                <p className="text-sm text-[var(--foreground)]">{order.workshopName ?? '—'}</p>
              </div>
            </div>
          ) : null}
          <div className="flex gap-3">
            <Scissors className="mt-0.5 size-5 shrink-0 text-[var(--muted-foreground)]" aria-hidden />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                Tipo de prenda
              </p>
              <p className="text-sm text-[var(--foreground)]">{order.garmentType}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Package className="mt-0.5 size-5 shrink-0 text-[var(--muted-foreground)]" aria-hidden />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                Cantidad
              </p>
              <p className="text-sm text-[var(--foreground)]">{order.quantity}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="mt-0.5 size-5 shrink-0" aria-hidden />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                Material
              </p>
              <p className="text-sm text-[var(--foreground)]">{order.material}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <DollarSign className="mt-0.5 size-5 shrink-0 text-[var(--muted-foreground)]" aria-hidden />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                Presupuesto
              </p>
              <p className="text-sm text-[var(--foreground)]">{formatArs(order.budget)}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Calendar className="mt-0.5 size-5 shrink-0 text-[var(--muted-foreground)]" aria-hidden />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                Fecha límite
              </p>
              <p className="text-sm text-[var(--foreground)]">{formatDate(order.deadline)}</p>
            </div>
          </div>
          <div className="flex gap-3 sm:col-span-2">
            <Calendar className="mt-0.5 size-5 shrink-0 text-[var(--muted-foreground)]" aria-hidden />
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                  Creada
                </p>
                <p className="text-sm text-[var(--foreground)]">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                  Actualizada
                </p>
                <p className="text-sm text-[var(--foreground)]">{formatDate(order.updatedAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial</CardTitle>
          <CardDescription>Eventos y cambios de estado</CardDescription>
        </CardHeader>
        <CardContent>
          <OrderTimeline events={timelineEvents} />
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetailPage;
