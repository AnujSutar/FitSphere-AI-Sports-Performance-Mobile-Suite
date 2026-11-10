import React from 'react';
import {
  Activity,
  Dumbbell,
  Trophy,
  ShoppingBag,
  Sliders,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import { ScreenType, ThemeMode } from '../../types';

interface BottomTabBarProps {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
  theme: ThemeMode;
  cartCount: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentScreen,
  onSelectScreen,
  theme,
  cartCount,
}) => {
  const isLight = theme === 'daylight';

  const navItems: { id: ScreenType; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Overview', icon: Activity },
    { id: 'fitness', label: 'Fitness', icon: Dumbbell },
    { id: 'sports', label: 'Sports', icon: Trophy },
    { id: 'coach', label: 'AI Coach', icon: Sparkles },
    { id: 'marketplace', label: 'Store', icon: ShoppingBag },
    { id: 'settings', label: 'Settings', icon: Sliders },
  ];

  return (
    <nav
      className={`md:hidden fixed bottom-0 inset-x-0 z-40 max-w-lg mx-auto sm:max-w-xl transition-all duration-200 border-t backdrop-blur-lg px-2 sm:px-4 py-1.5 ${
        isLight
          ? 'bg-white/95 border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]'
          : 'bg-[#0f172a]/95 border-slate-800 shadow-[0_-4px_25px_rgba(0,0,0,0.4)]'
      }`}
    >
      <div className="flex items-center justify-around relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectScreen(item.id)}
              className={`flex-1 py-1 flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all active:scale-95 ${
                isActive
                  ? isLight
                    ? 'text-emerald-600'
                    : 'text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {item.id === 'marketplace' && cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-emerald-500 text-slate-950 text-[9px] font-bold rounded-full flex items-center justify-center font-telemetry">
                    {cartCount}
                  </span>
                )}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-xs shadow-emerald-400/80" />
                )}
              </div>
              <span className="text-[10px] font-telemetry tracking-tight leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
