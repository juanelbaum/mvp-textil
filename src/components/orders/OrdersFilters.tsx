'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ORDER_STATUS_OPTIONS } from '@/constants/order';
import type { OrderStatus } from '@/types/order';

interface OrdersFiltersProps {
  initialStatus: OrderStatus | 'all';
  initialSearch: string;
}

export const OrdersFilters = ({ initialStatus, initialSearch }: OrdersFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pushParams = (patch: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, value]) => {
      if (!value || value === 'all') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    const qs = params.toString();
    router.replace(qs ? `/orders?${qs}` : '/orders');
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-end">
      <div className="flex flex-1 flex-col gap-2">
        <label
          htmlFor="order-status-filter"
          className="flex items-center gap-2 text-sm font-medium"
        >
          <Filter className="size-4 text-muted-foreground" aria-hidden />
          Estado
        </label>
        <Select
          id="order-status-filter"
          defaultValue={initialStatus}
          onChange={(e) => pushParams({ status: e.target.value })}
        >
          {ORDER_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <label
          htmlFor="order-search"
          className="flex items-center gap-2 text-sm font-medium"
        >
          <Search className="size-4 text-muted-foreground" aria-hidden />
          Buscar
        </label>
        <Input
          id="order-search"
          type="search"
          placeholder="Título o tipo de prenda…"
          defaultValue={initialSearch}
          onBlur={(e) => pushParams({ search: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              pushParams({ search: (e.target as HTMLInputElement).value });
            }
          }}
        />
      </div>
    </div>
  );
};
