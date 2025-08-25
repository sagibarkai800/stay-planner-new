import React, { useState, useEffect } from 'react';
import { api } from '../api/client';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.calculations.summary();
        setSummary(response.data);
      } catch (error) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="clay-card p-8 text-center">
        <div className="clay-icon w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <span className="text-4xl">🏠</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Welcome Back!</h1>
        <p className="text-xl text-gray-600">Here's what's happening with your travel plans today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Schengen Status Card */}
        <div className="clay-status-card p-8 text-center hover:transform hover:scale-105 transition-transform duration-300">
          <div className="clay-icon w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl">🇪🇺</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Schengen Status</h3>
          <p className="text-3xl font-bold text-gray-800 mb-1">
            {summary?.schengen?.remaining || 0}
          </p>
          <p className="text-sm text-gray-600">days remaining</p>
        </div>

        {/* Total Trips Card */}
        <div className="clay-status-card p-8 text-center hover:transform hover:scale-105 transition-transform duration-300">
          <div className="clay-icon w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl">✈️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Trips</h3>
          <p className="text-3xl font-bold text-gray-800 mb-1">
            {summary?.trips?.length || 0}
          </p>
          <p className="text-sm text-gray-600">trips planned</p>
        </div>

        {/* Documents Card */}
        <div className="clay-status-card p-8 text-center hover:transform hover:scale-105 transition-transform duration-300">
          <div className="clay-icon w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl">📄</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Documents</h3>
          <p className="text-3xl font-bold text-gray-800 mb-1">
            {summary?.documents?.length || 0}
          </p>
          <p className="text-sm text-gray-600">files uploaded</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="clay-card p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Quick Actions</h3>
          <p className="text-gray-600">Get started with your travel planning</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <button className="clay-button py-4 px-6 text-gray-800 font-medium text-sm flex flex-col items-center space-y-2 hover:transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">✈️</span>
            <span>Add Trip</span>
          </button>
          <button className="clay-button py-4 px-6 text-gray-800 font-medium text-sm flex flex-col items-center space-y-2 hover:transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">📄</span>
            <span>Upload Document</span>
          </button>
          <button className="clay-button py-4 px-6 text-gray-800 font-medium text-sm flex flex-col items-center space-y-2 hover:transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">🧮</span>
            <span>Calculate Status</span>
          </button>
          <button className="clay-button py-4 px-6 text-gray-800 font-medium text-sm flex flex-col items-center space-y-2 hover:transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">📊</span>
            <span>View Reports</span>
          </button>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="clay-card p-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Recent Activity</h3>
          <p className="text-gray-600">Your latest travel updates and notifications</p>
        </div>
        <div className="text-center py-12">
          <div className="clay-icon w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl">📱</span>
          </div>
          <p className="text-gray-500 text-lg">No recent activity yet</p>
          <p className="text-gray-400 text-sm">Start planning your next trip to see updates here!</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
