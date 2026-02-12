'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  isAuthenticated: false,
  username: null,
  login: () => false,
  logout: () => {},
});

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Check if admin is already logged in (from localStorage)
    const storedAuth = localStorage.getItem('adminAuth');
    if (storedAuth === 'true') {
      const storedUsername = localStorage.getItem('adminUsername');
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }
  }, []);

  const login = (inputUsername: string, inputPassword: string): boolean => {
    // Simple credentials check
    if (inputUsername === 'admin' && inputPassword === 'password') {
      setIsAuthenticated(true);
      setUsername(inputUsername);
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminUsername', inputUsername);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUsername');
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
