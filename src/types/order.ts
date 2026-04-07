export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'in_production'
  | 'quality_check'
  | 'completed'
  | 'cancelled';

export interface Order {
  id: string;
  title: string;
  description: string;
  manufacturerId: string;
  manufacturerName: string;
  workshopId?: string;
  workshopName?: string;
  status: OrderStatus;
  garmentType: string;
  quantity: number;
  material: string;
  deadline: string;
  budget: number;
  specifications: string[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderTimelineEvent {
  id: string;
  orderId: string;
  status: OrderStatus;
  description: string;
  timestamp: string;
}
