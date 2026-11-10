import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Activity, Flame, Trophy, TrendingUp, Info } from 'lucide-react';

export interface DayActiveRecord {
  day: string;
  activeMinutes: number;
  calories: number;
  isToday?: boolean;
}

interface ActiveMinutesBarChartProps {
  data?: DayActiveRecord[];
  targetMinutes?: number;
  isLightMode?: boolean;
}

const default7DayData: DayActiveRecord[] = [
  { day: 'Mon', activeMinutes: 45, calories: 510 },
  { day: 'Tue', activeMinutes: 62, calories: 730 },
  { day: 'Wed', activeMinutes: 38, calories: 420 },
  { day: 'Thu', activeMinutes: 70, calories: 840 },
  { day: 'Fri', activeMinutes: 55, calories: 640 },
  { day: 'Sat', activeMinutes: 82, calories: 960 },
  { day: 'Today', activeMinutes: 48, calories: 580, isToday: true },
];

export const ActiveMinutesBarChart: React.FC<ActiveMinutesBarChartProps> = ({
  data = default7DayData,
  targetMinutes = 60,
  isLightMode = false,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayActiveRecord | null>(data[data.length - 1]);

  const totalMinutes = data.reduce((acc, d) => acc + d.activeMinutes, 0);
  const avgMinutes = Math.round(totalMinutes / data.length);
  const daysMetTarget = data.filter((d) => d.activeMinutes >= targetMinutes).length;

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const margin = { top: 28, right: 16, bottom: 32, left: 36 };
    const width = 360;
    const height = 180;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // D3 Scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.day))
      .range([0, innerWidth])
      .padding(0.32);

    const maxVal = Math.max(d3.max(data, (d) => d.activeMinutes) || 90, targetMinutes + 15);
    const yScale = d3
      .scaleLinear()
      .domain([0, maxVal])
      .range([innerHeight, 0])
      .nice();

    // Defs & Gradients
    const defs = svg.append('defs');

    // Gradient for standard kinetic green bar
    const gradGreen = defs
      .append('linearGradient')
      .attr('id', 'd3-bar-green')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    gradGreen.append('stop').attr('offset', '0%').attr('stop-color', '#4be277');
    gradGreen.append('stop').attr('offset', '100%').attr('stop-color', '#15803d');

    // Gradient for exceeded target bar (Cyber Cyan / Emerald)
    const gradCyan = defs
      .append('linearGradient')
      .attr('id', 'd3-bar-cyan')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    gradCyan.append('stop').attr('offset', '0%').attr('stop-color', '#38bdf8');
    gradCyan.append('stop').attr('offset', '100%').attr('stop-color', '#0284c7');

    // Gradient for Today bar
    const gradToday = defs
      .append('linearGradient')
      .attr('id', 'd3-bar-today')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    gradToday.append('stop').attr('offset', '0%').attr('stop-color', '#22c55e');
    gradToday.append('stop').attr('offset', '100%').attr('stop-color', '#06b6d4');

    // Horizontal Grid Lines using D3
    const gridTicks = [20, 40, 60, 80];
    g.append('g')
      .selectAll('line.grid-line')
      .data(gridTicks)
      .enter()
      .append('line')
      .attr('class', 'grid-line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', (d) => yScale(d))
      .attr('y2', (d) => yScale(d))
      .attr('stroke', isLightMode ? '#e2e8f0' : '#1e293b')
      .attr('stroke-dasharray', '3,3')
      .attr('stroke-width', 1);

    // Target threshold horizontal dashed line (60 min)
    const targetY = yScale(targetMinutes);
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', targetY)
      .attr('y2', targetY)
      .attr('stroke', '#f59e0b')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,4');

    // Target Label tag
    g.append('text')
      .attr('x', innerWidth)
      .attr('y', targetY - 5)
      .attr('text-anchor', 'end')
      .attr('fill', '#f59e0b')
      .attr('font-size', '9px')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-weight', '600')
      .text(`TARGET ${targetMinutes}M`);

    // Y Axis labels
    g.append('g')
      .selectAll('text.y-label')
      .data([0, 30, 60, 90])
      .enter()
      .append('text')
      .attr('class', 'y-label')
      .attr('x', -8)
      .attr('y', (d) => yScale(d) + 3)
      .attr('text-anchor', 'end')
      .attr('fill', isLightMode ? '#64748b' : '#64748b')
      .attr('font-size', '9px')
      .attr('font-family', 'JetBrains Mono, monospace')
      .text((d) => `${d}m`);

    // D3 Bars
    const barGroups = g
      .selectAll('g.bar-group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .attr('cursor', 'pointer')
      .on('mouseenter', (_, d) => setSelectedDay(d))
      .on('click', (_, d) => setSelectedDay(d));

    // Background track slot for each bar
    barGroups
      .append('rect')
      .attr('x', (d) => xScale(d.day) || 0)
      .attr('y', 0)
      .attr('width', xScale.bandwidth())
      .attr('height', innerHeight)
      .attr('rx', 6)
      .attr('fill', isLightMode ? '#f1f5f9' : '#131b2e')
      .attr('opacity', 0.6);

    // Active Bar with rounded top
    barGroups
      .append('rect')
      .attr('class', 'active-bar')
      .attr('x', (d) => xScale(d.day) || 0)
      .attr('width', xScale.bandwidth())
      .attr('y', (d) => yScale(d.activeMinutes))
      .attr('height', (d) => innerHeight - yScale(d.activeMinutes))
      .attr('rx', 6)
      .attr('fill', (d) => {
        if (d.isToday) return 'url(#d3-bar-today)';
        if (d.activeMinutes >= targetMinutes) return 'url(#d3-bar-cyan)';
        return 'url(#d3-bar-green)';
      })
      .attr('stroke', (d) => (d.isToday ? '#4be277' : 'none'))
      .attr('stroke-width', (d) => (d.isToday ? 1.5 : 0))
      .attr('filter', (d) => (d.isToday ? 'drop-shadow(0 0 8px rgba(34,197,94,0.4))' : 'none'));

    // Top value label on each bar
    barGroups
      .append('text')
      .attr('x', (d) => (xScale(d.day) || 0) + xScale.bandwidth() / 2)
      .attr('y', (d) => yScale(d.activeMinutes) - 6)
      .attr('text-anchor', 'middle')
      .attr('fill', (d) => {
        if (d.isToday) return '#22c55e';
        if (d.activeMinutes >= targetMinutes) return '#38bdf8';
        return isLightMode ? '#0f172a' : '#dae2fd';
      })
      .attr('font-size', '10px')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-weight', '700')
      .text((d) => `${d.activeMinutes}`);

    // X Axis Days Labels
    barGroups
      .append('text')
      .attr('x', (d) => (xScale(d.day) || 0) + xScale.bandwidth() / 2)
      .attr('y', innerHeight + 18)
      .attr('text-anchor', 'middle')
      .attr('fill', (d) => (d.isToday ? '#22c55e' : isLightMode ? '#475569' : '#94a3b8'))
      .attr('font-size', '10px')
      .attr('font-family', 'Space Grotesk, sans-serif')
      .attr('font-weight', (d) => (d.isToday ? '700' : '600'))
      .text((d) => d.day);

    // Glowing indicator dot under Today
    barGroups
      .filter((d) => !!d.isToday)
      .append('circle')
      .attr('cx', (d) => (xScale(d.day) || 0) + xScale.bandwidth() / 2)
      .attr('cy', innerHeight + 26)
      .attr('r', 2.5)
      .attr('fill', '#22c55e');
  }, [data, targetMinutes, isLightMode]);

  return (
    <div
      ref={containerRef}
      className={`p-4 rounded-2xl border transition-all ${
        isLightMode
          ? 'bg-white border-slate-200 shadow-sm'
          : 'bg-[#131b2e] border-slate-800'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm leading-tight">
              7-Day Active Telemetry
            </h3>
            <span className="text-[10px] text-slate-400 font-telemetry">
              D3-Engineered Motion Volume
            </span>
          </div>
        </div>

        {/* 7-Day Total Badge */}
        <div className="text-right">
          <div className="font-display font-black text-base text-emerald-400 leading-none">
            {totalMinutes} <span className="text-[11px] font-telemetry text-slate-400">min</span>
          </div>
          <span className="text-[9px] uppercase font-telemetry text-slate-400">
            Past 7 Days
          </span>
        </div>
      </div>

      {/* D3 SVG Bar Chart */}
      <div className="w-full flex justify-center overflow-x-auto py-1">
        <svg
          ref={svgRef}
          viewBox="0 0 360 180"
          className="w-full max-w-[360px] h-[180px] overflow-visible select-none"
        />
      </div>

      {/* Selected Day Telemetry HUD */}
      {selectedDay && (
        <div
          className={`mt-2 p-2.5 rounded-xl border flex items-center justify-between text-xs font-telemetry transition-all ${
            isLightMode
              ? 'bg-slate-50 border-slate-200 text-slate-800'
              : 'bg-[#0f172a] border-slate-800 text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                selectedDay.activeMinutes >= targetMinutes ? 'bg-cyan-400' : 'bg-emerald-400'
              }`}
            />
            <span className="font-bold">
              {selectedDay.day}
              {selectedDay.isToday ? ' (Active)' : ''}:
            </span>
            <span className="text-emerald-400 font-bold">
              {selectedDay.activeMinutes} min
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-slate-400 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" />
              {selectedDay.calories} kcal
            </span>
            <span
              className={`font-semibold ${
                selectedDay.activeMinutes >= targetMinutes
                  ? 'text-cyan-400'
                  : 'text-slate-400'
              }`}
            >
              {selectedDay.activeMinutes >= targetMinutes
                ? `✓ +${selectedDay.activeMinutes - targetMinutes}m Goal`
                : `${targetMinutes - selectedDay.activeMinutes}m to Goal`}
            </span>
          </div>
        </div>
      )}

      {/* 3-Column Summary KPIs */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-700/20 text-center font-telemetry text-xs">
        <div className={`p-2 rounded-xl border ${isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-[#0f172a] border-slate-800'}`}>
          <span className="text-[9px] uppercase text-slate-400 block">Daily Avg</span>
          <strong className="text-emerald-400 font-display text-sm">{avgMinutes}m</strong>
          <span className="text-[9px] text-slate-400 block">/ day</span>
        </div>

        <div className={`p-2 rounded-xl border ${isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-[#0f172a] border-slate-800'}`}>
          <span className="text-[9px] uppercase text-slate-400 block">Goal Met</span>
          <strong className="text-cyan-400 font-display text-sm">{daysMetTarget}/7</strong>
          <span className="text-[9px] text-slate-400 block">days ≥ 60m</span>
        </div>

        <div className={`p-2 rounded-xl border ${isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-[#0f172a] border-slate-800'}`}>
          <span className="text-[9px] uppercase text-slate-400 block">Total Burn</span>
          <strong className="text-amber-400 font-display text-sm">4,680</strong>
          <span className="text-[9px] text-slate-400 block">active kcal</span>
        </div>
      </div>
    </div>
  );
};
