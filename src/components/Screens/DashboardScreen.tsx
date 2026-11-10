import React from 'react';
import {
  Flame,
  Dumbbell,
  Trophy,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  Award,
  Clock,
  Sparkles,
  ChevronRight,
  Zap,
  History,
  CheckCircle2,
  HeartPulse,
  Activity,
  Layers,
  Camera,
} from 'lucide-react';
import { AthleteUser, ScreenType, ThemeMode, CompletedWorkoutSession } from '../../types';
import { ActiveMinutesBarChart, DayActiveRecord } from '../Charts/ActiveMinutesBarChart';

interface DashboardScreenProps {
  athlete: AthleteUser;
  theme: ThemeMode;
  onNavigate: (screen: ScreenType) => void;
  onLogActivity?: (minutes: number, calories: number) => void;
  onOpenAvatarPicker?: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  athlete,
  theme,
  onNavigate,
  onLogActivity,
  onOpenAvatarPicker,
}) => {
  const isLight = theme === 'daylight';

  // Past 7 Days Active Minutes Dataset for D3 Bar Chart
  const past7DaysData: DayActiveRecord[] = [
    { day: 'Mon', activeMinutes: 45, calories: 510 },
    { day: 'Tue', activeMinutes: 62, calories: 730 },
    { day: 'Wed', activeMinutes: 38, calories: 420 },
    { day: 'Thu', activeMinutes: 70, calories: 840 },
    { day: 'Fri', activeMinutes: 55, calories: 640 },
    { day: 'Sat', activeMinutes: 82, calories: 960 },
    { day: 'Today', activeMinutes: athlete.activeMinutesToday, calories: athlete.caloriesBurnedToday, isToday: true },
  ];

  // Retrieve the last 5 completed workout sessions from the athlete state
  const last5CompletedSessions: CompletedWorkoutSession[] = (athlete.trainingHistory && athlete.trainingHistory.length > 0)
    ? athlete.trainingHistory.slice(0, 5)
    : [
        {
          id: 'th-default-1',
          title: 'Heavy Leg Telemetry & Back Squats',
          discipline: 'Strength & Power',
          dateCompleted: 'Today, 08:15 AM',
          durationMin: 62,
          caloriesBurned: 580,
          totalReps: 78,
          volumeKg: 8420,
          avgHeartRate: 154,
          prBadge: 'New 1RM Squat: 155kg',
          formAccuracy: '96% Elite',
          intensity: 'Peak',
        },
        {
          id: 'th-default-2',
          title: 'Rotational Core & Cable Speed Drills',
          discipline: 'Cricket Conditioning',
          dateCompleted: 'Yesterday, 19:15',
          durationMin: 48,
          caloriesBurned: 430,
          totalReps: 110,
          volumeKg: 3650,
          avgHeartRate: 146,
          prBadge: 'Rotational Chop: 35kg',
          formAccuracy: '98% Perfect',
          intensity: 'High',
        },
        {
          id: 'th-default-3',
          title: 'Sprint Intervals & Agility Shuttles',
          discipline: 'Speed & Track',
          dateCompleted: '2 days ago',
          durationMin: 42,
          caloriesBurned: 490,
          totalReps: 64,
          volumeKg: 0,
          avgHeartRate: 168,
          prBadge: '100m Speed: 11.2 m/s',
          formAccuracy: '97% Elite',
          intensity: 'Peak',
        },
        {
          id: 'th-default-4',
          title: 'Chest & Shoulder Hypertrophy',
          discipline: 'Upper Body Hypertrophy',
          dateCompleted: '3 days ago',
          durationMin: 54,
          caloriesBurned: 520,
          totalReps: 92,
          volumeKg: 6850,
          avgHeartRate: 142,
          prBadge: 'Bench Press: 112kg 3x3',
          formAccuracy: '94% High',
          intensity: 'High',
        },
        {
          id: 'th-default-5',
          title: 'Full-Body Mobility & Tissue Flush',
          discipline: 'Active Recovery',
          dateCompleted: '5 days ago',
          durationMin: 35,
          caloriesBurned: 220,
          totalReps: 45,
          volumeKg: 1200,
          avgHeartRate: 118,
          prBadge: null,
          formAccuracy: '99% Flawless',
          intensity: 'Recovery',
        },
      ];

  const getIntensityBadge = (intensity: CompletedWorkoutSession['intensity']) => {
    switch (intensity) {
      case 'Peak':
        return isLight
          ? 'bg-rose-100 text-rose-800 border-rose-200'
          : 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'High':
        return isLight
          ? 'bg-amber-100 text-amber-800 border-amber-200'
          : 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Moderate':
        return isLight
          ? 'bg-cyan-100 text-cyan-800 border-cyan-200'
          : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'Recovery':
      default:
        return isLight
          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-24 md:pb-8 pt-3 px-3 sm:px-6 space-y-4">
      {/* Welcome Banner & Athlete Quick Status */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          isLight
            ? 'bg-gradient-to-br from-white to-slate-50 border-slate-200 shadow-sm'
            : 'bg-gradient-to-br from-[#171f33] to-[#0f172a] border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative group shrink-0">
              <img
                src={athlete.avatar}
                alt={athlete.name}
                onClick={onOpenAvatarPicker}
                className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500/60 shadow-md cursor-pointer hover:opacity-90 transition-opacity"
              />
              {onOpenAvatarPicker && (
                <button
                  type="button"
                  onClick={onOpenAvatarPicker}
                  title="Change Profile Picture"
                  className="absolute inset-0 rounded-xl bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-emerald-400 transition-opacity cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 pointer-events-none" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-lg leading-tight tracking-tight">
                  {athlete.name}
                </h2>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-telemetry font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {athlete.tier}
                </span>
              </div>
              <div className="text-xs text-slate-400 font-telemetry mt-0.5">
                {athlete.athleteHandle} • {athlete.nationality || 'India'} • Telemetry Active
              </div>
              {athlete.biography && (
                <p className="text-[11px] text-slate-300 font-body line-clamp-1 mt-1 max-w-[320px] md:max-w-xl italic">
                  &ldquo;{athlete.biography}&rdquo;
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigate('settings')}
            className={`p-2 rounded-xl border text-xs font-telemetry transition-colors ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Profile
          </button>
        </div>

        {/* 14-Day Streak Banner */}
        <div className="mt-3.5 pt-3 border-t border-slate-700/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400">
              <Flame className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <div className="text-xs font-display font-bold text-amber-400">
                {athlete.streakDays}-Day Training Streak
              </div>
              <div className="text-[11px] text-slate-400 font-telemetry">
                Target: {athlete.workoutDaysPerWeek} sessions/week • On pace
              </div>
            </div>
          </div>

          <span className="text-[11px] font-telemetry font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30">
            Top 5% Consistency
          </span>
        </div>
      </div>

      {/* QUICK ACTIONS & PROTOCOL TILES */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-telemetry uppercase tracking-wider text-slate-400">
            Tactical Hub &amp; Quick Actions
          </span>
          <span className="text-[10px] text-emerald-400 font-telemetry font-bold">
            Zero-Cloud Local Vault
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {/* Card 1: Start Routine */}
          <button
            onClick={() => onNavigate('fitness')}
            className={`p-3.5 rounded-2xl border text-left transition-all active:scale-98 group flex flex-col justify-between ${
              isLight
                ? 'bg-white border-slate-200 hover:border-emerald-400 shadow-xs'
                : 'bg-[#171f33] border-slate-800 hover:border-emerald-500/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-[10px] font-telemetry font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                Active
              </span>
            </div>
            <div className="mt-3">
              <div className="font-display font-bold text-sm tracking-tight">Fitness Routine</div>
              <div className="text-[11px] text-slate-400 font-telemetry">Hypertrophy &amp; Power A</div>
            </div>
          </button>

          {/* Card 2: Quick Log Activity */}
          <button
            onClick={() => {
              if (onLogActivity) {
                onLogActivity(30, 320);
              }
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all active:scale-98 group flex flex-col justify-between ${
              isLight
                ? 'bg-white border-slate-200 hover:border-cyan-400 shadow-xs'
                : 'bg-[#171f33] border-slate-800 hover:border-cyan-500/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-[10px] font-telemetry font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400">
                +30m
              </span>
            </div>
            <div className="mt-3">
              <div className="font-display font-bold text-sm tracking-tight">Log Session</div>
              <div className="text-[11px] text-slate-400 font-telemetry">+30 min &amp; +320 kcal</div>
            </div>
          </button>

          {/* Card 3: Switch Sport */}
          <button
            onClick={() => onNavigate('sports')}
            className={`p-3.5 rounded-2xl border text-left transition-all active:scale-98 group flex flex-col justify-between ${
              isLight
                ? 'bg-white border-slate-200 hover:border-amber-400 shadow-xs'
                : 'bg-[#171f33] border-slate-800 hover:border-amber-500/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Trophy className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-[10px] font-telemetry font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">
                10 Sports
              </span>
            </div>
            <div className="mt-3">
              <div className="font-display font-bold text-sm tracking-tight">Multi-Sport Radar</div>
              <div className="text-[11px] text-slate-400 font-telemetry">Scouting &amp; release metrics</div>
            </div>
          </button>

          {/* Card 4: Marketplace */}
          <button
            onClick={() => onNavigate('marketplace')}
            className={`p-3.5 rounded-2xl border text-left transition-all active:scale-98 group flex flex-col justify-between ${
              isLight
                ? 'bg-white border-slate-200 hover:border-purple-400 shadow-xs'
                : 'bg-[#171f33] border-slate-800 hover:border-purple-500/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-[10px] font-telemetry font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">
                Store
              </span>
            </div>
            <div className="mt-3">
              <div className="font-display font-bold text-sm tracking-tight">Marketplace</div>
              <div className="text-[11px] text-slate-400 font-telemetry">Recovery &amp; equipment</div>
            </div>
          </button>
        </div>
      </div>

      {/* 2-Column Responsive Desktop Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left / Main Column (8 cols on lg): Chart & History */}
        <div className="lg:col-span-8 space-y-4">
          {/* D3 ACTIVE MINUTES 7-DAY BAR CHART */}
          <ActiveMinutesBarChart
            data={past7DaysData}
            targetMinutes={athlete.activeMinutesTargetToday}
            isLightMode={isLight}
          />

          {/* NEW: TRAINING HISTORY SECTION (Vertical Timeline) */}
          <div
        className={`p-4 rounded-2xl border transition-all ${
          isLight
            ? 'bg-white border-slate-200 shadow-sm'
            : 'bg-[#131b2e] border-slate-800'
        }`}
      >
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm leading-none">
                Training History
              </h3>
              <span className="text-[10px] font-telemetry text-slate-400">
                Last 5 Completed Workout Sessions (Athlete State)
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('fitness')}
            className="text-[11px] text-emerald-400 hover:underline font-telemetry flex items-center gap-0.5"
          >
            <span>Routine View</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Vertical Timeline Container */}
        <div className="relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-cyan-500/60 before:to-slate-700/40 space-y-3.5">
          {last5CompletedSessions.map((session, idx) => {
            const isLatest = idx === 0;

            return (
              <div key={session.id} className="relative group">
                {/* Timeline Node Marker */}
                <div
                  className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isLatest
                      ? 'bg-slate-950 border-emerald-400 text-emerald-400 glow-kinetic-green scale-110 shadow-md'
                      : isLight
                      ? 'bg-white border-slate-300 text-slate-500'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  {isLatest ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  ) : (
                    <span className="text-[9px] font-telemetry font-bold">{idx + 1}</span>
                  )}
                </div>

                {/* Session Timeline Card */}
                <div
                  onClick={() => onNavigate('fitness')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all active:scale-99 ${
                    isLatest
                      ? isLight
                        ? 'bg-emerald-50/40 border-emerald-300 shadow-xs'
                        : 'bg-emerald-950/20 border-emerald-500/40'
                      : isLight
                      ? 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/60'
                      : 'bg-[#172036] border-slate-800/80 hover:bg-slate-800/60'
                  }`}
                >
                  {/* Top Row: Timestamp, Discipline & Intensity */}
                  <div className="flex items-center justify-between gap-1.5 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-telemetry font-medium text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {session.dateCompleted}
                      </span>
                      <span className="text-slate-600 text-xs">•</span>
                      <span className="text-[10px] font-telemetry font-bold text-cyan-400">
                        {session.discipline}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span
                        className={`text-[9px] font-telemetry font-bold px-1.5 py-0.5 rounded border ${getIntensityBadge(
                          session.intensity
                        )}`}
                      >
                        {session.intensity} Load
                      </span>

                      {session.formAccuracy && (
                        <span className="text-[9px] font-telemetry font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {session.formAccuracy}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Session Title */}
                  <div className="mt-1 flex items-baseline justify-between gap-2">
                    <h4 className="font-display font-bold text-sm tracking-tight text-slate-100 group-hover:text-emerald-400 transition-colors">
                      {session.title}
                    </h4>
                  </div>

                  {/* Telemetry Metric Strip */}
                  <div className="mt-2 grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-700/20 text-center">
                    <div className="p-1 rounded bg-slate-900/40 border border-slate-800/60">
                      <span className="text-[9px] font-telemetry text-slate-400 block">Duration</span>
                      <strong className="text-[11px] font-telemetry font-bold text-slate-200">
                        {session.durationMin}m
                      </strong>
                    </div>

                    <div className="p-1 rounded bg-slate-900/40 border border-slate-800/60">
                      <span className="text-[9px] font-telemetry text-slate-400 block">Energy</span>
                      <strong className="text-[11px] font-telemetry font-bold text-amber-400">
                        {session.caloriesBurned}k
                      </strong>
                    </div>

                    <div className="p-1 rounded bg-slate-900/40 border border-slate-800/60">
                      <span className="text-[9px] font-telemetry text-slate-400 block">Volume</span>
                      <strong className="text-[11px] font-telemetry font-bold text-emerald-400">
                        {session.volumeKg ? `${session.volumeKg}kg` : `${session.totalReps}r`}
                      </strong>
                    </div>

                    <div className="p-1 rounded bg-slate-900/40 border border-slate-800/60">
                      <span className="text-[9px] font-telemetry text-slate-400 block">Avg HR</span>
                      <strong className="text-[11px] font-telemetry font-bold text-rose-400">
                        {session.avgHeartRate ? `${session.avgHeartRate}bpm` : '148bpm'}
                      </strong>
                    </div>
                  </div>

                  {/* PR Highlight Badge if Present */}
                  {session.prBadge && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 text-[10px] font-telemetry text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/30 font-bold">
                      <Award className="w-3.5 h-3.5 fill-amber-400" />
                      <span>PR: {session.prBadge}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>

    {/* Right Column (4 cols on lg): Modular Jump Cards & Tactical Vault Highlights */}
    <div className="lg:col-span-4 space-y-4">
      {/* Modular Jump Cards to Fitness, Sports, AI Coach */}
      <div className="space-y-2.5">
        <div
          onClick={() => onNavigate('fitness')}
          className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between group transition-all ${
            isLight
              ? 'bg-slate-50 border-slate-200 hover:border-emerald-400'
              : 'bg-[#171f33] border-slate-800 hover:border-emerald-500/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <div className="font-display font-bold text-xs">Jump to Fitness Hub</div>
              <div className="text-[11px] text-slate-400 font-telemetry">
                Hypertrophy &amp; Power A — 3 exercises left
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
        </div>

        <div
          onClick={() => onNavigate('sports')}
          className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between group transition-all ${
            isLight
              ? 'bg-slate-50 border-slate-200 hover:border-cyan-400'
              : 'bg-[#171f33] border-slate-800 hover:border-cyan-500/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="font-display font-bold text-xs">Multi-Sport Scouting</div>
              <div className="text-[11px] text-slate-400 font-telemetry">
                Cricket pace &amp; spin telemetry ready
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
        </div>

        <div
          onClick={() => onNavigate('coach')}
          className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between group transition-all ${
            isLight
              ? 'bg-slate-50 border-slate-200 hover:border-emerald-400'
              : 'bg-[#171f33] border-slate-800 hover:border-emerald-500/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-display font-bold text-xs flex items-center gap-1.5">
                <span>FitSphere AI Coach</span>
                <span className="text-[9px] font-telemetry px-1 rounded bg-cyan-500/20 text-cyan-400 font-bold">
                  gemini-3.8-flash
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-telemetry">
                Sports science advisor &amp; live Google Search grounding
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
    </div>
  </div>
  );
};
