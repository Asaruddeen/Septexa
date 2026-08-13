import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';

const Tools = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch tools from API
    setTimeout(() => {
      setTools([
        { id: 1, name: 'ChatGPT', category: 'chat', cost: 'Free / $20 Plus', status: 'active', added: '2024-01-15' },
        { id: 2, name: 'Claude', category: 'chat', cost: 'Free / $20 Pro', status: 'active', added: '2024-02-20' },
        { id: 3, name: 'Midjourney', category: 'image', cost: '$10–120/mo', status: 'pending', added: '2024-03-10' },
        { id: 4, name: 'Cursor', category: 'coding', cost: '~$20/mo', status: 'active', added: '2024-04-05' },
        { id: 5, name: 'ElevenLabs', category: 'voice', cost: 'Free tier / $5–330/mo', status: 'inactive', added: '2024-05-12' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-['Space_Grotesk'] text-white">AI Tools</h1>
        <p className="text-[#9297a6] text-sm">Manage all AI tools in your directory.</p>
      </div>

      {/* Search & Add */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5c6070]">🔍</span>
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0d0d11] border border-[#1b1b23] rounded-lg text-[#eef0f5] text-sm outline-none focus:border-[#2dd4ff] transition-colors placeholder:text-[#5c6070]"
            />
          </div>
        </div>
        <button className="px-6 py-2 bg-gradient-to-r from-[#2dd4ff] to-[#8b5cf6] text-[#050208] rounded-lg font-bold text-sm hover:brightness-110 transition-all whitespace-nowrap">
          + Add Tool
        </button>
      </div>

      {/* Tools Table */}
      <div className="bg-[#0d0d11] border border-[#1b1b23] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#17171e] border-b border-[#1b1b23]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5c6070] uppercase tracking-wider">Tool</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5c6070] uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5c6070] uppercase tracking-wider">Pricing</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#5c6070] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-[#5c6070] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b1b23]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[#5c6070]">Loading...</td>
                </tr>
              ) : filteredTools.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[#5c6070]">No tools found</td>
                </tr>
              ) : (
                filteredTools.map((tool) => (
                  <tr key={tool.id} className="hover:bg-[#17171e] transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-white">{tool.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#2dd4ff]/10 text-[#2dd4ff]">
                        {tool.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#9297a6]">{tool.cost}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${tool.status === 'active' ? 'bg-[#4fd18b]/10 text-[#4fd18b]' : 
                          tool.status === 'pending' ? 'bg-[#f0b84d]/10 text-[#f0b84d]' : 
                          'bg-[#fb5d78]/10 text-[#fb5d78]'}`}
                      >
                        {tool.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-[#2dd4ff] hover:text-[#2dd4ff]/80 transition-colors text-sm">Edit</button>
                        <button className="text-[#fb5d78] hover:text-[#fb5d78]/80 transition-colors text-sm">Delete</button>
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

export default Tools;