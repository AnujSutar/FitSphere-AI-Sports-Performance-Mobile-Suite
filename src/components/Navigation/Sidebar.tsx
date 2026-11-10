import React from 'react';
import {
  Activity,
  Dumbbell,
  Trophy,
  ShoppingBag,
  Sliders,
  UserCheck,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Smartphone,
  Maximize2,
  ShieldCheck,
  Camera,
  X,
  Flame,
  Plus,
  Zap,
} from 'lucide-react';
import { AthleteUser, ScreenType, ThemeMode } from '../../types';

interface SidebarProps {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
  athlete: AthleteUser;
  theme: ThemeMode;
  onToggleTheme: () => void;
  isDeviceFrame: boolean;
  onToggleDeviceFrame: () => void;
  cartCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenAvatarPicker: () => void;
  onQuickLog?: () => void;
}

export const screenNavItems: {
  id: ScreenType;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  badge?: string;
  description: string;
}[] = [
  {
    id: 'dashboard',
    label: 'Overview Dashboard',
    shortLabel: 'Overview',
    icon: Activity,
    description: 'Telemetry, D3 chart & training history',
  },
  {
    id: 'sports',
    label: 'Sports Workspace',
    shortLabel: 'Sports',
    icon: Trophy,
    badge: '10 Sports',
    description: 'Multi-discipline radar & metrics logger',
  },
  {
    id: 'fitness',
    label: 'Fitness & Routines',
    shortLabel: 'Fitness',
    icon: Dumbbell,
    description: 'PR telemetry, routine editor & micro-goals',
  },
  {
    id: 'coach',
    label: 'FitSphere AI Coach',
    shortLabel: 'AI Coach',
    icon: Sparkles,
    badge: 'Gemini',
    description: 'Sports science & search grounding',
  },
  {
    id: 'marketplace',
    label: 'Gear & Nutrition',
    shortLabel: 'Store',
    icon: ShoppingBag,
    description: 'Pro athlete equipment & supplements',
  },
  {
    id: 'settings',
    label: 'Settings & Identity',
    shortLabel: 'Settings',
    icon: Sliders,
    description: 'Profile, avatar gallery & currency',
  },
  {
    id: 'onboarding',
    label: 'Sign In & Vault',
    shortLabel: 'Vault',
    icon: UserCheck,
    description: 'Local-first AES-256 credentials',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onSelectScreen,
  athlete,
  theme,
  onToggleTheme,
  isDeviceFrame,
  onToggleDeviceFrame,
  cartCount,
  isCollapsed,
  onToggleCollapse,
  isOpenMobile,
  onCloseMobile,
  onOpenAvatarPicker,
  onQuickLog,
}) => {
  const isLight = theme === 'daylight';

  // Common inner sidebar content (shared between desktop sidebar and mobile drawer)
  const renderSidebarContent = (isMobileView = false) => {
    const collapsed = isMobileView ? false : isCollapsed;

    return (
      <div className="flex flex-col h-full select-none justify-between overflow-hidden">
        {/* TOP SECTION: Brand Header & Persistent Quick Log */}
        <div className="shrink-0">
          {/* Brand Header */}
          <div
            className={`h-16 px-4 flex items-center justify-between border-b shrink-0 ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            }`}
          >
            <div
              onClick={() => onSelectScreen('dashboard')}
              className="flex items-center gap-3 cursor-pointer group overflow-hidden"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-display font-extrabold text-base shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                FS
              </div>
              {!collapsed && (
                <div className="flex flex-col truncate">
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="font-display font-extrabold tracking-tight text-base">FitSphere</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-telemetry bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                      AI
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-telemetry tracking-wider uppercase mt-0.5">
                    Sports Performance
                  </span>
                </div>
              )}
            </div>

            {isMobileView ? (
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={onToggleCollapse}
                className={`p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer ${
                  isLight ? 'hover:bg-slate-200' : 'hover:bg-slate-800'
                }`}
                title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Persistent 'Quick Log' Button */}
          <div
            className={`p-2.5 border-b shrink-0 ${
              isLight ? 'border-slate-200 bg-slate-50/50' : 'border-slate-800 bg-[#0a1120]'
            }`}
          >
            {!collapsed ? (
              <button
                type="button"
                onClick={() => {
                  if (onQuickLog) {
                    onQuickLog();
                  } else {
                    onSelectScreen('fitness');
                  }
                  if (isMobileView) onCloseMobile();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-display font-black text-xs flex items-center justify-between shadow-md shadow-emerald-500/25 glow-kinetic-green cursor-pointer transition-all active:scale-97 group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg bg-slate-950/20 flex items-center justify-center">
                    <Plus className="w-3.5 h-3.5 stroke-[3] text-slate-950 group-hover:rotate-90 transition-transform duration-200" />
                  </div>
                  <span className="tracking-wide">Quick Log</span>
                </div>
                <span className="text-[10px] font-telemetry font-bold px-1.5 py-0.5 rounded bg-slate-950/20 text-slate-950">
                  +45m
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (onQuickLog) {
                    onQuickLog();
                  } else {
                    onSelectScreen('fitness');
                  }
                }}
                title="Quick Log Workout (+45m)"
                className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 flex items-center justify-center shadow-md shadow-emerald-500/30 cursor-pointer transition-all active:scale-95 glow-kinetic-green group"
              >
                <Plus className="w-5 h-5 stroke-[3] group-hover:rotate-90 transition-transform duration-200" />
              </button>
            )}
          </div>
        </div>

        {/* MIDDLE SECTION: Scrollable Navigation Suite (Scrolls independently while header and footer stay pinned!) */}
        <div className="flex-1 min-h-0 overflow-y-auto px-2.5 py-2.5 space-y-1 scrollbar-thin">
          {!collapsed && (
            <div className="px-2.5 pb-1 text-[10px] font-telemetry font-bold uppercase tracking-wider text-slate-400">
              Navigation Suite
            </div>
          )}

          {screenNavItems.map((item) => {
            const Icon = item.icon;
            const active = currentScreen === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectScreen(item.id);
                  if (isMobileView) onCloseMobile();
                }}
                title={collapsed ? `${item.label} — ${item.description}` : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all relative group cursor-pointer ${
                  active
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/25 glow-kinetic-green'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                } ${collapsed ? 'justify-center px-0' : ''}`}
              >
                <div className="relative shrink-0">
                  <Icon className={`w-4 h-4 ${active ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                  {item.id === 'marketplace' && cartCount > 0 && (
                    <span
                      className={`absolute -top-1.5 -right-2 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center font-telemetry ${
                        active
                          ? 'bg-slate-950 text-emerald-400'
                          : 'bg-emerald-500 text-slate-950'
                      }`}
                    >
                      {cartCount}
                    </span>
                  )}
                </div>

                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xs truncate leading-snug">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-telemetry px-1.5 py-0.2 rounded-md font-bold uppercase shrink-0 ${
                            active
                              ? 'bg-slate-950/20 text-slate-950'
                              : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-[10px] font-telemetry truncate leading-tight ${
                        active ? 'text-slate-800' : 'text-slate-400'
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* BOTTOM SECTION: Permanently Visible User Profile Summary & Utilities (Never scrolled away!) */}
        <div
          className={`shrink-0 mt-auto border-t transition-all ${
            isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-[#090f1d]'
          }`}
        >
          {/* User Profile Summary Card */}
          <div
            className={`p-3 border-b ${
              isLight ? 'border-slate-200/80 bg-slate-50/80' : 'border-slate-800/80 bg-[#0d1424]'
            }`}
          >
            <div
              className={`flex items-center gap-3 rounded-xl transition-all ${
                collapsed ? 'justify-center' : ''
              }`}
            >
              {/* Avatar with Camera Trigger & Online Status */}
              <div className="relative group shrink-0">
                <img
                  src={athlete.avatar}
                  alt={athlete.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/60 shadow-md bg-slate-800 cursor-pointer"
                  onClick={onOpenAvatarPicker}
                />
                <button
                  type="button"
                  onClick={onOpenAvatarPicker}
                  title="Change Profile Photo"
                  className="absolute inset-0 rounded-xl bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-emerald-400 transition-opacity cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
              </div>

              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      onClick={() => {
                        onSelectScreen('settings');
                        if (isMobileView) onCloseMobile();
                      }}
                      className="font-display font-bold text-xs truncate hover:text-emerald-400 cursor-pointer transition-colors"
                    >
                      {athlete.name}
                    </span>
                    <button
                      onClick={onOpenAvatarPicker}
                      className="text-[10px] text-emerald-400 hover:underline font-telemetry shrink-0 ml-1 cursor-pointer font-bold"
                    >
                      Edit Photo
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-telemetry truncate mt-0.5">
                    <span className="text-emerald-400 font-semibold">{athlete.tier}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                      <Flame className="w-2.5 h-2.5 fill-amber-400" /> {athlete.streakDays}d
                    </span>
                  </div>
                  <div className="text-[9px] text-slate-500 font-telemetry truncate mt-0.5">
                    {athlete.nationality || 'India'} • {athlete.bodyMassKg}kg
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Theme, Viewport & Local Vault Utilities */}
          <div className="p-2.5 space-y-1.5">
            <div className={`flex items-center gap-1.5 ${collapsed ? 'flex-col' : 'justify-between'}`}>
              <button
                onClick={onToggleTheme}
                title={isLight ? 'Switch to Kinetic Obsidian' : 'Switch to Kinetic Daylight'}
                className={`p-1.5 rounded-xl border flex items-center justify-center text-xs font-telemetry transition-colors cursor-pointer ${
                  collapsed ? 'w-full' : 'flex-1 gap-1.5'
                } ${
                  isLight
                    ? 'bg-white border-slate-200 text-amber-500 hover:bg-slate-100'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-200 hover:bg-slate-800'
                }`}
              >
                {isLight ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5 text-emerald-400" />}
                {!collapsed && (
                  <span className="font-semibold text-[11px] truncate">
                    {isLight ? 'Daylight' : 'Obsidian'}
                  </span>
                )}
              </button>

              <button
                onClick={onToggleDeviceFrame}
                title={isDeviceFrame ? 'Switch to Full Desktop View' : 'Preview in Phone Hardware Frame'}
                className={`p-1.5 rounded-xl border flex items-center justify-center text-xs font-telemetry transition-colors cursor-pointer ${
                  collapsed ? 'w-full' : 'flex-1 gap-1.5'
                } ${
                  isDeviceFrame
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                    : isLight
                    ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {isDeviceFrame ? <Smartphone className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                {!collapsed && (
                  <span className="font-semibold text-[11px] truncate">
                    {isDeviceFrame ? 'Phone View' : 'Desktop View'}
                  </span>
                )}
              </button>
            </div>

            {/* Local AES-256 Vault Status */}
            {!collapsed && (
              <div className="pt-0.5 flex items-center justify-between text-[9px] text-slate-400 font-telemetry">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  AES-256 Vault
                </span>
                <span className="text-emerald-400 font-bold">Secured</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 1. PERMANENT DESKTOP SIDEBAR (.sidebar-container selector targeted) */}
      <aside
        className={`sidebar-container hidden md:flex flex-col shrink-0 h-screen sticky top-0 z-30 border-r transition-all duration-200 ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900 shadow-sm'
            : 'bg-[#0c1426] border-slate-800 text-slate-100 shadow-xl'
        }`}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* 2. MOBILE OFF-CANVAS SLIDE-IN DRAWER (.sidebar-container) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Slide-out drawer container */}
          <div
            className={`sidebar-container relative w-[280px] max-w-[85vw] h-full shadow-2xl flex flex-col z-10 animate-slide-right ${
              isLight ? 'bg-white text-slate-900' : 'bg-[#0f172a] text-slate-100'
            }`}
          >
            {renderSidebarContent(true)}
          </div>
        </div>
      )}
    </>
  );
};
