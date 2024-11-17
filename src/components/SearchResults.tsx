import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { useBusiness } from '../contexts/BusinessContext';

interface SearchResultsProps {
  query: string;
  location: string;
  tags: string[];
  isSearching: boolean;
}

export function SearchResults({ query, location, tags, isSearching }: SearchResultsProps) {
  const navigate = useNavigate();
  const { businesses, isLoading } = useBusiness();

  const filteredBusinesses = businesses.filter(business => {
    const matchesQuery = !query || 
      business.name.toLowerCase().includes(query.toLowerCase()) ||
      business.category.toLowerCase().includes(query.toLowerCase()) ||
      business.description.toLowerCase().includes(query.toLowerCase());
    
    const matchesLocation = !location || 
      business.location.toLowerCase().includes(location.toLowerCase());
    
    const matchesTags = tags.length === 0 || 
      tags.every(tag => business.tags.includes(tag));

    return matchesQuery && matchesLocation && matchesTags;
  });

  if (!isSearching) return null;

  if (isLoading) {
    return (
      <div className="absolute top-full left-0 right-0 bg-white mt-2 rounded-xl shadow-lg p-4 text-center text-gray-500 z-50">
        Loading results...
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 bg-white mt-2 rounded-xl shadow-lg max-h-[70vh] overflow-y-auto z-50">
      {filteredBusinesses.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No businesses found matching your search criteria
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {filteredBusinesses.map((business) => (
            <div 
              key={business.id}
              onClick={() => navigate(`/business/${business.id}`)}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="w-16 h-16 flex-shrink-0">
                <img 
                  src={business.image} 
                  alt={business.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-medium text-gray-900 truncate">{business.name}</h3>
                  <div className="flex items-center flex-shrink-0">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium text-gray-600">{business.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-1">{business.category}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="truncate">{business.location}</span>
                </div>
                {business.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {business.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}