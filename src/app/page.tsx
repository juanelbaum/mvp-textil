import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  ClipboardList,
  Factory,
  Zap,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'TextilConnect | Fabricantes y talleres textiles',
  description:
    'Conectamos fabricantes con talleres textiles: publicá órdenes, matching inteligente y seguimiento en tiempo real.',
  openGraph: {
    title: 'TextilConnect',
    description:
      'Plataforma para conectar fabricantes de indumentaria con talleres de confección en Argentina.',
  },
};

const stats = [
  { value: '500+', label: 'Fabricantes' },
  { value: '200+', label: 'Talleres' },
  { value: '10,000+', label: 'Órdenes completadas' },
] as const;

const features = [
  {
    title: 'Publicar órdenes',
    description:
      'Los fabricantes publican necesidades de producción con especificaciones, plazos y presupuesto en un solo lugar.',
    icon: ClipboardList,
  },
  {
    title: 'Matching inteligente',
    description:
      'Nuestro sistema sugiere talleres según capacidad, especialidad y historial para acelerar la asignación.',
    icon: Zap,
  },
  {
    title: 'Seguimiento en tiempo real',
    description:
      'Estado de cada orden visible para ambas partes: desde la aceptación hasta la entrega final.',
    icon: BarChart3,
  },
] as const;

const HomePage = () => {
  return (
    <div className="flex flex-col gap-20 pb-16">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-accent/30 px-6 py-16 sm:px-10 sm:py-24">
        <Factory
          className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 text-primary/15 sm:h-64 sm:w-64"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-primary">
            TextilConnect
          </p>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Conectamos fabricantes con talleres textiles
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
            Una plataforma para publicar órdenes de confección, encontrar el taller adecuado y hacer seguimiento de cada
            etapa de producción con transparencia y eficiencia.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/orders"
              className={cn(buttonVariants({ size: 'lg' }), 'w-full min-w-[200px] sm:w-auto')}
            >
              Ver órdenes
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/workshops"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'w-full min-w-[200px] bg-background/80 backdrop-blur sm:w-auto'
              )}
            >
              Explorar talleres
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Cifras de la plataforma
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {stats.map((item) => (
            <Card key={item.label} className="border-border text-center shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                  {item.value}
                </CardTitle>
                <CardDescription className="text-base font-medium text-foreground">
                  {item.label}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="features-heading" className="space-y-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="features-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
            Todo lo que necesitás en un solo flujo
          </h2>
          <p className="mt-3 text-muted-foreground">
            Diseñado para fabricantes y talleres que quieren trabajar juntos sin fricción.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group border-border transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                  <Link
                    href="/dashboard"
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'sm' }),
                      'group/btn mt-4 -ml-3 w-fit justify-start px-3 text-primary'
                    )}
                  >
                    Ir al panel
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                  </Link>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
