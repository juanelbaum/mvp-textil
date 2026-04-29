import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { NewOrderForm } from '@/components/orders/NewOrderForm';
import { getServerCurrentUser } from '@/lib/currentUser';

const NewOrderPage = async () => {
  const { role } = await getServerCurrentUser();
  if (role !== 'manufacturer') {
    redirect('/orders');
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/orders"
          aria-label="Volver a órdenes"
          className={buttonVariants({ variant: 'outline', size: 'icon' })}
        >
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Nueva Orden de Producción
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos de la orden</CardTitle>
          <CardDescription>
            Completá los campos para publicar una nueva orden. Se guardará en la base de datos.
          </CardDescription>
        </CardHeader>
        <NewOrderForm />
      </Card>
    </div>
  );
};

export default NewOrderPage;
