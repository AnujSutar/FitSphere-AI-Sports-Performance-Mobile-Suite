import React from 'react';
import { AthleteRadarData } from '../../types';

interface RadarChartProps {
  data: AthleteRadarData[];
  athlete1Name: string;
  athlete2Name: string;
  isLightMode?: boolean;
  focusedAthlete?: 'both' | 'a' | 'b';
}

export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  athlete1Name,
  athlete2Name,
  isLightMode = false,
  focusedAthlete = 'both',
}) => {
  const size = 300;
  const center = size / 2;
  const radius = size * 0.38;
  const numSides = data.length;

  // Compute angles for each dimension
  const angleStep = (Math.PI * 2) / numSides;

  // Grid levels (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  const getCoordinates = (index: number, valPct: number) => {
    // Start at top (-PI/2)
    const angle = index * angleStep - Math.PI / 2;
    const r = radius * (valPct / 100);
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Build grid polygons
  const gridPolygons = gridLevels.map((lvl) => {
    const points = Array.from({ length: numSides }).map((_, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = radius * lvl;
      return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
    });
    return points.join(' ');
  });

  // Build polygon path for Athlete 1 (Green)
  const athlete1Points = data
    .map((item, i) => {
      const coord = getCoordinates(i, item.athlete1Val);
      return `${coord.x},${coord.y}`;
    })
    .join(' ');

  // Build polygon path for Athlete 2 (Cyan)
  const athlete2Points = data
    .map((item, i) => {
      const coord = getCoordinates(i, item.athlete2Val);
      return `${coord.x},${coord.y}`;
    })
    .join(' ');

  const gridStroke = isLightMode ? '#cbd5e1' : '#334155';
  const labelColor = isLightMode ? '#334155' : '#94a3b8';

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background web polygons */}
        {gridPolygons.map((pts, idx) => (
          <polygon
            key={idx}
            points={pts}
            fill={idx % 2 === 0 ? (isLightMode ? 'rgba(241,245,249,0.5)' : 'rgba(15,23,42,0.4)') : 'transparent'}
            stroke={gridStroke}
            strokeWidth="1"
            strokeDasharray={idx === 3 ? 'none' : '3,3'}
          />
        ))}

        {/* Spoke lines from center */}
        {Array.from({ length: numSides }).map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x2 = center + radius * Math.cos(angle);
          const y2 = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke={gridStroke}
              strokeWidth="1"
            />
          );
        })}

        {/* Athlete 2 Shape (Cyan) */}
        {(focusedAthlete === 'both' || focusedAthlete === 'b') && (
          <g className="transition-all duration-500 ease-out">
            <polygon
              points={athlete2Points}
              fill="rgba(6, 182, 212, 0.22)"
              stroke="#06b6d4"
              strokeWidth="2.5"
            />
            {data.map((item, i) => {
              const coord = getCoordinates(i, item.athlete2Val);
              return (
                <circle
                  key={`a2-${i}`}
                  cx={coord.x}
                  cy={coord.y}
                  r="4"
                  fill="#06b6d4"
                  stroke={isLightMode ? '#ffffff' : '#0f172a'}
                  strokeWidth="2"
                />
              );
            })}
          </g>
        )}

        {/* Athlete 1 Shape (Kinetic Green) */}
        {(focusedAthlete === 'both' || focusedAthlete === 'a') && (
          <g className="transition-all duration-500 ease-out">
            <polygon
              points={athlete1Points}
              fill="rgba(34, 197, 94, 0.28)"
              stroke="#22c55e"
              strokeWidth="2.5"
            />
            {data.map((item, i) => {
              const coord = getCoordinates(i, item.athlete1Val);
              return (
                <circle
                  key={`a1-${i}`}
                  cx={coord.x}
                  cy={coord.y}
                  r="4.5"
                  fill="#22c55e"
                  stroke={isLightMode ? '#ffffff' : '#0f172a'}
                  strokeWidth="2"
                />
              );
            })}
          </g>
        )}

        {/* Dimension Labels */}
        {data.map((item, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const labelDist = radius + 22;
          const lx = center + labelDist * Math.cos(angle);
          const ly = center + labelDist * Math.sin(angle);

          // text anchor depending on position
          let anchor: 'middle' | 'start' | 'end' = 'middle';
          if (Math.cos(angle) > 0.3) anchor = 'start';
          if (Math.cos(angle) < -0.3) anchor = 'end';

          return (
            <text
              key={i}
              x={lx}
              y={ly + 4}
              textAnchor={anchor}
              fill={labelColor}
              className="text-[10px] font-semibold tracking-wider uppercase font-telemetry select-none"
            >
              {item.dimension}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-2 text-xs font-telemetry">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-500 shadow-xs shadow-emerald-500/50"></span>
          <span className="font-semibold">{athlete1Name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-cyan-400 shadow-xs shadow-cyan-400/50"></span>
          <span className="font-semibold">{athlete2Name}</span>
        </div>
      </div>
    </div>
  );
};
