'use client';

import { useQuery } from '@tanstack/react-query';
import { useRole } from '@/providers/RoleProvider';
import type { Manufacturer, UserRole, Workshop } from '@/types/user';

export type CurrentUserProfile =
  | { role: 'manufacturer'; profile: Manufacturer }
  | { role: 'workshop'; profile: Workshop };

interface ApiResponse {
  ok: true;
  data: { role: UserRole; profile: Manufacturer | Workshop };
}

const fetchCurrentUser = async (): Promise<CurrentUserProfile> => {
  const res = await fetch('/api/me', { cache: 'no-store' });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `GET /api/me failed with ${res.status}`);
  }
  const body: ApiResponse = await res.json();
  return body.data as CurrentUserProfile;
};

export const useCurrentUser = () => {
  const { role, currentUserId } = useRole();
  return useQuery({
    queryKey: ['current-user', role, currentUserId],
    queryFn: fetchCurrentUser,
  });
};
