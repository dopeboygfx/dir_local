import React from 'react';
import { Store } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { BusinessCard } from '../components/BusinessCard';
import { Footer } from '../components/Footer';
import { useBusiness } from '../contexts/BusinessContext';

export default function HomePage() {
  const { businesses, isLoading } = useBusiness();
  const featuredBusinesses = businesses.filter(b => b.featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main>
        {/* Hero Section */}
        <section className="relative h-[500px] flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=2070"
              alt="Hero Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          
          <div className="relative z-10 container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Discover Local Businesses
              </h1>
              <p className="text-xl text-gray-200 mb-8">
                Find the best local shops, restaurants, and services near you
              </p>
            </div>
            <SearchBar />
          </div>
        </section>

        {/* Featured Businesses */}
        {featuredBusinesses.length > 0 && (
          <section className="py-16 container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Businesses</h2>
              <p className="text-gray-600">Discover highly-rated local favorites</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBusinesses.map((business) => (
                <BusinessCard key={business.id} {...business} />
              ))}
            </div>
          </section>
        )}

        {/* Get Started Section */}
        <section className="py-16 bg-emerald-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Grow Your Business?</h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Join our community of local businesses and start connecting with customers in your area.
            </p>
            <button 
              onClick={() => window.location.href = '/pricing'}
              className="bg-white text-emerald-900 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors inline-flex items-center"
            >
              <Store className="w-5 h-5 mr-2" />
              List Your Business
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}