import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Store, TrendingUp, DollarSign,
  AlertCircle, CheckCircle, XCircle, Loader
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBusiness } from '../contexts/BusinessContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { businesses, isLoading } = useBusiness();

  // Redirect non-admin users
  React.useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="w-6 h-6 text-emerald-600 animate-spin" />
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const stats = {
    totalUsers: 150, // In a real app, get from backend
    totalBusinesses: businesses.length,
    activeSubscriptions: 45,
    monthlyRevenue: 2890
  };

  const recentBusinesses = businesses.slice(-5);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500">Total Users</h3>
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500">Total Businesses</h3>
                <Store className="w-6 h-6 text-emerald-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalBusinesses}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500">Active Subscriptions</h3>
                <CheckCircle className="w-6 h-6 text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500">Monthly Revenue</h3>
                <DollarSign className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">${stats.monthlyRevenue}</p>
            </div>
          </div>

          {/* Recent Businesses */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Businesses</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {recentBusinesses.map((business) => (
                <div key={business.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={business.image}
                        alt={business.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{business.name}</h3>
                        <p className="text-sm text-gray-500">{business.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => navigate(`/business/${business.id}`)}
                        className="text-emerald-600 hover:text-emerald-700"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {/* Handle verification */}}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => {/* Handle removal */}}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => {/* Handle export */}}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Export Data
            </button>
            <button
              onClick={() => {/* Handle settings */}}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Platform Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}