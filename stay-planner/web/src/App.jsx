import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import components
import Login from './components/Login';
import Register from './components/Register';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Trips from './pages/Trips';
import Documents from './pages/Documents';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected app route with nested routes */}
          <Route 
            path="/app/*" 
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            } 
          >
            {/* Nested routes inside AppLayout */}
            <Route index element={<Dashboard />} />
            <Route path="trips" element={<Trips />} />
            <Route path="documents" element={<Documents />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          
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
