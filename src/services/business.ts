import { db } from '../lib/db';
import type { Business, BusinessStats } from '../types';

interface BusinessInput {
  userId: string;
  name: string;
  category: string;
  description: string;
  location: string;
  phone: string;
  hours: string;
  image: string;
  website?: string;
}

export const businessService = {
  async createBusiness(input: BusinessInput): Promise<Business> {
    return db.addBusiness({
      ...input,
      rating: 0,
      featured: false,
      stats: {
        views: 0,
        websiteClicks: 0,
        phoneClicks: 0,
        viewsChange: 0,
        websiteClicksChange: 0,
        phoneClicksChange: 0,
        ctr: 0,
        ctrChange: 0
      }
    });
  },

  async updateBusiness(id: string, updates: Partial<Business>): Promise<void> {
    db.updateBusiness(id, updates);
  },

  async deleteBusiness(id: string): Promise<void> {
    db.deleteBusiness(id);
  },

  async getBusinessById(id: string): Promise<Business | null> {
    return db.getBusinessById(id) || null;
  },

  async getUserBusinesses(userId: string): Promise<Business[]> {
    return db.getBusinessesByUserId(userId);
  },

  async getAllBusinesses(): Promise<Business[]> {
    return db.getBusinesses();
  },

  async trackView(businessId: string): Promise<void> {
    const business = db.getBusinessById(businessId);
    if (!business) return;

    const stats = business.stats || {
      views: 0,
      websiteClicks: 0,
      phoneClicks: 0,
      viewsChange: 0,
      websiteClicksChange: 0,
      phoneClicksChange: 0,
      ctr: 0,
      ctrChange: 0
    };

    const newStats = {
      ...stats,
      views: stats.views + 1,
      ctr: ((stats.websiteClicks + stats.phoneClicks) / (stats.views + 1)) * 100
    };

    db.updateBusiness(businessId, { stats: newStats });
  },

  async trackClick(businessId: string, type: 'website' | 'phone'): Promise<void> {
    const business = db.getBusinessById(businessId);
    if (!business) return;

    const stats = business.stats || {
      views: 0,
      websiteClicks: 0,
      phoneClicks: 0,
      viewsChange: 0,
      websiteClicksChange: 0,
      phoneClicksChange: 0,
      ctr: 0,
      ctrChange: 0
    };

    const newStats = {
      ...stats,
      [type === 'website' ? 'websiteClicks' : 'phoneClicks']: 
        type === 'website' ? stats.websiteClicks + 1 : stats.phoneClicks + 1,
      ctr: ((stats.websiteClicks + stats.phoneClicks + 1) / stats.views) * 100
    };

    db.updateBusiness(businessId, { stats: newStats });
  },

  getBusinessStats(businessId: string): BusinessStats | undefined {
    const business = db.getBusinessById(businessId);
    return business?.stats;
  }
};