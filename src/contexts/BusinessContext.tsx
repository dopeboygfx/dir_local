import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Business, BusinessStats } from '../types';
import { businessService } from '../services/business';
import { useAuth } from './AuthContext';

interface BusinessContextType {
  businesses: Business[];
  addBusiness: (business: Omit<Business, 'id' | 'userId' | 'rating' | 'featured'>) => Promise<Business>;
  updateBusiness: (id: string, business: Partial<Business>) => Promise<void>;
  deleteBusiness: (id: string) => Promise<void>;
  getBusinessById: (id: string) => Business | undefined;
  getUserBusinesses: (userId: string) => Business[];
  trackView: (businessId: string) => Promise<void>;
  trackClick: (businessId: string, type: 'website' | 'phone') => Promise<void>;
  getBusinessStats: (businessId: string) => BusinessStats | undefined;
  isLoading: boolean;
  error: string | null;
}

const BusinessContext = createContext<BusinessContextType | null>(null);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const allBusinesses = await businessService.getAllBusinesses();
        setBusinesses(allBusinesses);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load businesses');
        console.error('Failed to load businesses:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadBusinesses();
  }, []);

  const addBusiness = async (businessData: Omit<Business, 'id' | 'userId' | 'rating' | 'featured'>) => {
    if (!user) throw new Error('Must be logged in to create a business');

    try {
      setError(null);
      const newBusiness = await businessService.createBusiness({
        ...businessData,
        userId: user.id,
      });

      setBusinesses(prev => [...prev, newBusiness]);
      return newBusiness;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create business';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateBusiness = async (id: string, updates: Partial<Business>) => {
    try {
      setError(null);
      await businessService.updateBusiness(id, updates);
      setBusinesses(prev =>
        prev.map(business =>
          business.id === id ? { ...business, ...updates } : business
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update business';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteBusiness = async (id: string) => {
    try {
      setError(null);
      await businessService.deleteBusiness(id);
      setBusinesses(prev => prev.filter(business => business.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete business';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getBusinessById = (id: string) => {
    return businesses.find(business => business.id === id);
  };

  const getUserBusinesses = (userId: string) => {
    return businesses.filter(business => business.userId === userId);
  };

  const trackView = async (businessId: string) => {
    try {
      await businessService.trackView(businessId);
    } catch (err) {
      console.error('Failed to track view:', err);
    }
  };

  const trackClick = async (businessId: string, type: 'website' | 'phone') => {
    try {
      await businessService.trackClick(businessId, type);
    } catch (err) {
      console.error('Failed to track click:', err);
    }
  };

  const getBusinessStats = (businessId: string) => {
    return businessService.getBusinessStats(businessId);
  };

  return (
    <BusinessContext.Provider value={{
      businesses,
      addBusiness,
      updateBusiness,
      deleteBusiness,
      getBusinessById,
      getUserBusinesses,
      trackView,
      trackClick,
      getBusinessStats,
      isLoading,
      error,
    }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}