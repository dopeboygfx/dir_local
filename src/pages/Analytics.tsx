import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  TrendingUp, Eye, BookmarkCheck, Link, Phone,
  Image as ImageIcon, Download, Filter, Calendar,
  ChevronDown, Loader
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBusiness } from '../contexts/BusinessContext';
import type { Business, BusinessStats } from '../types';

const COLORS = ['#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'];

interface AggregatedStats {
  totalViews: number;
  totalWebsiteClicks: number;
  totalPhoneClicks: number;
  averageCTR: number;
  viewsChange: number;
  clicksChange: number;
}

function calculateAggregatedStats(businesses: Business[]): AggregatedStats {
  return businesses.reduce((acc, business) => {
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

    return {
      totalViews: acc.totalViews + stats.views,
      totalWebsiteClicks: acc.totalWebsiteClicks + stats.websiteClicks,
      totalPhoneClicks: acc.totalPhoneClicks + stats.phoneClicks,
      averageCTR: acc.averageCTR + stats.ctr,
      viewsChange: acc.viewsChange + stats.viewsChange,
      clicksChange: acc.clicksChange + (stats.websiteClicksChange + stats.phoneClicksChange) / 2
    };
  }, {
    totalViews: 0,
    totalWebsiteClicks: 0,
    totalPhoneClicks: 0,
    averageCTR: 0,
    viewsChange: 0,
    clicksChange: 0
  });
}

export default function Analytics() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getUserBusinesses, getBusinessStats, isLoading } = useBusiness();
  const [selectedBusiness, setSelectedBusiness] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [aggregatedStats, setAggregatedStats] = useState<AggregatedStats | null>(null);

  const userBusinesses = useMemo(() => {
    return user ? getUserBusinesses(user.id) : [];
  }, [user, getUserBusinesses]);

  useEffect(() => {
    if (userBusinesses.length > 0 && !aggregatedStats) {
      const stats = calculateAggregatedStats(userBusinesses);
      setAggregatedStats(stats);
    }
  }, [userBusinesses, aggregatedStats]);

  const metrics = useMemo(() => {
    if (!aggregatedStats) return [];

    return [
      {
        id: 'views',
        name: 'Total Views',
        value: aggregatedStats.totalViews,
        change: aggregatedStats.viewsChange,
        icon: <Eye className="w-5 h-5 text-blue-500" />
      },
      {
        id: 'websiteClicks',
        name: 'Website Clicks',
        value: aggregatedStats.totalWebsiteClicks,
        change: aggregatedStats.clicksChange,
        icon: <Link className="w-5 h-5 text-purple-500" />
      },
      {
        id: 'phoneClicks',
        name: 'Phone Clicks',
        value: aggregatedStats.totalPhoneClicks,
        change: aggregatedStats.clicksChange,
        icon: <Phone className="w-5 h-5 text-pink-500" />
      },
      {
        id: 'ctr',
        name: 'Average CTR',
        value: aggregatedStats.averageCTR / (userBusinesses.length || 1),
        change: aggregatedStats.clicksChange - aggregatedStats.viewsChange,
        icon: <TrendingUp className="w-5 h-5 text-emerald-500" />
      }
    ];
  }, [aggregatedStats, userBusinesses.length]);

  const chartData = useMemo(() => {
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    const selectedBusinessData = selectedBusiness === 'all' 
      ? userBusinesses 
      : userBusinesses.filter(b => b.id === selectedBusiness);

    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      
      return {
        name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        views: selectedBusinessData.reduce((sum, business) => {
          const stats = business.stats;
          return sum + (stats?.views || 0) / days;
        }, 0),
        clicks: selectedBusinessData.reduce((sum, business) => {
          const stats = business.stats;
          return sum + ((stats?.websiteClicks || 0) + (stats?.phoneClicks || 0)) / days;
        }, 0)
      };
    });
  }, [selectedBusiness, dateRange, userBusinesses]);

  const handleExport = () => {
    const data = userBusinesses.map(business => ({
      name: business.name,
      views: business.stats?.views || 0,
      websiteClicks: business.stats?.websiteClicks || 0,
      phoneClicks: business.stats?.phoneClicks || 0,
      ctr: business.stats?.ctr || 0
    }));

    const csv = [
      ['Business Name', 'Views', 'Website Clicks', 'Phone Clicks', 'CTR'],
      ...data.map(row => [
        row.name,
        row.views,
        row.websiteClicks,
        row.phoneClicks,
        `${row.ctr.toFixed(2)}%`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading || !aggregatedStats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="w-6 h-6 text-emerald-600 animate-spin" />
          <span className="text-gray-600">Loading analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <div className="flex items-center space-x-4">
              <select
                value={selectedBusiness}
                onChange={(e) => setSelectedBusiness(e.target.value)}
                className="px-4 py-2 border rounded-lg text-gray-700"
              >
                <option value="all">All Businesses</option>
                {userBusinesses.map((business) => (
                  <option key={business.id} value={business.id}>
                    {business.name}
                  </option>
                ))}
              </select>

              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as '7d' | '30d' | '90d')}
                className="px-4 py-2 border rounded-lg text-gray-700"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>

              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2 bg-white border rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Download className="w-5 h-5 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric) => (
              <div key={metric.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {metric.icon}
                    <h3 className="ml-2 text-gray-500">{metric.name}</h3>
                  </div>
                  <span className={`text-sm font-medium ${
                    metric.change >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {metric.change >= 0 ? '+' : ''}{metric.change}%
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {metric.id === 'ctr' 
                    ? `${metric.value.toFixed(1)}%`
                    : metric.value.toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Performance Over Time</h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}