import type { OrderStatus } from '@/types/order';

export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  pending: { label: 'Pendiente', color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200' },
  accepted: { label: 'Aceptada', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200' },
  in_production: { label: 'En Producción', color: 'text-indigo-700', bgColor: 'bg-indigo-50 border-indigo-200' },
  quality_check: { label: 'Control de Calidad', color: 'text-purple-700', bgColor: 'bg-purple-50 border-purple-200' },
  completed: { label: 'Completada', color: 'text-green-700', bgColor: 'bg-green-50 border-green-200' },
  cancelled: { label: 'Cancelada', color: 'text-red-700', bgColor: 'bg-red-50 border-red-200' },
};

export const ORDER_STATUS_OPTIONS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'accepted', label: 'Aceptada' },
  { value: 'in_production', label: 'En Producción' },
  { value: 'quality_check', label: 'Control de Calidad' },
  { value: 'completed', label: 'Completada' },
  { value: 'cancelled', label: 'Cancelada' },
];

export const GARMENT_TYPES = [
  'Camisetas', 'Remeras', 'Camisas', 'Pantalones', 'Jeans',
  'Vestidos', 'Faldas', 'Camperas', 'Buzos', 'Uniformes',
  'Ropa deportiva', 'Ropa interior', 'Accesorios', 'Otro',
];

export const MATERIAL_OPTIONS = [
  'Algodón 100%', 'Poliéster', 'Algodón-Poliéster', 'Seda',
  'Lino', 'Gabardina', 'Denim', 'Nylon', 'Lycra',
  'Poliéster Dry-fit', 'Jersey', 'Otro',
];
