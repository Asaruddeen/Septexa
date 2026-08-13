import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://septexa.onrender.com/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@septexa.com');
  const [password, setPassword] = useState('Asar7741');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/admin/login`, {
        email,
        password
      });

      if (response.data.success) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminToken', response.data.token);
        sessionStorage.setItem('adminUser', JSON.stringify(response.data.user));
        navigate('/admin/dashboard');
      } else {
        setError(response.data.message || 'Login failed');
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030304] flex items-center justify-center px-4">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-[#2dd4ff] opacity-[0.04] top-[-15%] left-[-10%] blur-[100px] animate-pulse"></div>
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[#e94ec4] opacity-[0.04] bottom-[-15%] right-[-10%] blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-[#0d0d11] border border-[#1b1b23] rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src="/septexa-logo.png" alt="Septexa" className="h-12 w-auto mx-auto mb-3" />
            <h1 className="text-2xl font-bold font-['Space_Grotesk'] text-white">Admin Access</h1>
            <p className="text-[#9297a6] text-sm mt-1">Enter your admin credentials to continue</p>
          </div>

          {error && (
            <div className="bg-[#fb5d78]/10 border border-[#fb5d78]/20 text-[#fb5d78] text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#9297a6] mb-1">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@septexa.com"
                className="w-full px-4 py-3 bg-[#17171e] border border-[#1b1b23] rounded-lg text-[#eef0f5] text-sm outline-none focus:border-[#2dd4ff] transition-colors placeholder:text-[#5c6070]"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[#9297a6] mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[#17171e] border border-[#1b1b23] rounded-lg text-[#eef0f5] text-sm outline-none focus:border-[#2dd4ff] transition-colors placeholder:text-[#5c6070] pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5c6070] hover:text-[#eef0f5] transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    // Eye open icon - showing password
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                      />
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                      />
                    </svg>
                  ) : (
                    // Eye closed icon - hiding password
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" 
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#2dd4ff] via-[#8b5cf6] to-[#e94ec4] text-[#050208] rounded-lg font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Access Admin Panel'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-[#5c6070]">
              {/* Default: admin@septexa.com / Asar7741 */}
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="mt-2 text-xs text-[#2dd4ff] hover:text-[#2dd4ff]/80 transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;