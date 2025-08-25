import React from 'react';

const Profile = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>
      
      <div className="clay-card p-8 text-center">
        <div className="clay-icon w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">👤</span>
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">Profile Management</h3>
        <p className="text-gray-600">Profile management features coming soon...</p>
      </div>
    </div>
  );
};

export default Profile;
