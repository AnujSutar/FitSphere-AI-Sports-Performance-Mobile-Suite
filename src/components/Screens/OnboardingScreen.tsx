import React, { useState } from 'react';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  User,
  Lock,
  ArrowRight,
  Download,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Database,
  Cpu,
} from 'lucide-react';
import { AthleteUser, ThemeMode } from '../../types';

interface OnboardingScreenProps {
  athlete: AthleteUser;
  theme: ThemeMode;
  onLoginSuccess: (athleteData?: Partial<AthleteUser>) => void;
  onContinueAsGuest: () => void;
  onImportBackup: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  athlete,
  theme,
  onLoginSuccess,
  onContinueAsGuest,
  onImportBackup,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [emailOrId, setEmailOrId] = useState('alex.rivera@fitsphere.pro');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);

  const isLight = theme === 'daylight';

  const handleDemoLogin = () => {
    setEmailOrId(athlete.email);
    setPassword('Athletics2026!');
    setLoginMessage('Loaded demo profile: Alex Rivera (Elite Pro Athlete)');
    setTimeout(() => {
      onLoginSuccess();
    }, 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrId.trim()) return;
    setLoginMessage(`Authenticated locally as ${emailOrId.split('@')[0]}`);
    setTimeout(() => {
      onLoginSuccess({
        email: emailOrId,
        name: isRegister ? 'New Athlete' : athlete.name,
      });
    }, 600);
  };

  return (
    <div className="w-full max-w-lg mx-auto pb-24 pt-4 px-4 sm:px-6">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-telemetry mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Local-First &amp; Zero-Cloud Telemetry</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          FitSphere <span className="text-emerald-500">AI</span>
        </h1>
        <p className={`text-xs mt-1.5 max-w-xs mx-auto font-body ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          High-performance sports telemetry, biomechanical scouting, and workout routines.
        </p>
      </div>

      {/* Local-First Architecture Privacy Badge */}
      <div
        className={`p-4 rounded-2xl border mb-6 transition-all ${
          isLight
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
            : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 mt-0.5">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-sm tracking-tight">
                Local-First Cryptographic Vault
              </h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-telemetry font-bold bg-emerald-500/30 text-emerald-300">
                AES-256-GCM
              </span>
            </div>
            <p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-emerald-900/80' : 'text-slate-300'}`}>
              Your biometrics, workout PRs, and training logs remain 100% on this device. No remote servers, no cloud telemetry tracking.
            </p>
          </div>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div
        className={`p-6 rounded-2xl border shadow-xl transition-all ${
          isLight
            ? 'bg-white border-slate-200 shadow-slate-200/50'
            : 'bg-[#131b2e] border-slate-800 shadow-black/40'
        }`}
      >
        {/* Toggle between Sign In and Register */}
        <div
          className={`flex p-1 rounded-xl mb-6 border ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#0f172a] border-slate-800'
          }`}
        >
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-2 text-xs font-telemetry font-bold rounded-lg transition-all ${
              !isRegister
                ? isLight
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'bg-[#1e293b] text-emerald-400 shadow-xs border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-2 text-xs font-telemetry font-bold rounded-lg transition-all ${
              isRegister
                ? isLight
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'bg-[#1e293b] text-emerald-400 shadow-xs border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register Athlete
          </button>
        </div>

        {/* Demo Credentials Quick Pill */}
        <div
          onClick={handleDemoLogin}
          className={`p-3 rounded-xl border border-dashed mb-5 cursor-pointer flex items-center justify-between group transition-all ${
            isLight
              ? 'bg-slate-50 border-emerald-300 hover:bg-emerald-50/50'
              : 'bg-emerald-500/5 border-emerald-500/40 hover:bg-emerald-500/10'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-xs font-display">
              AR
            </div>
            <div>
              <div className="text-xs font-display font-bold flex items-center gap-1.5">
                <span>Demo: Alex Rivera</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-telemetry bg-emerald-500/20 text-emerald-400">
                  Elite Pro
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-telemetry">
                1-Tap Instant Auth • 155kg Squat PR
              </div>
            </div>
          </div>
          <span className="text-xs font-telemetry font-semibold text-emerald-500 group-hover:translate-x-0.5 transition-transform">
            Auto-fill →
          </span>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-telemetry uppercase tracking-wider text-slate-400 mb-1.5">
              Athlete Email / ID
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={emailOrId}
                onChange={(e) => setEmailOrId(e.target.value)}
                placeholder="athlete@fitsphere.pro"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-body transition-all outline-hidden ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : 'bg-[#0f172a] border-slate-700 text-slate-100 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20'
                }`}
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-telemetry uppercase tracking-wider text-slate-400">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] font-telemetry text-slate-400 hover:text-emerald-400 flex items-center gap-1"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? 'Hide' : 'Reveal'}</span>
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm font-body transition-all outline-hidden ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : 'bg-[#0f172a] border-slate-700 text-slate-100 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20'
                }`}
                required
              />
            </div>
          </div>

          {/* Remember Device Checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 border-slate-700 bg-slate-900"
              />
              <span className={`text-xs font-body ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Remember biometric session on this device
              </span>
            </label>
          </div>

          {loginMessage && (
            <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-telemetry flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{loginMessage}</span>
            </div>
          )}

          {/* Primary Action Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isRegister ? 'Create Encrypted Profile' : 'Authenticate Session'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Local Gateways: Continue as Guest & Import Backup */}
        <div className="mt-6 pt-5 border-t border-slate-800/20 space-y-2.5">
          <div className="text-[11px] font-telemetry text-center uppercase tracking-wider text-slate-400">
            Local Gateway Options
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onContinueAsGuest}
              className={`py-2 px-3 rounded-xl border text-xs font-telemetry font-semibold flex items-center justify-center gap-1.5 transition-all ${
                isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>Continue as Guest</span>
            </button>

            <label
              className={`py-2 px-3 rounded-xl border text-xs font-telemetry font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Import .json</span>
              <input
                type="file"
                accept=".json"
                onChange={onImportBackup}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Feature Micro-Badges */}
      <div className="mt-6 grid grid-cols-3 gap-2 text-center">
        <div className={`p-2.5 rounded-xl border text-[11px] font-telemetry ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
          <div className="font-bold text-emerald-400">10 Sports</div>
          <div className="text-slate-400 text-[10px]">Scout Radar</div>
        </div>
        <div className={`p-2.5 rounded-xl border text-[11px] font-telemetry ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
          <div className="font-bold text-cyan-400">155kg Squat</div>
          <div className="text-slate-400 text-[10px]">PR Telemetry</div>
        </div>
        <div className={`p-2.5 rounded-xl border text-[11px] font-telemetry ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
          <div className="font-bold text-amber-400">0 KB Upload</div>
          <div className="text-slate-400 text-[10px]">Offline First</div>
        </div>
      </div>
    </div>
  );
};
