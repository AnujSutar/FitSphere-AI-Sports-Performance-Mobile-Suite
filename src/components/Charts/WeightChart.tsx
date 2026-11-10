import React, { useState } from 'react';
import { BodyweightRecord } from '../../types';

interface WeightChartProps {
  data: BodyweightRecord[];
  isLightMode?: boolean;
}

export const WeightChart: React.FC<WeightChartProps> = ({ data, isLightMode = false }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const width = 320;
  const height = 110;
  const paddingX = 24;
  const paddingY = 20;

  const weights = data.map((d) => d.weightKg);
  const minW = Math.min(...weights) - 0.5;
  const maxW = Math.max(...weights) + 0.5;

  const points = data.map((item, idx) => {
    const x = paddingX + (idx / (data.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((item.weightKg - minW) / (maxW - minW)) * (height - paddingY * 2);
    return { x, y, ...item };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - 4} L ${points[0].x} ${height - 4} Z`;

  const lineColor = '#22c55e';
  const gridStroke = isLightMode ? '#e2e8f0' : '#1e293b';

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex items-center justify-between text-xs text-slate-400 font-telemetry mb-1 px-1">
        <span>Trend: -1.8 kg (Steady Cut)</span>
        <span className="text-emerald-400 font-semibold">Current: 78.4 kg</span>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-28 overflow-visible">
          {/* Horizontal Grid lines */}
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke={gridStroke} strokeDasharray="3,3" />
          <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke={gridStroke} strokeDasharray="3,3" />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke={gridStroke} strokeDasharray="3,3" />

          {/* Area gradient under line */}
          <defs>
            <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={areaD} fill="url(#weightGrad)" />

          {/* Sparkline curve */}
          <path d={pathD} fill="none" stroke={lineColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Interactive Nodes */}
          {points.map((pt, i) => (
            <g
              key={i}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => setHoveredIdx(i)}
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredIdx === i ? 6 : 4}
                fill={lineColor}
                stroke={isLightMode ? '#ffffff' : '#0f172a'}
                strokeWidth="2"
                className="transition-all duration-200"
              />
            </g>
          ))}
        </svg>

        {/* Tooltip on hover/touch */}
        {hoveredIdx !== null && (
          <div
            className="absolute top-1 pointer-events-none transform -translate-x-1/2 bg-slate-900 border border-emerald-500/40 text-white px-2 py-0.5 rounded text-[11px] font-telemetry shadow-lg z-10"
            style={{
              left: `${(points[hoveredIdx].x / width) * 100}%`,
            }}
          >
            <span className="text-emerald-400 font-bold">{points[hoveredIdx].weightKg} kg</span> ({points[hoveredIdx].label})
          </div>
        )}
      </div>

      <div className="w-full flex justify-between text-[10px] text-slate-500 font-telemetry px-2 mt-1">
        {data.map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>
    </div>
  );
};
