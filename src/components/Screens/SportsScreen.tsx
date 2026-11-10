import React, { useState } from 'react';
import {
  Trophy,
  Target,
  Sparkles,
  Dumbbell,
  Plus,
  Minus,
  CheckCircle2,
  Circle,
  RotateCcw,
  PlusCircle,
  Flame,
  Trash2,
  ChevronDown,
  ChevronUp,
  Zap,
  Wind,
  HeartPulse,
  Crosshair,
  Gauge,
  Clock,
  TrendingUp,
} from 'lucide-react';
import {
  SportProfile,
  SportTargetExercise,
  ThemeMode,
  CustomSportMetric,
  MetricCategory,
} from '../../types';
import { sportsProfiles, initialCustomMetrics } from '../../data/mockData';
import { RadarChart } from '../Charts/RadarChart';

interface SportsScreenProps {
  theme: ThemeMode;
}

export const SportsScreen: React.FC<SportsScreenProps> = ({ theme }) => {
  const [selectedSportId, setSelectedSportId] = useState<string>('cricket');
  const [radarFocus, setRadarFocus] = useState<'both' | 'a' | 'b'>('both');

  // Dynamic state for Target Exercises per sport
  const [exercisesBySport, setExercisesBySport] = useState<Record<string, SportTargetExercise[]>>(() => {
    const map: Record<string, SportTargetExercise[]> = {};
    sportsProfiles.forEach((sport) => {
      map[sport.id] = sport.targetExercises ? [...sport.targetExercises] : [];
    });
    return map;
  });

  // State for Add Custom Exercise form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExName, setNewExName] = useState('');
  const [newExFocus, setNewExFocus] = useState('');
  const [newExSets, setNewExSets] = useState(4);
  const [newExReps, setNewExReps] = useState(10);
  const [newExLoad, setNewExLoad] = useState('');
  const [newExNotes, setNewExNotes] = useState('');

  // Dynamic state for Custom Performance Metrics
  const [customMetrics, setCustomMetrics] = useState<CustomSportMetric[]>(initialCustomMetrics);
  const [showMetricForm, setShowMetricForm] = useState(false);
  const [metricCategoryFilter, setMetricCategoryFilter] = useState<'All' | MetricCategory>('All');

  // Form fields for custom performance metrics
  const [metricName, setMetricName] = useState('');
  const [metricCategory, setMetricCategory] = useState<MetricCategory>('Speed');
  const [metricValue, setMetricValue] = useState('');
  const [metricUnit, setMetricUnit] = useState('sec');
  const [metricRating, setMetricRating] = useState<'Elite' | 'Pro Benchmark' | 'Personal Best' | 'Optimal' | 'Standard'>('Personal Best');
  const [metricNotes, setMetricNotes] = useState('');

  const isLight = theme === 'daylight';

  const currentSport = sportsProfiles.find((s) => s.id === selectedSportId) || sportsProfiles[0];
  const activeExercises = exercisesBySport[selectedSportId] || [];

  // Metrics for active sport exercises
  const totalSetsRequired = activeExercises.reduce((acc, ex) => acc + ex.targetSets, 0);
  const totalSetsCompleted = activeExercises.reduce((acc, ex) => acc + Math.min(ex.completedSets, ex.targetSets), 0);
  const completionPercentage = totalSetsRequired > 0 ? Math.round((totalSetsCompleted / totalSetsRequired) * 100) : 0;

  // Custom metrics filtering for the active sport
  const activeSportMetrics = customMetrics.filter((m) => m.sportId === selectedSportId);
  const filteredMetrics =
    metricCategoryFilter === 'All'
      ? activeSportMetrics
      : activeSportMetrics.filter((m) => m.category === metricCategoryFilter);

  // Handlers for exercise set/rep tracking
  const updateExercise = (exerciseId: string, updates: Partial<SportTargetExercise>) => {
    setExercisesBySport((prev) => {
      const sportList = prev[selectedSportId] || [];
      const updatedList = sportList.map((item) => {
        if (item.id === exerciseId) {
          return { ...item, ...updates };
        }
        return item;
      });
      return { ...prev, [selectedSportId]: updatedList };
    });
  };

  const handleToggleSet = (exerciseId: string, setIndex: number) => {
    const exercise = activeExercises.find((ex) => ex.id === exerciseId);
    if (!exercise) return;
    let newCompleted: number;
    if (setIndex < exercise.completedSets) {
      newCompleted = setIndex;
    } else {
      newCompleted = setIndex + 1;
    }
    updateExercise(exerciseId, { completedSets: Math.max(0, newCompleted) });
  };

  const handleQuickIncrementSet = (exerciseId: string) => {
    const exercise = activeExercises.find((ex) => ex.id === exerciseId);
    if (!exercise) return;
    const nextVal = Math.min(exercise.targetSets, exercise.completedSets + 1);
    updateExercise(exerciseId, { completedSets: nextVal });
  };

  const handleQuickDecrementSet = (exerciseId: string) => {
    const exercise = activeExercises.find((ex) => ex.id === exerciseId);
    if (!exercise) return;
    const nextVal = Math.max(0, exercise.completedSets - 1);
    updateExercise(exerciseId, { completedSets: nextVal });
  };

  const handleAdjustTargetSets = (exerciseId: string, delta: number) => {
    const exercise = activeExercises.find((ex) => ex.id === exerciseId);
    if (!exercise) return;
    const newTarget = Math.max(1, Math.min(12, exercise.targetSets + delta));
    updateExercise(exerciseId, {
      targetSets: newTarget,
      completedSets: Math.min(exercise.completedSets, newTarget),
    });
  };

  const handleAdjustTargetReps = (exerciseId: string, delta: number) => {
    const exercise = activeExercises.find((ex) => ex.id === exerciseId);
    if (!exercise) return;
    const newTarget = Math.max(1, Math.min(100, exercise.targetReps + delta));
    updateExercise(exerciseId, { targetReps: newTarget });
  };

  const handleDirectRepsChange = (exerciseId: string, valStr: string) => {
    const val = parseInt(valStr, 10);
    if (!isNaN(val) && val >= 1) {
      updateExercise(exerciseId, { targetReps: Math.min(150, val) });
    }
  };

  const handleDirectSetsChange = (exerciseId: string, valStr: string) => {
    const val = parseInt(valStr, 10);
    if (!isNaN(val) && val >= 1) {
      const sets = Math.min(20, val);
      const ex = activeExercises.find((e) => e.id === exerciseId);
      updateExercise(exerciseId, {
        targetSets: sets,
        completedSets: ex ? Math.min(ex.completedSets, sets) : 0,
      });
    }
  };

  const handleResetExercise = (exerciseId: string) => {
    updateExercise(exerciseId, { completedSets: 0 });
  };

  const handleDeleteExercise = (exerciseId: string) => {
    setExercisesBySport((prev) => {
      const sportList = prev[selectedSportId] || [];
      return {
        ...prev,
        [selectedSportId]: sportList.filter((item) => item.id !== exerciseId),
      };
    });
  };

  const handleAddExerciseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExName.trim()) return;

    const newExercise: SportTargetExercise = {
      id: `${selectedSportId}-custom-${Date.now()}`,
      name: newExName.trim(),
      focusArea: newExFocus.trim() || 'Sport Conditioning',
      targetSets: Number(newExSets) || 4,
      targetReps: Number(newExReps) || 10,
      completedSets: 0,
      recommendedLoad: newExLoad.trim() || 'Adaptive Load',
      notes: newExNotes.trim() || 'Discipline-specific performance protocol',
    };

    setExercisesBySport((prev) => ({
      ...prev,
      [selectedSportId]: [...(prev[selectedSportId] || []), newExercise],
    }));

    setNewExName('');
    setNewExFocus('');
    setNewExSets(4);
    setNewExReps(10);
    setNewExLoad('');
    setNewExNotes('');
    setShowAddForm(false);
  };

  // Custom Metric Handlers
  const handleAddMetricSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!metricName.trim() || !metricValue.trim()) return;

    const newMetric: CustomSportMetric = {
      id: `cm-${selectedSportId}-${Date.now()}`,
      sportId: selectedSportId,
      metricName: metricName.trim(),
      category: metricCategory,
      value: metricValue.trim(),
      unit: metricUnit.trim() || 'units',
      ratingBadge: metricRating,
      dateRecorded: 'Today, Just now',
      notes: metricNotes.trim() || undefined,
    };

    setCustomMetrics((prev) => [newMetric, ...prev]);

    // Reset form fields
    setMetricName('');
    setMetricValue('');
    setMetricNotes('');
    setShowMetricForm(false);
  };

  const handleDeleteMetric = (id: string) => {
    setCustomMetrics((prev) => prev.filter((m) => m.id !== id));
  };

  const getCategoryIcon = (category: MetricCategory) => {
    switch (category) {
      case 'Speed':
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'Agility':
        return <Wind className="w-3.5 h-3.5 text-sky-400" />;
      case 'Endurance':
        return <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Power':
        return <Flame className="w-3.5 h-3.5 text-rose-400" />;
      case 'Reaction':
        return <Crosshair className="w-3.5 h-3.5 text-violet-400" />;
      default:
        return <Gauge className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  const getCategoryBadgeClass = (category: MetricCategory) => {
    switch (category) {
      case 'Speed':
        return isLight
          ? 'bg-amber-50 text-amber-800 border-amber-200'
          : 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Agility':
        return isLight
          ? 'bg-sky-50 text-sky-800 border-sky-200'
          : 'bg-sky-500/15 text-sky-400 border-sky-500/30';
      case 'Endurance':
        return isLight
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
          : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Power':
        return isLight
          ? 'bg-rose-50 text-rose-800 border-rose-200'
          : 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'Reaction':
        return isLight
          ? 'bg-violet-50 text-violet-800 border-violet-200'
          : 'bg-violet-500/15 text-violet-400 border-violet-500/30';
      default:
        return isLight
          ? 'bg-slate-100 text-slate-800 border-slate-200'
          : 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-24 md:pb-8 pt-2 px-3 sm:px-6 space-y-4">
      {/* 10-SPORT HORIZONTAL SCROLLING QUICK SWITCHER */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-telemetry uppercase tracking-wider text-slate-400">
            Discipline Selector (10 Sports)
          </span>
          <span className="text-[10px] text-emerald-400 font-telemetry font-bold">
            Biomechanical Engine
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin no-scrollbar">
          {sportsProfiles.map((sport) => {
            const isSelected = sport.id === selectedSportId;
            return (
              <button
                key={sport.id}
                onClick={() => {
                  setSelectedSportId(sport.id);
                  setShowAddForm(false);
                  setShowMetricForm(false);
                }}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-telemetry font-bold border transition-all active:scale-95 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 glow-kinetic-green scale-102'
                    : isLight
                    ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    : 'bg-[#131b2e] border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{sport.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sport Title & Tagline Banner */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          isLight
            ? 'bg-white border-slate-200 shadow-sm'
            : 'bg-[#131b2e] border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg leading-tight">
                {currentSport.name} Telemetry Hub
              </h2>
              <p className="text-xs text-slate-400 font-body mt-0.5">
                {currentSport.tagline}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-telemetry font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            PRO TIER
          </span>
        </div>
      </div>

      {/* DISCIPLINE-SPECIFIC KPIS */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-telemetry uppercase tracking-wider text-slate-400">
            Sport-Tailored Key Performance Indicators
          </span>
          <span className="text-[10px] text-slate-400 font-telemetry">Live Match Normalized</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {currentSport.kpis.map((kpi, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border transition-all ${
                isLight
                  ? 'bg-white border-slate-200'
                  : 'bg-[#171f33] border-slate-800'
              }`}
            >
              <div className="text-[11px] font-telemetry text-slate-400 uppercase tracking-wider line-clamp-1">
                {kpi.label}
              </div>

              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="font-display font-black text-2xl text-slate-100 tracking-tight">
                  {kpi.value}
                </span>
                {kpi.unit && (
                  <span className="text-xs font-telemetry text-slate-400 font-normal">
                    {kpi.unit}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/20 text-[10px] font-telemetry">
                <span
                  className={`font-bold ${
                    kpi.deltaPositive ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {kpi.delta} vs prev
                </span>
                <span className="text-slate-400 truncate max-w-[90px]" title={kpi.benchmark}>
                  {kpi.benchmark}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column Responsive Desktop Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column (6 cols on lg): Target Exercises + Custom Performance Metrics */}
        <div className="lg:col-span-6 space-y-4">
          {/* DYNAMIC TARGET EXERCISES SECTION (Discipline Specific Conditioning & Movement Tracker) */}
          <div
        className={`p-4 rounded-2xl border transition-all ${
          isLight
            ? 'bg-white border-slate-200 shadow-sm'
            : 'bg-[#131b2e] border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm leading-none">
                Target Exercises ({currentSport.name})
              </h3>
              <span className="text-[10px] font-telemetry text-slate-400">
                Discipline-Specific Reps & Sets Conditioning
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-telemetry font-bold border transition-all ${
              showAddForm
                ? 'bg-slate-700 text-slate-200 border-slate-600'
                : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
            }`}
          >
            {showAddForm ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" /> Close
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" /> Add Exercise
              </>
            )}
          </button>
        </div>

        {/* Overall Completion Progress Bar */}
        <div className="mb-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-telemetry mb-1.5">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Discipline Volume Progress
            </span>
            <span className="text-emerald-400 font-bold">
              {totalSetsCompleted} / {totalSetsRequired} sets ({completionPercentage}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Add Custom Exercise Form (Collapsible) */}
        {showAddForm && (
          <form
            onSubmit={handleAddExerciseSubmit}
            className={`mb-4 p-3.5 rounded-xl border space-y-3 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#172036] border-slate-700/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-telemetry font-bold text-emerald-400 flex items-center gap-1.5">
                <PlusCircle className="w-3.5 h-3.5" /> New {currentSport.name} Drill
              </span>
              <span className="text-[10px] text-slate-400 font-telemetry">Auto-persisted</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-telemetry text-slate-400 uppercase mb-1">
                  Movement Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Explosive Rotational Cable Press"
                  value={newExName}
                  onChange={(e) => setNewExName(e.target.value)}
                  className={`w-full px-2.5 py-1.5 text-xs rounded-lg border font-body outline-none focus:border-emerald-500 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-100'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-telemetry text-slate-400 uppercase mb-1">
                  Biomechanical Focus Area
                </label>
                <input
                  type="text"
                  placeholder="e.g. Thoracic Rotation & Hip Drive"
                  value={newExFocus}
                  onChange={(e) => setNewExFocus(e.target.value)}
                  className={`w-full px-2.5 py-1.5 text-xs rounded-lg border font-body outline-none focus:border-emerald-500 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-100'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-telemetry text-slate-400 uppercase mb-1">
                  Target Sets
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={newExSets}
                  onChange={(e) => setNewExSets(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className={`w-full px-2.5 py-1.5 text-xs rounded-lg border font-telemetry outline-none focus:border-emerald-500 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-100'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-telemetry text-slate-400 uppercase mb-1">
                  Target Reps
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={newExReps}
                  onChange={(e) => setNewExReps(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className={`w-full px-2.5 py-1.5 text-xs rounded-lg border font-telemetry outline-none focus:border-emerald-500 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-100'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-telemetry text-slate-400 uppercase mb-1">
                  Rec. Load
                </label>
                <input
                  type="text"
                  placeholder="e.g. 25 kg Plate"
                  value={newExLoad}
                  onChange={(e) => setNewExLoad(e.target.value)}
                  className={`w-full px-2.5 py-1.5 text-xs rounded-lg border font-body outline-none focus:border-emerald-500 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-100'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-telemetry text-slate-400 uppercase mb-1">
                Technique Notes / Execution Cue
              </label>
              <input
                type="text"
                placeholder="e.g. Maintain locked pivot foot with full extension"
                value={newExNotes}
                onChange={(e) => setNewExNotes(e.target.value)}
                className={`w-full px-2.5 py-1.5 text-xs rounded-lg border font-body outline-none focus:border-emerald-500 ${
                  isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-100'
                }`}
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 text-xs font-telemetry text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-telemetry font-bold hover:bg-emerald-400 transition-all"
              >
                Save Movement
              </button>
            </div>
          </form>
        )}

        {/* Dynamic Exercise Cards List */}
        {activeExercises.length === 0 ? (
          <div className="py-8 text-center text-slate-400 font-telemetry text-xs">
            No target exercises defined for this discipline. Tap &quot;Add Exercise&quot; above to create one.
          </div>
        ) : (
          <div className="space-y-3">
            {activeExercises.map((exercise) => {
              const isAllDone = exercise.completedSets >= exercise.targetSets && exercise.targetSets > 0;
              return (
                <div
                  key={exercise.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isAllDone
                      ? isLight
                        ? 'bg-emerald-50/50 border-emerald-300'
                        : 'bg-emerald-950/20 border-emerald-500/40'
                      : isLight
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-[#151e33] border-slate-800'
                  }`}
                >
                  {/* Top Row: Title, Focus Area & Actions */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display font-bold text-sm text-slate-100">
                          {exercise.name}
                        </span>
                        {isAllDone && (
                          <span className="text-[10px] font-telemetry font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Target Complete
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-cyan-400 font-telemetry font-medium mt-0.5">
                        {exercise.focusArea}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {exercise.completedSets > 0 && (
                        <button
                          onClick={() => handleResetExercise(exercise.id)}
                          title="Reset completed sets"
                          className="p-1 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {exercise.id.includes('custom') && (
                        <button
                          onClick={() => handleDeleteExercise(exercise.id)}
                          title="Remove custom drill"
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Badges: Load & Execution Cue */}
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px] font-telemetry">
                    {exercise.recommendedLoad && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60">
                        Load: <strong className="text-emerald-400">{exercise.recommendedLoad}</strong>
                      </span>
                    )}
                    {exercise.notes && (
                      <span className="text-slate-400 italic line-clamp-1">
                        Cue: {exercise.notes}
                      </span>
                    )}
                  </div>

                  {/* Interactive Target Sets & Reps Stepper Controls */}
                  <div className="mt-3 pt-2.5 border-t border-slate-700/30 grid grid-cols-2 gap-3">
                    {/* Target Sets Adjuster */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-[10px] font-telemetry uppercase text-slate-400">
                        Target Sets
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAdjustTargetSets(exercise.id, -1)}
                          className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center active:scale-95 transition-all"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={exercise.targetSets}
                          onChange={(e) => handleDirectSetsChange(exercise.id, e.target.value)}
                          className="w-9 text-center font-telemetry font-bold text-xs bg-transparent text-emerald-400 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleAdjustTargetSets(exercise.id, 1)}
                          className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center active:scale-95 transition-all"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Target Reps Adjuster */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-[10px] font-telemetry uppercase text-slate-400">
                        Target Reps
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAdjustTargetReps(exercise.id, -1)}
                          className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center active:scale-95 transition-all"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="150"
                          value={exercise.targetReps}
                          onChange={(e) => handleDirectRepsChange(exercise.id, e.target.value)}
                          className="w-9 text-center font-telemetry font-bold text-xs bg-transparent text-cyan-400 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleAdjustTargetReps(exercise.id, 1)}
                          className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center active:scale-95 transition-all"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Set Tracker with Bubbles & Quick Complete Button */}
                  <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-telemetry text-slate-400 mr-1">
                        Track:
                      </span>
                      {Array.from({ length: exercise.targetSets }).map((_, sIdx) => {
                        const isDone = sIdx < exercise.completedSets;
                        return (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => handleToggleSet(exercise.id, sIdx)}
                            className={`w-7 h-7 rounded-lg text-[10px] font-telemetry font-bold transition-all flex items-center justify-center active:scale-90 ${
                              isDone
                                ? 'bg-emerald-500 text-slate-950 glow-kinetic-green border border-emerald-400'
                                : 'bg-slate-800/80 text-slate-400 border border-slate-700 hover:border-slate-500'
                            }`}
                            title={`Set ${sIdx + 1}: ${isDone ? 'Complete (Click to undo)' : 'Click to complete'}`}
                          >
                            {isDone ? `✓${sIdx + 1}` : sIdx + 1}
                          </button>
                        );
                      })}
                      <span className="text-[10px] font-telemetry text-slate-400 ml-1">
                        ({exercise.completedSets}/{exercise.targetSets} sets)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleQuickDecrementSet(exercise.id)}
                        disabled={exercise.completedSets === 0}
                        className="px-2 py-1 rounded-lg text-[10px] font-telemetry bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-all"
                      >
                        - Set
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickIncrementSet(exercise.id)}
                        disabled={exercise.completedSets >= exercise.targetSets}
                        className={`px-3 py-1 rounded-lg text-[10px] font-telemetry font-bold transition-all ${
                          exercise.completedSets >= exercise.targetSets
                            ? 'bg-slate-800 text-slate-500'
                            : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:scale-95'
                        }`}
                      >
                        {exercise.completedSets >= exercise.targetSets ? 'All Sets Logged' : '+ Log Set'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* NEW: CUSTOM PERFORMANCE METRICS SECTION (Multi-field input form + dynamic list) */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          isLight
            ? 'bg-white border-slate-200 shadow-sm'
            : 'bg-[#131b2e] border-slate-800'
        }`}
      >
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm leading-none">
                Custom Performance Metrics
              </h3>
              <span className="text-[10px] font-telemetry text-slate-400">
                Log speed, agility & endurance telemetry for {currentSport.name}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowMetricForm(!showMetricForm)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-telemetry font-bold border transition-all ${
              showMetricForm
                ? 'bg-slate-700 text-slate-200 border-slate-600'
                : 'bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25'
            }`}
          >
            {showMetricForm ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" /> Close Form
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" /> Log Metric
              </>
            )}
          </button>
        </div>

        {/* MULTI-FIELD INPUT FORM */}
        {showMetricForm && (
          <form
            onSubmit={handleAddMetricSubmit}
            className={`mb-4 p-3.5 rounded-xl border space-y-3 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#172036] border-slate-700/60'
            }`}
          >
            <div className="flex items-center justify-between pb-1 border-b border-slate-700/30">
              <span className="text-xs font-telemetry font-bold text-amber-400 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5" /> Log Telemetry: {currentSport.name}
              </span>
              <span className="text-[10px] text-slate-400 font-telemetry">
                Active Protocol Entry
              </span>
            </div>

            {/* Field 1: Metric Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-telemetry text-slate-400 uppercase mb-1">
                  Metric Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 40m Flying Sprint, T-Test Agility, VO2 Max"
                  value={metricName}
                  onChange={(e) => setMetricName(e.target.value)}
                  className={`w-full px-2.5 py-1.5 text-xs rounded-lg border font-body outline-none focus:border-amber-400 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-100'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-telemetry text-slate-400 uppercase mb-1">
                  Category *
                </label>
                <div className="grid grid-cols-5 gap-1">
                  {(['Speed', 'Agility', 'Endurance', 'Power', 'Reaction'] as MetricCategory[]).map((cat) => {
                    const isSelected = metricCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setMetricCategory(cat);
                          if (cat === 'Speed' && !['km/h', 'm/s', 'sec'].includes(metricUnit)) setMetricUnit('km/h');
                          if (cat === 'Agility' && !['sec', 'ms'].includes(metricUnit)) setMetricUnit('sec');
                          if (cat === 'Endurance' && !['meters', 'avg bpm', 'min'].includes(metricUnit)) setMetricUnit('meters');
                          if (cat === 'Power' && !['N', 'W', 'm', 'kg'].includes(metricUnit)) setMetricUnit('W');
                        }}
                        className={`py-1 text-[9px] font-telemetry font-bold rounded border transition-all text-center ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 border-amber-300'
                            : isLight
                            ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Field 2: Value & Unit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-telemetry text-slate-400 uppercase mb-1">
                  Recorded Value *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 144.2 or 3.82 or 2,400"
                  value={metricValue}
                  onChange={(e) => setMetricValue(e.target.value)}
                  className={`w-full px-2.5 py-1.5 text-xs rounded-lg border font-telemetry font-bold outline-none focus:border-amber-400 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-100'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-telemetry text-slate-400 uppercase mb-1">
                  Unit of Measure
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    required
                    placeholder="e.g. sec, km/h, m, N"
                    value={metricUnit}
                    onChange={(e) => setMetricUnit(e.target.value)}
                    className={`flex-1 px-2.5 py-1.5 text-xs rounded-lg border font-telemetry outline-none focus:border-amber-400 ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-100'
                    }`}
                  />
                  {/* Preset quick unit buttons */}
                  <div className="flex gap-1">
                    {['sec', 'km/h', 'm', 'N', 'W'].map((unit) => (
                      <button
                        key={unit}
                        type="button"
                        onClick={() => setMetricUnit(unit)}
                        className={`px-1.5 py-1 text-[9px] font-telemetry rounded border ${
                          metricUnit === unit
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Field 3: Performance Assessment Badge */}
            <div>
              <label className="block text-[10px] font-telemetry text-slate-400 uppercase mb-1">
                Performance Rating / Benchmark
              </label>
              <div className="grid grid-cols-5 gap-1">
                {(['Personal Best', 'Elite', 'Pro Benchmark', 'Optimal', 'Standard'] as const).map((rating) => {
                  const isSelected = metricRating === rating;
                  return (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setMetricRating(rating)}
                      className={`py-1 text-[9px] font-telemetry font-bold rounded border transition-all truncate px-1 text-center ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : isLight
                          ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                      title={rating}
                    >
                      {rating}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field 4: Testing Notes & Environmental Conditions */}
            <div>
              <label className="block text-[10px] font-telemetry text-slate-400 uppercase mb-1">
                Session Notes & Test Conditions
              </label>
              <input
                type="text"
                placeholder="e.g. Free-lap timing gates, low humidity, spike traction test"
                value={metricNotes}
                onChange={(e) => setMetricNotes(e.target.value)}
                className={`w-full px-2.5 py-1.5 text-xs rounded-lg border font-body outline-none focus:border-amber-400 ${
                  isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-100'
                }`}
              />
            </div>

            {/* Form Action Buttons */}
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowMetricForm(false)}
                className="px-3 py-1.5 text-xs font-telemetry text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-amber-400 text-slate-950 text-xs font-telemetry font-bold hover:bg-amber-300 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Save Performance Metric
              </button>
            </div>
          </form>
        )}

        {/* CATEGORY FILTER TABS FOR DYNAMIC LIST */}
        <div className="flex items-center justify-between mb-3 px-0.5">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin no-scrollbar">
            {(['All', 'Speed', 'Agility', 'Endurance', 'Power', 'Reaction'] as const).map((cat) => {
              const isSelected = metricCategoryFilter === cat;
              const count =
                cat === 'All'
                  ? activeSportMetrics.length
                  : activeSportMetrics.filter((m) => m.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setMetricCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-telemetry font-bold border transition-all flex items-center gap-1 shrink-0 ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-amber-300'
                      : isLight
                      ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[9px] px-1 rounded-full ${
                      isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* DYNAMIC LIST OF METRICS */}
        {filteredMetrics.length === 0 ? (
          <div className="py-6 text-center rounded-xl border border-dashed border-slate-700/60 p-4">
            <Gauge className="w-6 h-6 text-slate-500 mx-auto mb-1.5 opacity-60" />
            <p className="text-xs font-telemetry text-slate-300 font-bold">
              No {metricCategoryFilter !== 'All' ? metricCategoryFilter : ''} metrics recorded for {currentSport.name}
            </p>
            <p className="text-[11px] text-slate-400 font-body mt-0.5">
              Click &quot;Log Metric&quot; to register sprint speed, agility splits, or endurance records.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredMetrics.map((metric) => {
              return (
                <div
                  key={metric.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      : 'bg-[#151e33] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      {/* Metric Category & Benchmark Badge */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-[9px] font-telemetry font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 ${getCategoryBadgeClass(
                            metric.category
                          )}`}
                        >
                          {getCategoryIcon(metric.category)}
                          {metric.category}
                        </span>

                        <span className="text-[9px] font-telemetry font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {metric.ratingBadge}
                        </span>

                        <span className="text-[9px] font-telemetry text-slate-400 flex items-center gap-1 ml-auto">
                          <Clock className="w-2.5 h-2.5" />
                          {metric.dateRecorded}
                        </span>
                      </div>

                      {/* Metric Name */}
                      <h4 className="font-display font-bold text-sm text-slate-100 mt-1.5">
                        {metric.metricName}
                      </h4>

                      {/* Testing Notes */}
                      {metric.notes && (
                        <p className="text-[10px] text-slate-400 font-body italic mt-0.5 line-clamp-1">
                          {metric.notes}
                        </p>
                      )}
                    </div>

                    {/* Metric Value Display & Delete Action */}
                    <div className="flex flex-col items-end shrink-0 pl-2">
                      <div className="flex items-baseline gap-1">
                        <span className="font-display font-black text-xl text-amber-400 tracking-tight">
                          {metric.value}
                        </span>
                        <span className="text-[10px] font-telemetry text-slate-400 font-semibold">
                          {metric.unit}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteMetric(metric.id)}
                        title="Remove metric log"
                        className="mt-1 p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </div>
      </div>

      {/* Right Column (6 cols on lg): Biomechanical Radar & Scout Intelligence */}
      <div className="lg:col-span-6 space-y-4">
        {/* ATHLETE RADAR & SCOUTING SECTION */}
        <div
        className={`p-4 rounded-2xl border transition-all ${
          isLight
            ? 'bg-white border-slate-200 shadow-sm'
            : 'bg-[#131b2e] border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <h3 className="font-display font-bold text-sm">
              Biomechanical Radar Comparison
            </h3>
          </div>
          <span className="text-[10px] font-telemetry text-slate-400">
            5 Dimensions
          </span>
        </div>

        {/* Head-to-Head Athlete Selector Pills */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <button
            onClick={() => setRadarFocus('both')}
            className={`px-3 py-1 rounded-full text-xs font-telemetry transition-all ${
              radarFocus === 'both'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            Overlay Both
          </button>
          <button
            onClick={() => setRadarFocus('a')}
            className={`px-3 py-1 rounded-full text-xs font-telemetry transition-all ${
              radarFocus === 'a'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-emerald-400'
            }`}
          >
            {currentSport.athleteA.name}
          </button>
          <button
            onClick={() => setRadarFocus('b')}
            className={`px-3 py-1 rounded-full text-xs font-telemetry transition-all ${
              radarFocus === 'b'
                ? 'bg-cyan-400 text-slate-950 font-bold'
                : 'bg-slate-800 text-cyan-400'
            }`}
          >
            {currentSport.athleteB.name}
          </button>
        </div>

        {/* Head-to-Head Cards */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className={`p-2.5 rounded-xl border border-emerald-500/30 ${isLight ? 'bg-emerald-50/40' : 'bg-emerald-500/10'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-display font-bold text-emerald-400">
                {currentSport.athleteA.name}
              </span>
              <span className="text-[10px] font-telemetry font-bold px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950">
                {currentSport.athleteA.rating}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-telemetry mt-0.5">
              {currentSport.athleteA.team} • {currentSport.athleteA.role}
            </div>
          </div>

          <div className={`p-2.5 rounded-xl border border-cyan-500/30 ${isLight ? 'bg-cyan-50/40' : 'bg-cyan-500/10'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-display font-bold text-cyan-400">
                {currentSport.athleteB.name}
              </span>
              <span className="text-[10px] font-telemetry font-bold px-1.5 py-0.2 rounded bg-cyan-400 text-slate-950">
                {currentSport.athleteB.rating}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-telemetry mt-0.5">
              {currentSport.athleteB.team} • {currentSport.athleteB.role}
            </div>
          </div>
        </div>

        {/* RADAR SVG GRAPH */}
        <div className="py-2 flex justify-center">
          <RadarChart
            data={currentSport.radarDimensions}
            athlete1Name={currentSport.athleteA.name}
            athlete2Name={currentSport.athleteB.name}
            isLightMode={isLight}
            focusedAthlete={radarFocus}
          />
        </div>

        {/* Radar Dimension Detail List */}
        <div className="mt-4 pt-3 border-t border-slate-700/20 space-y-2">
          {currentSport.radarDimensions.map((dim, i) => (
            <div
              key={i}
              className={`p-2 rounded-xl text-xs flex items-center justify-between font-telemetry ${
                isLight ? 'bg-slate-50' : 'bg-[#0f172a]'
              }`}
            >
              <div>
                <span className="font-semibold text-slate-200">{dim.dimension}</span>
                <span className="text-[10px] text-slate-400 block">{dim.categoryDesc}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 font-bold">{dim.athlete1Val}</span>
                <span className="text-slate-500">|</span>
                <span className="text-cyan-400 font-bold">{dim.athlete2Val}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SCOUT INTELLIGENCE REPORT & VECTOR RELEASE METRICS */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          isLight
            ? 'bg-white border-slate-200'
            : 'bg-[#171f33] border-slate-800'
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h4 className="font-display font-bold text-sm">
            {currentSport.scoutIntelligence.title}
          </h4>
        </div>

        <p className={`text-xs leading-relaxed font-body mb-3 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
          {currentSport.scoutIntelligence.verdict}
        </p>

        <div className="grid grid-cols-3 gap-2 text-center">
          {currentSport.scoutIntelligence.vectorMetrics.map((vm, i) => (
            <div
              key={i}
              className={`p-2 rounded-xl border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0f172a] border-slate-800'
              }`}
            >
              <span className="text-[9px] uppercase font-telemetry text-slate-400 block truncate">
                {vm.name}
              </span>
              <strong className="font-display font-bold text-sm text-emerald-400">
                {vm.val}
              </strong>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  </div>
  );
};
