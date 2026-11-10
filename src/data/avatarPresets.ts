export interface AthleteAvatarIcon {
  id: string;
  name: string;
  category: 'gym' | 'sports' | 'animated' | 'portraits';
  categoryLabel: string;
  url: string;
  tag: string;
  emoji: string;
}

// 1. GYM & FITNESS AVATARS ("jim avtar")
export const GYM_AVATARS: AthleteAvatarIcon[] = [
  {
    id: 'gym-barbell-powerlifter',
    name: 'Iron Powerlifter',
    category: 'gym',
    categoryLabel: 'Gym & Iron',
    emoji: '🏋️‍♂️',
    tag: 'Heavy Squat & Deadlift',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='bgGym1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%231e293b'/%3E%3Cstop offset='100%25' stop-color='%230f172a'/%3E%3C/linearGradient%3E%3ClinearGradient id='plateGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2310b981'/%3E%3Cstop offset='100%25' stop-color='%23047857'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' rx='28' fill='url(%23bgGym1)' stroke='%23334155' stroke-width='2'/%3E%3C!-- Barbell Bar --%3E%3Crect x='10' y='57' width='100' height='6' rx='3' fill='%2394a3b8'/%3E%3C!-- Plates Left --%3E%3Crect x='20' y='32' width='8' height='56' rx='3' fill='url(%23plateGrad)'/%3E%3Crect x='29' y='38' width='6' height='44' rx='2' fill='%23059669'/%3E%3Crect x='16' y='46' width='4' height='28' rx='2' fill='%2364748b'/%3E%3C!-- Plates Right --%3E%3Crect x='92' y='32' width='8' height='56' rx='3' fill='url(%23plateGrad)'/%3E%3Crect x='85' y='38' width='6' height='44' rx='2' fill='%23059669'/%3E%3Crect x='100' y='46' width='4' height='28' rx='2' fill='%2364748b'/%3E%3C!-- Lifter Silhouette Grip --%3E%3Ccircle cx='60' cy='36' r='12' fill='%23f1f5f9'/%3E%3Cpath d='M44 68 C44 54, 76 54, 76 68 L78 98 L42 98 Z' fill='%2310b981'/%3E%3Cpath d='M38 58 L48 54 M82 58 L72 54' stroke='%23f1f5f9' stroke-width='4' stroke-linecap='round'/%3E%3C!-- Kinetic Sparkle --%3E%3Ccircle cx='60' cy='60' r='3' fill='%2334d399'/%3E%3C/svg%3E",
  },
  {
    id: 'gym-dumbbell-warrior',
    name: 'Dumbbell Warrior',
    category: 'gym',
    categoryLabel: 'Gym & Iron',
    emoji: '💪',
    tag: 'Hypertrophy & Pump',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='bgDb' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23134e4a'/%3E%3Cstop offset='100%25' stop-color='%23042f2e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' rx='28' fill='url(%23bgDb)' stroke='%230d9488' stroke-width='2'/%3E%3C!-- Hex Dumbbell 1 (Angled) --%3E%3Cg transform='translate(60,60) rotate(45) translate(-60,-60)'%3E%3Crect x='34' y='56' width='52' height='8' rx='3' fill='%23cbd5e1'/%3E%3Cpolygon points='26,42 34,46 34,74 26,78 18,74 18,46' fill='%232dd4bf' stroke='%23ffffff' stroke-width='2'/%3E%3Cpolygon points='102,42 94,46 94,74 102,78 110,74 110,46' fill='%232dd4bf' stroke='%23ffffff' stroke-width='2'/%3E%3C/g%3E%3C!-- Crossed Dumbbell 2 --%3E%3Cg transform='translate(60,60) rotate(-45) translate(-60,-60)'%3E%3Crect x='34' y='56' width='52' height='8' rx='3' fill='%23cbd5e1'/%3E%3Cpolygon points='26,42 34,46 34,74 26,78 18,74 18,46' fill='%2314b8a6' stroke='%23ffffff' stroke-width='2'/%3E%3Cpolygon points='102,42 94,46 94,74 102,78 110,74 110,46' fill='%2314b8a6' stroke='%23ffffff' stroke-width='2'/%3E%3C/g%3E%3Ccircle cx='60' cy='60' r='10' fill='%23ffffff'/%3E%3Cpath d='M60 54 L60 66 M54 60 L66 60' stroke='%230f766e' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E",
  },
  {
    id: 'gym-kettlebell-master',
    name: 'Kettlebell Specialist',
    category: 'gym',
    categoryLabel: 'Gym & Iron',
    emoji: '⚡',
    tag: 'Functional Power & Swings',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='bgKb' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2318181b'/%3E%3Cstop offset='100%25' stop-color='%2309090b'/%3E%3C/linearGradient%3E%3ClinearGradient id='kbIron' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23f59e0b'/%3E%3Cstop offset='100%25' stop-color='%23b45309'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' rx='28' fill='url(%23bgKb)' stroke='%23d97706' stroke-width='2'/%3E%3C!-- Kettlebell Handle --%3E%3Cpath d='M44 48 C44 26, 76 26, 76 48' fill='none' stroke='%23e2e8f0' stroke-width='7' stroke-linecap='round'/%3E%3C!-- Kettlebell Body --%3E%3Ccircle cx='60' cy='72' r='28' fill='url(%23kbIron)'/%3E%3Ccircle cx='60' cy='72' r='16' fill='%2378350f' opacity='0.4'/%3E%3Ctext x='60' y='76' font-family='sans-serif' font-weight='900' font-size='13' fill='%23ffffff' text-anchor='middle'%3E24KG%3C/text%3E%3C!-- Kinetic arcs --%3E%3Cpath d='M20 72 A40 40 0 0 1 60 20' fill='none' stroke='%23fbbf24' stroke-width='3' stroke-dasharray='4 4'/%3E%3C/svg%3E",
  },
  {
    id: 'gym-calisthenics-rings',
    name: 'Calisthenics Ring Titan',
    category: 'gym',
    categoryLabel: 'Gym & Iron',
    emoji: '🤸‍♂️',
    tag: 'Iron Cross & Muscle-Up',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='bgRings' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23312e81'/%3E%3Cstop offset='100%25' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' rx='28' fill='url(%23bgRings)' stroke='%236366f1' stroke-width='2'/%3E%3C!-- Straps --%3E%3Cline x1='36' y1='10' x2='36' y2='45' stroke='%23a5b4fc' stroke-width='3'/%3E%3Cline x1='84' y1='10' x2='84' y2='45' stroke='%23a5b4fc' stroke-width='3'/%3E%3C!-- Rings --%3E%3Ccircle cx='36' cy='56' r='12' fill='none' stroke='%23fbbf24' stroke-width='4'/%3E%3Ccircle cx='84' cy='56' r='12' fill='none' stroke='%23fbbf24' stroke-width='4'/%3E%3C!-- Athlete Torso in Iron Cross --%3E%3Ccircle cx='60' cy='46' r='10' fill='%23ffffff'/%3E%3Cpath d='M36 56 L60 62 L84 56' stroke='%23ffffff' stroke-width='5' stroke-linecap='round' fill='none'/%3E%3Cpolygon points='60,62 52,94 68,94' fill='%23818cf8'/%3E%3C/svg%3E",
  },
  {
    id: 'gym-bodybuilder-titan',
    name: 'Muscular Titan',
    category: 'gym',
    categoryLabel: 'Gym & Iron',
    emoji: '🏆',
    tag: 'Classic Physique & Mass',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='bgTitan' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23701a75'/%3E%3Cstop offset='100%25' stop-color='%234a044e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' rx='28' fill='url(%23bgTitan)' stroke='%23c026d3' stroke-width='2'/%3E%3Ccircle cx='60' cy='32' r='11' fill='%23fae8ff'/%3E%3C!-- V-Taper Torso & Delts --%3E%3Cpath d='M30 48 Q40 40 60 44 Q80 40 90 48 Q94 62 82 72 L68 96 L52 96 L38 72 Q26 62 30 48 Z' fill='%23e879f9'/%3E%3C!-- Chest Definition --%3E%3Cpath d='M44 58 Q60 66 60 76 Q60 66 76 58' stroke='%234a044e' stroke-width='3' fill='none' stroke-linecap='round'/%3E%3C!-- Biceps Flare --%3E%3Ccircle cx='24' cy='46' r='8' fill='%23f0abfc'/%3E%3Ccircle cx='96' cy='46' r='8' fill='%23f0abfc'/%3E%3C/svg%3E",
  },
  {
    id: 'gym-cardio-beast',
    name: 'Telemetry Beast',
    category: 'gym',
    categoryLabel: 'Gym & Iron',
    emoji: '❤️‍🔥',
    tag: 'Zone 5 Aerobic Engine',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='bgCardio' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23991b1b'/%3E%3Cstop offset='100%25' stop-color='%23450a0a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' rx='28' fill='url(%23bgCardio)' stroke='%23ef4444' stroke-width='2'/%3E%3C!-- Pulse Line Behind --%3E%3Cpath d='M16 60 L40 60 L48 36 L56 86 L66 48 L74 68 L82 60 L104 60' fill='none' stroke='%23fca5a5' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C!-- Glowing Core Heart --%3E%3Ccircle cx='60' cy='60' r='18' fill='%23ef4444' stroke='%23ffffff' stroke-width='3'/%3E%3Cpath d='M54 58 L60 52 L66 58 C68 62 60 70 60 70 C60 70 52 62 54 58 Z' fill='%23ffffff'/%3E%3C/svg%3E",
  },
];

// 2. SPORTS AVATARS ("sports avtar")
export const SPORTS_AVATARS: AthleteAvatarIcon[] = [
  {
    id: 'sport-basketball-dunk',
    name: 'Basketball Slammer',
    category: 'sports',
    categoryLabel: 'Sports Disciplines',
    emoji: '🏀',
    tag: 'Hoops, Vertical & Agility',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='bgBb' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23ea580c'/%3E%3Cstop offset='100%25' stop-color='%237c2d12'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' rx='28' fill='url(%23bgBb)' stroke='%23f97316' stroke-width='2'/%3E%3C!-- Basketball Rim Net --%3E%3Cline x1='20' y1='36' x2='48' y2='36' stroke='%23ffffff' stroke-width='4' stroke-linecap='round'/%3E%3Cpolygon points='24,36 30,56 42,56 46,36' fill='none' stroke='%23ffedd5' stroke-width='2' stroke-dasharray='3 3'/%3E%3C!-- High Flying Basketball --%3E%3Ccircle cx='76' cy='40' r='22' fill='%23f97316' stroke='%23ffffff' stroke-width='3'/%3E%3Cpath d='M54 40 H98 M76 18 V62' stroke='%23431407' stroke-width='2'/%3E%3Cpath d='M62 26 C72 34 72 46 62 54 M90 26 C80 34 80 46 90 54' stroke='%23431407' stroke-width='2' fill='none'/%3E%3C!-- Player hand dunking --%3E%3Cpath d='M68 20 L84 26 L96 44' stroke='%23ffffff' stroke-width='5' stroke-linecap='round' fill='none'/%3E%3Ctext x='34' y='96' font-family='sans-serif' font-weight='900' font-size='14' fill='%23ffedd5'%3E%2323%3C/text%3E%3C/svg%3E",
  },
  {
    id: 'sport-cricket-legend',
    name: 'Cricket Legend',
    category: 'sports',
    categoryLabel: 'Sports Disciplines',
    emoji: '🏏',
    tag: 'Batting, Pace & Spin',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='bgCk' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%230284c7'/%3E%3Cstop offset='100%25' stop-color='%23075985'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' rx='28' fill='url(%23bgCk)' stroke='%2338bdf8' stroke-width='2'/%3E%3C!-- Cricket Bat Angled --%3E%3Cg transform='translate(60,60) rotate(-35) translate(-60,-60)'%3E%3Crect x='55' y='18' width='10' height='26' rx='3' fill='%23cbd5e1' stroke='%23ffffff' stroke-width='1.5'/%3E%3Cpath d='M50 44 L70 44 L68 96 L52 96 Z' fill='%23fed7aa' stroke='%23c2410c' stroke-width='3'/%3E%3Cline x1='60' y1='48' x2='60' y2='92' stroke='%23ea580c' stroke-width='2'/%3E%3C/g%3E%3C!-- Red Leather Seam Ball --%3E%3Ccircle cx='84' cy='46' r='14' fill='%23dc2626' stroke='%23ffffff' stroke-width='2'/%3E%3Cpath d='M74 46 C79 40 89 40 94 46' stroke='%23ffffff' stroke-width='2' stroke-dasharray='2 2' fill='none'/%3E%3C!-- Stumps outline --%3E%3Cline x1='26' y1='65' x2='26' y2='98' stroke='%23f8fafc' stroke-width='3'/%3E%3Cline x1='34' y1='65' x2='34' y2='98' stroke='%23f8fafc' stroke-width='3'/%3E%3Cline x1='42' y1='65' x2='42' y2='98' stroke='%23f8fafc' stroke-width='3'/%3E%3Cline x1='24' y1='65' x2='44' y2='65' stroke='%23f8fafc' stroke-width='3'/%3E%3C/svg%3E",
  },
  {
    id: 'sport-football-striker',
    name: 'Soccer / Football Ace',
    category: 'sports',
    categoryLabel: 'Sports Disciplines',
    emoji: '⚽',
    tag: 'Striker, Dribble & Precision',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='bgFb' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2315803d'/%3E%3Cstop offset='100%25' stop-color='%2314532d'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' rx='28' fill='url(%23bgFb)' stroke='%2322c55e' stroke-width='2'/%3E%3C!-- Electric Soccer Ball with Speed Flames --%3E%3Ccircle cx='56' cy='56' r='26' fill='%23ffffff' stroke='%230f172a' stroke-width='3'/%3E%3Cpolygon points='56,44 67,52 63,65 49,65 45,52' fill='%230f172a'/%3E%3Cline x1='56' y1='44' x2='56' y2='30' stroke='%230f172a' stroke-width='2.5'/%3E%3Cline x1='67' y1='52' x2='78' y2='46' stroke='%230f172a' stroke-width='2.5'/%3E%3Cline x1='63' y1='65' x2='74' y2='74' stroke='%230f172a' stroke-width='2.5'/%3E%3Cline x1='49' y1='65' x2='38' y2='74' stroke='%230f172a' stroke-width='2.5'/%3E%3Cline x1='45' y1='52' x2='34' y2='46' stroke='%230f172a' stroke-width='2.5'/%3E%3C!-- Kinetic Green Curving Streaks --%3E%3Cpath d='M86 36 Q106 56 86 76' fill='none' stroke='%2386efac' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E",
  },
  {
    id: 'sport-boxing-champ',
    name: 'Boxing & MMA Champ',
    category: 'sports',
    categoryLabel: 'Sports Disciplines',
    emoji: '🥊',
    tag: 'Punch Velocity & Guard',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='bgBox' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23b91c1c'/%3E%3Cstop offset='100%25' stop-color='%23450a0a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' rx='28' fill='url(%23bgBox)' stroke='%23f87171' stroke-width='2'/%3E%3C!-- Left Glove --%3E%3Cpath d='M32 40 C32 26 54 26 56 42 L58 66 C58 74 46 76 38 72 C32 68 32 54 32 40 Z' fill='%23ef4444' stroke='%23ffffff' stroke-width='2.5'/%3E%3Crect x='34' y='70' width='22' height='10' rx='2' fill='%23f8fafc'/%3E%3C!-- Right Glove Crossed --%3E%3Cpath d='M88 40 C88 26 66 26 64 42 L62 66 C62 74 74 76 82 72 C88 68 88 54 88 40 Z' fill='%23dc2626' stroke='%23ffffff' stroke-width='2.5'/%3E%3Crect x='64' y='70' width='22' height='10' rx='2' fill='%23f8fafc'/%3E%3C!-- Gold Crown at top --%3E%3Cpolygon points='48,22 54,30 60,18 66,30 72,22 70,32 50,32' fill='%23facc15' stroke='%23ca8a04' stroke-width='1.5'/%3E%3C/svg%3E",
  },
  {
    id: 'sport-tennis-ace',
    name: 'Tennis Ace',
    category: 'sports',
    categoryLabel: 'Sports Disciplines',
    emoji: '🎾',
    tag: '130mph Serve & Spin',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='bgTen' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%230f766e'/%3E%3Cstop offset='100%25' stop-color='%23134e4a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' rx='28' fill='url(%23bgTen)' stroke='%232dd4bf' stroke-width='2'/%3E%3C!-- Tennis Racket Oval Head --%3E%3Cellipse cx='52' cy='46' rx='24' ry='28' fill='none' stroke='%23f8fafc' stroke-width='4'/%3E%3Cline x1='52' y1='20' x2='52' y2='72' stroke='%235eead4' stroke-width='1.5' stroke-dasharray='3 2'/%3E%3Cline x1='30' y1='46' x2='74' y2='46' stroke='%235eead4' stroke-width='1.5' stroke-dasharray='3 2'/%3E%3C!-- Racket Shaft and Grip --%3E%3Cline x1='52' y1='74' x2='76' y2='102' stroke='%23f8fafc' stroke-width='5' stroke-linecap='round'/%3E%3Cline x1='68' y1='92' x2='78' y2='104' stroke='%2314b8a6' stroke-width='6' stroke-linecap='round'/%3E%3C!-- Optic Yellow Tennis Ball --%3E%3Ccircle cx='86' cy='36' r='15' fill='%23ccff00' stroke='%23ffffff' stroke-width='2'/%3E%3Cpath d='M76 30 Q86 36 76 42 M96 30 Q86 36 96 42' fill='none' stroke='%23ffffff' stroke-width='2'/%3E%3C/svg%3E",
  },
  {
    id: 'sport-swimmer-aero',
    name: 'Olympic Swimmer',
    category: 'sports',
    categoryLabel: 'Sports Disciplines',
    emoji: '🏊‍♂️',
    tag: 'Aerodynamic Stroke Engine',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='bgSwim' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%230369a1'/%3E%3Cstop offset='100%25' stop-color='%23082f49'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' rx='28' fill='url(%23bgSwim)' stroke='%2338bdf8' stroke-width='2'/%3E%3C!-- Swimmer Head & Cap --%3E%3Cellipse cx='60' cy='46' rx='22' ry='16' fill='%2338bdf8' stroke='%23ffffff' stroke-width='2.5'/%3E%3C!-- Mirrored Goggles --%3E%3Cellipse cx='52' cy='48' rx='7' ry='5' fill='%23fbbf24' stroke='%230f172a' stroke-width='2'/%3E%3Cellipse cx='68' cy='48' rx='7' ry='5' fill='%23fbbf24' stroke='%230f172a' stroke-width='2'/%3E%3Cline x1='59' y1='48' x2='61' y2='48' stroke='%230f172a' stroke-width='2'/%3E%3C!-- Water Wave Ripples --%3E%3Cpath d='M16 70 Q38 60 60 70 T104 70' fill='none' stroke='%23bae6fd' stroke-width='4' stroke-linecap='round'/%3E%3Cpath d='M20 84 Q42 76 64 84 T100 84' fill='none' stroke='%237dd3fc' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E",
  },
  {
    id: 'sport-track-sprinter',
    name: 'Track Sprinter',
    category: 'sports',
    categoryLabel: 'Sports Disciplines',
    emoji: '🏃‍♂️',
    tag: '100m Velocity & Spikes',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='bgTrack' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23b45309'/%3E%3Cstop offset='100%25' stop-color='%23451a03'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' rx='28' fill='url(%23bgTrack)' stroke='%23f59e0b' stroke-width='2'/%3E%3C!-- Track Lane lines --%3E%3Cpath d='M20 100 L40 20 M50 100 L65 20 M80 100 L90 20' stroke='%23fde68a' stroke-width='2' stroke-dasharray='4 3'/%3E%3C!-- Sprinter Figure Explosion --%3E%3Ccircle cx='70' cy='32' r='9' fill='%23ffffff'/%3E%3Cpath d='M44 54 L62 46 L76 58 L94 62 M60 48 L48 68 L28 72 M48 68 L68 94' stroke='%23f59e0b' stroke-width='6' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E",
  },
];

// 3. ANIMATED & STYLIZED ATHLETE CHARACTERS ("animated avtar like this avtar")
export const ANIMATED_AVATARS: AthleteAvatarIcon[] = [
  {
    id: 'anim-cyber-runner',
    name: 'Cybernetic Runner',
    category: 'animated',
    categoryLabel: 'Animated Characters',
    emoji: '🥽',
    tag: 'Neon Visor & Techwear',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='bgCyber' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%230f172a'/%3E%3Cstop offset='100%25' stop-color='%23020617'/%3E%3C/linearGradient%3E%3ClinearGradient id='visorG' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2306b6d4'/%3E%3Cstop offset='100%25' stop-color='%2310b981'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' rx='28' fill='url(%23bgCyber)' stroke='%2306b6d4' stroke-width='2'/%3E%3C!-- Athletic Cyber Hoodie --%3E%3Cpath d='M26 100 C26 75, 40 68, 60 68 C80 68, 94 75, 94 100 Z' fill='%231e293b' stroke='%23334155' stroke-width='2'/%3E%3C!-- Head --%3E%3Ccircle cx='60' cy='50' r='20' fill='%23fed7aa'/%3E%3C!-- Spiky Athletic Hair --%3E%3Cpath d='M42 46 C42 30 50 24 60 24 C72 24 78 30 78 46 L82 36 L72 30 L60 22 L48 30 L40 36 Z' fill='%230f172a'/%3E%3C!-- Neon Visor HUD Glasses --%3E%3Crect x='44' y='42' width='32' height='10' rx='4' fill='url(%23visorG)' stroke='%23ffffff' stroke-width='1.5'/%3E%3Cline x1='46' y1='47' x2='74' y2='47' stroke='%23ffffff' stroke-width='1' stroke-dasharray='2 2'/%3E%3C!-- Neon Collar Stripe --%3E%3Cpath d='M48 84 L60 92 L72 84' stroke='%2310b981' stroke-width='3' fill='none' stroke-linecap='round'/%3E%3C/svg%3E",
  },
  {
    id: 'anim-gym-hero',
    name: 'Headphones Gym Bro',
    category: 'animated',
    categoryLabel: 'Animated Characters',
    emoji: '🎧',
    tag: 'Over-Ear Beats & Focus',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='bgHero' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23047857'/%3E%3Cstop offset='100%25' stop-color='%23064e3b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' rx='28' fill='url(%23bgHero)' stroke='%2310b981' stroke-width='2'/%3E%3C!-- Gym Muscle Tank --%3E%3Cpath d='M30 100 C30 78, 42 72, 60 72 C78 72, 90 78, 90 100 Z' fill='%2310b981'/%3E%3Cpolygon points='60,78 52,100 68,100' fill='%23064e3b'/%3E%3C!-- Head & Face --%3E%3Ccircle cx='60' cy='50' r='20' fill='%23ffedd5'/%3E%3C!-- Backward Cap --%3E%3Cpath d='M40 44 C40 30 50 26 60 26 C70 26 80 30 80 44 Z' fill='%230f172a'/%3E%3Cpath d='M76 42 L92 45 L78 48 Z' fill='%230f172a'/%3E%3C!-- Eyes with Intensity --%3E%3Ccircle cx='53' cy='48' r='2.5' fill='%230f172a'/%3E%3Ccircle cx='67' cy='48' r='2.5' fill='%230f172a'/%3E%3C!-- Confident Smile --%3E%3Cpath d='M55 58 Q60 62 65 58' stroke='%230f172a' stroke-width='2' stroke-linecap='round' fill='none'/%3E%3C!-- Large Over-Ear Headphones --%3E%3Cpath d='M34 50 C34 26 86 26 86 50' fill='none' stroke='%23ffffff' stroke-width='4'/%3E%3Crect x='32' y='42' width='8' height='18' rx='4' fill='%2310b981' stroke='%23ffffff' stroke-width='1.5'/%3E%3Crect x='80' y='42' width='8' height='18' rx='4' fill='%2310b981' stroke='%23ffffff' stroke-width='1.5'/%3E%3C/svg%3E",
  },
  {
    id: 'anim-fitness-valkyrie',
    name: 'Fitness Valkyrie',
    category: 'animated',
    categoryLabel: 'Animated Characters',
    emoji: '👱‍♀️',
    tag: 'Athletic Ponytail & Headband',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='bgValk' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%236366f1'/%3E%3Cstop offset='100%25' stop-color='%233730a3'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' rx='28' fill='url(%23bgValk)' stroke='%23a5b4fc' stroke-width='2'/%3E%3C!-- Sports Top --%3E%3Cpath d='M34 100 C34 80 44 74 60 74 C76 74 86 80 86 100 Z' fill='%23ec4899'/%3E%3C!-- High Athletic Ponytail behind --%3E%3Cpath d='M70 34 C85 24 96 36 94 56 C90 62 82 54 80 44' fill='%23fbbf24'/%3E%3C!-- Head --%3E%3Ccircle cx='60' cy='52' r='19' fill='%23fed7aa'/%3E%3C!-- Blonde bangs & athletic hair --%3E%3Cpath d='M44 46 C44 32 52 26 62 26 C72 26 78 32 78 46 C74 38 68 36 60 36 C52 36 46 40 44 46 Z' fill='%23fbbf24'/%3E%3C!-- Kinetic Green Headband --%3E%3Cpath d='M43 40 Q60 42 77 40' stroke='%2310b981' stroke-width='4' fill='none' stroke-linecap='round'/%3E%3C!-- Focused eyes --%3E%3Ccircle cx='54' cy='50' r='2.5' fill='%231e1b4b'/%3E%3Ccircle cx='66' cy='50' r='2.5' fill='%231e1b4b'/%3E%3Cpath d='M56 59 Q60 62 64 59' stroke='%239a3412' stroke-width='2' stroke-linecap='round' fill='none'/%3E%3C/svg%3E",
  },
  {
    id: 'anim-boxing-hero',
    name: 'Brawler Champ',
    category: 'animated',
    categoryLabel: 'Animated Characters',
    emoji: '🥊',
    tag: 'Red Gloves & Championship Aura',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='bgBrawl' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23dc2626'/%3E%3Cstop offset='100%25' stop-color='%237f1d1d'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' rx='28' fill='url(%23bgBrawl)' stroke='%23f87171' stroke-width='2'/%3E%3C!-- Boxing Robe --%3E%3Cpath d='M30 100 C30 76, 44 70, 60 70 C76 70, 90 76, 90 100 Z' fill='%2318181b' stroke='%23facc15' stroke-width='2'/%3E%3C!-- Headgear Protective Helmet --%3E%3Ccircle cx='60' cy='48' r='22' fill='%23b91c1c' stroke='%23ffffff' stroke-width='2'/%3E%3Ccircle cx='60' cy='50' r='14' fill='%23fde047'/%3E%3Ccircle cx='55' cy='49' r='2.5' fill='%230f172a'/%3E%3Ccircle cx='65' cy='49' r='2.5' fill='%230f172a'/%3E%3C!-- Mouthguard --%3E%3Crect x='55' y='56' width='10' height='4' rx='2' fill='%23ffffff'/%3E%3C!-- Posed Red Gloves --%3E%3Ccircle cx='36' cy='74' r='12' fill='%23ef4444' stroke='%23ffffff' stroke-width='2'/%3E%3Ccircle cx='84' cy='74' r='12' fill='%23ef4444' stroke='%23ffffff' stroke-width='2'/%3E%3C/svg%3E",
  },
  {
    id: 'anim-golden-champ',
    name: 'Golden Medalist',
    category: 'animated',
    categoryLabel: 'Animated Characters',
    emoji: '🥇',
    tag: 'Olympic Gold & Sparkles',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='bgGold' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23d97706'/%3E%3Cstop offset='100%25' stop-color='%2378350f'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' rx='28' fill='url(%23bgGold)' stroke='%23fde047' stroke-width='2'/%3E%3C!-- Victory Jersey --%3E%3Cpath d='M30 100 C30 76 44 70 60 70 C76 70 90 76 90 100 Z' fill='%231e3a8a'/%3E%3C!-- Ribbon & Gold Medal --%3E%3Cpath d='M50 70 L60 84 L70 70' stroke='%23ef4444' stroke-width='3' fill='none'/%3E%3Ccircle cx='60' cy='88' r='10' fill='%23facc15' stroke='%23ffffff' stroke-width='2'/%3E%3Ctext x='60' y='92' font-family='sans-serif' font-weight='900' font-size='10' fill='%2378350f' text-anchor='middle'%3E1%3C/text%3E%3C!-- Smiling Athlete Head --%3E%3Ccircle cx='60' cy='46' r='18' fill='%23fed7aa'/%3E%3Ccircle cx='54' cy='44' r='2.5' fill='%230f172a'/%3E%3Ccircle cx='66' cy='44' r='2.5' fill='%230f172a'/%3E%3Cpath d='M53 52 Q60 58 67 52' stroke='%230f172a' stroke-width='2.5' stroke-linecap='round' fill='none'/%3E%3C!-- Hair --%3E%3Cpath d='M44 42 C44 28 52 24 60 24 C68 24 76 28 76 42 Z' fill='%2378350f'/%3E%3C/svg%3E",
  },
  {
    id: 'anim-stealth-ninja',
    name: 'Stealth Ninja',
    category: 'animated',
    categoryLabel: 'Animated Characters',
    emoji: '🥷',
    tag: 'Parkour & Agility Mastery',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='bgNinja' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2318181b'/%3E%3Cstop offset='100%25' stop-color='%2309090b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' rx='28' fill='url(%23bgNinja)' stroke='%2338bdf8' stroke-width='2'/%3E%3C!-- Stealth Gi --%3E%3Cpath d='M30 100 C30 76 44 70 60 70 C76 70 90 76 90 100 Z' fill='%2309090b' stroke='%2327272a' stroke-width='2'/%3E%3C!-- Masked Head --%3E%3Ccircle cx='60' cy='48' r='20' fill='%2318181b' stroke='%2338bdf8' stroke-width='2'/%3E%3C!-- Eye Slot Opening --%3E%3Crect x='46' y='42' width='28' height='10' rx='3' fill='%23fed7aa'/%3E%3Ccircle cx='53' cy='47' r='2' fill='%230284c7'/%3E%3Ccircle cx='67' cy='47' r='2' fill='%230284c7'/%3E%3C!-- Kinetic Headband Tails --%3E%3Cpath d='M78 44 Q92 48 98 40' stroke='%2338bdf8' stroke-width='3' fill='none' stroke-linecap='round'/%3E%3Cpath d='M78 48 Q94 54 96 62' stroke='%2338bdf8' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E",
  },
  {
    id: 'anim-zen-mobility',
    name: 'Zen Mobility Master',
    category: 'animated',
    categoryLabel: 'Animated Characters',
    emoji: '🧘‍♂️',
    tag: 'Flexibility & Kinetic Flow',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='bgZen' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%230d9488'/%3E%3Cstop offset='100%25' stop-color='%23115e59'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' rx='28' fill='url(%23bgZen)' stroke='%235eead4' stroke-width='2'/%3E%3C!-- Kinetic Chakra Circles --%3E%3Ccircle cx='60' cy='60' r='36' stroke='%2399f6e4' stroke-width='2' stroke-dasharray='6 4' fill='none'/%3E%3C!-- Meditating Silhouette --%3E%3Ccircle cx='60' cy='38' r='10' fill='%23ffffff'/%3E%3Cpath d='M44 64 C44 52 76 52 76 64 L82 82 C82 86 78 88 60 88 C42 88 38 86 38 82 Z' fill='%23f0fdfa'/%3E%3Cpath d='M34 82 Q60 96 86 82' stroke='%232dd4bf' stroke-width='4' fill='none' stroke-linecap='round'/%3E%3C/svg%3E",
  },
  {
    id: 'anim-retro-80s-fitness',
    name: 'Retro Neon Aerobics',
    category: 'animated',
    categoryLabel: 'Animated Characters',
    emoji: '⚡',
    tag: 'Synthwave & High Energy',
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='bgRetro' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23a21caf'/%3E%3Cstop offset='100%25' stop-color='%23581c87'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' rx='28' fill='url(%23bgRetro)' stroke='%23f472b6' stroke-width='2'/%3E%3C!-- Neon Headband & Shades --%3E%3Ccircle cx='60' cy='50' r='20' fill='%23fdf4ff'/%3E%3C!-- Neon Yellow Headband --%3E%3Crect x='40' y='36' width='40' height='8' rx='4' fill='%23facc15' stroke='%23ffffff' stroke-width='1.5'/%3E%3C!-- 80s Shutter Shades --%3E%3Crect x='44' y='46' width='32' height='10' rx='3' fill='%2306b6d4' stroke='%23ffffff' stroke-width='1.5'/%3E%3Cline x1='46' y1='51' x2='74' y2='51' stroke='%23ffffff' stroke-width='1.5'/%3E%3C!-- Neon Pink Windbreaker --%3E%3Cpath d='M30 100 C30 76 44 70 60 70 C76 70 90 76 90 100 Z' fill='%23ec4899'/%3E%3Cline x1='60' y1='70' x2='60' y2='100' stroke='%23facc15' stroke-width='3'/%3E%3C/svg%3E",
  },
];

// 4. CURATED PRO REAL PORTRAITS (kept to only 3 top picks per user request)
export const PRO_PORTRAITS: AthleteAvatarIcon[] = [
  {
    id: 'portrait-elena',
    name: 'Elena Vance',
    category: 'portraits',
    categoryLabel: 'Pro Real Portraits',
    emoji: '🏃‍♀️',
    tag: 'Track & Sprint Pro',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'portrait-marcus',
    name: 'Marcus Hayes',
    category: 'portraits',
    categoryLabel: 'Pro Real Portraits',
    emoji: '🏋️‍♂️',
    tag: 'Strength & Conditioning',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'portrait-maya',
    name: 'Maya Lin',
    category: 'portraits',
    categoryLabel: 'Pro Real Portraits',
    emoji: '💪',
    tag: 'CrossFit & Powerlifting',
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=240&auto=format&fit=crop&q=80',
  },
];

// Master list of all athlete icons (over 23 options!)
export const ALL_ATHLETE_ICONS: AthleteAvatarIcon[] = [
  ...GYM_AVATARS,
  ...SPORTS_AVATARS,
  ...ANIMATED_AVATARS,
  ...PRO_PORTRAITS,
];

// Legacy aliases for backward compatibility
export const AVATAR_PORTRAITS = PRO_PORTRAITS;
export const AVATAR_VECTORS = [...GYM_AVATARS, ...SPORTS_AVATARS, ...ANIMATED_AVATARS];

export const MONOGRAM_GRADIENTS = [
  { id: 'emerald', name: 'Kinetic Emerald', from: '#10b981', to: '#047857', text: '#ffffff' },
  { id: 'cyan', name: 'Cyber Cyan', from: '#06b6d4', to: '#0e7490', text: '#ffffff' },
  { id: 'amber', name: 'Solar Amber', from: '#f59e0b', to: '#b45309', text: '#ffffff' },
  { id: 'violet', name: 'Quantum Violet', from: '#8b5cf6', to: '#5b21b6', text: '#ffffff' },
  { id: 'rose', name: 'Crimson Power', from: '#f43f5e', to: '#be123c', text: '#ffffff' },
  { id: 'slate', name: 'Obsidian Stealth', from: '#334155', to: '#0f172a', text: '#38bdf8' },
];

export function generateMonogramDataUri(initials: string, gradientId: string = 'emerald'): string {
  const grad = MONOGRAM_GRADIENTS.find((g) => g.id === gradientId) || MONOGRAM_GRADIENTS[0];
  const cleanInitials = (initials || 'FS').slice(0, 2).toUpperCase();
  
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'>
    <defs>
      <linearGradient id='mg' x1='0%' y1='0%' x2='100%' y2='100%'>
        <stop offset='0%' stop-color='${grad.from}'/>
        <stop offset='100%' stop-color='${grad.to}'/>
      </linearGradient>
    </defs>
    <rect width='120' height='120' rx='28' fill='url(#mg)'/>
    <text x='60' y='72' font-family='system-ui, -apple-system, sans-serif' font-weight='800' font-size='44' fill='${grad.text}' text-anchor='middle' letter-spacing='1'>${cleanInitials}</text>
  </svg>`;
  
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
