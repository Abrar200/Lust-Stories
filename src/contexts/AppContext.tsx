import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  userRole: 'customer' | 'sugar' | 'worker' | null;
  setUserRole: (role: 'customer' | 'sugar' | 'worker') => void;
}

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
  userRole: null,
  setUserRole: () => {},
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRoleState] = useState<'customer' | 'sugar' | 'worker' | null>(null);

  useEffect(() => {
    // Load user role from localStorage
    const savedRole = localStorage.getItem('userRole') as 'customer' | 'sugar' | 'worker' | null;
    if (savedRole) {
      setUserRoleState(savedRole);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const setUserRole = (role: 'customer' | 'sugar' | 'worker') => {
    setUserRoleState(role);
    localStorage.setItem('userRole', role);
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        userRole,
        setUserRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

