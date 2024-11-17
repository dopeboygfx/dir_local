import React, { useState } from 'react';
import { Star, TrendingUp, Filter } from 'lucide-react';
import { useBusiness } from '../contexts/BusinessContext';
import { Footer } from '../components/Footer';
import type { Business } from '../types';

const CATEGORIES = [
  'All',
  'Barbers',
  'Salons',
  'Nail Services',
  'Cafés',
  'Mechanics'
] as const;

type SortOption = 'rating' | 'reviews' | 'trending';

export default function TopBusinesses() {
  const { businesses } = useBusiness();
  const [selectedCategory, setSelectedCategory] = useState<typeof CATEGORIES[number]>('All');
  const [sortBy, setSortBy] = useState<SortOption>('rating');

  const filteredBusinesses = businesses
    .filter(business => selectedCategory === 'All' || business.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          // In a real app, use actual review count
          return (b.reviews?.length || 0) - (a.reviews?.length || 0);
        case 'trending':
          // In a real app, use view count or recent review count
          return b.rating - a.rating;
        default:
          return 0;
      }
    })
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Top Local Businesses</h1>
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviewed</option>
                <option value="trending">Trending</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex overflow-x-auto pb-4 mb-6 -mx-4 px-4 scrollbar-hide">
            <div className="flex space-x-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Rankings List */}
          <div className="space-y-4">
            {filteredBusinesses.map((business, index) => (
              <div
                key={business.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start p-6">
                  <div className="flex-shrink-0 w-24 h-24">
                    <img
                      src={business.image}
                      alt={business.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="ml-6 flex-grow">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                          <span className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            {index + 1}
                          </span>
                          {business.name}
                        </h2>
                        <p className="text-gray-500 mt-1">{business.category}</p>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center bg-emerald-50 px-3 py-1 rounded-lg">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="ml-1 font-semibold text-gray-900">
                            {business.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2 line-clamp-2">{business.description}</p>
                    <div className="flex items-center mt-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-gray-400" />
                        <span className="ml-1">238 reviews</span>
                      </div>
                      {sortBy === 'trending' && (
                        <div className="flex items-center ml-4">
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                          <span className="ml-1">Trending</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredBusinesses.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-500">No businesses found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}