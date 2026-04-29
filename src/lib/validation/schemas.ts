import { z } from 'zod';

// Primitives -------------------------------------------------------------

export const uuidSchema = z.string().uuid();

export const orderStatusSchema = z.enum([
  'pending',
  'accepted',
  'in_production',
  'quality_check',
  'completed',
  'cancelled',
]);

export const workshopCapacitySchema = z.enum(['low', 'medium', 'high']);

// Profile update schemas --------------------------------------------------

export const manufacturerProfileUpdateSchema = z.object({
  companyName: z.string().trim().min(1, 'La razón social es obligatoria').max(120),
  name: z.string().trim().min(1, 'El nombre es obligatorio').max(120),
  email: z.string().trim().email('Email inválido'),
  phone: z.string().trim().max(40).default(''),
  location: z.string().trim().max(120).default(''),
  industry: z.string().trim().max(120).default(''),
  description: z.string().trim().max(2000).default(''),
});
export type ManufacturerProfileUpdateInput = z.infer<typeof manufacturerProfileUpdateSchema>;

export const workshopProfileUpdateSchema = z.object({
  workshopName: z.string().trim().min(1, 'El nombre del taller es obligatorio').max(120),
  ownerName: z.string().trim().min(1, 'El nombre del responsable es obligatorio').max(120),
  email: z.string().trim().email('Email inválido'),
  phone: z.string().trim().max(40).default(''),
  location: z.string().trim().max(120).default(''),
  services: z.array(z.string().trim().min(1)).default([]),
  specialties: z.array(z.string().trim().min(1)).default([]),
  capacity: workshopCapacitySchema,
  minOrderQuantity: z.coerce.number().int().min(0).max(100000),
  leadTimeDays: z.coerce.number().int().min(0).max(365),
  description: z.string().trim().max(2000).default(''),
});
export type WorkshopProfileUpdateInput = z.infer<typeof workshopProfileUpdateSchema>;

// Order schemas ----------------------------------------------------------

export const orderCreateSchema = z.object({
  title: z.string().trim().min(1, 'El título es obligatorio').max(200),
  description: z.string().trim().min(1, 'La descripción es obligatoria').max(2000),
  garmentType: z.string().trim().min(1).max(80),
  quantity: z.coerce.number().int().positive('La cantidad debe ser mayor a 0'),
  material: z.string().trim().min(1).max(120),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha en formato YYYY-MM-DD'),
  budget: z.coerce.number().nonnegative(),
  specifications: z.array(z.string().trim().min(1)).default([]),
});
export type OrderCreateInput = z.infer<typeof orderCreateSchema>;

export const orderStatusUpdateSchema = z.object({
  orderId: uuidSchema,
  nextStatus: orderStatusSchema,
});
export type OrderStatusUpdateInput = z.infer<typeof orderStatusUpdateSchema>;

export const orderAcceptanceSchema = z.object({
  orderId: uuidSchema,
});
export type OrderAcceptanceInput = z.infer<typeof orderAcceptanceSchema>;

// Workshop filter schema --------------------------------------------------

export const workshopFilterSchema = z.object({
  search: z.string().trim().max(120).default(''),
  location: z.string().trim().max(120).default(''),
  services: z.array(z.string().trim().min(1)).default([]),
  minRating: z.coerce.number().min(0).max(5).default(0),
  capacity: z.union([workshopCapacitySchema, z.literal('')]).default(''),
});
export type WorkshopFilterInput = z.infer<typeof workshopFilterSchema>;
