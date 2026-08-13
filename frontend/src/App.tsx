import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import OAuthCallback from './components/OAuthCallback';

// Admin Components
import AdminLogin from './components/admin/AdminLogin';
import AdminRoute from './components/admin/AdminRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import Users from './components/admin/Users';
import Tools from './components/admin/Tools';
import Analytics from './components/admin/Analytics';
import Settings from './components/admin/Settings';

const App = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#030304]">
        <div className="text-[#2dd4ff] text-lg font-mono animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Landing />} />
      <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/oauth-callback" element={<OAuthCallback />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/asaradmin" element={<AdminLogin />} />
      <Route 
        path="/admin/dashboard" 
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } 
      />
      <Route 
        path="/asaradmin/dashboard" 
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <AdminRoute>
            <Users />
          </AdminRoute>
        } 
      />
      <Route 
        path="/asaradmin/users" 
        element={
          <AdminRoute>
            <Users />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/tools" 
        element={
          <AdminRoute>
            <Tools />
          </AdminRoute>
        } 
      />
      <Route 
        path="/asaradmin/tools" 
        element={
          <AdminRoute>
            <Tools />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/analytics" 
        element={
          <AdminRoute>
            <Analytics />
          </AdminRoute>
        } 
      />
      <Route 
        path="/asaradmin/analytics" 
        element={
          <AdminRoute>
            <Analytics />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/settings" 
        element={
          <AdminRoute>
            <Settings />
          </AdminRoute>
        } 
      />
      <Route 
        path="/asaradmin/settings" 
        element={
          <AdminRoute>
            <Settings />
          </AdminRoute>
        } 
      />
    </Routes>
  );
};

export default App;