import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBusiness } from '../contexts/BusinessContext';

export default function MyListings() {
  const { user } = useAuth();
  const { getUserBusinesses, deleteBusiness, isLoading, error } = useBusiness();
  const myListings = user ? getUserBusinesses(user.id) : [];

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await deleteBusiness(id);
      } catch (err) {
        console.error('Failed to delete business:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="w-6 h-6 text-emerald-600 animate-spin" />
          <span className="text-gray-600">Loading your listings...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">
          Error loading listings: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
            <Link
              to="/create-listing"
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Listing
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {myListings.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">You haven't created any listings yet.</p>
                <Link
                  to="/create-listing"
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Create your first listing
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {myListings.map((listing) => (
                  <div key={listing.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={listing.image}
                        alt={listing.name}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-grow min-w-0">
                        <h2 className="text-xl font-semibold text-gray-900 mb-1">
                          {listing.name}
                        </h2>
                        <p className="text-gray-500 mb-2">{listing.category}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="truncate">{listing.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/edit-listing/${listing.id}`}
                          className="p-2 text-gray-400 hover:text-emerald-600 transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(listing.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}