'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Filter, PlusCircle, Search } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { OrderCard } from '@/components/orders/OrderCard';
import { MOCK_ORDERS } from '@/lib/mocks/orders';
import { ORDER_STATUS_OPTIONS } from '@/constants/order';
import { useRole } from '@/providers/RoleProvider';
import type { OrderStatus } from '@/types/order';

const OrdersPage = () => {
  const { role, currentUser } = useRole();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const filteredOrders = useMemo(() => {
    const byRole =
      role === 'manufacturer'
        ? MOCK_ORDERS.filter((o) => o.manufacturerId === currentUser.id)
        : MOCK_ORDERS;

    const byStatus =
      statusFilter === 'all' ? byRole : byRole.filter((o) => o.status === statusFilter);

    const q = search.trim().toLowerCase();
    if (!q) return byStatus;

    return byStatus.filter(
      (o) =>
        o.title.toLowerCase().includes(q) || o.garmentType.toLowerCase().includes(q)
    );
  }, [role, currentUser.id, statusFilter, search]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          Órdenes
        </h1>
        {role === 'manufacturer' ? (
          <Link href="/orders/new" className={cn(buttonVariants(), 'gap-2')}>
            <PlusCircle className="size-4" aria-hidden />
            Nueva Orden
          </Link>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-2">
          <label htmlFor="order-status-filter" className="flex items-center gap-2 text-sm font-medium">
            <Filter className="size-4 text-[var(--muted-foreground)]" aria-hidden />
            Estado
          </label>
          <Select
            id="order-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
          >
            {ORDER_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <label htmlFor="order-search" className="flex items-center gap-2 text-sm font-medium">
            <Search className="size-4 text-[var(--muted-foreground)]" aria-hidden />
            Buscar
          </label>
          <Input
            id="order-search"
            type="search"
            placeholder="Título o tipo de prenda…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--muted)]/30 px-6 py-12 text-center text-sm text-[var(--muted-foreground)]">
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
