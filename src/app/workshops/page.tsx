import { Factory } from 'lucide-react';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { listWorkshops } from '@/services/workshopService';
import { WorkshopsBrowser } from '@/components/workshops/WorkshopsBrowser';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const DEFAULT_FILTERS = {
  search: '',
  location: '',
  services: [] as string[],
  minRating: 1,
  capacity: '' as const,
};

const WorkshopsPage = async () => {
  const initialData = await listWorkshops({ ...DEFAULT_FILTERS });

  const queryClient = new QueryClient();
  queryClient.setQueryData(['workshops', DEFAULT_FILTERS], initialData);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-lg',
              'bg-primary/10 text-primary',
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

      <HydrationBoundary state={dehydrate(queryClient)}>
        <WorkshopsBrowser initialFilters={DEFAULT_FILTERS} />
      </HydrationBoundary>
    </div>
  );
};

export default WorkshopsPage;
