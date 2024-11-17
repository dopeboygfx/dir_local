import React from 'react';
import { Eye, MousePointerClick, Phone, TrendingUp } from 'lucide-react';
import type { BusinessStats } from '../types';

interface StatisticsCardProps {
  stats: BusinessStats;
}

export function StatisticsCard({ stats }: StatisticsCardProps) {
  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-emerald-600' : 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Eye className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-gray-600">Views</span>
            </div>
            <span className={`text-sm font-medium ${getChangeColor(stats.viewsChange)}`}>
              {stats.viewsChange >= 0 ? '+' : ''}{stats.viewsChange}%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.views.toLocaleString()}</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <MousePointerClick className="w-5 h-5 text-purple-500 mr-2" />
              <span className="text-gray-600">Website Clicks</span>
            </div>
            <span className={`text-sm font-medium ${getChangeColor(stats.websiteClicksChange)}`}>
              {stats.websiteClicksChange >= 0 ? '+' : ''}{stats.websiteClicksChange}%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.websiteClicks.toLocaleString()}</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-emerald-500 mr-2" />
              <span className="text-gray-600">Phone Clicks</span>
            </div>
            <span className={`text-sm font-medium ${getChangeColor(stats.phoneClicksChange)}`}>
              {stats.phoneClicksChange >= 0 ? '+' : ''}{stats.phoneClicksChange}%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.phoneClicks.toLocaleString()}</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-pink-500 mr-2" />
              <span className="text-gray-600">CTR</span>
            </div>
            <span className={`text-sm font-medium ${getChangeColor(stats.ctrChange)}`}>
              {stats.ctrChange >= 0 ? '+' : ''}{stats.ctrChange}%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.ctr.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
}