import React from 'react';

const Trips = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Trips</h1>
        <p className="text-gray-600">Manage your travel trips and itineraries</p>
      </div>
      
      <div className="clay-card p-8 text-center">
        <div className="clay-icon w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">✈️</span>
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">Trip Management</h3>
        <p className="text-gray-600">Trip management features coming soon...</p>
      </div>
    </div>
  );
};

export default Trips;
