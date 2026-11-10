import React, { useState, useEffect } from 'react';
import {
  Dumbbell,
  Check,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Flame,
  Award,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Sliders,
  CheckCircle2,
  Target,
  Calendar,
  Zap,
  RotateCcw,
  Flag,
  Share2,
} from 'lucide-react';
import { AthleteUser, ExerciseItem, FitnessMicroGoal, GoalType, ThemeMode, WorkoutRoutine } from '../../types';
import { initialRoutine, bodyweightHistory } from '../../data/mockData';
import { initialMicroGoals } from '../../data/goalData';
import { WeightChart } from '../Charts/WeightChart';
import { GoalPlanningModal } from '../Modals/GoalPlanningModal';

interface FitnessScreenProps {
  athlete: AthleteUser;
  theme: ThemeMode;
}

const STORAGE_GOALS_KEY = 'fitsphere_micro_goals_v2';

export const FitnessScreen: React.FC<FitnessScreenProps> = ({
  athlete,
  theme,
}) => {
  const [routine, setRoutine] = useState<WorkoutRoutine>(initialRoutine);
  const [activeTab, setActiveTab] = useState<'routine' | 'goals' | 'history'>('routine');
  const [goalFilter, setGoalFilter] = useState<'all' | 'Lifting' | 'Endurance' | 'completed'>('all');

  // Goals State with Local Storage persistence
  const [microGoals, setMicroGoals] = useState<FitnessMicroGoal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_GOALS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore parse errors
    }
    return initialMicroGoals;
  });

  // Goal Modal State
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalModalCategory, setGoalModalCategory] = useState<GoalType>('Lifting');

  // Add Exercise Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExName, setNewExName] = useState('');
  const [newExCategory, setNewExCategory] = useState<'Legs' | 'Chest' | 'Back' | 'Core' | 'Cardio'>('Legs');
  const [newExSets, setNewExSets] = useState(3);
  const [newExReps, setNewExReps] = useState(10);
  const [newExWeight, setNewExWeight] = useState(60);

  const [sessionCompletedNotice, setSessionCompletedNotice] = useState(false);
  const [goalToast, setGoalToast] = useState<string | null>(null);

  const isLight = theme === 'daylight';

  // Sync goals to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_GOALS_KEY, JSON.stringify(microGoals));
    } catch {
      // Ignore
    }
  }, [microGoals]);

  // Toast feedback helper
  const triggerGoalToast = (msg: string) => {
    setGoalToast(msg);
    setTimeout(() => setGoalToast(null), 3000);
  };

  // Calculate goal progress percentage
  const calculateGoalPercentage = (goal: FitnessMicroGoal): number => {
    if (goal.completed) return 100;
    if (goal.startingValue === goal.targetValue) return 100;

    // Time/endurance: lower is better (e.g. 22 min -> 19.8 min)
    if (goal.targetValue < goal.startingValue) {
      if (goal.currentValue <= goal.targetValue) return 100;
      if (goal.currentValue >= goal.startingValue) return 0;
      const totalReduction = goal.startingValue - goal.targetValue;
      const achievedReduction = goal.startingValue - goal.currentValue;
      return Math.min(100, Math.max(0, Math.round((achievedReduction / totalReduction) * 100)));
    }

    // Weight lifting / volume: higher is better
    const totalGain = goal.targetValue - goal.startingValue;
    const currentGain = goal.currentValue - goal.startingValue;
    return Math.min(100, Math.max(0, Math.round((currentGain / totalGain) * 100)));
  };

  // Quick incremental logger on the goal card
  const handleAdjustGoalProgress = (goalId: string, step: number) => {
    setMicroGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;

        // Apply increment
        const nextVal = Math.round((g.currentValue + step) * 100) / 100;
        let isNowComplete = g.completed;

        // Auto-check if target reached
        if (g.targetValue >= g.startingValue && nextVal >= g.targetValue) {
          isNowComplete = true;
          triggerGoalToast(`🎉 PR Achieved: ${g.title}!`);
        } else if (g.targetValue < g.startingValue && nextVal <= g.targetValue) {
          isNowComplete = true;
          triggerGoalToast(`🎉 PR Achieved: ${g.title}!`);
        } else {
          triggerGoalToast(`Progress updated to ${nextVal} ${g.unit}!`);
        }

        const newLog = {
          date: new Date().toISOString().split('T')[0],
          value: nextVal,
          delta: step > 0 ? `+${step} ${g.unit}` : `${step} ${g.unit}`,
        };

        return {
          ...g,
          currentValue: nextVal,
          completed: isNowComplete,
          historyLogs: [newLog, ...(g.historyLogs || [])].slice(0, 5),
        };
      })
    );
  };

  // Toggle goal completion manually
  const handleToggleGoalCompletion = (goalId: string) => {
    setMicroGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const nextState = !g.completed;
        triggerGoalToast(nextState ? `Goal marked complete!` : `Goal reopened for training.`);
        return { ...g, completed: nextState };
      })
    );
  };

  // Delete goal
  const handleDeleteGoal = (goalId: string) => {
    setMicroGoals((prev) => prev.filter((g) => g.id !== goalId));
    triggerGoalToast('Micro-goal removed from tracker.');
  };

  // Save new goal from GoalPlanningModal
  const handleSaveNewGoal = (newGoal: FitnessMicroGoal) => {
    setMicroGoals((prev) => [newGoal, ...prev]);
    setActiveTab('goals');
    triggerGoalToast(`🎯 Micro-Goal locked in: ${newGoal.title}!`);
  };

  // Routine exercise operations
  const toggleExercise = (id: string) => {
    setRoutine((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === id ? { ...ex, completed: !ex.completed } : ex
      ),
    }));
  };

  const moveExercise = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= routine.exercises.length) return;

    const list = [...routine.exercises];
    const temp = list[index];
    list[index] = list[newIdx];
    list[newIdx] = temp;

    setRoutine((prev) => ({
      ...prev,
      exercises: list,
    }));
  };

  const adjustExerciseParam = (
    id: string,
    field: 'targetWeightKg' | 'targetReps',
    delta: number
  ) => {
    setRoutine((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => {
        if (ex.id !== id) return ex;
        const current = ex[field];
        const updated = Math.max(0, current + delta);
        return { ...ex, [field]: updated };
      }),
    }));
  };

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExName.trim()) return;

    const newEx: ExerciseItem = {
      id: `ex-${Date.now()}`,
      name: newExName,
      category: newExCategory,
      targetSets: newExSets,
      targetReps: newExReps,
      targetWeightKg: newExWeight,
      completed: false,
    };

    setRoutine((prev) => ({
      ...prev,
      exercises: [...prev.exercises, newEx],
    }));

    setNewExName('');
    setShowAddModal(false);
  };

  const handleFinishRoutine = () => {
    setSessionCompletedNotice(true);
    setTimeout(() => {
      setSessionCompletedNotice(false);
    }, 4000);
  };

  const completedCount = routine.exercises.filter((e) => e.completed).length;
  const totalCount = routine.exercises.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  // Goal metrics counts
  const totalGoals = microGoals.length;
  const activeGoals = microGoals.filter((g) => !g.completed);
  const completedGoalsCount = microGoals.filter((g) => g.completed).length;
  const liftingGoalsCount = microGoals.filter((g) => g.category === 'Lifting').length;
  const enduranceGoalsCount = microGoals.filter((g) => g.category === 'Endurance').length;
  const avgGoalProgress = totalGoals > 0
    ? Math.round(microGoals.reduce((sum, g) => sum + calculateGoalPercentage(g), 0) / totalGoals)
    : 0;

  // Filtered goals
  const filteredGoals = microGoals.filter((g) => {
    if (goalFilter === 'completed') return g.completed;
    if (goalFilter === 'Lifting') return g.category === 'Lifting' && !g.completed;
    if (goalFilter === 'Endurance') return g.category === 'Endurance' && !g.completed;
    return true; // 'all'
  });

  return (
    <div className="w-full max-w-6xl mx-auto pb-24 md:pb-8 pt-3 px-3 sm:px-6 space-y-4">
      {/* 1. Athlete PR Snapshot Benchmark Panel */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          isLight
            ? 'bg-white border-slate-200 shadow-sm'
            : 'bg-[#131b2e] border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <h3 className="font-display font-bold text-sm">Athlete PR Telemetry</h3>
          </div>
          <span className="text-[10px] font-telemetry px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
            Active Verified
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0f172a] border-slate-800'}`}>
            <span className="text-[10px] uppercase font-telemetry text-slate-400 block">Body Mass</span>
            <span className="font-display font-bold text-base text-slate-100">{athlete.bodyMassKg}</span>
            <span className="text-[9px] text-slate-400 block font-telemetry">kg (-1.8)</span>
          </div>

          <div className={`p-2.5 rounded-xl border border-emerald-500/30 ${isLight ? 'bg-emerald-50/50' : 'bg-emerald-500/10'}`}>
            <span className="text-[10px] uppercase font-telemetry text-emerald-400 block font-bold">1RM Squat</span>
            <span className="font-display font-bold text-base text-emerald-400">{athlete.squat1RmKg}</span>
            <span className="text-[9px] text-emerald-500 font-telemetry block font-bold">kg (+5 PR)</span>
          </div>

          <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0f172a] border-slate-800'}`}>
            <span className="text-[10px] uppercase font-telemetry text-slate-400 block">1RM Bench</span>
            <span className="font-display font-bold text-base text-cyan-400">{athlete.bench1RmKg}</span>
            <span className="text-[9px] text-slate-400 block font-telemetry">kg</span>
          </div>

          <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0f172a] border-slate-800'}`}>
            <span className="text-[10px] uppercase font-telemetry text-slate-400 block">1RM Deadlift</span>
            <span className="font-display font-bold text-base text-amber-400">{athlete.deadlift1RmKg}</span>
            <span className="text-[9px] text-slate-400 block font-telemetry">kg</span>
          </div>
        </div>

        {athlete.biography && (
          <div className="mt-2.5 pt-2 border-t border-slate-700/20 text-xs text-slate-400 font-body italic flex items-center gap-1.5">
            <span className="text-emerald-400 font-bold not-italic font-telemetry text-[10px] uppercase tracking-wider">Bio:</span>
            <span className="line-clamp-1">{athlete.biography}</span>
          </div>
        )}
      </div>

      {/* 2. Segmented Controller: Routine vs Micro-Goals vs Bodyweight */}
      <div
        className={`flex p-1 rounded-xl border ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#0f172a] border-slate-800'
        }`}
      >
        <button
          onClick={() => setActiveTab('routine')}
          className={`flex-1 py-1.5 text-xs font-telemetry font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'routine'
              ? isLight
                ? 'bg-white text-slate-900 shadow-xs'
                : 'bg-[#1e293b] text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Routine ({completedCount}/{totalCount})
        </button>

        <button
          onClick={() => setActiveTab('goals')}
          className={`flex-1 py-1.5 text-xs font-telemetry font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'goals'
              ? isLight
                ? 'bg-white text-slate-900 shadow-xs'
                : 'bg-[#1e293b] text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Target className="w-3.5 h-3.5 text-emerald-400" />
          <span>Micro-Goals ({activeGoals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-1.5 text-xs font-telemetry font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'history'
              ? isLight
                ? 'bg-white text-slate-900 shadow-xs'
                : 'bg-[#1e293b] text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Weight Sparkline
        </button>
      </div>

      {/* TAB 1: ROUTINE EDITOR */}
      {activeTab === 'routine' && (
        <div className="space-y-3">
          {/* Active Goals Pulse Ribbon inside Routine view */}
          <div
            className={`p-3 rounded-2xl border transition-all ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#10192e] border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <span className="font-display font-bold text-xs">Active Micro-Goals Pacing</span>
                <span className="text-[10px] font-telemetry px-1.5 py-0.2 rounded bg-cyan-500/15 text-cyan-400 font-bold">
                  {avgGoalProgress}% Avg
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setGoalModalCategory('Lifting');
                    setIsGoalModalOpen(true);
                  }}
                  className="text-[11px] font-telemetry text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Plan Goal</span>
                </button>
                <button
                  onClick={() => setActiveTab('goals')}
                  className="text-[11px] font-telemetry text-slate-400 hover:text-white flex items-center gap-0.5 cursor-pointer"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Quick mini-cards for top 2 active goals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeGoals.slice(0, 2).map((goal) => {
                const pct = calculateGoalPercentage(goal);
                return (
                  <div
                    key={goal.id}
                    onClick={() => setActiveTab('goals')}
                    className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-display font-bold text-slate-200 truncate max-w-[200px]">
                        {goal.title}
                      </span>
                      <span className="text-[10px] font-telemetry text-emerald-400 font-bold shrink-0">
                        {goal.currentValue}/{goal.targetValue} {goal.unit}
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Header of split */}
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="font-display font-bold text-base leading-tight">
                {routine.title}
              </h2>
              <div className="text-xs text-slate-400 font-telemetry">
                {routine.split} • {routine.sessionCadence}
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-telemetry font-semibold flex items-center gap-1 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Exercise</span>
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800/40 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Exercise list */}
          <div className="space-y-2.5">
            {routine.exercises.map((ex, index) => (
              <div
                key={ex.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  ex.completed
                    ? isLight
                      ? 'bg-emerald-50/40 border-emerald-200 opacity-90'
                      : 'bg-emerald-950/15 border-emerald-500/30'
                    : isLight
                    ? 'bg-white border-slate-200'
                    : 'bg-[#131b2e] border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    {/* Completion Checkbox */}
                    <button
                      type="button"
                      onClick={() => toggleExercise(ex.id)}
                      className={`w-6 h-6 mt-0.5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                        ex.completed
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950 glow-kinetic-green'
                          : isLight
                          ? 'border-slate-300 hover:border-emerald-500'
                          : 'border-slate-700 hover:border-emerald-500'
                      }`}
                    >
                      {ex.completed && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-display font-bold text-sm tracking-tight ${
                            ex.completed ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {ex.name}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-telemetry mt-0.5">
                        {ex.category} • {ex.targetSets} sets × {ex.targetReps} reps @ {ex.targetWeightKg} kg
                      </div>
                    </div>
                  </div>

                  {/* Reorder handles */}
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => moveExercise(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded text-slate-400 hover:text-slate-200 disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveExercise(index, 'down')}
                      disabled={index === routine.exercises.length - 1}
                      className="p-1 rounded text-slate-400 hover:text-slate-200 disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Adjuster steppers */}
                <div className="mt-3 pt-2.5 border-t border-slate-700/20 flex items-center justify-between text-xs font-telemetry">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 text-[10px]">Weight:</span>
                    <button
                      onClick={() => adjustExerciseParam(ex.id, 'targetWeightKg', -2.5)}
                      className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-bold text-emerald-400 min-w-8 text-center">
                      {ex.targetWeightKg} kg
                    </span>
                    <button
                      onClick={() => adjustExerciseParam(ex.id, 'targetWeightKg', 2.5)}
                      className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 text-[10px]">Reps:</span>
                    <button
                      onClick={() => adjustExerciseParam(ex.id, 'targetReps', -1)}
                      className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-bold text-cyan-400 min-w-7 text-center">
                      {ex.targetReps}
                    </span>
                    <button
                      onClick={() => adjustExerciseParam(ex.id, 'targetReps', 1)}
                      className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {ex.notes && (
                  <div className="mt-2 text-[10px] text-slate-400 font-telemetry italic bg-slate-900/40 px-2 py-1 rounded">
                    💡 {ex.notes}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Log Routine Complete Button */}
          <div className="pt-2">
            {sessionCompletedNotice ? (
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/60 text-emerald-300 text-center font-telemetry text-xs font-bold animate-bounce">
                🎉 Telemetry Logged! 18,420 kg volume saved to local vault.
              </div>
            ) : (
              <button
                onClick={handleFinishRoutine}
                className="w-full py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Log Session Complete ({progressPct}%)</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: GOAL PLANNING & PROGRESS TRACKING CARDS */}
      {activeTab === 'goals' && (
        <div className="space-y-4 animate-fade-in">
          {/* Header Strip with Action Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-lg leading-tight">
                  Micro-Goals &amp; Targets
                </h2>
                <span className="text-[10px] font-telemetry px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  {activeGoals.length} Active
                </span>
              </div>
              <p className="text-xs text-slate-400 font-telemetry mt-0.5">
                Precision targets for weight lifting loads and endurance speed milestones.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setGoalModalCategory('Lifting');
                  setIsGoalModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-telemetry font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer active:scale-95 glow-kinetic-green"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Plan New Goal</span>
              </button>
            </div>
          </div>

          {/* Performance Summary Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className={`p-3 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[#10192e] border-slate-800'}`}>
              <span className="text-[10px] font-telemetry uppercase text-slate-400 block font-bold">Active Goals</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-display font-black text-xl text-slate-100">{activeGoals.length}</span>
                <span className="text-[10px] text-slate-400 font-telemetry">of {totalGoals}</span>
              </div>
              <span className="text-[9px] text-emerald-400 font-telemetry block mt-0.5">Across 2 modalities</span>
            </div>

            <div className={`p-3 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[#10192e] border-slate-800'}`}>
              <span className="text-[10px] font-telemetry uppercase text-slate-400 block font-bold">Average Progress</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-display font-black text-xl text-emerald-400">{avgGoalProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all"
                  style={{ width: `${avgGoalProgress}%` }}
                />
              </div>
            </div>

            <div className={`p-3 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[#10192e] border-slate-800'}`}>
              <span className="text-[10px] font-telemetry uppercase text-slate-400 block font-bold">Completed PRs</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-display font-black text-xl text-amber-400">{completedGoalsCount}</span>
                <span className="text-[10px] text-amber-400/80 font-telemetry font-bold">Milestones Hit</span>
              </div>
              <span className="text-[9px] text-slate-400 font-telemetry block mt-0.5">Saved in local vault</span>
            </div>

            <div className={`p-3 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[#10192e] border-slate-800'}`}>
              <span className="text-[10px] font-telemetry uppercase text-slate-400 block font-bold">Modalities</span>
              <div className="flex items-center gap-2 mt-1 text-xs font-telemetry font-bold">
                <span className="text-emerald-400 flex items-center gap-1">
                  <Dumbbell className="w-3.5 h-3.5" /> {liftingGoalsCount} Lifting
                </span>
                <span className="text-cyan-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> {enduranceGoalsCount} Endur.
                </span>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            {[
              { id: 'all', label: `All Goals (${totalGoals})` },
              { id: 'Lifting', label: `🏋️ Weight Lifting (${liftingGoalsCount})` },
              { id: 'Endurance', label: `🏃 Endurance (${enduranceGoalsCount})` },
              { id: 'completed', label: `🏆 Completed (${completedGoalsCount})` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setGoalFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-telemetry font-bold border transition-all shrink-0 cursor-pointer ${
                  goalFilter === f.id
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-xs'
                    : isLight
                    ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Progress Tracking Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredGoals.map((goal) => {
              const pct = calculateGoalPercentage(goal);
              const isLifting = goal.category === 'Lifting';
              const stepDelta = isLifting ? 2.5 : 0.2;

              return (
                <div
                  key={goal.id}
                  className={`p-4 rounded-3xl border transition-all relative group ${
                    goal.completed
                      ? isLight
                        ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                        : 'bg-gradient-to-br from-emerald-950/20 to-[#10192e] border-emerald-500/40 shadow-emerald-950/20'
                      : isLight
                      ? 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
                      : 'bg-[#10192e] border-slate-800 hover:border-slate-700/80'
                  }`}
                >
                  {/* Card Header: Category Badge + Status + Actions */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-2 rounded-xl text-xs font-bold border ${
                          isLifting
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                        }`}
                      >
                        {isLifting ? <Dumbbell className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-display font-extrabold text-sm sm:text-base text-slate-100">
                            {goal.title}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-telemetry">
                          {goal.discipline} • <span className="text-slate-300">{goal.cyclePhase}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Pill & Delete Button */}
                    <div className="flex items-center gap-1 shrink-0">
                      {goal.completed ? (
                        <span className="text-[9px] font-telemetry px-2 py-0.5 rounded-full font-bold bg-emerald-500 text-slate-950 flex items-center gap-0.5 shadow-xs">
                          <CheckCircle2 className="w-3 h-3 stroke-[3]" /> PR Achieved
                        </span>
                      ) : pct >= 80 ? (
                        <span className="text-[9px] font-telemetry px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-0.5">
                          <Zap className="w-3 h-3 fill-amber-400" /> Near Target
                        </span>
                      ) : (
                        <span className="text-[9px] font-telemetry px-2 py-0.5 rounded-full font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                          In Progress
                        </span>
                      )}

                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        title="Delete Goal"
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Quantitative Telemetry Row */}
                  <div className="my-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs font-telemetry">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Starting</span>
                      <strong className="text-slate-300 text-sm">
                        {goal.startingValue} <span className="text-[10px] font-normal">{goal.unit}</span>
                      </strong>
                    </div>

                    <div className="text-center">
                      <span className="text-[10px] text-emerald-400 uppercase block font-bold">Current Metric</span>
                      <strong className="text-emerald-400 text-base font-black">
                        {goal.currentValue} <span className="text-[10px] font-normal">{goal.unit}</span>
                      </strong>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-cyan-400 uppercase block font-semibold">Goal Target</span>
                      <strong className="text-cyan-400 text-sm">
                        {goal.targetValue} <span className="text-[10px] font-normal">{goal.unit}</span>
                      </strong>
                    </div>
                  </div>

                  {/* High-Precision Progress Bar */}
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center justify-between text-[11px] font-telemetry">
                      <span className="font-bold text-slate-200">{pct}% Achieved</span>
                      <span className="text-slate-400">
                        {goal.completed
                          ? 'Target surpassed! 🚀'
                          : isLifting
                          ? `Remaining: ${(goal.targetValue - goal.currentValue).toFixed(1)} ${goal.unit}`
                          : `Delta: ${(goal.currentValue - goal.targetValue).toFixed(1)} ${goal.unit} to cut`}
                      </span>
                    </div>

                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          goal.completed
                            ? 'bg-emerald-400'
                            : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Quick-Log Stepper Buttons & Completion Toggle */}
                  <div className="pt-2 border-t border-slate-700/25 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-telemetry">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Quick Log:</span>
                      <button
                        onClick={() => handleAdjustGoalProgress(goal.id, -stepDelta)}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold border border-slate-700 cursor-pointer text-xs"
                      >
                        -{stepDelta}
                      </button>
                      <button
                        onClick={() => handleAdjustGoalProgress(goal.id, stepDelta)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold border border-emerald-500/40 cursor-pointer text-xs flex items-center gap-1"
                      >
                        <span>+{stepDelta}</span>
                        <span className="text-[9px]">{goal.unit}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleToggleGoalCompletion(goal.id)}
                      className={`px-3 py-1 rounded-xl text-[10px] font-telemetry font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                        goal.completed
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : isLight
                          ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border-slate-700'
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[2.5]" />
                      <span>{goal.completed ? 'Reopen Goal' : 'Mark Achieved'}</span>
                    </button>
                  </div>

                  {/* Biomechanical Cues / Notes */}
                  {goal.notes && (
                    <div className="mt-2.5 text-[10px] text-slate-400 font-telemetry italic bg-slate-900/50 p-2 rounded-xl border border-slate-800/60 flex items-start gap-1.5">
                      <span className="text-emerald-400 not-italic font-bold">💡 Strategy:</span>
                      <span>{goal.notes}</span>
                    </div>
                  )}

                  {/* Target Deadline Ribbon */}
                  <div className="mt-2 pt-1.5 flex items-center justify-between text-[10px] font-telemetry text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" /> Pacing: {goal.weeklyIncrement || 'Active'}
                    </span>
                    {goal.targetDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" /> Target: {goal.targetDate}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredGoals.length === 0 && (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-3xl p-6">
              <Target className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <h4 className="font-display font-bold text-sm text-slate-300">No micro-goals in this category</h4>
              <p className="text-xs text-slate-500 font-telemetry mt-1 mb-3">
                Ready to engineer your next lifting PR or endurance milestone?
              </p>
              <button
                onClick={() => {
                  setGoalModalCategory(goalFilter === 'Endurance' ? 'Endurance' : 'Lifting');
                  setIsGoalModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-telemetry font-bold text-xs"
              >
                + Plan New Micro-Goal
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BODYWEIGHT PROGRESSION SPARKLINE */}
      {activeTab === 'history' && (
        <div
          className={`p-4 rounded-2xl border space-y-3 ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#131b2e] border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-sm leading-tight">
                Bodyweight Progression
              </h2>
              <div className="text-xs text-slate-400 font-telemetry">
                On-device telemetry recorded via smart scale
              </div>
            </div>
            <span className="text-[10px] font-telemetry font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
              -1.8 kg / 4 wks
            </span>
          </div>

          <WeightChart data={bodyweightHistory} isLightMode={isLight} />

          <div className="pt-2 border-t border-slate-700/20 grid grid-cols-3 gap-2 text-center text-xs font-telemetry">
            <div>
              <span className="text-slate-400 block text-[10px]">Starting</span>
              <strong className="text-slate-200">80.2 kg</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Current</span>
              <strong className="text-emerald-400">78.4 kg</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Target Goal</span>
              <strong className="text-cyan-400">77.0 kg</strong>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Exercise Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div
            className={`w-full max-w-sm rounded-2xl border p-5 shadow-2xl ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#111827] border-slate-800 text-slate-100'
            }`}
          >
            <h3 className="font-display font-bold text-base mb-3">Add Custom Movement</h3>
            <form onSubmit={handleAddExercise} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-telemetry block mb-1">Exercise Name</label>
                <input
                  type="text"
                  value={newExName}
                  onChange={(e) => setNewExName(e.target.value)}
                  placeholder="e.g. Front Squat, Pull-ups"
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-sm font-body text-slate-100 outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-telemetry block mb-1">Category</label>
                <select
                  value={newExCategory}
                  onChange={(e) => setNewExCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-sm font-body text-slate-100 outline-hidden"
                >
                  <option value="Legs">Legs</option>
                  <option value="Chest">Chest</option>
                  <option value="Back">Back</option>
                  <option value="Core">Core</option>
                  <option value="Cardio">Cardio</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-telemetry block mb-1">Sets</label>
                  <input
                    type="number"
                    value={newExSets}
                    onChange={(e) => setNewExSets(Number(e.target.value))}
                    min={1}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-sm font-telemetry text-slate-100 text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-telemetry block mb-1">Reps</label>
                  <input
                    type="number"
                    value={newExReps}
                    onChange={(e) => setNewExReps(Number(e.target.value))}
                    min={1}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-sm font-telemetry text-slate-100 text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-telemetry block mb-1">Kg</label>
                  <input
                    type="number"
                    value={newExWeight}
                    onChange={(e) => setNewExWeight(Number(e.target.value))}
                    min={0}
                    step={2.5}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-sm font-telemetry text-slate-100 text-center"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-700 text-xs font-telemetry text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-500 text-slate-950 font-telemetry font-bold text-xs cursor-pointer"
                >
                  Save Exercise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Goal Planning Modal */}
      <GoalPlanningModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSaveGoal={handleSaveNewGoal}
        theme={theme}
        initialCategory={goalModalCategory}
      />

      {/* Floating Goal Feedback Toast */}
      {goalToast && (
        <div className="fixed bottom-20 md:bottom-8 right-4 sm:right-8 z-50 px-4 py-2.5 rounded-2xl bg-emerald-500 text-slate-950 text-xs font-telemetry font-bold shadow-xl shadow-emerald-500/30 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 stroke-[2.5]" />
          <span>{goalToast}</span>
        </div>
      )}
    </div>
  );
};
