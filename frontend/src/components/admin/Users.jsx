import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const token = sessionStorage.getItem('adminToken');
      await axios.delete(`${API_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-['Space_Grotesk'] text-white">Users</h1>
        <p className="text-[#9297a6] text-sm">Manage all users on your platform.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5c6070]">🔍</span>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0d0d11] border border-[#1b1b23] rounded-lg text-[#eef0f5] text-sm outline-none focus:border-[#2dd4ff] transition-colors placeholder:text-[#5c6070]"
            />
          </div>
        </div>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-4 py-2 bg-[#0d0d11] border border-[#1b1b23] rounded-lg text-[#eef0f5] text-sm outline-none focus:border-[#2dd4ff] transition-colors"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
          <option value="user">User</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-[#0d0d11] border border-[#1b1b23] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#17171e] border-b border-[#1b1b23]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5c6070] uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5c6070] uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5c6070] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5c6070] uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-[#5c6070] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b1b23]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[#5c6070]">Loading...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[#5c6070]">No users found</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-[#17171e] transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs text-[#5c6070]">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${user.role === 'admin' ? 'bg-[#2dd4ff]/10 text-[#2dd4ff]' : 
                          user.role === 'moderator' ? 'bg-[#8b5cf6]/10 text-[#8b5cf6]' : 
                          'bg-[#e94ec4]/10 text-[#e94ec4]'}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${user.status === 'active' ? 'bg-[#4fd18b]/10 text-[#4fd18b]' : 
                          user.status === 'inactive' ? 'bg-[#f0b84d]/10 text-[#f0b84d]' : 
                          'bg-[#fb5d78]/10 text-[#fb5d78]'}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#5c6070]">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-[#2dd4ff] hover:text-[#2dd4ff]/80 transition-colors text-sm">Edit</button>
                        <button 
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-[#fb5d78] hover:text-[#fb5d78]/80 transition-colors text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Users;