import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { OrderCard } from '@/components/orders/OrderCard';
import { OrdersFilters } from '@/components/orders/OrdersFilters';
import { getServerCurrentUser } from '@/lib/currentUser';
import { listOrdersForUser } from '@/services/orderService';
import type { OrderStatus } from '@/types/order';

type OrderStatusFilter = OrderStatus | 'all';

const VALID_STATUSES: OrderStatus[] = [
  'pending',
  'accepted',
  'in_production',
  'quality_check',
  'completed',
  'cancelled',
];

const isOrderStatusFilter = (value: string): value is OrderStatusFilter =>
  value === 'all' || (VALID_STATUSES as string[]).includes(value);

interface OrdersPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const OrdersPage = async ({ searchParams }: OrdersPageProps) => {
  const { role, userId } = await getServerCurrentUser();
  const sp = await searchParams;

  const rawStatus = typeof sp.status === 'string' ? sp.status : 'all';
  const statusFilter: OrderStatusFilter = isOrderStatusFilter(rawStatus) ? rawStatus : 'all';
  const search = (typeof sp.search === 'string' ? sp.search : '').trim();

  const allOrders = await listOrdersForUser(userId, role);

  const byStatus =
    statusFilter === 'all'
      ? allOrders
      : allOrders.filter((o) => o.status === statusFilter);

  const q = search.toLowerCase();
  const filteredOrders = q
    ? byStatus.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.garmentType.toLowerCase().includes(q),
      )
    : byStatus;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Órdenes</h1>
        {role === 'manufacturer' ? (
          <Link href="/orders/new" className={cn(buttonVariants(), 'gap-2')}>
            <PlusCircle className="size-4" aria-hidden />
            Nueva Orden
          </Link>
        ) : null}
      </div>

      <OrdersFilters initialStatus={statusFilter} initialSearch={search} />

      {filteredOrders.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-muted/30 px-6 py-12 text-center text-sm text-muted-foreground">
          No hay órdenes que coincidan con los filtros.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
