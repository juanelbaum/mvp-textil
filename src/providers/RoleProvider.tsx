'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { UserRole } from '@/types/user';
import { CURRENT_MANUFACTURER, CURRENT_WORKSHOP } from '@/lib/mocks/users';

interface RoleContextValue {
  role: UserRole;
  toggleRole: () => void;
  currentUser: {
    id: string;
    name: string;
    companyName: string;
  };
}

const RoleContext = createContext<RoleContextValue | null>(null);

interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider = ({ children }: RoleProviderProps) => {
  const [role, setRole] = useState<UserRole>('manufacturer');

  const toggleRole = useCallback(() => {
    setRole((prev) => (prev === 'manufacturer' ? 'workshop' : 'manufacturer'));
  }, []);

  const currentUser = role === 'manufacturer'
    ? {
        id: CURRENT_MANUFACTURER.id,
        name: CURRENT_MANUFACTURER.name,
        companyName: CURRENT_MANUFACTURER.companyName,
      }
    : {
        id: CURRENT_WORKSHOP.id,
        name: CURRENT_WORKSHOP.name,
        companyName: CURRENT_WORKSHOP.workshopName,
      };

  return (
    <RoleContext.Provider value={{ role, toggleRole, currentUser }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
