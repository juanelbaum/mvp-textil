import { User } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types/user';

interface ProfileHeaderProps {
  role: UserRole;
  displayName: string;
}

export const ProfileHeader = ({ role, displayName }: ProfileHeaderProps) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
    <Avatar fallback={displayName} size="lg" />
    <div className="flex items-start gap-3">
      <div
        className={cn(
          'mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg',
          'bg-primary/10 text-primary',
        )}
      >
        <User className="h-5 w-5" aria-hidden />
      </div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Mi Perfil</h1>
        <p className="text-sm text-muted-foreground">
          {role === 'manufacturer' ? 'Fabricante' : 'Taller'}
        </p>
      </div>
    </div>
  </div>
);
