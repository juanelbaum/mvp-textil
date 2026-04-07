'use client';

import { Search } from 'lucide-react';
import type { WorkshopFilter } from '@/types/workshop';
import { CAPACITY_OPTIONS, LOCATION_OPTIONS, WORKSHOP_SERVICES } from '@/constants/workshop';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const TOP_SERVICES = WORKSHOP_SERVICES.slice(0, 6);

type WorkshopFiltersProps = {
  filters: WorkshopFilter;
  onFiltersChange: (filters: WorkshopFilter) => void;
};

export const WorkshopFilters = ({ filters, onFiltersChange }: WorkshopFiltersProps) => {
  const patch = (partial: Partial<WorkshopFilter>) => {
    onFiltersChange({ ...filters, ...partial });
  };

  const toggleService = (service: string) => {
    const next = filters.services.includes(service)
      ? filters.services.filter((s) => s !== service)
      : [...filters.services, service];
    patch({ services: next });
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4',
        'md:flex-row md:flex-wrap md:items-end'
      )}
    >
      <div className="w-full md:min-w-[200px] md:flex-1">
        <label htmlFor="workshop-search" className="mb-1 block text-sm font-medium">
          Buscar
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]"
            aria-hidden
          />
          <Input
            id="workshop-search"
            className="pl-9"
            placeholder="Nombre o palabra clave…"
            value={filters.search}
            onChange={(e) => patch({ search: e.target.value })}
          />
        </div>
      </div>

      <div className="w-full md:w-auto md:min-w-[200px]">
        <label htmlFor="workshop-location" className="mb-1 block text-sm font-medium">
          Ubicación
        </label>
        <Select
          id="workshop-location"
          value={filters.location}
          onChange={(e) => patch({ location: e.target.value })}
        >
          <option value="">Todas</option>
          {LOCATION_OPTIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </Select>
      </div>

      <fieldset className="w-full min-w-0 md:min-w-[240px] md:flex-1">
        <legend className="mb-2 text-sm font-medium">Servicios</legend>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {TOP_SERVICES.map((service) => (
            <label
              key={service}
              className="flex cursor-pointer items-center gap-2 text-sm text-[var(--foreground)]"
            >
              <input
                type="checkbox"
                checked={filters.services.includes(service)}
                onChange={() => toggleService(service)}
                className="h-4 w-4 rounded border border-[var(--input)] bg-[var(--background)] text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              />
              {service}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="w-full md:w-auto md:min-w-[160px]">
        <label htmlFor="workshop-min-rating" className="mb-1 block text-sm font-medium">
          Calificación mín.
        </label>
        <Select
          id="workshop-min-rating"
          value={String(Math.min(5, Math.max(1, filters.minRating)))}
          onChange={(e) => patch({ minRating: Number(e.target.value) })}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? 'estrella' : 'estrellas'}
            </option>
          ))}
        </Select>
      </div>

      <div className="w-full md:w-auto md:min-w-[220px]">
        <label htmlFor="workshop-capacity" className="mb-1 block text-sm font-medium">
          Capacidad
        </label>
        <Select
          id="workshop-capacity"
          value={filters.capacity}
          onChange={(e) =>
            patch({ capacity: e.target.value as WorkshopFilter['capacity'] })
          }
        >
          <option value="">Cualquiera</option>
          {CAPACITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
};
