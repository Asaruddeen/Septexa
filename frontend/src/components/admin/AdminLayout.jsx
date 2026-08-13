import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    const email = sessionStorage.getItem('adminEmail');
    if (email) setAdminEmail(email);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminEmail');
    navigate('/asaradmin');
  };

  return (
    <div className="min-h-screen bg-[#030304]">
      {/* Topbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d11] border-b border-[#1b1b23]">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-[#eef0f5] hover:text-[#2dd4ff] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <img src="/septexa-logo.png" alt="Septexa" className="h-8 w-auto" />
            <span className="text-lg font-bold text-white font-['Space_Grotesk']">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#5c6070] hidden md:block">
              {adminEmail || 'Admin'}
            </span>
            <Link
              to="/dashboard"
              className="text-sm text-[#5c6070] hover:text-[#2dd4ff] transition-colors"
            >
              ← Back to Site
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-[#fb5d78] hover:text-[#fb5d78]/80 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar + Content */}
      <div className="flex pt-16">
        <Sidebar isOpen={isSidebarOpen} currentPath={location.pathname} />
        
        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;