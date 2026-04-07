import type { UserRole } from '@/types/user';

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: UserRole[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard', roles: ['manufacturer', 'workshop'] },
  { label: 'Órdenes', href: '/orders', icon: 'ClipboardList', roles: ['manufacturer', 'workshop'] },
  { label: 'Nueva Orden', href: '/orders/new', icon: 'PlusCircle', roles: ['manufacturer'] },
  { label: 'Talleres', href: '/workshops', icon: 'Factory', roles: ['manufacturer'] },
  { label: 'Mensajes', href: '/messages', icon: 'MessageSquare', roles: ['manufacturer', 'workshop'] },
  { label: 'Perfil', href: '/profile', icon: 'User', roles: ['manufacturer', 'workshop'] },
];
