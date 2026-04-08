'use client';

import { useEffect, useState } from 'react';
import { Save, User } from 'lucide-react';
import { useRole } from '@/providers/RoleProvider';
import { CURRENT_MANUFACTURER, CURRENT_WORKSHOP } from '@/lib/mocks/users';
import { CAPACITY_OPTIONS } from '@/constants/workshop';
import type {
  ManufacturerProfileFormState,
  WorkshopProfileFormState,
} from '@/types/profileForm';
import type { WorkshopCapacity } from '@/types/user';
import { Avatar } from '@/components/ui/avatar';
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
import { cn } from '@/lib/utils';

const manufacturerFromMock = (): ManufacturerProfileFormState => ({
  companyName: CURRENT_MANUFACTURER.companyName,
  name: CURRENT_MANUFACTURER.name,
  email: CURRENT_MANUFACTURER.email,
  phone: CURRENT_MANUFACTURER.phone,
  location: CURRENT_MANUFACTURER.location,
  industry: CURRENT_MANUFACTURER.industry,
  description: CURRENT_MANUFACTURER.description,
});

const workshopFromMock = (): WorkshopProfileFormState => ({
  workshopName: CURRENT_WORKSHOP.workshopName,
  ownerName: CURRENT_WORKSHOP.name,
  email: CURRENT_WORKSHOP.email,
  phone: CURRENT_WORKSHOP.phone,
  location: CURRENT_WORKSHOP.location,
  services: CURRENT_WORKSHOP.services.join(', '),
  specialties: CURRENT_WORKSHOP.specialties.join(', '),
  capacity: CURRENT_WORKSHOP.capacity,
  minOrderQuantity: String(CURRENT_WORKSHOP.minOrderQuantity),
  leadTimeDays: String(CURRENT_WORKSHOP.leadTimeDays),
  description: CURRENT_WORKSHOP.description,
});

const ProfilePage = () => {
  const { role } = useRole();
  const [manufacturer, setManufacturer] = useState<ManufacturerProfileFormState>(
    manufacturerFromMock
  );
  const [workshop, setWorkshop] = useState<WorkshopProfileFormState>(workshopFromMock);

  useEffect(() => {
    if (role === 'manufacturer') setManufacturer(manufacturerFromMock());
    else setWorkshop(workshopFromMock());
  }, [role]);

  const handleSave = () => {
    window.alert('Perfil actualizado (demo)');
  };

  const avatarFallback =
    role === 'manufacturer' ? manufacturer.name : workshop.workshopName;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <Avatar fallback={avatarFallback} size="lg" />
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg',
              'bg-primary/10 text-primary'
            )}
          >
            <User className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Mi Perfil</h1>
            <p className="text-sm text-muted-foreground">
              {role === 'manufacturer' ? 'Fabricante' : 'Taller'} — datos de demostración
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos de cuenta</CardTitle>
          <CardDescription>
            Editá tu información. Los cambios son solo de demostración.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {role === 'manufacturer' ? (
            <>
              <div className="space-y-2">
                <label htmlFor="mfr-company" className="text-sm font-medium">
                  Empresa
                </label>
                <Input
                  id="mfr-company"
                  value={manufacturer.companyName}
                  onChange={(e) =>
                    setManufacturer((s) => ({ ...s, companyName: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="mfr-name" className="text-sm font-medium">
                  Nombre
                </label>
                <Input
                  id="mfr-name"
                  value={manufacturer.name}
                  onChange={(e) => setManufacturer((s) => ({ ...s, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="mfr-email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="mfr-email"
                  type="email"
                  value={manufacturer.email}
                  onChange={(e) => setManufacturer((s) => ({ ...s, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="mfr-phone" className="text-sm font-medium">
                  Teléfono
                </label>
                <Input
                  id="mfr-phone"
                  value={manufacturer.phone}
                  onChange={(e) => setManufacturer((s) => ({ ...s, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="mfr-location" className="text-sm font-medium">
                  Ubicación
                </label>
                <Input
                  id="mfr-location"
                  value={manufacturer.location}
                  onChange={(e) =>
                    setManufacturer((s) => ({ ...s, location: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="mfr-industry" className="text-sm font-medium">
                  Industria
                </label>
                <Input
                  id="mfr-industry"
                  value={manufacturer.industry}
                  onChange={(e) =>
                    setManufacturer((s) => ({ ...s, industry: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="mfr-desc" className="text-sm font-medium">
                  Descripción
                </label>
                <Textarea
                  id="mfr-desc"
                  rows={4}
                  value={manufacturer.description}
                  onChange={(e) =>
                    setManufacturer((s) => ({ ...s, description: e.target.value }))
                  }
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label htmlFor="ws-name" className="text-sm font-medium">
                  Nombre del taller
                </label>
                <Input
                  id="ws-name"
                  value={workshop.workshopName}
                  onChange={(e) =>
                    setWorkshop((s) => ({ ...s, workshopName: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="ws-owner" className="text-sm font-medium">
                  Responsable
                </label>
                <Input
                  id="ws-owner"
                  value={workshop.ownerName}
                  onChange={(e) =>
                    setWorkshop((s) => ({ ...s, ownerName: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="ws-email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="ws-email"
                  type="email"
                  value={workshop.email}
                  onChange={(e) => setWorkshop((s) => ({ ...s, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="ws-phone" className="text-sm font-medium">
                  Teléfono
                </label>
                <Input
                  id="ws-phone"
                  value={workshop.phone}
                  onChange={(e) => setWorkshop((s) => ({ ...s, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="ws-location" className="text-sm font-medium">
                  Ubicación
                </label>
                <Input
                  id="ws-location"
                  value={workshop.location}
                  onChange={(e) =>
                    setWorkshop((s) => ({ ...s, location: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="ws-services" className="text-sm font-medium">
                  Servicios (separados por coma)
                </label>
                <Input
                  id="ws-services"
                  value={workshop.services}
                  onChange={(e) =>
                    setWorkshop((s) => ({ ...s, services: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="ws-spec" className="text-sm font-medium">
                  Especialidades (separadas por coma)
                </label>
                <Input
                  id="ws-spec"
                  value={workshop.specialties}
                  onChange={(e) =>
                    setWorkshop((s) => ({ ...s, specialties: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="ws-capacity" className="text-sm font-medium">
                  Capacidad
                </label>
                <Select
                  id="ws-capacity"
                  value={workshop.capacity}
                  onChange={(e) =>
                    setWorkshop((s) => ({
                      ...s,
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
                    value={workshop.minOrderQuantity}
                    onChange={(e) =>
                      setWorkshop((s) => ({ ...s, minOrderQuantity: e.target.value }))
                    }
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
                    value={workshop.leadTimeDays}
                    onChange={(e) =>
                      setWorkshop((s) => ({ ...s, leadTimeDays: e.target.value }))
                    }
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
                  value={workshop.description}
                  onChange={(e) =>
                    setWorkshop((s) => ({ ...s, description: e.target.value }))
                  }
                />
              </div>
            </>
          )}

          <Button type="button" className="gap-2" onClick={handleSave}>
            <Save className="h-4 w-4" aria-hidden />
            Guardar Cambios
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
