'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Loader, ShieldCheck, Truck, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { acceptOrderAction, updateOrderStatusAction } from '@/actions/orders';
import type { Order, OrderStatus } from '@/types/order';
import type { UserRole } from '@/types/user';

interface OrderStatusActionsProps {
  order: Order;
  viewerRole: UserRole;
  viewerId: string;
}

interface ActionButton {
  label: string;
  nextStatus: OrderStatus;
  Icon: typeof CheckCircle;
  variant?: 'default' | 'outline' | 'destructive';
}

const progressionFor = (status: OrderStatus): ActionButton | null => {
  switch (status) {
    case 'accepted':
      return { label: 'Iniciar producción', nextStatus: 'in_production', Icon: Loader };
    case 'in_production':
      return {
        label: 'Enviar a control de calidad',
        nextStatus: 'quality_check',
        Icon: ShieldCheck,
      };
    case 'quality_check':
      return { label: 'Marcar como completada', nextStatus: 'completed', Icon: Truck };
    default:
      return null;
  }
};

export const OrderStatusActions = ({
  order,
  viewerRole,
  viewerId,
}: OrderStatusActionsProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const runTransition = (
    runner: () => Promise<{ success: true; data: Order } | { success: false; error: string }>,
  ) => {
    setError(null);
    startTransition(async () => {
      const result = await runner();
      if (!result.success) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  };

  const buttons: React.ReactNode[] = [];

  if (viewerRole === 'workshop' && order.status === 'pending') {
    buttons.push(
      <Button
        key="accept"
        type="button"
        disabled={isPending}
        onClick={() => runTransition(() => acceptOrderAction({ orderId: order.id }))}
      >
        <CheckCircle className="mr-2 size-4" aria-hidden />
        {isPending ? 'Procesando…' : 'Aceptar Orden'}
      </Button>,
    );
  }

  const isAssignedWorkshop =
    viewerRole === 'workshop' && order.workshopId === viewerId;
  if (isAssignedWorkshop) {
    const progression = progressionFor(order.status);
    if (progression) {
      buttons.push(
        <Button
          key={progression.nextStatus}
          type="button"
          disabled={isPending}
          onClick={() =>
            runTransition(() =>
              updateOrderStatusAction({
                orderId: order.id,
                nextStatus: progression.nextStatus,
              }),
            )
          }
        >
          <progression.Icon className="mr-2 size-4" aria-hidden />
          {isPending ? 'Procesando…' : progression.label}
        </Button>,
      );
    }
  }

  const isOwnerManufacturer =
    viewerRole === 'manufacturer' && order.manufacturerId === viewerId;
  const canCancel =
    isOwnerManufacturer && order.status !== 'completed' && order.status !== 'cancelled';
  if (canCancel) {
    buttons.push(
      <Button
        key="cancel"
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={() =>
          runTransition(() =>
            updateOrderStatusAction({ orderId: order.id, nextStatus: 'cancelled' }),
          )
        }
      >
        <XCircle className="mr-2 size-4" aria-hidden />
        Cancelar orden
      </Button>,
    );
  }

  if (buttons.length === 0) return null;

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap gap-2">{buttons}</div>
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  );
};
