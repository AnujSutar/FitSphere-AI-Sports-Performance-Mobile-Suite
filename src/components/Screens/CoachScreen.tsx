import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Globe,
  ExternalLink,
  RotateCcw,
  Zap,
  Loader2,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Flame,
  Dumbbell,
  HeartPulse,
  Apple,
  Target,
  ArrowRight,
  BookmarkCheck,
  Share2,
  ChevronDown,
  ChevronUp,
  Sliders,
  X,
  Lightbulb,
  MessageSquare,
  StopCircle,
} from 'lucide-react';
import { AthleteUser, ThemeMode } from '../../types';
import { sportsProfiles } from '../../data/mockData';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  webSources?: Array<{ title: string; uri: string }>;
  coachingMode?: string;
  followUps?: string[];
  status?: 'sent' | 'pending' | 'error';
}

interface CoachScreenProps {
  athlete: AthleteUser;
  theme: ThemeMode;
}

const COACHING_MODES = [
  { id: 'Biomechanics', label: 'Biomechanics & Form', icon: Dumbbell, color: 'text-emerald-400' },
  { id: '1RM Progression', label: '1RM & Power Scaling', icon: Zap, color: 'text-amber-400' },
  { id: 'Nutrition & Macros', label: 'Nutrition & Hydration', icon: Apple, color: 'text-rose-400' },
  { id: 'Recovery & Deload', label: 'Recovery & CNS Rest', icon: HeartPulse, color: 'text-cyan-400' },
  { id: 'Tactical Playbook', label: 'Tactical Drills & Game Plan', icon: Target, color: 'text-violet-400' },
];

type PromptCategory = 'all' | 'workouts' | 'strength' | 'nutrition' | 'recovery' | 'sport';

const LOADING_STATUS_STEPS = [
  'Connecting to FitSphere sports science engine...',
  'Analyzing athlete telemetry & 1RM baselines...',
  'Computing kinetic load percentages & force curves...',
  'Synthesizing sport-specific biomechanical cues...',
];

const STORAGE_KEY = 'fitsphere_coach_chat_history_v3';

export const CoachScreen: React.FC<CoachScreenProps> = ({ athlete, theme }) => {
  const [selectedSport, setSelectedSport] = useState<string>('General Sports Science');
  const [coachingMode, setCoachingMode] = useState<string>('Biomechanics');
  const [isTelemetryOpen, setIsTelemetryOpen] = useState<boolean>(false);
  const [isCuesOpen, setIsCuesOpen] = useState<boolean>(false);
  const [promptCategory, setPromptCategory] = useState<PromptCategory>('all');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState<number>(0);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [exportedMessageId, setExportedMessageId] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isLight = theme === 'daylight';

  // Initial welcome message factory
  const getInitialWelcomeMessage = (): ChatMessage => ({
    id: 'welcome-1',
    role: 'assistant',
    content: `Welcome to **FitSphere AI Coach**, **${athlete.name.split(' ')[0]}**!\n\nI have synchronized your live athletic telemetry:\n- **1RM Baseline:** Squat **${athlete.squat1RmKg}kg** • Bench **${athlete.bench1RmKg}kg** • Deadlift **${athlete.deadlift1RmKg}kg** (Total: **${athlete.squat1RmKg + athlete.bench1RmKg + athlete.deadlift1RmKg}kg**)\n- **Kinetic Streak:** **${athlete.streakDays} days active** • ${athlete.activeMinutesToday} min today\n- **Frame:** ${athlete.bodyMassKg}kg • ${athlete.heightCm}cm • ${athlete.nationality || 'India'}\n\nAsk me about periodized training routines, 1RM percentages, biomechanical form, or tactical drills!`,
    timestamp: 'Just now',
    coachingMode: 'Biomechanics',
    followUps: [
      '⚡ Give me a complete workout routine',
      `📈 Calculate 1RM loading for ${athlete.squat1RmKg}kg squat`,
      `🥗 Daily macros & protein for ${athlete.bodyMassKg}kg`,
    ],
  });

  // Restore conversation history from localStorage or fallback to initial
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore parse errors
    }
    return [getInitialWelcomeMessage()];
  });

  // Save history on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Ignore storage errors
    }
  }, [messages]);

  // Dynamic loading step rotator while thinking
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isLoading) {
      setLoadingStepIdx(0);
      interval = setInterval(() => {
        setLoadingStepIdx((prev) => (prev + 1) % LOADING_STATUS_STEPS.length);
      }, 1600);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Curated quick prompt database by category
  const getPromptCategoryCues = (): string[] => {
    switch (promptCategory) {
      case 'workouts':
        return [
          '⚡ Build a 4-day Push Pull Legs routine',
          '⚡ Full-body hypertrophy & speed routine',
          '⚡ Upper body strength with bench focus',
          '⚡ Lower body explosive power workout',
        ];
      case 'strength':
        return [
          `📈 Warm-up wave for squat PR above ${athlete.squat1RmKg}kg`,
          `📈 How to break bench press plateau at ${athlete.bench1RmKg}kg`,
          `📈 Deadlift lockout cues for ${athlete.deadlift1RmKg}kg`,
          '📈 RPE 8 vs RPE 9 wave loading table',
        ];
      case 'nutrition':
        return [
          `🥗 Daily calories & protein for ${athlete.bodyMassKg}kg frame`,
          '🥗 Creatine monohydrate saturation protocol',
          '🥗 Intra-workout hydration & electrolyte ratio',
          '🥗 Post-workout glycogen replenishment meal',
        ];
      case 'recovery':
        return [
          '🧊 Ice bath vs active recovery flush for hypertrophy',
          '🧊 Fast relief protocol for severe quad & hamstring DOMS',
          '🧊 Sleep architecture targets for peak growth hormone',
          '🧊 Deload week structure to restore CNS power',
        ];
      case 'sport':
        if (selectedSport === 'Cricket') {
          return [
            '🎯 140+ kph fast bowling crease landing mechanics',
            '🎯 Hip-to-shoulder separation for power hitting',
            '🎯 Rotator cuff deceleration drills for throwers',
            '🎯 Footwork speed drills for spin defense',
          ];
        }
        if (selectedSport === 'Football') {
          return [
            '🎯 Ball striking: plant foot to ankle lockout',
            '🎯 Repeat sprint ability (RSA) for 90-min stamina',
            '🎯 Reactive COD deceleration for wingers',
          ];
        }
        if (selectedSport === 'Kabaddi') {
          return [
            '🎯 Corner escape acceleration & raiding agility',
            '🎯 Ankle hold clamping force & grip conditioning',
            '🎯 Low center of gravity stance for chain defense',
          ];
        }
        if (selectedSport === 'Basketball') {
          return [
            '🎯 Vertical jump plant mechanics: penultimate step',
            '🎯 Lateral slide hip angle & reactive defensive footwork',
            '🎯 Plyometrics progression for rim finishes',
          ];
        }
        return [
          `🎯 Tactical movement and conditioning drills for ${selectedSport}`,
          '🎯 Sprint acceleration shin angles & ground contact time',
          '🎯 Rotational kinetic chain drills for maximum power',
        ];
      case 'all':
      default:
        return [
          '⚡ Generate today\'s custom workout routine',
          `📈 Squat wave progression for ${athlete.squat1RmKg}kg`,
          `🥗 Macro & nutrition targets for ${athlete.bodyMassKg}kg`,
          '🧊 Rapid recovery protocol for sore muscles',
          selectedSport !== 'General Sports Science'
            ? `🎯 Tactical cues for ${selectedSport}`
            : '📈 Bench press form breakdown & bar path',
        ];
    }
  };

  // Text-To-Speech audio readout
  const handleToggleSpeak = (msgId: string, text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Copy message to clipboard
  const handleCopyMessage = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(msgId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  // Export routine protocol
  const handleExportProtocol = (msgId: string, text: string) => {
    const formatted = `=== FitSphere AI Athletic Protocol ===\nAthlete: ${athlete.name} (${athlete.tier})\nDate: ${new Date().toLocaleDateString()}\nSport: ${selectedSport}\nLens: ${coachingMode}\n\n${text}\n\nGenerated by FitSphere AI Coach`;
    navigator.clipboard.writeText(formatted);
    setExportedMessageId(msgId);
    setTimeout(() => setExportedMessageId(null), 2500);
  };

  // Generate intelligent follow-up suggestions dynamically based on query & answer
  const determineFollowUps = (query: string, sport: string): string[] => {
    const q = query.toLowerCase();
    if (q.includes('workout') || q.includes('routine') || q.includes('exercise')) {
      return [
        `🥗 Post-workout nutrition for ${athlete.bodyMassKg}kg`,
        `📈 How do I scale this with my ${athlete.squat1RmKg}kg squat?`,
        '🧊 Recovery and foam rolling cooldown for this session',
      ];
    }
    if (q.includes('squat') || q.includes('bench') || q.includes('deadlift') || q.includes('1rm')) {
      return [
        '⚡ Build a complete workout around this lift',
        '📊 How often should I test my 1RM max?',
        '🛡️ Accessory exercises to fix sticking points',
      ];
    }
    if (q.includes('nutrition') || q.includes('macro') || q.includes('protein')) {
      return [
        '⚡ Pre-workout meal timing and caffeine dosage',
        '💊 Creatine and electrolyte hydration guide',
        '🏋️ Strength workout to match these macros',
      ];
    }
    if (q.includes('recovery') || q.includes('sore') || q.includes('sleep')) {
      return [
        '🧘 Active recovery vs complete rest day',
        '🥗 Nutrition protocol to accelerate muscle repair',
        '⚡ Light mobility flow for tight hips and back',
      ];
    }
    return [
      '⚡ Generate today\'s custom workout routine',
      `📈 Calculate exact 1RM percentage loads`,
      `🎯 Sport-specific drills for ${sport !== 'General Sports Science' ? sport : 'Cricket'}`,
    ];
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    // Close cues drawer once user sends a message to maximize reading space
    setIsCuesOpen(false);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // Build clean multi-turn payload that starts with a 'user' turn and omits notices
      const cleanHistory = messages
        .filter((m) => !m.content.startsWith('**FitSphere Telemetry Notice:**'))
        .map((m) => ({ role: m.role, content: m.content }));

      const firstUserIdx = cleanHistory.findIndex((m) => m.role === 'user');
      const historyToSend = firstUserIdx !== -1 ? cleanHistory.slice(firstUserIdx) : [];
      const payloadMessages = [...historyToSend, { role: 'user', content: text }];

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: payloadMessages,
          sport: selectedSport !== 'General Sports Science' ? selectedSport : undefined,
          coachingMode,
          athleteProfile: {
            name: athlete.name,
            tier: athlete.tier,
            experience: athlete.experience,
            bodyMassKg: athlete.bodyMassKg,
            heightCm: athlete.heightCm,
            squat1RmKg: athlete.squat1RmKg,
            bench1RmKg: athlete.bench1RmKg,
            deadlift1RmKg: athlete.deadlift1RmKg,
            streakDays: athlete.streakDays,
            activeMinutesToday: athlete.activeMinutesToday,
            fitnessGoal: athlete.fitnessGoal,
            availableEquipment: athlete.availableEquipment,
            nationality: athlete.nationality,
            biography: athlete.biography,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Server error occurred');
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.text || 'No response received.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        webSources: data.webSources || [],
        coachingMode,
        followUps: determineFollowUps(text, selectedSport),
        status: 'sent',
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        const cancelMsg: ChatMessage = {
          id: `cancelled-${Date.now()}`,
          role: 'assistant',
          content: 'Coaching generation cancelled by athlete.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          coachingMode,
        };
        setMessages((prev) => [...prev, cancelMsg]);
        return;
      }

      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `**FitSphere Telemetry Notice:** ${err.message || 'Unable to connect to FitSphere AI Coach server.'}\n\nOur built-in biomechanics engine is operational. Try asking another question or tapping a suggested cue.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        coachingMode,
        followUps: [
          '⚡ Give me a complete workout routine',
          `📈 Squat wave progression for ${athlete.squat1RmKg}kg`,
          `🥗 Macro targets for ${athlete.bodyMassKg}kg`,
        ],
        status: 'error',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleClearChat = () => {
    if (speakingMessageId && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }
    const freshWelcome = getInitialWelcomeMessage();
    setMessages([freshWelcome]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  // Keyboard shortcut for Enter to submit, Shift+Enter for newline
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Render text with Markdown bold and bullet point lists cleanly
  const renderMessageContent = (content: string, isUser: boolean) => {
    const paragraphs = content.split('\n\n');

    return (
      <div className="space-y-2.5">
        {paragraphs.map((p, pIdx) => {
          const trimmed = p.trim();

          // Heading 3
          if (trimmed.startsWith('### ')) {
            return (
              <h3
                key={pIdx}
                className={`font-display font-extrabold text-sm tracking-tight border-b pb-1 ${
                  isUser
                    ? 'text-slate-950 border-slate-900/20'
                    : 'text-emerald-400 border-slate-700/40'
                }`}
              >
                {trimmed.replace('### ', '')}
              </h3>
            );
          }

          // Heading 4
          if (trimmed.startsWith('#### ')) {
            return (
              <h4
                key={pIdx}
                className={`font-display font-bold text-xs uppercase tracking-wider mt-2 ${
                  isUser ? 'text-slate-950' : 'text-cyan-400'
                }`}
              >
                {trimmed.replace('#### ', '')}
              </h4>
            );
          }

          // Bullet list or numbered list
          const lines = trimmed.split('\n');
          const isList = lines.every(
            (l) =>
              l.trim().startsWith('- ') ||
              l.trim().startsWith('* ') ||
              /^\d+\.\s/.test(l.trim()) ||
              l.trim() === ''
          );

          if (isList) {
            return (
              <ul key={pIdx} className="space-y-1.5 pl-1 my-1">
                {lines.map((line, lIdx) => {
                  const cleanLine = line
                    .replace(/^[-*]\s+/, '')
                    .replace(/^\d+\.\s+/, '');
                  if (!cleanLine.trim()) return null;

                  return (
                    <li key={lIdx} className="flex items-start gap-2 text-xs leading-relaxed">
                      <span
                        className={`inline-block w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                          isUser ? 'bg-slate-950' : 'bg-emerald-400'
                        }`}
                      />
                      <span className="flex-1">
                        {cleanLine.split('**').map((chunk, cIdx) =>
                          cIdx % 2 === 1 ? (
                            <strong
                              key={cIdx}
                              className={isUser ? 'font-black text-slate-950' : 'font-bold text-emerald-300'}
                            >
                              {chunk}
                            </strong>
                          ) : (
                            chunk
                          )
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            );
          }

          // Normal Paragraph
          return (
            <p key={pIdx} className="text-xs leading-relaxed whitespace-pre-wrap">
              {trimmed.split('**').map((chunk, cIdx) =>
                cIdx % 2 === 1 ? (
                  <strong
                    key={cIdx}
                    className={isUser ? 'font-black text-slate-950' : 'font-bold text-emerald-400'}
                  >
                    {chunk}
                  </strong>
                ) : (
                  chunk
                )
              )}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col h-[calc(100vh-130px)] md:h-[calc(100vh-95px)] px-2 sm:px-4 pb-20 md:pb-3 pt-1">
      {/* 1. Ultra-Compact Slim Control Strip (Saves 80% vertical space!) */}
      <div
        className={`px-3 py-2 rounded-2xl border mb-2 shrink-0 transition-all ${
          isLight
            ? 'bg-white border-slate-200 shadow-xs'
            : 'bg-[#10192e] border-slate-800 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          {/* Left: Branding & Active Mode Indicator */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative shrink-0">
              <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-xs">
                <Bot className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse" />
            </div>

            <div className="flex items-center gap-1.5 truncate">
              <span className="font-display font-extrabold text-xs sm:text-sm text-slate-100 truncate">
                FitSphere AI Coach
              </span>
              <span className="text-[10px] font-telemetry px-1.5 py-0.2 rounded-md font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shrink-0 hidden xs:inline">
                gemini-3.8-flash
              </span>
              <span className="text-[10px] font-telemetry px-1.5 py-0.2 rounded-md font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0 hidden sm:inline">
                {selectedSport !== 'General Sports Science' ? selectedSport : 'All Sports'} • {coachingMode}
              </span>
            </div>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center gap-1.5 shrink-0 ml-auto">
            {/* Quick Cues Toggle */}
            <button
              onClick={() => setIsCuesOpen(!isCuesOpen)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-telemetry font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                isCuesOpen
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-xs'
                  : isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  : 'bg-slate-800/80 hover:bg-slate-750 text-cyan-400 border-cyan-500/30'
              }`}
              title="Toggle Prompt Suggestions"
            >
              <Lightbulb className="w-3 h-3" />
              <span>Cues</span>
              {isCuesOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {/* Telemetry & Lens Accordion Toggle */}
            <button
              onClick={() => setIsTelemetryOpen(!isTelemetryOpen)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-telemetry font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                isTelemetryOpen
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-xs'
                  : isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  : 'bg-slate-800/80 hover:bg-slate-750 text-slate-300 border-slate-700'
              }`}
              title="Expand Telemetry & Sport Lens"
            >
              <Sliders className="w-3 h-3 text-emerald-400" />
              <span className="hidden sm:inline">Telemetry &amp; Lens</span>
              <span className="sm:hidden">Controls</span>
              {isTelemetryOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {/* Clear / New Session */}
            <button
              onClick={handleClearChat}
              title="Start a new coaching session"
              className={`p-1.5 rounded-xl border text-slate-400 hover:text-white transition-colors cursor-pointer ${
                isLight
                  ? 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                  : 'bg-slate-800/80 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 1A. Collapsible Telemetry & Lens Drawer (Hidden by default to give MAX space to chat) */}
        {isTelemetryOpen && (
          <div className="mt-2.5 pt-2.5 border-t border-slate-700/30 animate-fade-in space-y-2.5">
            {/* Live Athlete Telemetry Ribbon */}
            <div className="flex items-center justify-between flex-wrap gap-2 text-[10px] font-telemetry">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <span className="text-slate-400 font-bold uppercase tracking-wider">
                  Live Telemetry:
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-emerald-400 font-bold border border-slate-700">
                  Squat: {athlete.squat1RmKg}kg
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-emerald-400 font-bold border border-slate-700">
                  Bench: {athlete.bench1RmKg}kg
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-emerald-400 font-bold border border-slate-700">
                  Deadlift: {athlete.deadlift1RmKg}kg
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30 flex items-center gap-0.5">
                  <Flame className="w-3 h-3 fill-amber-400" /> {athlete.streakDays}d Streak
                </span>
              </div>
              <span className="text-slate-400">
                {athlete.name} • {athlete.bodyMassKg}kg • {athlete.nationality || 'India'}
              </span>
            </div>

            {/* Coaching Lens & Sport Dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-700/20">
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0.5">
                <span className="text-[10px] font-telemetry text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                  Focus Lens:
                </span>
                {COACHING_MODES.map((mode) => {
                  const Icon = mode.icon;
                  const isActive = coachingMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setCoachingMode(mode.id)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-telemetry font-bold flex items-center gap-1 shrink-0 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-500 text-slate-950 shadow-xs'
                          : isLight
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <Icon className="w-2.5 h-2.5" />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] font-telemetry text-slate-400 uppercase tracking-wider">
                  Sport:
                </span>
                <select
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className={`text-xs font-telemetry font-bold px-2 py-1 rounded-lg border outline-hidden cursor-pointer ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-800'
                      : 'bg-slate-900 border-slate-700 text-emerald-400'
                  }`}
                >
                  <option value="General Sports Science">All Disciplines</option>
                  {sportsProfiles.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 1B. Collapsible Quick Cues Drawer */}
        {isCuesOpen && (
          <div className="mt-2.5 pt-2.5 border-t border-slate-700/30 animate-fade-in space-y-1.5">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0.5">
              {[
                { id: 'all', label: 'All Cues' },
                { id: 'workouts', label: '⚡ Workouts' },
                { id: 'strength', label: '🏋️ 1RM & Lifts' },
                { id: 'nutrition', label: '🥗 Nutrition' },
                { id: 'recovery', label: '🧊 Recovery' },
                { id: 'sport', label: `🎯 ${selectedSport !== 'General Sports Science' ? selectedSport : 'Sport Drills'}` },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setPromptCategory(cat.id as PromptCategory)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-telemetry font-semibold transition-all shrink-0 cursor-pointer ${
                    promptCategory === cat.id
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : isLight
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Chips for the active category */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {getPromptCategoryCues().map((qp, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(qp)}
                  disabled={isLoading}
                  className={`shrink-0 px-2.5 py-1 rounded-xl text-[10px] font-telemetry border transition-all text-left truncate max-w-[280px] cursor-pointer ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50/40'
                      : 'bg-[#152038] border-slate-800 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300'
                  }`}
                >
                  {qp}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Primary Conversational Messages Thread (Occupies >75% of Screen Height) */}
      <div
        className={`flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-4 rounded-2xl border space-y-3.5 scrollbar-thin ${
          isLight
            ? 'bg-slate-50/70 border-slate-200'
            : 'bg-[#0c1426]/95 border-slate-800/80 shadow-inner'
        }`}
      >
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isSpeaking = speakingMessageId === msg.id;
          const isCopied = copiedMessageId === msg.id;
          const isExported = exportedMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[90%] sm:max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed font-body relative group ${
                    isUser
                      ? 'bg-emerald-500 text-slate-950 font-medium rounded-br-xs shadow-md shadow-emerald-500/20'
                      : isLight
                      ? 'bg-white border border-slate-200 text-slate-900 shadow-sm rounded-bl-xs'
                      : 'bg-[#16213a] border border-slate-700/80 text-slate-100 rounded-bl-xs shadow-sm'
                  }`}
                >
                  {/* Assistant Message Header Pill */}
                  {!isUser && (
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700/25 text-[10px] font-telemetry">
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        FitSphere AI Performance Coach
                        {msg.coachingMode && (
                          <span className="text-slate-400 font-normal">
                            • {msg.coachingMode}
                          </span>
                        )}
                      </span>

                      {/* Action buttons: Speech, Copy, Export Protocol */}
                      <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleToggleSpeak(msg.id, msg.content)}
                          title={isSpeaking ? 'Stop Voice Readout' : 'Listen to Audio Cue'}
                          className={`p-1 rounded-md transition-colors cursor-pointer ${
                            isSpeaking
                              ? 'bg-emerald-500 text-slate-950 animate-pulse'
                              : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          title="Copy text to clipboard"
                          className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => handleExportProtocol(msg.id, msg.content)}
                          title="Export Protocol / Routine"
                          className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          {isExported ? (
                            <BookmarkCheck className="w-3.5 h-3.5 text-cyan-400" />
                          ) : (
                            <Share2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Message Content formatted with line breaks, headers, lists and markdown boldness */}
                  {renderMessageContent(msg.content, isUser)}

                  {/* Google Search Grounding Sources */}
                  {msg.webSources && msg.webSources.length > 0 && (
                    <div className="mt-3.5 pt-2.5 border-t border-slate-700/30">
                      <span className="text-[10px] font-telemetry uppercase text-slate-400 font-bold block mb-1.5 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-emerald-400" />
                        Verified Citations:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.webSources.map((source, sIdx) => (
                          <a
                            key={sIdx}
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 text-[10px] font-telemetry transition-all hover:scale-102"
                          >
                            <span className="truncate max-w-[170px]">{source.title}</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Follow-up Action Chips (Interactive Next Steps) */}
                  {!isUser && msg.followUps && msg.followUps.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-700/25">
                      <span className="text-[9px] font-telemetry uppercase text-slate-400 font-bold block mb-1">
                        Recommended Next Inquiries:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.followUps.map((action, aIdx) => (
                          <button
                            key={aIdx}
                            onClick={() => handleSendMessage(action)}
                            disabled={isLoading}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-telemetry transition-all hover:translate-x-0.5 cursor-pointer"
                          >
                            <span>{action}</span>
                            <ArrowRight className="w-2.5 h-2.5 shrink-0 opacity-70" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <span className="text-[9px] font-telemetry text-slate-500 mt-1 px-1 block">
                  {msg.timestamp}
                </span>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5 shadow-xs overflow-hidden">
                  {athlete.avatar ? (
                    <img src={athlete.avatar} alt={athlete.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* 2A. Enhanced Multi-Stage AI Loading State */}
        {isLoading && (
          <div className="flex gap-2.5 items-start animate-fade-in">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>

            <div
              className={`p-3.5 rounded-2xl text-xs rounded-bl-xs border flex flex-col gap-2 min-w-[280px] max-w-md ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#16213a] border-slate-700/80 shadow-md'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
                  <span className="text-slate-100 font-telemetry font-bold text-xs">
                    FitSphere AI Coach Thinking...
                  </span>
                </div>
                <button
                  onClick={handleStopGeneration}
                  title="Stop Response"
                  className="px-2 py-0.5 rounded-md bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-[9px] font-telemetry flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <StopCircle className="w-3 h-3" />
                  <span>Stop</span>
                </button>
              </div>

              {/* Dynamic status ticker */}
              <div className="px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[10px] font-telemetry text-emerald-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="truncate">{LOADING_STATUS_STEPS[loadingStepIdx]}</span>
              </div>

              {/* Animated wave bars */}
              <div className="flex items-center gap-1 pt-1">
                <div className="h-1 flex-1 bg-emerald-500/20 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 animate-pulse rounded-full w-full" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. High-Clarity Chat Input Field & Controls */}
      <div className="mt-2 shrink-0">
        {/* Subtle active context pill directly above the input */}
        <div className="flex items-center justify-between px-2 py-1 text-[10px] font-telemetry text-slate-400 mb-1">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            <span className="truncate">
              Inquiring in <strong className="text-emerald-400">{selectedSport !== 'General Sports Science' ? selectedSport : 'All Sports'}</strong> ({coachingMode})
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsTelemetryOpen(true)}
              className="text-cyan-400 hover:underline cursor-pointer"
            >
              Tune telemetry
            </button>
            <span className="text-slate-600 hidden sm:inline">• Enter ↵ to send</span>
          </div>
        </div>

        {/* Input Bar Card */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className={`p-1.5 sm:p-2 rounded-2xl border transition-all flex items-end gap-2 ${
            isLight
              ? 'bg-white border-slate-300 focus-within:border-emerald-500 shadow-md'
              : 'bg-[#121b2f] border-slate-700/80 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/20 shadow-lg'
          }`}
        >
          {/* Quick Cues trigger inside input */}
          <button
            type="button"
            onClick={() => setIsCuesOpen(!isCuesOpen)}
            title="Suggested Cues"
            className={`p-2 rounded-xl border transition-colors cursor-pointer shrink-0 mb-0.5 ${
              isCuesOpen
                ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                : isLight
                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200'
                : 'bg-slate-800 text-slate-400 hover:text-cyan-300 border-slate-700'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
          </button>

          {/* Textarea Input */}
          <div className="relative flex-1">
            <textarea
              ref={inputRef}
              rows={1}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask coach about ${selectedSport !== 'General Sports Science' ? selectedSport : 'training'} (e.g. workout routine, 1RM loading, recovery)...`}
              disabled={isLoading}
              className={`w-full py-2 px-2 resize-none max-h-32 text-xs font-body outline-hidden bg-transparent transition-all scrollbar-none leading-relaxed ${
                isLight ? 'text-slate-900 placeholder:text-slate-400' : 'text-slate-100 placeholder:text-slate-500'
              }`}
            />

            {/* Clear Input Button */}
            {inputMessage.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setInputMessage('');
                  inputRef.current?.focus();
                }}
                className="absolute right-1 top-2 p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
                title="Clear input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* High-Contrast Send Button */}
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-telemetry font-bold hover:bg-emerald-400 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1.5 active:scale-95 glow-kinetic-green cursor-pointer shadow-md shadow-emerald-500/20 shrink-0 mb-0.5"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span className="hidden xs:inline">Ask Coach</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
