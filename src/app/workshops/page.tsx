'use client';

import { useMemo, useState } from 'react';
import { Factory, Search } from 'lucide-react';
import type { WorkshopFilter, WorkshopProfile } from '@/types/workshop';
import { MOCK_WORKSHOP_PROFILES } from '@/lib/mocks/workshops';
import { WorkshopCard } from '@/components/workshops/WorkshopCard';
import { WorkshopFilters } from '@/components/workshops/WorkshopFilters';
import { cn } from '@/lib/utils';

const DEFAULT_FILTERS: WorkshopFilter = {
  search: '',
  location: '',
  services: [],
  minRating: 1,
  capacity: '',
};

const matchesFilters = (workshop: WorkshopProfile, filters: WorkshopFilter): boolean => {
  const q = filters.search.trim().toLowerCase();
  if (q) {
    const searchable = [
      workshop.workshopName,
      workshop.ownerName,
      workshop.location,
      ...workshop.services,
      ...workshop.specialties,
    ]
      .join(' ')
      .toLowerCase();
    if (!searchable.includes(q)) return false;
  }
  if (filters.location && workshop.location !== filters.location) return false;
  if (filters.services.length > 0) {
    const overlap = filters.services.some((s) => workshop.services.includes(s));
    if (!overlap) return false;
  }
  if (workshop.rating < filters.minRating) return false;
  if (filters.capacity && workshop.capacity !== filters.capacity) return false;
  return true;
};

const WorkshopsPage = () => {
  const [filters, setFilters] = useState<WorkshopFilter>(DEFAULT_FILTERS);

  const filtered = useMemo(
    () => MOCK_WORKSHOP_PROFILES.filter((w) => matchesFilters(w, filters)),
    [filters]
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-lg',
              'bg-primary/10 text-primary'
            )}
          >
            <Factory className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Explorar Talleres</h1>
            <p className="text-sm text-muted-foreground">
              Encontrá talleres que se ajusten a tu producción
            </p>
          </div>
        </div>
      </div>

      <WorkshopFilters filters={filters} onFiltersChange={setFilters} />

      {filtered.length === 0 ? (
        <div
          className={cn(
            'flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed',
            'border-border bg-card px-6 py-16 text-center'
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
        <ul
          className={cn(
            'grid list-none gap-6 p-0',
            'md:grid-cols-2 lg:grid-cols-3'
          )}
        >
          {filtered.map((workshop) => (
            <li key={workshop.id}>
              <WorkshopCard workshop={workshop} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WorkshopsPage;
