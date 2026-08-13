import React, { useState } from 'react';
import { CATEGORY_META } from '../data/tools';

const Sidebar = ({ onSearch, onFilterChange, currentFilter }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value, currentFilter);
  };

  const handleCategoryClick = (category) => {
    setQuery(category);
    onSearch(category, currentFilter);
  };

  const filters = ['all', 'free', 'budget', 'paid', 'premium'];

  return (
    <div className="bg-[#101014] border border-[#1b1b23] rounded-2xl sticky top-5 h-[calc(100vh-40px)] flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 sidebar-scroll">
        {/* Search */}
        <div className="mb-4">
          <div className="font-mono text-[10.5px] uppercase tracking-[1.2px] text-[#5c6070] flex items-center gap-2 mb-2.5">
            <span className="w-3.5 h-px bg-[#2a2a35]"></span>Query
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5c6070] text-xs">⌕</span>
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="coding, budget, image..."
              className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-[#2a2a35] bg-[#17171e] text-[#eef0f5] text-sm outline-none focus:border-[#2dd4ff] transition-colors placeholder:text-[#5c6070]"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4">
          <div className="font-mono text-[10.5px] uppercase tracking-[1.2px] text-[#5c6070] flex items-center gap-2 mb-2.5">
            <span className="w-3.5 h-px bg-[#2a2a35]"></span>Cost tier
          </div>
          <div className="flex flex-wrap gap-1.5">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => onFilterChange(filter)}
                className={`px-3 py-1 rounded-full border text-xs font-semibold font-mono flex items-center gap-1.5 transition-all hover:border-[#9297a6] hover:text-[#eef0f5] ${
                  currentFilter === filter
                    ? 'active bg-[#2dd4ff] text-[#050208] border-[#2dd4ff]'
                    : 'border-[#2a2a35] bg-[#17171e] text-[#9297a6]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${currentFilter === filter ? 'bg-[#050208]' : 'bg-[#5c6070]'}`}></span>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Recent */}
        <div className="mb-4">
          <div className="font-mono text-[10.5px] uppercase tracking-[1.2px] text-[#5c6070] flex items-center gap-2 mb-2.5">
            <span className="w-3.5 h-px bg-[#2a2a35]"></span>Recent queries
          </div>
          <div className="flex flex-col gap-0.5">
            {['ChatGPT pricing', 'Budget coding options', 'Image generation', 'Document creation'].map((item) => (
              <div
                key={item}
                onClick={() => handleCategoryClick(item.split(' ')[0].toLowerCase())}
                className="px-2.5 py-2 rounded-lg text-[12.5px] text-[#9297a6] cursor-pointer flex items-center gap-2 border border-transparent hover:bg-[#17171e] hover:text-[#eef0f5]"
              >
                <span className="text-[#5c6070] text-[10px]">↳</span>
                {item}
                <span className="ml-auto font-mono text-[10.5px] text-[#5c6070]">{['2h', '5h', '1d', '2d'][Math.floor(Math.random() * 4)]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Channels */}
        <div>
          <div className="font-mono text-[10.5px] uppercase tracking-[1.2px] text-[#5c6070] flex items-center gap-2 mb-2.5">
            <span className="w-3.5 h-px bg-[#2a2a35]"></span>Channels
          </div>
          <div className="flex flex-col gap-0.5">
            {Object.entries(CATEGORY_META).map(([key, meta]) => (
              <div
                key={key}
                onClick={() => handleCategoryClick(key)}
                className="px-2.5 py-2 rounded-lg text-sm text-[#9297a6] cursor-pointer flex items-center gap-2.5 hover:bg-[#17171e] hover:text-[#eef0f5]"
              >
                <span className="font-mono text-[10px] text-[#5c6070] w-[30px] flex-shrink-0">{meta.code}</span>
                {meta.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;