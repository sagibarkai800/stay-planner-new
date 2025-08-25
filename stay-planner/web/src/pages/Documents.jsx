import React from 'react';

const Documents = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <p className="text-gray-600">Upload and manage your travel documents</p>
      </div>
      
      <div className="clay-card p-8 text-center">
        <div className="clay-icon w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">📄</span>
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">Document Management</h3>
        <p className="text-gray-600">Document management features coming soon...</p>
      </div>
    </div>
  );
};

export default Documents;
