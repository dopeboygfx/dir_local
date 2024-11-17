import React, { useState, useCallback } from 'react';
import { Search, MapPin, Store } from 'lucide-react';
import { SearchResults } from './SearchResults';
import { TagFilter } from './TagFilter';
import type { SearchFilters } from '../types';

export function SearchBar() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    tags: []
  });
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(
    (field: keyof SearchFilters) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFilters(prev => ({ ...prev, [field]: value }));
      setIsSearching(true);
    },
    []
  );

  const handleTagsChange = (tags: string[]) => {
    setFilters(prev => ({ ...prev, tags }));
    setIsSearching(true);
  };

  return (
    <div className="relative w-full">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-xl shadow-lg">
          <div className="flex-1 relative">
            <Store className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="What are you looking for?"
              value={filters.query}
              onChange={handleSearch('query')}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={handleSearch('location')}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>
          <button 
            onClick={() => setIsSearching(true)}
            className="bg-emerald-600 text-white px-8 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            <span>Search</span>
          </button>
        </div>

        <div className="px-4">
          <TagFilter
            selectedTags={filters.tags}
            onChange={handleTagsChange}
          />
        </div>
      </div>

      <SearchResults 
        query={filters.query}
        location={filters.location}
        tags={filters.tags}
        isSearching={isSearching}
      />
    </div>
  );
}