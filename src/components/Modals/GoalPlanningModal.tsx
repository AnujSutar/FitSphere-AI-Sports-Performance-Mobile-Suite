import React, { useState } from 'react';
import {
  X,
  Dumbbell,
  Flame,
  Zap,
  Target,
  Calendar,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Sliders,
  Award,
  Clock,
  HeartPulse,
} from 'lucide-react';
import { FitnessMicroGoal, GoalType, ThemeMode } from '../../types';
import { GOAL_PRESETS, GoalPreset } from '../../data/goalData';

interface GoalPlanningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveGoal: (goal: FitnessMicroGoal) => void;
  theme: ThemeMode;
  initialCategory?: GoalType;
}

export const GoalPlanningModal: React.FC<GoalPlanningModalProps> = ({
  isOpen,
  onClose,
  onSaveGoal,
  theme,
  initialCategory = 'Lifting',
}) => {
  const [category, setCategory] = useState<GoalType>(initialCategory);
  const [title, setTitle] = useState('');
  const [discipline, setDiscipline] = useState('');
  const [startingValue, setStartingValue] = useState<number>(155);
  const [currentValue, setCurrentValue] = useState<number>(155);
  const [targetValue, setTargetValue] = useState<number>(160);
  const [unit, setUnit] = useState('kg');
  const [cyclePhase, setCyclePhase] = useState('4-Week Microcycle');
  const [weeklyIncrement, setWeeklyIncrement] = useState('+2.5 kg / week');
  const [targetDate, setTargetDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 28);
    return d.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('');

  const isLight = theme === 'daylight';

  if (!isOpen) return null;

  // Apply a preset to prefill fields
  const applyPreset = (preset: GoalPreset) => {
    setTitle(preset.title);
    setCategory(preset.category);
    setDiscipline(preset.discipline);
    setStartingValue(preset.defaultStarting);
    setCurrentValue(preset.defaultStarting);
    setTargetValue(preset.defaultTarget);
    setUnit(preset.unit);
    setCyclePhase(preset.cyclePhase);
    setWeeklyIncrement(preset.weeklyIncrement);
    setNotes(preset.notes);
  };

  // Quick switch between Lifting and Endurance
  const handleCategorySwitch = (newCat: GoalType) => {
    setCategory(newCat);
    if (newCat === 'Lifting') {
      setTitle('Squat 1RM +5kg PR Wave');
      setDiscipline('Barbell Back Squat');
      setStartingValue(155);
      setCurrentValue(155);
      setTargetValue(160);
      setUnit('kg');
      setCyclePhase('Cycle 3 Wave Peak');
      setWeeklyIncrement('+2.5 kg / week');
      setNotes('360° intra-abdominal bracing, drive out of the hole with external hip torque.');
    } else {
      setTitle('5,000m Tempo Run Sub-20 Min');
      setDiscipline('5,000m Road Running');
      setStartingValue(22.0);
      setCurrentValue(22.0);
      setTargetValue(19.8);
      setUnit('min');
      setCyclePhase('Lactate Threshold Block');
      setWeeklyIncrement('-20 sec / week');
      setNotes('Maintain 3:58/km pace, 178-180 spm stride rate with controlled nasal breathing.');
    }
  };

  // Calculate percentage toward target
  const calculateProgress = (): number => {
    if (startingValue === targetValue) return 100;
    // If target is lower than starting (e.g. running time 22min -> 20min)
    if (targetValue < startingValue) {
      if (currentValue <= targetValue) return 100;
      if (currentValue >= startingValue) return 0;
      const totalReduction = startingValue - targetValue;
      const achievedReduction = startingValue - currentValue;
      return Math.min(100, Math.max(0, Math.round((achievedReduction / totalReduction) * 100)));
    }
    // Normal higher is better (e.g. weight lifting 155kg -> 160kg)
    const totalGain = targetValue - startingValue;
    const currentGain = currentValue - startingValue;
    return Math.min(100, Math.max(0, Math.round((currentGain / totalGain) * 100)));
  };

  const previewProgress = calculateProgress();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newGoal: FitnessMicroGoal = {
      id: `goal-${Date.now()}`,
      title: title.trim(),
      category,
      discipline: discipline.trim() || (category === 'Lifting' ? 'Barbell Strength' : 'Endurance Conditioning'),
      startingValue: Number(startingValue),
      currentValue: Number(currentValue),
      targetValue: Number(targetValue),
      unit: unit.trim(),
      cyclePhase: cyclePhase.trim() || 'Active Microcycle',
      targetDate,
      weeklyIncrement: weeklyIncrement.trim() || (category === 'Lifting' ? '+2.5 kg / week' : '-15s / week'),
      notes: notes.trim(),
      completed: false,
      createdAt: new Date().toISOString().split('T')[0],
      historyLogs: [
        {
          date: new Date().toISOString().split('T')[0],
          value: Number(currentValue),
          delta: 'Goal Established',
        },
      ],
    };

    onSaveGoal(newGoal);
    onClose();
  };

  const activePresets = GOAL_PRESETS.filter((p) => p.category === category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div
        className={`w-full max-w-xl rounded-3xl border shadow-2xl transition-all my-auto overflow-hidden animate-scale-up ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900'
            : 'bg-[#10192e] border-slate-700/80 text-slate-100 shadow-emerald-950/20'
        }`}
      >
        {/* Header Strip */}
        <div className="p-4 sm:p-5 border-b border-slate-700/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Target className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-base sm:text-lg tracking-tight">
                  Goal Planning Vault
                </h3>
                <span className="text-[10px] font-telemetry px-2 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Micro-Targets
                </span>
              </div>
              <p className="text-xs text-slate-400 font-telemetry mt-0.5">
                Engineer periodized micro-goals for weight lifting or endurance capacity.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[calc(90vh-130px)] overflow-y-auto scrollbar-thin">
          {/* 1. Category Switcher: Lifting vs Endurance */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-telemetry uppercase tracking-wider text-slate-400 font-bold block">
              Discipline Modality:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleCategorySwitch('Lifting')}
                className={`py-2.5 px-3 rounded-2xl border text-xs font-telemetry font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  category === 'Lifting'
                    ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-500/30 border-emerald-400 text-emerald-300 shadow-xs'
                    : isLight
                    ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Dumbbell className="w-4 h-4 text-emerald-400" />
                <span>Weight Lifting / Strength</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategorySwitch('Endurance')}
                className={`py-2.5 px-3 rounded-2xl border text-xs font-telemetry font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  category === 'Endurance'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-cyan-500/30 border-cyan-400 text-cyan-300 shadow-xs'
                    : isLight
                    ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Flame className="w-4 h-4 text-cyan-400" />
                <span>Endurance &amp; Stamina</span>
              </button>
            </div>
          </div>

          {/* 2. Quick Presets Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-telemetry text-slate-400">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                One-Click Athletic Presets:
              </span>
              <span className="text-[10px] text-slate-500">Tap to autofill</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {activePresets.map((preset, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className={`shrink-0 px-2.5 py-1.5 rounded-xl border text-[11px] font-telemetry transition-all cursor-pointer ${
                    title === preset.title
                      ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                      : isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  ⚡ {preset.title}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Goal Title & Specific Discipline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-telemetry uppercase text-slate-400 font-bold block mb-1">
                Goal Milestone Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={category === 'Lifting' ? 'e.g., Squat 160kg Wave Peak' : 'e.g., 5K Sub-20 Minutes'}
                className={`w-full px-3 py-2.5 rounded-xl border text-xs font-body outline-hidden transition-all ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                    : 'bg-slate-900 border-slate-700 text-slate-100 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20'
                }`}
              />
            </div>

            <div>
              <label className="text-[11px] font-telemetry uppercase text-slate-400 font-bold block mb-1">
                Movement / Exercise
              </label>
              <input
                type="text"
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                placeholder={category === 'Lifting' ? 'e.g., Barbell Back Squat' : 'e.g., 5,000m Road Running'}
                className={`w-full px-3 py-2.5 rounded-xl border text-xs font-body outline-hidden transition-all ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                    : 'bg-slate-900 border-slate-700 text-slate-100 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20'
                }`}
              />
            </div>
          </div>

          {/* 4. Metric Configuration: Start, Current, Target, Unit */}
          <div className="p-3.5 rounded-2xl border border-slate-700/40 bg-slate-950/40 space-y-3">
            <span className="text-[10px] font-telemetry uppercase tracking-wider text-emerald-400 font-bold block">
              Quantitative Telemetry Parameters
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="text-[10px] font-telemetry text-slate-400 block mb-1">Starting Metric</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={startingValue}
                  onChange={(e) => setStartingValue(parseFloat(e.target.value) || 0)}
                  className={`w-full px-2.5 py-2 rounded-lg border text-xs font-telemetry font-bold outline-hidden ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="text-[10px] font-telemetry text-slate-400 block mb-1">Current Metric</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={currentValue}
                  onChange={(e) => setCurrentValue(parseFloat(e.target.value) || 0)}
                  className={`w-full px-2.5 py-2 rounded-lg border text-xs font-telemetry font-bold outline-hidden ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-emerald-400'
                  }`}
                />
              </div>

              <div>
                <label className="text-[10px] font-telemetry text-slate-400 block mb-1">Target Goal Metric</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={targetValue}
                  onChange={(e) => setTargetValue(parseFloat(e.target.value) || 0)}
                  className={`w-full px-2.5 py-2 rounded-lg border text-xs font-telemetry font-bold outline-hidden ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-cyan-400'
                  }`}
                />
              </div>

              <div>
                <label className="text-[10px] font-telemetry text-slate-400 block mb-1">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className={`w-full px-2 py-2 rounded-lg border text-xs font-telemetry font-bold outline-hidden cursor-pointer ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-200'
                  }`}
                >
                  <option value="kg">kg (weight)</option>
                  <option value="lbs">lbs (weight)</option>
                  <option value="min">min (time)</option>
                  <option value="sec">sec (sprints)</option>
                  <option value="reps">reps (volume)</option>
                  <option value="km">km (distance)</option>
                  <option value="bpm">bpm (heart rate)</option>
                  <option value="watts">watts (power)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 5. Periodization Timeline & Increments */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="text-[10px] font-telemetry text-slate-400 uppercase font-bold block mb-1">
                Cycle Phase / Block
              </label>
              <input
                type="text"
                value={cyclePhase}
                onChange={(e) => setCyclePhase(e.target.value)}
                placeholder="e.g. 4-Week Wave Peak"
                className={`w-full px-3 py-2 rounded-xl border text-xs font-body outline-hidden ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="text-[10px] font-telemetry text-slate-400 uppercase font-bold block mb-1">
                Weekly Micro-Pacing
              </label>
              <input
                type="text"
                value={weeklyIncrement}
                onChange={(e) => setWeeklyIncrement(e.target.value)}
                placeholder="e.g. +2.5 kg / week"
                className={`w-full px-3 py-2 rounded-xl border text-xs font-body outline-hidden ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="text-[10px] font-telemetry text-slate-400 uppercase font-bold block mb-1">
                Target Deadline
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs font-telemetry outline-hidden cursor-pointer ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-200'
                }`}
              />
            </div>
          </div>

          {/* 6. Strategic Notes */}
          <div>
            <label className="text-[10px] font-telemetry text-slate-400 uppercase font-bold block mb-1">
              Biomechanical Cues &amp; Strategy
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 360° abdominal wall expansion, external hip rotation at the hole"
              className={`w-full px-3 py-2 rounded-xl border text-xs font-body outline-hidden ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-200'
              }`}
            />
          </div>

          {/* 7. Live Preview Card */}
          <div className="pt-2 border-t border-slate-700/30">
            <span className="text-[10px] font-telemetry uppercase text-slate-400 font-bold block mb-1.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-cyan-400" />
              Live Card Preview (Fitness Screen):
            </span>

            <div
              className={`p-3.5 rounded-2xl border transition-all ${
                isLight ? 'bg-slate-50 border-slate-300' : 'bg-[#141f36] border-slate-700/80'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`p-1 rounded-lg text-xs font-bold ${
                      category === 'Lifting' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'
                    }`}
                  >
                    {category === 'Lifting' ? <Dumbbell className="w-3.5 h-3.5" /> : <Flame className="w-3.5 h-3.5" />}
                  </span>
                  <span className="font-display font-bold text-xs sm:text-sm text-slate-100">
                    {title || 'Untitled Micro-Goal'}
                  </span>
                </div>

                <span
                  className={`text-[9px] font-telemetry px-2 py-0.5 rounded font-bold ${
                    category === 'Lifting'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  }`}
                >
                  {category}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] font-telemetry text-slate-400 mb-2">
                <span>
                  Start: <strong className="text-slate-300">{startingValue} {unit}</strong>
                </span>
                <span>
                  Current: <strong className="text-emerald-400">{currentValue} {unit}</strong>
                </span>
                <span>
                  Target: <strong className="text-cyan-400">{targetValue} {unit}</strong>
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800 mb-1.5">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${previewProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-telemetry text-slate-400">
                <span className="font-bold text-emerald-400">{previewProgress}% Completed</span>
                <span>Phase: {cyclePhase}</span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2.5 rounded-xl text-xs font-telemetry font-bold border transition-colors cursor-pointer ${
                isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-telemetry font-bold hover:bg-emerald-400 transition-all flex items-center gap-1.5 active:scale-95 glow-kinetic-green cursor-pointer shadow-md shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>Lock In Micro-Goal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
