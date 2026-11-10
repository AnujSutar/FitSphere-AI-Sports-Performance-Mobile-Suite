import React, { useState } from 'react';
import {
  X,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Video,
  Monitor,
  ExternalLink,
  Sparkles,
  Award,
  ShieldCheck,
  Activity,
  Dumbbell,
  Trophy,
  ShoppingBag,
  Sliders,
  Flame,
  Globe,
  Download,
  Smartphone,
} from 'lucide-react';
import { ScreenType, ThemeMode } from '../../types';

interface VideoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToScreen: (screen: ScreenType) => void;
  theme: ThemeMode;
}

interface TourStep {
  id: number;
  screenId: ScreenType;
  screenName: string;
  icon: React.ElementType;
  timeRange: string;
  title: string;
  visualAction: string;
  voiceoverScript: string;
  onScreenText: string;
  keyFeatures: string[];
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 1,
    screenId: 'dashboard',
    screenName: 'Introduction & Hook',
    icon: Sparkles,
    timeRange: '0:00 - 0:25',
    title: 'The Modern Athletic Operating System',
    visualAction: 'Start on the Overview Dashboard. Move cursor smoothly over the 3 kinetic telemetry rings (Calories, Reps, Active Minutes). Highlight the 14-day training streak and D3 Active Minutes chart.',
    voiceoverScript: 'Welcome to FitSphere AI — the all-in-one athletic performance suite engineered for competitive athletes, powerlifters, and multi-sport competitors. Built on our Kinetic Obsidian design system, FitSphere integrates local-first AES-256 data privacy, multi-sport scouting telemetry, periodized routine tracking, and server-side Gemini 3.8 Flash intelligence. Let us dive in and see how it works.',
    onScreenText: 'FitSphere AI • Multi-Sport Performance Suite',
    keyFeatures: ['Kinetic Obsidian & Daylight themes', 'Zero-cloud local-first privacy', 'Real-time athletic telemetry'],
  },
  {
    id: 2,
    screenId: 'onboarding',
    screenName: 'Sign In & Vault',
    icon: ShieldCheck,
    timeRange: '0:25 - 0:50',
    title: 'Local-First AES-256 Encrypted Vault',
    visualAction: 'Navigate to Sign In & Vault screen. Point out the local encrypted athlete ID, biometric credentials, and 100% on-device vault status.',
    voiceoverScript: 'Security starts with zero-cloud compromise. In the Sign In & Vault screen, athlete data is encrypted directly on your device using military-grade AES-256 standards. Your biometric telemetry, 1RM power records, and body composition logs never leave your device without explicit authorization.',
    onScreenText: 'AES-256 Local Encrypted Vault • Zero-Cloud Architecture',
    keyFeatures: ['Zero third-party tracking', 'Instant biometric unlock', 'Offline resilient state'],
  },
  {
    id: 3,
    screenId: 'dashboard',
    screenName: 'Overview Dashboard',
    icon: Activity,
    timeRange: '0:50 - 1:25',
    title: 'Real-Time Telemetry & Training History',
    visualAction: 'Return to the Dashboard. Click "+15m Active Log" in the Tactical Hub to demonstrate live telemetry updates. Point to the D3 Active Minutes interactive bar chart and training timeline.',
    voiceoverScript: 'The Overview Dashboard is your daily mission control. At a glance, track your active calories, daily reps, and training duration against personalized targets. The D3-powered chart visualizes your weekly training volume across Monday to Sunday, while the training history log captures workout volume, heart rate intensity, and form accuracy.',
    onScreenText: 'Interactive D3 Charting • Live Tactical Telemetry Log',
    keyFeatures: ['Dynamic energy rings', 'Interactive D3 chart', 'Recent session volume history'],
  },
  {
    id: 4,
    screenId: 'fitness',
    screenName: 'Fitness & Micro-Goals',
    icon: Dumbbell,
    timeRange: '1:25 - 2:05',
    title: 'PR Telemetry, Routine Editor & Micro-Goals',
    visualAction: 'Navigate to Fitness & Routines screen. Show the 1RM benchmarks (155kg Squat, 112kg Bench, 195kg Deadlift). Click on the "Micro-Goals (5)" tab. Click the "+2.5kg" quick-log stepper on a goal card. Then open "Plan New Goal" modal to show the lifting & endurance presets.',
    voiceoverScript: 'In the Fitness screen, athletes manage their core lifts and periodized routines. Our new Micro-Goals feature lets you engineer granular targets for weight lifting loads like squat and bench milestones, or endurance feats like sub-20 minute 5K runs. With on-card quick steppers, you can log PR progress with a single tap, while the Goal Planning modal provides one-click athletic presets.',
    onScreenText: 'Periodized Routine Editor • Lifting & Endurance Micro-Goals',
    keyFeatures: ['Live 1RM power telemetry', 'Interactive micro-goals stepper', 'Pre-configured lifting presets'],
  },
  {
    id: 5,
    screenId: 'sports',
    screenName: 'Sports Workspace',
    icon: Trophy,
    timeRange: '2:05 - 2:45',
    title: '10-Sport Radar & Biomechanical Scouting',
    visualAction: 'Navigate to Sports Workspace. Switch sport tabs (Cricket, Football, Kabaddi, Basketball, Athletics). Show the dual-athlete radar chart and click "+ Add Metric" to record a new custom metric.',
    voiceoverScript: 'FitSphere supports ten distinct Olympic and competitive disciplines — from Cricket pace bowling and Kabaddi raids to Swimming, Football, and Basketball. The interactive radar chart compares your biomechanical profile against benchmark standards across Speed, Power, Reaction, Agility, and Endurance. Record sport-specific metrics and view scout intelligence verdicts.',
    onScreenText: '10 Competitive Sports • Biomechanical Radar Analysis',
    keyFeatures: ['10 competitive sport profiles', 'Dual-athlete comparison radar', 'Custom metric logger with ratings'],
  },
  {
    id: 6,
    screenId: 'coach',
    screenName: 'FitSphere AI Coach',
    icon: Sparkles,
    timeRange: '2:45 - 3:30',
    title: 'Gemini 3.8 Flash & Grounded Coaching',
    visualAction: 'Navigate to FitSphere AI Coach. Click a prompt chip like "Give me a complete workout routine" or type "bench press form". Demonstrate the multi-stage loading animation, the detailed response with exact calculated weights, and the audio voice readout button.',
    voiceoverScript: 'FitSphere AI Coach is powered by server-side Gemini 3.8 Flash with Google Search grounding. Unlike generic chatbots, it synchronizes your exact athletic telemetry — your 155kg squat, 112kg bench, and 14-day streak — to calculate precise wave periodization percentages. Enjoy rich formatting, interactive follow-up chips, one-click routine export, and Text-To-Speech audio readouts.',
    onScreenText: 'Gemini 3.8 Flash • Real-Time Telemetry Synchronization',
    keyFeatures: ['Server-side Gemini 3.8 Flash', 'Grounded sports science', 'Text-to-speech audio coaching'],
  },
  {
    id: 7,
    screenId: 'marketplace',
    screenName: 'Gear & Nutrition Store',
    icon: ShoppingBag,
    timeRange: '3:30 - 4:10',
    title: 'Multi-Currency Catalog & Seller Portal',
    visualAction: 'Navigate to Gear & Nutrition. Point to the local currency conversion badge (e.g. INR ₹ / USD $ based on nationality). Click "+ Become a Seller", fill in sample product details, and append it live to the product catalog.',
    voiceoverScript: 'The Marketplace connects athletes with certified nutrition and professional equipment. Prices dynamically convert into your national currency — supporting 11 global currencies including INR, USD, EUR, and GBP. Athletes can also list their own equipment via the "Become a Seller" portal with live card previews and instant catalog appending.',
    onScreenText: '11 Global Currencies • Live "Become a Seller" Portal',
    keyFeatures: ['Automatic national currency sync', 'In-page Seller listing module', 'Instant cart & checkout prototype'],
  },
  {
    id: 8,
    screenId: 'settings',
    screenName: 'Settings & Identity',
    icon: Sliders,
    timeRange: '4:10 - 4:40',
    title: '24-Avatar Gallery, Gym Scaling & Device Frame',
    visualAction: 'Navigate to Settings. Click the avatar to open the 24-preset Avatar Picker (Gym, Sports, Anime). Toggle the "Daylight / Obsidian" theme. Click the Phone View hardware frame button in the top navbar to show the responsive layout.',
    voiceoverScript: 'Customize your identity with our curated 24-athlete avatar gallery across Gym, Sports, and Anime presets. Set your nationality to automatically lock in your currency, and toggle Gym-Tuned Scaling for ultra-readable text in high-intensity gym environments. Finally, seamlessly switch between desktop widescreen view and mobile phone hardware frame.',
    onScreenText: '24 Athlete Avatars • Gym-Tuned Scaling • Hardware Frame',
    keyFeatures: ['24 diverse illustrated avatars', 'High-contrast theme toggles', 'Seamless mobile phone hardware frame'],
  },
];

const FULL_VIDEO_SCRIPT_TEXT = `========================================================================
FITSPHERE AI — OFFICIAL PRODUCT VIDEO WALKTHROUGH SCRIPT
Target Duration: ~4 Minutes | Format: 1080p / 1440p (16:9) Widescreen
========================================================================

[SCENE 1: 0:00 - 0:25] INTRODUCTION & THE ATHLETIC OS
- Visual: Start on Overview Dashboard. Smooth cursor pan over 3 kinetic telemetry rings (Calories, Reps, Active Minutes). Show the 14-day streak and D3 Active Minutes chart.
- Voiceover: "Welcome to FitSphere AI — the all-in-one athletic performance suite engineered for competitive athletes, powerlifters, and multi-sport competitors. Built on our Kinetic Obsidian design system, FitSphere integrates local-first AES-256 data privacy, multi-sport scouting telemetry, periodized routine tracking, and server-side Gemini 3.8 Flash intelligence. Let's dive in and see how it works."
- On-Screen Text: FitSphere AI • The Athletic Performance Suite

[SCENE 2: 0:25 - 0:50] SIGN IN & LOCAL-FIRST VAULT
- Visual: Click 'Sign In & Vault' in the permanent sidebar. Show the biometric status, encrypted ID, and zero-cloud indicator.
- Voiceover: "Security starts with zero-cloud compromise. In the Sign In & Vault screen, athlete data is encrypted directly on your device using military-grade AES-256 standards. Your biometric telemetry, 1RM power records, and body composition logs never leave your device without explicit authorization."
- On-Screen Text: Local AES-256 Encrypted Vault • Zero-Cloud Architecture

[SCENE 3: 0:50 - 1:25] OVERVIEW DASHBOARD & D3 TELEMETRY
- Visual: Navigate to Overview Dashboard. Tap '+15m Active Log' in the Tactical Hub to show live ring animation. Hover over the D3 weekly bar chart (Mon-Sun) and review recent session timeline.
- Voiceover: "The Overview Dashboard is your daily mission control. At a glance, track your active calories, daily reps, and training duration against personalized targets. The D3-powered chart visualizes your weekly training volume across Monday to Sunday, while the training history log captures workout volume, heart rate intensity, and form accuracy."
- On-Screen Text: Interactive D3 Charting • Live Tactical Telemetry Log

[SCENE 4: 1:25 - 2:05] FITNESS & MICRO-GOALS PLANNER
- Visual: Switch to Fitness & Routines. Highlight the 1RM benchmarks (155kg Squat, 112kg Bench, 195kg Deadlift). Tap 'Micro-Goals' tab. Click '+2.5kg' stepper on a progress tracking card. Open '+ Plan New Goal' modal, demonstrate one-click presets for Lifting and Endurance.
- Voiceover: "In the Fitness screen, athletes manage their core lifts and periodized routines. Our new Micro-Goals feature lets you engineer granular targets for weight lifting loads like squat and bench milestones, or endurance feats like sub-20 minute 5K runs. With on-card quick steppers, you can log PR progress with a single tap, while the Goal Planning modal provides one-click athletic presets."
- On-Screen Text: Periodized Routine Editor • Lifting & Endurance Micro-Goals

[SCENE 5: 2:05 - 2:45] 10-SPORT WORKSPACE & BIOMECHANICAL RADAR
- Visual: Open Sports Workspace. Click between sport tabs (Cricket, Football, Kabaddi, Basketball, Athletics). Point to the dual-athlete spider radar. Click '+ Add Metric' and input a custom scout metric.
- Voiceover: "FitSphere supports ten distinct Olympic and competitive disciplines — from Cricket pace bowling and Kabaddi raids to Swimming, Football, and Basketball. The interactive radar chart compares your biomechanical profile against benchmark standards across Speed, Power, Reaction, Agility, and Endurance. Record sport-specific metrics and view scout intelligence verdicts."
- On-Screen Text: 10 Competitive Sports • Biomechanical Radar Analysis

[SCENE 6: 2:45 - 3:30] FITSPHERE AI COACH (GEMINI 3.8 FLASH)
- Visual: Open FitSphere AI Coach. Point out the ultra-spacious chat area and slim telemetry HUD. Tap the '⚡ Generate today's custom workout routine' prompt. Show the thinking state, then review the calculated percentage loads and click the Voice Readout icon.
- Voiceover: "FitSphere AI Coach is powered by server-side Gemini 3.8 Flash with Google Search grounding. Unlike generic chatbots, it synchronizes your exact athletic telemetry — your 155kg squat, 112kg bench, and 14-day streak — to calculate precise wave periodization percentages. Enjoy rich formatting, interactive follow-up chips, one-click routine export, and Text-To-Speech audio readouts."
- On-Screen Text: Gemini 3.8 Flash • Real-Time Telemetry Synchronization

[SCENE 7: 3:30 - 4:10] GEAR & NUTRITION MARKETPLACE
- Visual: Navigate to Gear & Nutrition. Point to the local currency conversion badge (INR ₹ / USD $). Click '+ Become a Seller', fill in sample product details, and show it live on the product grid.
- Voiceover: "The Marketplace connects athletes with certified nutrition and professional equipment. Prices dynamically convert into your national currency — supporting 11 global currencies including INR, USD, EUR, and GBP. Athletes can also list their own equipment via the 'Become a Seller' portal with live card previews and instant catalog appending."
- On-Screen Text: 11 Global Currencies • Live "Become a Seller" Portal

[SCENE 8: 4:10 - 4:40] IDENTITY, AVATAR GALLERY & GYM SCALING
- Visual: Go to Settings. Open the Avatar Picker showing 24 athlete icons. Toggle Daylight mode and Gym-Tuned Scaling. Click the Phone View hardware frame toggle in the Top Navbar.
- Voiceover: "Customize your identity with our curated 24-athlete avatar gallery across Gym, Sports, and Anime presets. Set your nationality to automatically lock in your currency, and toggle Gym-Tuned Scaling for ultra-readable text in high-intensity gym environments. Finally, seamlessly switch between desktop widescreen view and mobile phone hardware frame."
- On-Screen Text: 24 Athlete Avatars • Gym-Tuned Scaling • Hardware Frame

[OUTRO: 4:40 - 5:00] CONCLUSION & CALL TO ACTION
- Visual: Return to the Dashboard in full desktop layout with glowing kinetic rings.
- Voiceover: "FitSphere AI is your ultimate athletic edge. Experience private, intelligent, and multi-sport performance today."
========================================================================`;

export const VideoTourModal: React.FC<VideoTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateToScreen,
  theme,
}) => {
  const [activeTab, setActiveTab] = useState<'walkthrough' | 'script' | 'tips'>('walkthrough');
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  const isLight = theme === 'daylight';

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIdx];
  const StepIcon = currentStep.icon;

  // Text-To-Speech audio readout for voiceover narration
  const handleToggleAudio = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleNextStep = () => {
    if (isPlayingAudio && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
    setCurrentStepIdx((prev) => (prev < TOUR_STEPS.length - 1 ? prev + 1 : 0));
  };

  const handlePrevStep = () => {
    if (isPlayingAudio && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
    setCurrentStepIdx((prev) => (prev > 0 ? prev - 1 : TOUR_STEPS.length - 1));
  };

  const handleJumpToScreen = (screen: ScreenType) => {
    if (isPlayingAudio && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
    onNavigateToScreen(screen);
    onClose();
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(FULL_VIDEO_SCRIPT_TEXT);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div
        className={`w-full max-w-3xl rounded-3xl border shadow-2xl transition-all my-auto overflow-hidden animate-scale-up ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900'
            : 'bg-[#0f172a] border-slate-700/80 text-slate-100 shadow-emerald-950/20'
        }`}
      >
        {/* Header Strip */}
        <div className="p-4 sm:p-5 border-b border-slate-700/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30 shadow-xs">
              <Video className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-base sm:text-lg tracking-tight">
                  Project Video Guide &amp; Walkthrough
                </h3>
                <span className="text-[10px] font-telemetry px-2 py-0.5 rounded-full font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  8-Scene Script
                </span>
              </div>
              <p className="text-xs text-slate-400 font-telemetry mt-0.5">
                Complete walkthrough instructions, voiceover screenplay, and live demonstration cues.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (isPlayingAudio && typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
              }
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls: Walkthrough vs Full Script vs Recording Tips */}
        <div className="px-4 sm:px-6 pt-3 border-b border-slate-700/25 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('walkthrough')}
            className={`py-2 px-3 text-xs font-telemetry font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'walkthrough'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            🎬 Scene-by-Scene Tour ({currentStepIdx + 1}/{TOUR_STEPS.length})
          </button>
          <button
            onClick={handleCopyScript}
            className={`py-2 px-3 text-xs font-telemetry font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'script'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedScript ? 'Copied Full Script!' : 'Full Video Script'}</span>
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`py-2 px-3 text-xs font-telemetry font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'tips'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📹 Recording Tips
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 max-h-[calc(85vh-140px)] overflow-y-auto scrollbar-thin space-y-4">
          {/* TAB 1: SCENE-BY-SCENE INTERACTIVE TOUR */}
          {activeTab === 'walkthrough' && (
            <div className="space-y-4">
              {/* Scene Navigator Bar */}
              <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-2xl text-xs font-telemetry">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <StepIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-display font-bold text-slate-200 block">
                      Scene {currentStep.id}: {currentStep.screenName}
                    </span>
                    <span className="text-[10px] text-cyan-400 font-telemetry">
                      Timestamp: {currentStep.timeRange}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevStep}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
                    title="Previous Scene"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-2 text-[11px] font-bold text-slate-400">
                    {currentStepIdx + 1} of {TOUR_STEPS.length}
                  </span>
                  <button
                    onClick={handleNextStep}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
                    title="Next Scene"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title & On-Screen Banner Callout */}
              <div className="space-y-1">
                <h4 className="font-display font-black text-base sm:text-lg text-emerald-400">
                  {currentStep.title}
                </h4>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-cyan-500/15 text-cyan-400 text-[10px] font-telemetry font-bold border border-cyan-500/30">
                  <span>Overlay Title:</span> {currentStep.onScreenText}
                </div>
              </div>

              {/* 1. Visual Camera Action (What to show on screen) */}
              <div className="p-3.5 rounded-2xl bg-[#141e33] border border-slate-700/80 space-y-1">
                <span className="text-[10px] font-telemetry uppercase text-amber-400 font-bold flex items-center gap-1">
                  <Monitor className="w-3.5 h-3.5" />
                  Visual Screen Direction (What to Record):
                </span>
                <p className="text-xs text-slate-200 font-body leading-relaxed">
                  {currentStep.visualAction}
                </p>
              </div>

              {/* 2. Voiceover Dialogue (What to say) */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-telemetry uppercase text-emerald-400 font-bold flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5" />
                    Voiceover Dialogue (What to Say):
                  </span>

                  <button
                    onClick={() => handleToggleAudio(currentStep.voiceoverScript)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-telemetry font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                      isPlayingAudio
                        ? 'bg-emerald-500 text-slate-950 animate-pulse border-emerald-400'
                        : 'bg-slate-900 text-emerald-400 hover:bg-slate-850 border-emerald-500/30'
                    }`}
                  >
                    {isPlayingAudio ? <VolumeX className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{isPlayingAudio ? 'Stop Narration' : 'Listen Voiceover'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 font-body leading-relaxed italic bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60">
                  &ldquo;{currentStep.voiceoverScript}&rdquo;
                </p>
              </div>

              {/* 3. Key Bullet Points */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-telemetry uppercase text-slate-400 font-bold block">
                  Core Highlights to Showcase:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {currentStep.keyFeatures.map((feat, fIdx) => (
                    <div
                      key={fIdx}
                      className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] font-telemetry text-slate-300 flex items-center gap-1.5"
                    >
                      <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Demonstration Button */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleJumpToScreen(currentStep.screenId)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-display font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer active:scale-95 transition-all"
                >
                  <span>Demonstrate This Screen Now</span>
                  <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevStep}
                    className="px-3 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-telemetry cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-telemetry font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>Next Scene</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FULL COPYABLE SCRIPT */}
          {activeTab === 'script' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-sm text-slate-200">
                    Production Screenplay &amp; Timestamps
                  </h4>
                  <p className="text-[11px] text-slate-400 font-telemetry">
                    Formatted text file ready to paste into your teleprompter or recording software.
                  </p>
                </div>

                <button
                  onClick={handleCopyScript}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-telemetry font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'Copied to Clipboard!' : 'Copy Entire Script'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-telemetry text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto select-all">
                {FULL_VIDEO_SCRIPT_TEXT}
              </pre>
            </div>
          )}

          {/* TAB 3: RECORDING TIPS */}
          {activeTab === 'tips' && (
            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <h5 className="font-display font-bold text-emerald-400 flex items-center gap-1.5">
                  <Monitor className="w-4 h-4" /> 1. Screen &amp; Resolution Setup
                </h5>
                <ul className="space-y-1 text-slate-300 list-disc pl-4 font-body leading-relaxed">
                  <li>Set recording resolution to <strong>1920×1080 (1080p)</strong> or <strong>2560×1440 (1440p)</strong> with 60 FPS.</li>
                  <li>Press <strong>F11</strong> to toggle fullscreen browser view, hiding browser bookmark bars and system taskbars.</li>
                  <li>Keep browser zoom at <strong>100%</strong> for pixel-perfect typography.</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <h5 className="font-display font-bold text-cyan-400 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" /> 2. Dual-Layout Demonstration (Desktop + Phone Frame)
                </h5>
                <ul className="space-y-1 text-slate-300 list-disc pl-4 font-body leading-relaxed">
                  <li>In Scene 1-7, record the wide multi-column desktop layout with the permanent sidebar.</li>
                  <li>In Scene 8, tap the <strong>Phone View button</strong> in the Top Navbar to show how FitSphere adapts to an iPhone hardware frame!</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <h5 className="font-display font-bold text-amber-400 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4" /> 3. Audio &amp; Voiceover Pacing
                </h5>
                <ul className="space-y-1 text-slate-300 list-disc pl-4 font-body leading-relaxed">
                  <li>Aim for an energetic, confident coaching tone at <strong>130 to 145 words per minute</strong>.</li>
                  <li>Use the <strong>&ldquo;Listen Voiceover&rdquo;</strong> button in Tab 1 to practice your cadence before recording.</li>
                  <li>Allow 1-2 seconds of pause between scenes so viewers can absorb the visuals.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
