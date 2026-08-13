import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2.5 items-center flex-wrap">
      <div className="flex-1 min-w-[240px] bg-[#101014] border border-[#1b1b23] rounded-2xl flex items-center px-5 py-1 transition-all focus-within:border-[#2dd4ff]">
        <span className="text-[#5c6070] mr-3">⌕</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search 89 AI tools by task, name, or budget..."
          className="border-none py-3.5 text-base w-full bg-transparent outline-none text-[#eef0f5] font-['Inter'] placeholder:text-[#5c6070]"
        />
      </div>
      <button
        type="submit"
        className="bg-gradient-to-r from-[#2dd4ff] via-[#8b5cf6] to-[#e94ec4] text-[#050208] border-none px-6 py-3 rounded-lg font-bold text-sm cursor-pointer transition-all hover:brightness-110 whitespace-nowrap font-['Inter']"
      >
        Route →
      </button>
    </form>
  );
};

export default SearchBar;