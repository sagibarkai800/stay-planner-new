import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import components (we'll create these next)
import Login from './components/Login';
import Register from './components/Register';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected app route */}
          <Route 
            path="/app/*" 
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect root to app */}
          <Route path="/" element={<Navigate to="/app" replace />} />
          
          {/* Catch all - redirect to app */}
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
