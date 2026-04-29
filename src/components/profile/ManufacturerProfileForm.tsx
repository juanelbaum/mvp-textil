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
import { Textarea } from '@/components/ui/textarea';
import { updateManufacturerProfileAction } from '@/actions/profile';
import type { ManufacturerProfileFormState } from '@/types/profileForm';
import type { Manufacturer } from '@/types/user';

interface ManufacturerProfileFormProps {
  userId: string;
  profile: Manufacturer;
}

const toFormState = (profile: Manufacturer): ManufacturerProfileFormState => ({
  companyName: profile.companyName,
  name: profile.name,
  email: profile.email,
  phone: profile.phone,
  location: profile.location,
  industry: profile.industry,
  description: profile.description,
});

export const ManufacturerProfileForm = ({
  userId,
  profile,
}: ManufacturerProfileFormProps) => {
  const [form, setForm] = useState<ManufacturerProfileFormState>(toFormState(profile));
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<
    { type: 'success' | 'error'; message: string } | null
  >(null);

  const handleChange =
    (field: keyof ManufacturerProfileFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((state) => ({ ...state, [field]: event.target.value }));
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const result = await updateManufacturerProfileAction(userId, form);
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
            <label htmlFor="mfr-company" className="text-sm font-medium">
              Empresa
            </label>
            <Input
              id="mfr-company"
              value={form.companyName}
              onChange={handleChange('companyName')}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="mfr-name" className="text-sm font-medium">
              Nombre
            </label>
            <Input
              id="mfr-name"
              value={form.name}
              onChange={handleChange('name')}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="mfr-email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="mfr-email"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="mfr-phone" className="text-sm font-medium">
              Teléfono
            </label>
            <Input id="mfr-phone" value={form.phone} onChange={handleChange('phone')} />
          </div>
          <div className="space-y-2">
            <label htmlFor="mfr-location" className="text-sm font-medium">
              Ubicación
            </label>
            <Input
              id="mfr-location"
              value={form.location}
              onChange={handleChange('location')}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="mfr-industry" className="text-sm font-medium">
              Industria
            </label>
            <Input
              id="mfr-industry"
              value={form.industry}
              onChange={handleChange('industry')}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="mfr-desc" className="text-sm font-medium">
              Descripción
            </label>
            <Textarea
              id="mfr-desc"
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
