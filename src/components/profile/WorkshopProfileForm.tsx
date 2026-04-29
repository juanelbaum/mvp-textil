'use client';

import { useState, useTransition } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CAPACITY_OPTIONS } from '@/constants/workshop';
import { updateWorkshopProfileAction } from '@/actions/profile';
import type { WorkshopProfileFormState } from '@/types/profileForm';
import type { Workshop, WorkshopCapacity } from '@/types/user';

interface WorkshopProfileFormProps {
  userId: string;
  profile: Workshop;
}

const toFormState = (profile: Workshop): WorkshopProfileFormState => ({
  workshopName: profile.workshopName,
  ownerName: profile.name,
  email: profile.email,
  phone: profile.phone,
  location: profile.location,
  services: profile.services.join(', '),
  specialties: profile.specialties.join(', '),
  capacity: profile.capacity,
  minOrderQuantity: String(profile.minOrderQuantity),
  leadTimeDays: String(profile.leadTimeDays),
  description: profile.description,
});

const csvToList = (raw: string): string[] =>
  raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

export const WorkshopProfileForm = ({ userId, profile }: WorkshopProfileFormProps) => {
  const [form, setForm] = useState<WorkshopProfileFormState>(toFormState(profile));
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<
    { type: 'success' | 'error'; message: string } | null
  >(null);

  const handleChange =
    (field: keyof WorkshopProfileFormState) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setForm((state) => ({ ...state, [field]: event.target.value }));
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const payload = {
        workshopName: form.workshopName,
        ownerName: form.ownerName,
        email: form.email,
        phone: form.phone,
        location: form.location,
        services: csvToList(form.services),
        specialties: csvToList(form.specialties),
        capacity: form.capacity,
        minOrderQuantity: form.minOrderQuantity,
        leadTimeDays: form.leadTimeDays,
        description: form.description,
      };

      const result = await updateWorkshopProfileAction(userId, payload);
      if (result.success) {
        setFeedback({ type: 'success', message: 'Perfil actualizado' });
      } else {
        setFeedback({ type: 'error', message: result.error });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos de cuenta</CardTitle>
        <CardDescription>
          Editá tu información. Los cambios se guardan en la base de datos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="ws-name" className="text-sm font-medium">
              Nombre del taller
            </label>
            <Input
              id="ws-name"
              value={form.workshopName}
              onChange={handleChange('workshopName')}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="ws-owner" className="text-sm font-medium">
              Responsable
            </label>
            <Input
              id="ws-owner"
              value={form.ownerName}
              onChange={handleChange('ownerName')}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="ws-email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="ws-email"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="ws-phone" className="text-sm font-medium">
              Teléfono
            </label>
            <Input id="ws-phone" value={form.phone} onChange={handleChange('phone')} />
          </div>
          <div className="space-y-2">
            <label htmlFor="ws-location" className="text-sm font-medium">
              Ubicación
            </label>
            <Input
              id="ws-location"
              value={form.location}
              onChange={handleChange('location')}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="ws-services" className="text-sm font-medium">
              Servicios (separados por coma)
            </label>
            <Input
              id="ws-services"
              value={form.services}
              onChange={handleChange('services')}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="ws-spec" className="text-sm font-medium">
              Especialidades (separadas por coma)
            </label>
            <Input
              id="ws-spec"
              value={form.specialties}
              onChange={handleChange('specialties')}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="ws-capacity" className="text-sm font-medium">
              Capacidad
            </label>
            <Select
              id="ws-capacity"
              value={form.capacity}
              onChange={(e) =>
                setForm((state) => ({
                  ...state,
                  capacity: e.target.value as WorkshopCapacity,
                }))
              }
            >
              {CAPACITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="ws-min" className="text-sm font-medium">
                Pedido mínimo
              </label>
              <Input
                id="ws-min"
                type="number"
                min={0}
                value={form.minOrderQuantity}
                onChange={handleChange('minOrderQuantity')}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="ws-lead" className="text-sm font-medium">
                Plazo (días)
              </label>
              <Input
                id="ws-lead"
                type="number"
                min={0}
                value={form.leadTimeDays}
                onChange={handleChange('leadTimeDays')}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="ws-desc" className="text-sm font-medium">
              Descripción
            </label>
            <Textarea
              id="ws-desc"
              rows={4}
              value={form.description}
              onChange={handleChange('description')}
            />
          </div>

          {feedback && (
            <p
              className={
                feedback.type === 'success'
                  ? 'text-sm text-green-700'
                  : 'text-sm text-red-700'
              }
            >
              {feedback.message}
            </p>
          )}

          <Button type="submit" className="gap-2" disabled={isPending}>
            <Save className="h-4 w-4" aria-hidden />
            {isPending ? 'Guardando…' : 'Guardar Cambios'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
