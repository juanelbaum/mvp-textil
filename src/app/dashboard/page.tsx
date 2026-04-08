'use client';

import {
  CheckCircle,
  ClipboardList,
  DollarSign,
  Loader,
  Package,
  Star,
} from 'lucide-react';
import { OrderCard } from '@/components/orders/OrderCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { MOCK_ORDERS } from '@/lib/mocks/orders';
import { MOCK_WORKSHOPS } from '@/lib/mocks/users';
import { useRole } from '@/providers/RoleProvider';

const formatArs = (value: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);

const sortByCreatedDesc = <T extends { createdAt: string }>(items: T[]) =>
  [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

const DashboardPage = () => {
  const { role, currentUser } = useRole();

  if (role === 'manufacturer') {
    const myOrders = MOCK_ORDERS.filter((o) => o.manufacturerId === currentUser.id);
    const total = myOrders.length;
    const inProduction = myOrders.filter((o) => o.status === 'in_production').length;
    const completed = myOrders.filter((o) => o.status === 'completed').length;
    const budgetTotal = myOrders.reduce((sum, o) => sum + o.budget, 0);
    const recent = sortByCreatedDesc(myOrders).slice(0, 3);

    return (
      <div className="space-y-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panel del fabricante</h1>
          <p className="mt-1 text-muted-foreground">{currentUser.companyName}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total órdenes" value={total} icon={ClipboardList} />
          <StatsCard title="En producción" value={inProduction} icon={Loader} />
          <StatsCard title="Completadas" value={completed} icon={CheckCircle} />
          <StatsCard
            title="Presupuesto total"
            value={formatArs(budgetTotal)}
            description="Suma de presupuestos de tus órdenes"
            icon={DollarSign}
          />
        </div>

        <section aria-labelledby="recent-orders-heading" className="space-y-4">
          <h2 id="recent-orders-heading" className="text-xl font-semibold tracking-tight">
            Órdenes recientes
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recent.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  const pendingOrders = MOCK_ORDERS.filter((o) => o.status === 'pending');
  const workshopOrders = MOCK_ORDERS.filter((o) => o.workshopId === currentUser.id);
  const inProduction = workshopOrders.filter((o) => o.status === 'in_production').length;
  const completed = workshopOrders.filter((o) => o.status === 'completed').length;
  const workshopProfile = MOCK_WORKSHOPS.find((w) => w.id === currentUser.id);
  const ratingValue = workshopProfile ? workshopProfile.rating.toFixed(1) : '—';
  const ratingDescription = workshopProfile
    ? `${workshopProfile.reviewsCount} reseñas en la plataforma`
    : undefined;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Panel del taller</h1>
        <p className="mt-1 text-muted-foreground">{currentUser.companyName}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Órdenes disponibles" value={pendingOrders.length} icon={Package} />
        <StatsCard title="En producción" value={inProduction} icon={Loader} />
        <StatsCard title="Completadas" value={completed} icon={CheckCircle} />
        <StatsCard title="Rating" value={ratingValue} description={ratingDescription} icon={Star} />
      </div>

      <section aria-labelledby="available-orders-heading" className="space-y-4">
        <h2 id="available-orders-heading" className="text-xl font-semibold tracking-tight">
          Órdenes disponibles
        </h2>
        {pendingOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay órdenes pendientes en este momento.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
