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
import { getServerCurrentUser } from '@/lib/currentUser';
import {
  getManufacturerProfile,
  getWorkshopProfile,
} from '@/services/userService';
import {
  listOrdersForUser,
  listPendingOrders,
} from '@/services/orderService';
import type { Order } from '@/types/order';

const formatArs = (value: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);

const sortByCreatedDesc = (items: Order[]) =>
  [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

const DashboardPage = async () => {
  const { role, userId } = await getServerCurrentUser();

  if (role === 'manufacturer') {
    const [profile, myOrders] = await Promise.all([
      getManufacturerProfile(userId),
      listOrdersForUser(userId, 'manufacturer'),
    ]);

    const total = myOrders.length;
    const inProduction = myOrders.filter((o) => o.status === 'in_production').length;
    const completed = myOrders.filter((o) => o.status === 'completed').length;
    const budgetTotal = myOrders.reduce((sum, o) => sum + o.budget, 0);
    const recent = sortByCreatedDesc(myOrders).slice(0, 3);

    return (
      <div className="space-y-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panel del fabricante</h1>
          <p className="mt-1 text-muted-foreground">{profile?.companyName ?? ''}</p>
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
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aún no publicaste órdenes. Creá la primera desde la sección Órdenes.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recent.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </section>
      </div>
    );
  }

  const [workshopProfile, pendingOrders, workshopOrders] = await Promise.all([
    getWorkshopProfile(userId),
    listPendingOrders(),
    listOrdersForUser(userId, 'workshop'),
  ]);

  const myWorkshopOrders = workshopOrders.filter((o) => o.workshopId === userId);
  const inProduction = myWorkshopOrders.filter((o) => o.status === 'in_production').length;
  const completed = myWorkshopOrders.filter((o) => o.status === 'completed').length;
  const ratingValue = workshopProfile ? workshopProfile.rating.toFixed(1) : '—';
  const ratingDescription = workshopProfile
    ? `${workshopProfile.reviewsCount} reseñas en la plataforma`
    : undefined;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Panel del taller</h1>
        <p className="mt-1 text-muted-foreground">
          {workshopProfile?.workshopName ?? ''}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Órdenes disponibles" value={pendingOrders.length} icon={Package} />
        <StatsCard title="En producción" value={inProduction} icon={Loader} />
        <StatsCard title="Completadas" value={completed} icon={CheckCircle} />
        <StatsCard
          title="Rating"
          value={ratingValue}
          description={ratingDescription}
          icon={Star}
        />
      </div>

      <section aria-labelledby="available-orders-heading" className="space-y-4">
        <h2 id="available-orders-heading" className="text-xl font-semibold tracking-tight">
          Órdenes disponibles
        </h2>
        {pendingOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay órdenes pendientes en este momento.
          </p>
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
