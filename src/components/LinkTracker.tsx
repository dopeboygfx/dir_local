import React from 'react';
import { ExternalLink, Phone, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBusiness } from '../contexts/BusinessContext';
import type { Business } from '../types';

interface LinkTrackerProps {
  business: Business;
}

export function LinkTracker({ business }: LinkTrackerProps) {
  const { user } = useAuth();
  const { trackClick } = useBusiness();

  const handleClick = async (type: 'website' | 'phone') => {
    try {
      await trackClick(business.id, type);
    } catch (error) {
      console.error(`Failed to track ${type} click:`, error);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {business.website && (
        <a
          href={business.website}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleClick('website')}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Globe className="w-5 h-5 mr-2" />
          Visit Website
          <ExternalLink className="w-4 h-4 ml-2" />
        </a>
      )}

      <a
        href={`tel:${business.phone.replace(/\D/g, '')}`}
        onClick={() => handleClick('phone')}
        className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Phone className="w-5 h-5 mr-2 text-gray-600" />
        <span className="text-gray-900">{business.phone}</span>
      </a>
    </div>
  );
}