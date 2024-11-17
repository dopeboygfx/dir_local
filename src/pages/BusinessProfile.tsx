import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Phone, Clock, CreditCard, Star, 
  Calendar, Image as ImageIcon, MessageCircle, Tag,
  ChevronLeft, Facebook, Twitter, Instagram, Loader,
  Globe
} from 'lucide-react';
import { useBusiness } from '../contexts/BusinessContext';
import { Footer } from '../components/Footer';
import { LinkTracker } from '../components/LinkTracker';

export default function BusinessProfile() {
  const { id } = useParams();
  const { getBusinessById, trackView, isLoading, error } = useBusiness();
  const business = id ? getBusinessById(id) : undefined;

  useEffect(() => {
    if (id) {
      trackView(id).catch(console.error);
    }
  }, [id, trackView]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="w-6 h-6 text-emerald-600 animate-spin" />
          <span className="text-gray-600">Loading business details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error loading business</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Link to="/" className="text-emerald-600 hover:text-emerald-700">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Business not found</h2>
          <Link to="/" className="text-emerald-600 hover:text-emerald-700">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center py-4 text-emerald-600 hover:text-emerald-700">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to search
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="h-[300px] relative">
            <img 
              src={business.image} 
              alt={business.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{business.name}</h1>
                <p className="text-gray-600 mb-4">{business.description}</p>
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                  {business.category}
                </span>
              </div>
              <div className="flex items-center bg-emerald-50 px-4 py-2 rounded-lg">
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <span className="ml-2 text-2xl font-bold text-gray-900">{business.rating}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 pt-6 border-t">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{business.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="w-5 h-5 mr-2" />
                <span>{business.phone}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-2" />
                <span>{business.hours}</span>
              </div>
            </div>

            {/* Link Tracker */}
            <div className="mt-6 pt-6 border-t">
              <LinkTracker business={business} />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Payment Methods */}
            <section className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Methods
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Visa', 'Mastercard', 'American Express', 'Apple Pay'].map((method) => (
                  <div key={method} className="bg-gray-50 rounded-lg p-3 text-center text-sm">
                    {method}
                  </div>
                ))}
              </div>
            </section>

            {/* Photo Gallery */}
            <section className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <ImageIcon className="w-5 h-5 mr-2" />
                Photo Gallery
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <img
                    key={i}
                    src={business.image}
                    alt={`Gallery ${i + 1}`}
                    className="rounded-lg aspect-square object-cover"
                  />
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Customer Reviews
              </h2>
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border-b last:border-0 pb-6 last:pb-0">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">1 week ago</span>
                    </div>
                    <p className="text-gray-600">
                      Great experience! The staff was very friendly and professional.
                      Would definitely recommend to others.
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Upcoming Events */}
            <section className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Upcoming Events
              </h2>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border-b last:border-0 pb-4 last:pb-0">
                    <h3 className="font-medium text-gray-900">Weekend Special Event</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Join us this weekend for special promotions and activities!
                    </p>
                    <time className="text-sm text-emerald-600">March {15 + i}, 2024</time>
                  </div>
                ))}
              </div>
            </section>

            {/* Special Offers */}
            <section className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Special Offers
              </h2>
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-emerald-50 rounded-lg p-4">
                    <h3 className="font-medium text-emerald-900 mb-2">
                      {i === 0 ? 'First-Time Customer Discount' : 'Weekly Special'}
                    </h3>
                    <p className="text-sm text-emerald-700">
                      {i === 0 
                        ? 'Get 20% off on your first visit!' 
                        : 'Every Wednesday: Buy one, get one 50% off'}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Social Media */}
            <section className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Follow Us</h2>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-emerald-600 transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-emerald-600 transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-emerald-600 transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}