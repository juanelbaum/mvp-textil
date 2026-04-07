'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { GARMENT_TYPES, MATERIAL_OPTIONS } from '@/constants/order';

const initialForm = {
  title: '',
  description: '',
  garmentType: '',
  quantity: '',
  material: '',
  deadline: '',
  budget: '',
  specifications: '',
};

const NewOrderPage = () => {
  const [form, setForm] = useState(initialForm);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert('Orden creada exitosamente (demo)');
    setForm(initialForm);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/orders" aria-label="Volver a órdenes" className={buttonVariants({ variant: 'outline', size: 'icon' })}>
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          Nueva Orden de Producción
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos de la orden</CardTitle>
          <CardDescription>
            Completá los campos para publicar una nueva orden (demo sin persistencia).
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="order-title" className="text-sm font-medium">
                Título
              </label>
              <Input
                id="order-title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="order-description" className="text-sm font-medium">
                Descripción
              </label>
              <Textarea
                id="order-description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="order-garment" className="text-sm font-medium">
                Tipo de prenda
              </label>
              <Select
                id="order-garment"
                value={form.garmentType}
                onChange={(e) => setForm((f) => ({ ...f, garmentType: e.target.value }))}
                required
              >
                <option value="">Seleccionar…</option>
                {GARMENT_TYPES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="order-qty" className="text-sm font-medium">
                  Cantidad
                </label>
                <Input
                  id="order-qty"
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="order-material" className="text-sm font-medium">
                  Material
                </label>
                <Select
                  id="order-material"
                  value={form.material}
                  onChange={(e) => setForm((f) => ({ ...f, material: e.target.value }))}
                  required
                >
                  <option value="">Seleccionar…</option>
                  {MATERIAL_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="order-deadline" className="text-sm font-medium">
                  Fecha límite
                </label>
                <Input
                  id="order-deadline"
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="order-budget" className="text-sm font-medium">
                  Presupuesto (ARS)
                </label>
                <Input
                  id="order-budget"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.budget}
                  onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="order-specs" className="text-sm font-medium">
                Especificaciones (separadas por coma)
              </label>
              <Textarea
                id="order-specs"
                placeholder="Ej: tallas S-XL, 3 colores, etiqueta bordada"
                value={form.specifications}
                onChange={(e) => setForm((f) => ({ ...f, specifications: e.target.value }))}
                rows={2}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2 border-t border-[var(--border)] pt-6">
            <Button type="submit">Crear orden</Button>
            <Link href="/orders" className={buttonVariants({ variant: 'outline' })}>
              Cancelar
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default NewOrderPage;
