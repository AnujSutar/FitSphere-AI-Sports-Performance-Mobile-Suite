import React, { useState, useRef, useMemo } from 'react';
import {
  X,
  Check,
  Upload,
  Link as LinkIcon,
  Sparkles,
  Camera,
  Image as ImageIcon,
  ShieldCheck,
  RotateCcw,
  Dumbbell,
  Trophy,
  User,
  Search,
} from 'lucide-react';
import {
  ALL_ATHLETE_ICONS,
  GYM_AVATARS,
  SPORTS_AVATARS,
  ANIMATED_AVATARS,
  PRO_PORTRAITS,
  AthleteAvatarIcon,
  MONOGRAM_GRADIENTS,
  generateMonogramDataUri,
} from '../../data/avatarPresets';
import { ThemeMode } from '../../types';

interface AvatarPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar: string;
  athleteName: string;
  athleteTier: string;
  theme: ThemeMode;
  onSaveAvatar: (avatarUrl: string) => void;
}

type CategoryFilter = 'all' | 'gym' | 'sports' | 'animated' | 'portraits' | 'monogram' | 'upload' | 'url';

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  isOpen,
  onClose,
  currentAvatar,
  athleteName,
  athleteTier,
  theme,
  onSaveAvatar,
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatar);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [urlError, setUrlError] = useState<boolean>(false);
  const [monogramInitials, setMonogramInitials] = useState<string>(
    athleteName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'AS'
  );
  const [selectedGradient, setSelectedGradient] = useState<string>('emerald');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLight = theme === 'daylight';

  // Filtered array of athlete icons based on category tab & search query
  const filteredIcons = useMemo(() => {
    let list: AthleteAvatarIcon[] = [];
    if (activeCategory === 'all') {
      list = ALL_ATHLETE_ICONS;
    } else if (activeCategory === 'gym') {
      list = GYM_AVATARS;
    } else if (activeCategory === 'sports') {
      list = SPORTS_AVATARS;
    } else if (activeCategory === 'animated') {
      list = ANIMATED_AVATARS;
    } else if (activeCategory === 'portraits') {
      list = PRO_PORTRAITS;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (icon) =>
          icon.name.toLowerCase().includes(q) ||
          icon.tag.toLowerCase().includes(q) ||
          icon.categoryLabel.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeCategory, searchQuery]);

  // Selected icon details for metadata display
  const currentIconDetails = useMemo(() => {
    return ALL_ATHLETE_ICONS.find((i) => i.url === selectedAvatar);
  }, [selectedAvatar]);

  if (!isOpen) return null;

  const handleApply = () => {
    onSaveAvatar(selectedAvatar);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('Please choose an image under 3MB for optimal local vault performance.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyCustomUrl = () => {
    if (!customUrl.trim()) return;
    setUrlError(false);
    setSelectedAvatar(customUrl.trim());
  };

  const handleMonogramSelect = (gradientId: string, initials: string) => {
    setSelectedGradient(gradientId);
    const dataUri = generateMonogramDataUri(initials, gradientId);
    setSelectedAvatar(dataUri);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div
        className={`w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden transition-all my-auto ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900 shadow-slate-300/40'
            : 'bg-[#111827] border-slate-800 text-slate-100 shadow-black/80'
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between ${
            isLight ? 'border-slate-200 bg-slate-50/80' : 'border-slate-800 bg-[#0d1322]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base tracking-tight">
                Athlete Profile Picture Selector
              </h2>
              <p className="text-[11px] text-slate-400 font-telemetry">
                Choose from Gym, Sports Disciplines, and Animated Athlete Avatars.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Athlete Selection Preview Bar */}
        <div
          className={`px-5 py-3.5 border-b flex items-center justify-between gap-3 ${
            isLight ? 'bg-slate-100/70 border-slate-200' : 'bg-slate-900/70 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src={selectedAvatar}
                alt="Selected avatar"
                className="w-13 h-13 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-md bg-slate-800"
                onError={() => {
                  if (activeCategory === 'url') setUrlError(true);
                }}
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-display font-bold text-sm truncate">{athleteName}</span>
                <span className="text-[10px] px-2 py-0.2 rounded font-telemetry font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {athleteTier}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-telemetry truncate mt-0.5">
                {currentIconDetails ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <span>{currentIconDetails.emoji}</span>
                    <span>{currentIconDetails.name}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400 font-normal">{currentIconDetails.tag}</span>
                  </span>
                ) : (
                  <span>Custom Athlete Image • Real-Time Sync</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSelectedAvatar(currentAvatar)}
              className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-700/50 hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 font-telemetry"
              title="Reset to initial avatar"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-telemetry font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/25 transition-all hover:scale-102"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Apply Avatar</span>
            </button>
          </div>
        </div>

        {/* Filter Bar & Category Tabs */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-800/20 space-y-2.5">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
            {[
              { id: 'all', label: 'All Avatars', icon: Sparkles, count: ALL_ATHLETE_ICONS.length },
              { id: 'gym', label: 'Gym & Iron', icon: Dumbbell, count: GYM_AVATARS.length },
              { id: 'sports', label: 'Sports', icon: Trophy, count: SPORTS_AVATARS.length },
              { id: 'animated', label: 'Animated', icon: Sparkles, count: ANIMATED_AVATARS.length },
              { id: 'portraits', label: 'Pro Real (3)', icon: User, count: PRO_PORTRAITS.length },
              { id: 'monogram', label: 'Monogram', icon: ImageIcon, count: null },
              { id: 'upload', label: 'Upload Photo', icon: Upload, count: null },
              { id: 'url', label: 'Link URL', icon: LinkIcon, count: null },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as CategoryFilter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-telemetry font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                    active
                      ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        active ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Input for Icon Grid */}
          {['all', 'gym', 'sports', 'animated', 'portraits'].includes(activeCategory) && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search athlete icons (e.g., powerlifter, basketball, cricket, runner, gym)..."
                className={`w-full pl-8 pr-3 py-1.5 rounded-xl border text-xs font-telemetry outline-hidden ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500'
                    : 'bg-[#0f172a] border-slate-800 text-slate-100 focus:border-emerald-400'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>

        {/* Modal Main Body: Dynamic Grid Selector vs Tools */}
        <div className="p-5 max-h-[380px] overflow-y-auto">
          {/* 1. DIVERSE ATHLETE ICON GRID SELECTOR */}
          {['all', 'gym', 'sports', 'animated', 'portraits'].includes(activeCategory) && (
            <div>
              {filteredIcons.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs font-telemetry">
                  No athlete icons found matching &ldquo;{searchQuery}&rdquo;. Try another search term.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredIcons.map((icon) => {
                    const isSelected = selectedAvatar === icon.url;
                    return (
                      <div
                        key={icon.id}
                        onClick={() => setSelectedAvatar(icon.url)}
                        className={`relative p-3 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center group select-none ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-500 ring-2 ring-emerald-500/50 scale-102 shadow-md shadow-emerald-500/20'
                            : isLight
                            ? 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                            : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                        }`}
                      >
                        {/* Avatar Image Thumbnail */}
                        <div className="relative mb-2">
                          <img
                            src={icon.url}
                            alt={icon.name}
                            className="w-16 h-16 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform bg-slate-900"
                          />
                          {isSelected && (
                            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md animate-bounce">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                          <span className="absolute -bottom-1 -left-1 text-sm drop-shadow-md">
                            {icon.emoji}
                          </span>
                        </div>

                        {/* Title & Tag */}
                        <span className="font-display font-bold text-xs leading-tight line-clamp-1">
                          {icon.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-telemetry line-clamp-1 mt-0.5">
                          {icon.tag}
                        </span>
                        <span
                          className={`mt-1.5 text-[9px] px-1.5 py-0.2 rounded-md font-telemetry font-bold uppercase tracking-wider ${
                            isSelected
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {icon.categoryLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 2. MONOGRAM CREATOR */}
          {activeCategory === 'monogram' && (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-2xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/40 border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={generateMonogramDataUri(monogramInitials, selectedGradient)}
                    alt="Monogram preview"
                    className="w-20 h-20 rounded-2xl shadow-lg ring-2 ring-emerald-500/50"
                  />
                  <div className="flex-1 w-full space-y-2">
                    <label className="block text-xs font-telemetry uppercase tracking-wider text-slate-400">
                      Initials (Max 2 Chars)
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      value={monogramInitials}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        setMonogramInitials(val);
                        handleMonogramSelect(selectedGradient, val);
                      }}
                      className={`w-full max-w-[120px] px-3 py-2 rounded-xl border text-center font-display font-bold text-lg tracking-widest outline-hidden ${
                        isLight
                          ? 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                          : 'bg-[#0f172a] border-slate-700 text-slate-100 focus:border-emerald-400'
                      }`}
                    />
                    <p className="text-[11px] text-slate-400 font-telemetry">
                      Generates a sharp kinetic SVG monogram that stays crystal clear at any scale.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-telemetry uppercase tracking-wider text-slate-400 mb-2">
                  Select Kinetic Gradient Palette
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {MONOGRAM_GRADIENTS.map((g) => {
                    const isGradActive = selectedGradient === g.id;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => handleMonogramSelect(g.id, monogramInitials)}
                        className={`p-2 rounded-xl border flex items-center gap-2 text-left transition-all ${
                          isGradActive
                            ? 'border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-500/10'
                            : isLight
                            ? 'border-slate-200 hover:bg-slate-100'
                            : 'border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        <div
                          className="w-6 h-6 rounded-lg shrink-0 shadow-xs"
                          style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
                        />
                        <span className="text-xs font-telemetry font-bold truncate">{g.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 3. UPLOAD LOCAL PHOTO */}
          {activeCategory === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`p-8 rounded-3xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center text-center transition-all group ${
                  isLight
                    ? 'border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/30'
                    : 'border-slate-700 hover:border-emerald-400 bg-slate-900/40 hover:bg-slate-900/80'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-7 h-7" />
                </div>
                <h4 className="font-display font-bold text-sm mb-1">
                  Click to Browse or Drop Photo
                </h4>
                <p className="text-xs text-slate-400 font-body max-w-sm">
                  Upload your own training picture (PNG, JPG, or WebP). Encrypted and stored locally in your browser sandbox.
                </p>
                <span className="mt-3 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-[10px] font-telemetry font-semibold">
                  Max file size: 3MB
                </span>
              </div>
            </div>
          )}

          {/* 4. CUSTOM WEB URL */}
          {activeCategory === 'url' && (
            <div className="space-y-3">
              <label className="block text-xs font-telemetry uppercase tracking-wider text-slate-400">
                Direct Image Link (HTTPS)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => {
                    setCustomUrl(e.target.value);
                    setUrlError(false);
                  }}
                  placeholder="https://images.unsplash.com/..."
                  className={`flex-1 px-3 py-2 rounded-xl border text-sm font-body outline-hidden ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                      : 'bg-[#0f172a] border-slate-700 text-slate-100 focus:border-emerald-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleApplyCustomUrl}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-telemetry text-xs font-bold transition-colors"
                >
                  Preview
                </button>
              </div>

              {urlError && (
                <p className="text-xs text-rose-400 font-telemetry">
                  Could not load image from this URL. Please verify the link allows direct image access.
                </p>
              )}

              <p className="text-[11px] text-slate-400 font-telemetry leading-relaxed">
                Paste any publicly accessible avatar or photo URL. It will be loaded and persisted in your local state.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`px-5 py-3.5 border-t flex items-center justify-between text-xs font-telemetry ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-[#0d1322] border-slate-800 text-slate-400'
          }`}
        >
          <span className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Persists in Local AES-256 Vault
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-md"
            >
              Confirm Avatar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
