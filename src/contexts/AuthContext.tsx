import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User } from '../types';
import { authService } from '../services/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: {
    name: string;
    email: string;
    businessName?: string;
    businessAddress?: string;
  }) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const TOKEN_KEY = 'auth_token';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        try {
          const { userId } = await authService.verifyToken(token);
          const user = await authService.getUserById(userId);
          if (user) {
            setUser(user);
          }
        } catch {
          localStorage.removeItem(TOKEN_KEY);
        }
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user, token } = await authService.login(email, password);
    localStorage.setItem(TOKEN_KEY, token);
    setUser(user);
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    const user = await authService.createUser({ email, password, name });
    const { token } = await authService.login(email, password);
    localStorage.setItem(TOKEN_KEY, token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const updateProfile = useCallback(async (data: {
    name: string;
    email: string;
    businessName?: string;
    businessAddress?: string;
  }) => {
    if (!user) throw new Error('Not authenticated');
    const updatedUser = await authService.updateUser(user.id, data);
    setUser(updatedUser);
  }, [user]);

  const updatePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error('Not authenticated');
    await authService.updatePassword(user.id, currentPassword, newPassword);
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      updateProfile,
      updatePassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}