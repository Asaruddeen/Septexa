import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    monthlyUsers: [],
    topSearches: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAnalytics({
        monthlyUsers: [
          { month: 'Jan', users: 120 },
          { month: 'Feb', users: 180 },
          { month: 'Mar', users: 240 },
          { month: 'Apr', users: 310 },
          { month: 'May', users: 380 },
          { month: 'Jun', users: 450 },
        ],
        topSearches: [
          { term: 'ChatGPT', count: 3456 },
          { term: 'Claude', count: 2890 },
          { term: 'Midjourney', count: 2156 },
          { term: 'DeepSeek', count: 1876 },
          { term: 'Cursor', count: 1456 },
        ],
      });
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-['Space_Grotesk'] text-white">Analytics</h1>
        <p className="text-[#9297a6] text-sm">View platform statistics and insights.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <div className="bg-[#0d0d11] border border-[#1b1b23] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 font-['Space_Grotesk']">User Growth</h3>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-[#5c6070]">Loading...</div>
          ) : (
            <div className="space-y-3">
              {analytics.monthlyUsers.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#9297a6]">{item.month}</span>
                    <span className="text-white">{item.users}</span>
                  </div>
                  <div className="w-full bg-[#17171e] rounded-full h-2 mt-1">
                    <div
                      className="bg-gradient-to-r from-[#2dd4ff] to-[#8b5cf6] h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(item.users / 450) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Searches */}
        <div className="bg-[#0d0d11] border border-[#1b1b23] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 font-['Space_Grotesk']">Top Searches</h3>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-[#5c6070]">Loading...</div>
          ) : (
            <div className="space-y-3">
              {analytics.topSearches.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-[#1b1b23] last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-white">#{index + 1}</span>
                    <span className="text-sm text-[#9297a6]">{item.term}</span>
                  </div>
                  <span className="text-sm text-[#5c6070]">{item.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;