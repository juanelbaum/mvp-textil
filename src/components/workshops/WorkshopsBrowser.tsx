'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import type { WorkshopFilter, WorkshopProfile } from '@/types/workshop';
import { WorkshopCard } from '@/components/workshops/WorkshopCard';
import { WorkshopFilters } from '@/components/workshops/WorkshopFilters';
import { cn } from '@/lib/utils';

interface WorkshopsBrowserProps {
  initialFilters: WorkshopFilter;
}

const buildQueryString = (filters: WorkshopFilter): string => {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.location) params.set('location', filters.location);
  filters.services.forEach((s) => params.append('services', s));
  params.set('minRating', String(filters.minRating));
  if (filters.capacity) params.set('capacity', filters.capacity);
  return params.toString();
};

const fetchWorkshops = async (filters: WorkshopFilter): Promise<WorkshopProfile[]> => {
  const qs = buildQueryString(filters);
  const res = await fetch(`/api/workshops${qs ? `?${qs}` : ''}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `GET /api/workshops failed with ${res.status}`);
  }
  const body: { ok: true; data: WorkshopProfile[] } = await res.json();
  return body.data;
};

export const WorkshopsBrowser = ({ initialFilters }: WorkshopsBrowserProps) => {
  const [filters, setFilters] = useState<WorkshopFilter>(initialFilters);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['workshops', filters],
    queryFn: () => fetchWorkshops(filters),
  });

  const items = data ?? [];

  return (
    <>
      <WorkshopFilters filters={filters} onFiltersChange={setFilters} />

      {isError && (
        <p className="text-sm text-red-700">
          Error cargando talleres: {error instanceof Error ? error.message : 'desconocido'}
        </p>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando talleres…</p>
      ) : items.length === 0 ? (
        <div
          className={cn(
            'flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed',
            'border-border bg-card px-6 py-16 text-center',
          )}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/30">
            <Search className="h-7 w-7 text-muted-foreground" aria-hidden />
          </div>
          <div className="max-w-sm space-y-1">
            <p className="font-medium">No hay talleres con estos criterios</p>
            <p className="text-sm text-muted-foreground">
              Probá ampliar la búsqueda o quitar algunos filtros.
            </p>
          </div>
        </div>
      ) : (
        <ul className={cn('grid list-none gap-6 p-0', 'md:grid-cols-2 lg:grid-cols-3')}>
          {items.map((workshop) => (
            <li key={workshop.id}>
              <WorkshopCard workshop={workshop} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
