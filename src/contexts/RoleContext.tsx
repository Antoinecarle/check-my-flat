import { createContext, useContext, useState, type ReactNode } from 'react';
import { users, workspaceUsers } from '../data/fake';

export type AppRole = 'admin' | 'technicien';

interface RoleContextValue {
  role: AppRole;
  setRole: (role: AppRole) => void;
  currentUser: typeof users[0];
  currentUserId: string;
}

const RoleContext = createContext<RoleContextValue | null>(null);

const ROLE_USER_MAP: Record<AppRole, string> = {
  admin: 'u-1',     // Clement Durand
  technicien: 'u-3', // Lucas Bernard
};

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<AppRole>('admin');

  const currentUserId = ROLE_USER_MAP[role];
  const currentUser = users.find(u => u.id === currentUserId)!;

  return (
    <RoleContext.Provider value={{ role, setRole, currentUser, currentUserId }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}
