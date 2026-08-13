import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);
  const token = sessionStorage.getItem('adminToken');

  useEffect(() => {
    const verifyAdmin = async () => {
      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/admin/verify`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          setIsValid(true);
        } else {
          setIsValid(false);
          sessionStorage.removeItem('adminLoggedIn');
          sessionStorage.removeItem('adminToken');
          sessionStorage.removeItem('adminUser');
        }
      } catch (error) {
        setIsValid(false);
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminToken');
        sessionStorage.removeItem('adminUser');
      }
    };

    verifyAdmin();
  }, [token]);

  if (isValid === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#030304]">
        <div className="text-[#2dd4ff] text-lg font-mono animate-pulse">Verifying admin access...</div>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/admin" />;
  }

  return children;
};

export default AdminRoute;