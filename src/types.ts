export type ScreenType =
  | 'onboarding'
  | 'dashboard'
  | 'fitness'
  | 'sports'
  | 'coach'
  | 'marketplace'
  | 'settings';

export type ThemeMode = 'obsidian' | 'daylight' | 'outdoor';

export type DisplayScale = 'standard' | 'large' | 'xlarge';

export interface AthleteUser {
  id: string;
  name: string;
  email: string;
  athleteHandle: string;
  avatar: string;
  tier: 'Elite Pro' | 'Amateur' | 'Collegiate';
  age: number;
  heightCm: number;
  bodyMassKg: number;
  squat1RmKg: number;
  bench1RmKg: number;
  deadlift1RmKg: number;
  experience: 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite Pro';
  fitnessGoal: string;
  availableEquipment: string;
  workoutDaysPerWeek: number;
  preferredDurationMin: number;
  appLayoutPreference?: 'desktop' | 'mobile';
  fontScalePercent?: number;
  streakDays: number;
  caloriesBurnedToday: number;
  caloriesTargetToday: number;
  repsCountToday: number;
  repsTargetToday: number;
  activeMinutesToday: number;
  activeMinutesTargetToday: number;
  localEncryptedId: string;
  biography?: string;
  trainingHistory?: CompletedWorkoutSession[];
  nationality?: string;
  preferredCurrency?: string;
}

export interface CompletedWorkoutSession {
  id: string;
  title: string;
  discipline: string;
  dateCompleted: string;
  durationMin: number;
  caloriesBurned: number;
  totalReps: number;
  volumeKg?: number;
  avgHeartRate?: number;
  prBadge?: string | null;
  formAccuracy?: string;
  intensity: 'Peak' | 'High' | 'Moderate' | 'Recovery';
}

export interface SportExercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  targetMuscle: string;
  purpose: string;
  completedSets: number;
}

export interface ExerciseItem {
  id: string;
  name: string;
  category: 'Legs' | 'Chest' | 'Back' | 'Core' | 'Cardio';
  targetSets: number;
  targetReps: number;
  targetWeightKg: number;
  completed: boolean;
  actualReps?: number;
  actualWeightKg?: number;
  notes?: string;
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  split: string;
  sessionCadence: string;
  completedSessions: number;
  totalSessions: number;
  exercises: ExerciseItem[];
}

export type GoalType = 'Lifting' | 'Endurance';

export interface FitnessMicroGoal {
  id: string;
  title: string;
  category: 'Lifting' | 'Endurance';
  discipline: string;
  startingValue: number;
  currentValue: number;
  targetValue: number;
  unit: string;
  cyclePhase: string;
  targetDate?: string;
  weeklyIncrement?: string;
  notes?: string;
  completed: boolean;
  createdAt: string;
  historyLogs?: Array<{ date: string; value: number; delta: string }>;
}

export interface TargetMilestone {
  id: string;
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  cyclePhase: string;
  category: 'Strength' | 'Endurance' | 'Mobility';
}

export interface BodyweightRecord {
  label: string;
  weightKg: number;
}

export interface SportKPI {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  deltaPositive?: boolean;
  benchmark: string;
}

export interface AthleteRadarData {
  dimension: string;
  athlete1Val: number; // 0-100
  athlete2Val: number; // 0-100
  categoryDesc: string;
}

export interface SportTargetExercise {
  id: string;
  name: string;
  focusArea: string;
  targetSets: number;
  targetReps: number;
  completedSets: number;
  recommendedLoad?: string;
  notes?: string;
}

export type MetricCategory = 'Speed' | 'Agility' | 'Endurance' | 'Power' | 'Reaction';

export interface CustomSportMetric {
  id: string;
  sportId: string;
  metricName: string;
  category: MetricCategory;
  value: string;
  unit: string;
  ratingBadge: 'Elite' | 'Pro Benchmark' | 'Personal Best' | 'Optimal' | 'Standard';
  dateRecorded: string;
  notes?: string;
}

export interface SportProfile {
  id: string;
  name: string;
  iconName: string;
  tagline: string;
  athleteA: {
    name: string;
    team: string;
    role: string;
    rating: number;
  };
  athleteB: {
    name: string;
    team: string;
    role: string;
    rating: number;
  };
  kpis: SportKPI[];
  radarDimensions: AthleteRadarData[];
  targetExercises?: SportTargetExercise[];
  scoutIntelligence: {
    title: string;
    verdict: string;
    vectorMetrics: { name: string; val: string }[];
  };
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  brand: string;
  category: 'Protein & Nutrition' | 'Gym Equipment' | 'Recovery' | 'Snacks' | 'Apparel & Footwear' | 'Accessories';
  priceUsd: number;
  rating: number;
  reviewsCount: number;
  image: string;
  badge?: string;
  inStock: boolean;
  specs: string;
  sellerName?: string;
  isSellerProduct?: boolean;
  createdAt?: string;
}

export interface CartItem {
  product: MarketplaceProduct;
  quantity: number;
}
