import React from 'react';
import {
  Smartphone,
  Maximize2,
  Sun,
  Moon,
  ShoppingBag,
  Menu,
  Camera,
  Video,
} from 'lucide-react';
import { AthleteUser, ScreenType, ThemeMode } from '../../types';
import { screenNavItems } from './Sidebar';

interface TopNavbarProps {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
  athlete: AthleteUser;
  theme: ThemeMode;
  onToggleTheme: () => void;
  isDeviceFrame: boolean;
  onToggleDeviceFrame: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenMobileMenu: () => void;
  onOpenAvatarPicker: () => void;
  onOpenVideoTour: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentScreen,
  onSelectScreen,
  athlete,
  theme,
  onToggleTheme,
  isDeviceFrame,
  onToggleDeviceFrame,
  cartCount,
  onOpenCart,
  onOpenMobileMenu,
  onOpenAvatarPicker,
  onOpenVideoTour,
}) => {
  const isLight = theme === 'daylight';
  const activeScreenInfo = screenNavItems.find((s) => s.id === currentScreen) || screenNavItems[0];
  const ActiveIcon = activeScreenInfo.icon;

  return (
    <header
      className={`w-full sticky top-0 z-20 backdrop-blur-md border-b transition-colors duration-200 ${
        isLight
          ? 'bg-white/90 border-slate-200 text-slate-900'
          : 'bg-[#0b1326]/90 border-slate-800 text-slate-100'
      }`}
    >
      <div className="w-full px-3 sm:px-6 h-14 flex items-center justify-between">
        {/* Left: Mobile Drawer Trigger + Active Screen Breadcrumb */}
        <div className="flex items-center gap-2.5">
          {/* Mobile hamburger button */}
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl border border-slate-700/50 hover:bg-slate-800/40 text-slate-300 transition-colors flex items-center justify-center"
            title="Open Navigation Menu"
          >
            <Menu className="w-5 h-5 text-emerald-400" />
          </button>

          {/* Screen Title & Active Context */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ActiveIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-display font-bold text-sm tracking-tight">
                  {activeScreenInfo.label}
                </span>
                {activeScreenInfo.badge && (
                  <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.2 rounded font-telemetry bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                    {activeScreenInfo.badge}
                  </span>
                )}
              </div>
              <p className="hidden sm:block text-[10px] text-slate-400 font-telemetry leading-tight mt-0.5">
                {activeScreenInfo.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right Tools: Athlete Avatar Shortcut + Theme + Cart */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Athlete Profile & Avatar Quick Button */}
          <button
            onClick={onOpenAvatarPicker}
            title="Click to change profile picture"
            className={`p-1 pl-1.5 pr-2.5 rounded-full border transition-all flex items-center gap-2 group ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-200'
            }`}
          >
            <div className="relative">
              <img
                src={athlete.avatar}
                alt={athlete.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500/60"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-900" />
            </div>
            <div className="hidden sm:flex flex-col text-left leading-none">
              <span className="font-display font-semibold text-xs group-hover:text-emerald-400 transition-colors">
                {athlete.name}
              </span>
              <span className="text-[9px] text-emerald-400 font-telemetry flex items-center gap-1">
                <Camera className="w-2.5 h-2.5" /> Avatar
              </span>
            </div>
          </button>

          {/* Video Guide & Walkthrough Script Trigger */}
          <button
            onClick={onOpenVideoTour}
            title="Open Project Video Walkthrough & Script Guide"
            className={`p-2 sm:px-2.5 sm:py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
              isLight
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 shadow-xs'
                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25 shadow-xs'
            }`}
          >
            <Video className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline text-xs font-telemetry font-bold">Video Guide</span>
          </button>

          {/* Phone Hardware Viewport Toggle */}
          <button
            onClick={onToggleDeviceFrame}
            title={isDeviceFrame ? 'Switch to Full Desktop View' : 'Preview in Phone Hardware Frame'}
            className={`p-2 rounded-xl border transition-colors ${
              isDeviceFrame
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                : isLight
                ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {isDeviceFrame ? <Smartphone className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Theme Mode Switcher */}
          <button
            onClick={onToggleTheme}
            title={isLight ? 'Switch to Kinetic Obsidian' : 'Switch to Kinetic Daylight'}
            className={`p-2 rounded-xl border transition-colors ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-amber-500 hover:bg-slate-200'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {isLight ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            title="Open Marketplace Cart"
            className={`relative p-2 rounded-xl border transition-colors ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                : 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold flex items-center justify-center font-telemetry animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
