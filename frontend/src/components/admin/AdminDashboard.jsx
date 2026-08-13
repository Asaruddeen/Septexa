import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    newUsersToday: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentUsers();
  }, []);

  const fetchStats = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentUsers = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setRecentUsers(response.data.users.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: '👤', color: 'border-[#2dd4ff]' },
    { label: 'Active Users', value: stats.activeUsers, icon: '🟢', color: 'border-[#4fd18b]' },
    { label: 'Admin Users', value: stats.adminUsers, icon: '🛡️', color: 'border-[#8b5cf6]' },
    { label: 'New Today', value: stats.newUsersToday, icon: '📈', color: 'border-[#e94ec4]' },
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-['Space_Grotesk'] text-white">Dashboard</h1>
        <p className="text-[#9297a6] text-sm">Welcome back, Admin! Here's what's happening with your platform.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className={`bg-[#0d0d11] border-l-4 ${stat.color} rounded-xl p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#9297a6] text-sm">{stat.label}</p>
                {loading ? (
                  <div className="h-8 w-20 bg-[#17171e] rounded animate-pulse mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold text-white font-['Space_Grotesk']">{stat.value.toLocaleString()}</p>
                )}
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Users */}
      <div className="bg-[#0d0d11] border border-[#1b1b23] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 font-['Space_Grotesk']">Recent Users</h3>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#1b1b23]">
                <div>
                  <div className="h-4 w-32 bg-[#17171e] rounded animate-pulse"></div>
                  <div className="h-3 w-48 bg-[#17171e] rounded animate-pulse mt-1"></div>
                </div>
                <div className="h-3 w-16 bg-[#17171e] rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : recentUsers.length === 0 ? (
          <p className="text-[#5c6070] text-sm">No users found</p>
        ) : (
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user._id} className="flex items-center justify-between py-2 border-b border-[#1b1b23] last:border-0">
                <div>
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-[#5c6070]">{user.email}</p>
                </div>
                <span className="text-xs text-[#5c6070]">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;