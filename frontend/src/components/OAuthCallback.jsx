import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { handleGoogleCallback } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userData = params.get('user');

    if (token && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        handleGoogleCallback(user, token);
        navigate('/dashboard');
      } catch (error) {
        console.error('OAuth callback error:', error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [handleGoogleCallback, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#030304]">
      <div className="text-[#2dd4ff] text-lg font-mono animate-pulse">Authenticating...</div>
    </div>
  );
};

export default OAuthCallback;