import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import Trips from './pages/Trips';
import Calendar from './pages/Calendar';
import Documents from './pages/Documents';
import Profile from './pages/Profile';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="trips" element={<Trips />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="docs" element={<Documents />} />
          <Route path="settings" element={<Profile />} />
        </Route>
        <Route path="/" element={<Navigate to="/app" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
