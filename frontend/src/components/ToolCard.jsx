import React from 'react';
import { CATEGORY_META } from '../data/tools';

const ToolCard = ({ tool, index }) => {
  const costColors = {
    free: 'text-[#2dd4ff]',
    budget: 'text-[#8b5cf6]',
    paid: 'text-[#e94ec4]',
    premium: 'text-[#fb5d78]',
  };

  const ledColors = {
    free: 'bg-[#2dd4ff] shadow-[0_0_10px_rgba(45,212,255,0.5)]',
    budget: 'bg-[#8b5cf6] shadow-[0_0_10px_rgba(139,92,246,0.5)]',
    paid: 'bg-[#e94ec4] shadow-[0_0_10px_rgba(233,78,196,0.5)]',
    premium: 'bg-[#fb5d78] shadow-[0_0_10px_rgba(251,93,120,0.5)]',
  };

  return (
    <div
      className="bg-[#101014] border border-[#1b1b23] rounded-2xl p-4 flex gap-3.5 items-start transition-all hover:border-[#2a2a35] hover:bg-[#17171e]"
      style={{ animationDelay: `${Math.min(index, 10) * 0.03}s` }}
    >
      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${ledColors[tool.costLevel] || 'bg-[#5c6070]'}`}></div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2.5 flex-wrap mb-1">
          <span className="font-mono text-[10.5px] text-[#5c6070]">{tool.code}</span>
          <span className="font-['Space_Grotesk'] font-semibold text-base inline-flex items-center gap-1.5">
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-[#2dd4ff]"
            >
              {tool.name}
              <span className="text-[11px] text-[#5c6070]">↗</span>
            </a>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.5px] text-[#5c6070] bg-[#1e1e27] px-2 py-0.5 rounded-full">
            {CATEGORY_META[tool.category]?.label || tool.category}
          </span>
        </div>
        <div className="text-sm text-[#9297a6] leading-relaxed mb-2">{tool.desc}</div>
        <div className="flex gap-1.5 flex-wrap">
          {tool.tags.map((tag) => (
            <span key={tag} className="font-mono text-[10.5px] text-[#5c6070] bg-[#17171e] px-2 py-0.5 rounded border border-[#1b1b23]">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className={`font-mono text-xs font-semibold whitespace-nowrap ${costColors[tool.costLevel] || 'text-[#5c6070]'}`}>
          {tool.cost}
        </div>
      </div>
    </div>
  );
};

export default ToolCard;