'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  Factory,
  MessageSquare,
  User,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useRole } from '@/providers/RoleProvider';
import { NAV_ITEMS } from '@/constants/navigation';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  Factory,
  MessageSquare,
  User,
};

export const Navbar = () => {
  const { role, toggleRole, currentUser } = useRole();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredItems = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Factory className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold text-foreground">TextilConnect</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {filteredItems.map((item) => {
                const Icon = ICON_MAP[item.icon];
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleRole}
              className="hidden sm:flex text-xs"
            >
              {role === 'manufacturer' ? 'Fabricante' : 'Taller'}
            </Button>

            <div className="hidden sm:flex items-center gap-2">
              <Avatar fallback={currentUser.name} size="sm" />
              <div className="text-sm">
                <p className="font-medium leading-none">{currentUser.companyName}</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="px-4 py-3 space-y-1">
            {filteredItems.map((item) => {
              const Icon = ICON_MAP[item.icon];
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-border">
              <Button variant="outline" size="sm" onClick={toggleRole} className="w-full text-xs">
                Cambiar a: {role === 'manufacturer' ? 'Taller' : 'Fabricante'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
