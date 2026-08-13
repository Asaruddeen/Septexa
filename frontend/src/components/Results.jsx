import React from 'react';
import ToolCard from './ToolCard';
import { CATEGORY_META } from '../data/tools';

const Results = ({ results, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[#2dd4ff] text-sm font-mono animate-pulse">Loading tools...</div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="bg-[#101014] border border-[#1b1b23] rounded-2xl text-center py-16 px-5">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="font-['Space_Grotesk'] font-semibold text-lg">No matching tools</h3>
        <p className="text-[#9297a6] text-sm mt-2">Try a different keyword like "coding", "budget", or "image"</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {results.map((tool, index) => (
        <ToolCard key={tool.code || index} tool={tool} index={index} />
      ))}
    </div>
  );
};

export default Results;