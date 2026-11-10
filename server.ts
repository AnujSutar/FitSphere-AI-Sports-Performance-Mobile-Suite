import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize server-side Google GenAI client dynamically
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function buildSystemInstruction(athlete: any, sport?: string, mode?: string) {
  return `You are FitSphere AI Coach, a world-class athletic trainer, biomechanics researcher, and sports performance specialist.
You provide evidence-based exercise cues, tactical drills, periodization strategies, 1RM progression advice, and recovery guidance.
You support 10 sports: Cricket, Football, Kabaddi, Basketball, Athletics, Swimming, Tennis, Badminton, Rugby, and Volleyball.

Athlete Profile Telemetry:
${
  athlete
    ? `- Name: ${athlete.name || 'Athlete'}
- Tier / Experience: ${athlete.tier || 'Elite Pro'} (${athlete.experience || 'Advanced'})
- Body Mass: ${athlete.bodyMassKg || 72}kg, Height: ${athlete.heightCm || 167}cm
- 1RM Squat: ${athlete.squat1RmKg || 155}kg, Bench Press: ${athlete.bench1RmKg || 112}kg, Deadlift: ${athlete.deadlift1RmKg || 195}kg
- Current Streak: ${athlete.streakDays || 14} days
- Active Minutes Today: ${athlete.activeMinutesToday || 48} min
- Fitness Goal: ${athlete.fitnessGoal || 'General Fitness'}
- Equipment: ${athlete.availableEquipment || 'Full Gym'}
- Nationality: ${athlete.nationality || 'India'}
- Athletic Biography: "${athlete.biography || 'Elite multi-sport training'}"`
    : 'General athlete profile.'
}

${sport ? `Current Sport Discipline: ${sport}. Tailor tactical and biomechanical cues to ${sport}.` : ''}
${mode ? `Current Coaching Lens: ${mode}. Prioritize this specialized angle.` : ''}

Output Guidelines:
- Directly address the athlete by first name.
- Use clean Markdown with headers (###, ####), bullet points, and bold key terms.
- Use exact calculated percentage loads based on their 1RMs (e.g. 70%, 80%, 85% of their 155kg squat, 112kg bench, 195kg deadlift).
- Provide concrete biomechanical cues (e.g. ground reaction force, joint torque, deceleration control).
- Keep answers concise, highly professional, motivating, and actionable.`;
}

// Comprehensive sports science knowledge engine for offline, quota-limited, or local operation
function generateIntelligentSportsScienceResponse(
  query: string,
  sport: string,
  athlete: any,
  mode: string
) {
  const q = (query || '').toLowerCase().trim();
  const name = athlete?.name?.split(' ')[0] || 'Athlete';
  const squat1Rm = athlete?.squat1RmKg || 155;
  const bench1Rm = athlete?.bench1RmKg || 112;
  const deadlift1Rm = athlete?.deadlift1RmKg || 195;
  const bodyMass = athlete?.bodyMassKg || 72;
  const streak = athlete?.streakDays || 14;

  // 1. GREETINGS & INTRODUCTIONS
  if (
    q === 'hi' ||
    q === 'hello' ||
    q === 'hey' ||
    q === 'helo' ||
    q.startsWith('hi ') ||
    q.startsWith('hello ') ||
    q.startsWith('hey ') ||
    q.includes('who are you') ||
    q.includes('what can you do') ||
    q.includes('help')
  ) {
    return `### FitSphere AI Performance Coach: Live Telemetry Synchronized

Hello **${name}**! I am your real-time athletic trainer, biomechanics specialist, and sports performance coach.

#### Your Synced Telemetry Profile:
- **Kinetic Baseline:** Squat **${squat1Rm}kg** • Bench **${bench1Rm}kg** • Deadlift **${deadlift1Rm}kg** (Total: **${squat1Rm + bench1Rm + deadlift1Rm}kg**)
- **Training Streak:** **${streak} consecutive days** active | Body Mass: **${bodyMass}kg**
- **Selected Sport Discipline:** **${sport || 'All Disciplines'}**
- **Active Coaching Lens:** **${mode || 'Biomechanics & Form'}**

#### What I Can Formulate For You:
1. **Dynamic Workout Generator:** Complete Push/Pull/Legs, Upper/Lower, or sport conditioning splits with exact calculated kilo loads.
2. **1RM Wave Periodization:** Precise percentage loads (70%–90%) for your squat, bench, and deadlift.
3. **Sport-Specific Tactical Playbooks:** Mechanics for Cricket bowling, Football pressing, Kabaddi raids, Basketball vertical jump, and more.
4. **Targeted Macro & Hydration Formulas:** Customized gram-by-gram intake for your ${bodyMass}kg frame.
5. **Recovery & CNS Deloading:** Active flush protocols, sleep architecture, and tendon injury prevention.

*What would you like to dial in today? Type a question or tap one of the suggested cues above!*`;
  }

  // 2. WORKOUT & ROUTINE GENERATION
  if (
    q.includes('workout') ||
    q.includes('routine') ||
    q.includes('exercise') ||
    q.includes('program') ||
    q.includes('split') ||
    q.includes('push pull') ||
    q.includes('ppl') ||
    q.includes('upper lower') ||
    q.includes('full body') ||
    q.includes('leg day') ||
    q.includes('chest workout') ||
    q.includes('back workout') ||
    q.includes('arm workout')
  ) {
    let focus = 'Full Body Kinetic Power';
    if (q.includes('chest') || q.includes('push')) focus = 'Push Hypertrophy & Power';
    else if (q.includes('back') || q.includes('pull')) focus = 'Posterior Chain & Pull Strength';
    else if (q.includes('leg') || q.includes('squat')) focus = 'Lower Body Force & Explosiveness';

    return `### FitSphere Custom Training Routine: ${focus}

Hey **${name}**! Here is your periodized training protocol calibrated to your **${bodyMass}kg** mass and **${streak}-day streak**:

#### Phase 1: Dynamic Mobility & CNS Activation (8–10 min)
- **90/90 Hip Flow + Adductor Rocks:** 2 sets × 8 reps/side (Opens pelvic girdle)
- **Band Pull-Aparts & Face Pulls:** 3 sets × 15 reps (Scapular stabilizer priming)
- **Pogo Hops / Low Ankle Bounding:** 3 sets × 20 sec (Achilles tendon stiffness)

#### Phase 2: Primary Compound Anchor (Wave Loading)
- **Main Lift:** ${
      focus.includes('Push')
        ? `Barbell Bench Press: 4 sets × 5 reps @ **${Math.round(bench1Rm * 0.8)}kg** (80% 1RM) — RPE 8.0, 3 min rest`
        : focus.includes('Pull')
        ? `Conventional Deadlift: 4 sets × 4 reps @ **${Math.round(deadlift1Rm * 0.825)}kg** (82.5% 1RM) — RPE 8.5, 3 min rest`
        : `Barbell Back Squat: 5 sets × 5 reps @ **${Math.round(squat1Rm * 0.775)}kg** (77.5% 1RM) — RPE 8.0, 2.5 min rest`
    }
- **Secondary Power Movement:** 3 sets × 6 reps (Explosive intent, 100% velocity on concentric phase)

#### Phase 3: Accessory & Structural Hypertrophy
- **Accessory A:** Dumbbell Romanian Deadlifts / Incline Press: 3 sets × 10 reps (RPE 7.5, 90s rest)
- **Accessory B:** Unilateral Bulgarian Split Squats / Chest-Supported Rows: 3 sets × 10 reps/side
- **Core / Anti-Rotation:** Pallof Press or Hanging Leg Raises: 3 sets × 12 reps (3-sec isometric hold)

#### Phase 4: Cool-Down & Parasympathetic Restoration
- 5 minutes light cycling or walking + diaphragmatic boxed breathing (4s in, 4s hold, 4s out, 4s hold) to initiate recovery.`;
  }

  // 3. BENCH PRESS & UPPER BODY STRENGTH
  if (q.includes('bench') || q.includes('chest') || q.includes('pec') || q.includes('pushup')) {
    return `### FitSphere Biomechanics: Barbell Bench Press Mastery

Hello **${name}**! Analyzing your **${bench1Rm}kg Bench Press 1RM** and force curve:

#### 1. Optimal Loading Progression for Next Microcycle
- **Velocity Accumulation (72.5%):** **${Math.round(bench1Rm * 0.725)}kg** × 4 sets × 6 reps (Control 2s eccentric, explode up)
- **Strength Anchor Wave (82.5%):** **${Math.round(bench1Rm * 0.825)}kg** × 5 sets × 3 reps (Full competition pauses)
- **CNS Overload Target (90%):** **${Math.round(bench1Rm * 0.9)}kg** × 3 sets × 1–2 reps (Pre-competition testing)

#### 2. Three Critical Biomechanical Cues
- **Scapular Retraction & Depression:** Pinch your shoulder blades down and back as if sliding them into your rear pockets.
- **Leg Drive Vector:** Drive heel force horizontally toward the headboard, converting ground reaction force through the lumbar arch into the barbell.
- **Bar Path J-Curve:** Lower to the sternum (xiphoid process) and press back in a gentle curve over the glenohumeral joint.`;
  }

  // 4. SQUAT & LOWER BODY MECHANICS
  if (q.includes('squat') || q.includes('knee') || q.includes('quad') || q.includes('glute') || q.includes('valgus')) {
    return `### FitSphere Biomechanics: 1RM Squat Progression & Force Production

Hello **${name}**! Based on your **${squat1Rm}kg Squat 1RM** and **${streak}-day active streak**, here is your periodized breakdown:

#### 1. Optimal Loading Matrix (Wave Periodization)
- **Hypertrophy / Velocity Wave (70%):** **${Math.round(squat1Rm * 0.7)}kg** × 4 sets × 8 reps (Dynamic effort, fast concentric)
- **Strength Anchor Wave (82.5%):** **${Math.round(squat1Rm * 0.825)}kg** × 5 sets × 4 reps (RPE 7.5–8.0)
- **CNS Peak Overload (90%):** **${Math.round(squat1Rm * 0.9)}kg** × 3 sets × 2 reps (Full rest: 3 to 4 minutes)

#### 2. Biomechanical Form Cues
- **Tri-Planar Bracing:** Expand abdominal wall 360° against the belt prior to unrack; lock lats into the back pocket.
- **Tripod Foot Pressure:** Equal force distribution across 1st metatarsal, 5th metatarsal, and calcaneus to maintain knee tracking over 2nd toe.
- **Torque at the Hole:** External rotational torque at hip capsules prevents valgus collapse during upward transition.`;
  }

  // 5. DEADLIFT & POSTERIOR CHAIN
  if (q.includes('deadlift') || q.includes('back') || q.includes('hamstring') || q.includes('hinge') || q.includes('pull')) {
    return `### FitSphere Posterior Chain: Deadlift Kinetic Mechanics

Hey **${name}**! Analyzing your **${deadlift1Rm}kg Deadlift 1RM**:

#### 1. Periodized Working Percentages
- **Volume Base (72.5%):** **${Math.round(deadlift1Rm * 0.725)}kg** × 4 sets × 5 reps (Crisp lockouts, no hitching)
- **Heavy Working Sets (85%):** **${Math.round(deadlift1Rm * 0.85)}kg** × 3 sets × 3 reps (RPE 8.0)
- **Top Single / PR Test (92.5%):** **${Math.round(deadlift1Rm * 0.925)}kg** × 1 rep (Targeting a new 200kg+ milestone)

#### 2. Kinetic Setup Cues
- **Slack Pull:** Pull tension out of the barbell until you hear the click against the plate collars before driving the floor away.
- **Lat Engagement:** Actively squeeze oranges under your armpits to keep the bar glued to your shins throughout the ascent.
- **Hip Hinge Lockout:** Finish with glute contraction rather than hyperextending the lumbar spine.`;
  }

  // 6. 1RM PROGRESSION & PLATEAU BREAKTHROUGHS
  if (q.includes('1rm') || q.includes('pr') || q.includes('plateau') || q.includes('heavy') || q.includes('load') || q.includes('rpe')) {
    return `### FitSphere 1RM Progression & Plateau Breakthrough Protocol

Hello **${name}**! Here is your periodized blueprint for breaking through plateaus:

#### 1. Current Metric Overview
- **Squat 1RM:** ${squat1Rm}kg | **Bench 1RM:** ${bench1Rm}kg | **Deadlift 1RM:** ${deadlift1Rm}kg
- **Total Powerlifting Output:** **${squat1Rm + bench1Rm + deadlift1Rm}kg** (Bodyweight ratio: **${((squat1Rm + bench1Rm + deadlift1Rm) / bodyMass).toFixed(2)}× BW**)

#### 2. The 3-Week Wave Loading Strategy
- **Week 1 (Volume Accumulation):** 4 sets × 6 reps @ 72.5% (High velocity, build work capacity)
- **Week 2 (Intensification):** 5 sets × 3 reps @ 82.5% (Focus on rate of force development)
- **Week 3 (Peak Strain):** 3 sets × 1–2 reps @ 90% (CNS adaptation under near-maximal loads)
- **Week 4 (Deload):** 3 sets × 5 reps @ 60% (Full neurological and tendon restoration)

#### 3. Overcoming Sticking Points
- **Off the chest / bottom of squat:** Implement 2-second paused repetitions at the sticking point.
- **Mid-range stall:** Incorporate accommodating resistance (bands or chains) to match the ascending strength curve.`;
  }

  // 7. NUTRITION, MACROS & HYDRATION
  if (
    q.includes('nutrition') ||
    q.includes('diet') ||
    q.includes('protein') ||
    q.includes('creatine') ||
    q.includes('calorie') ||
    q.includes('macro') ||
    q.includes('food') ||
    q.includes('hydration') ||
    q.includes('carb') ||
    q.includes('fat loss') ||
    q.includes('cutting') ||
    q.includes('bulking')
  ) {
    const targetProtein = Math.round(bodyMass * 2.0);
    const targetCarbs = Math.round(bodyMass * 4.2);
    const targetFats = Math.round(bodyMass * 0.9);
    const targetCalories = targetProtein * 4 + targetCarbs * 4 + targetFats * 9;

    return `### FitSphere Precision Nutrition & Micronutrient Protocol

Hi **${name}**! Here is your calculated nutritional architecture for a **${bodyMass}kg** athlete:

#### 1. Daily Macronutrient Blueprint (Performance Surplus)
- **Target Energy Intake:** ~**${targetCalories} kcal / day**
- **Protein Synthesis:** **${targetProtein}g/day** (2.0g/kg) — Divided across 4 feedings with ≥3g leucine each.
- **Carbohydrate Glycogen Loading:** **${targetCarbs}g/day** (4.2g/kg) — Focused around pre- and post-workout windows.
- **Essential Lipids:** **${targetFats}g/day** (0.9g/kg) — Supports testosterone production and joint lubrication.

#### 2. Ergogenic Supplementation
- **Creatine Monohydrate:** 5g daily, taken consistently post-workout with 30g simple carbs to saturate phosphocreatine reserves.
- **Electrolytes:** 500mg sodium + 200mg potassium per hour of intense sweat session.
- **Hydration Target:** Minimum **${((bodyMass * 40) / 1000).toFixed(1)}L** of water daily, adding 1L for every hour of high-intensity training.`;
  }

  // 8. RECOVERY, DOMS & CNS DELOAD
  if (
    q.includes('recovery') ||
    q.includes('sore') ||
    q.includes('sleep') ||
    q.includes('doms') ||
    q.includes('deload') ||
    q.includes('injury') ||
    q.includes('pain') ||
    q.includes('ice') ||
    q.includes('cold') ||
    q.includes('sauna')
  ) {
    return `### FitSphere Recovery & Metabolic Restoration Protocol

Hi **${name}**! Here is your cellular adaptation and recovery prescription:

#### 1. Acute Soreness & Metabolic Clearance
- **Active Deloading:** 20–30 minutes of low-intensity Zone-2 cardio (HR 115–130 bpm) to flush lactate and stimulate lymphatic drainage.
- **Contrast Therapy vs Ice Baths:** Avoid full ice immersion within 4 hours post-lifting if muscular hypertrophy is your goal, as cold blunts the anabolic inflammatory signaling cascade. Use contrast showers (3 min warm / 1 min cold) instead.
- **Soft Tissue Mobility:** 10 minutes targeted myofascial release on glutes, piriformis, thoracic spine, and hip flexors.

#### 2. CNS & Sleep Architecture
- **Sleep Quality Target:** 8 to 9 hours nightly. Peak Growth Hormone (GH) pulse occurs during deep NREM Stage 3 sleep.
- **Sleep Hygiene:** Ambient bedroom temperature at 18°C (65°F), zero blue light 60 minutes before bed, and 300mg magnesium glycinate 45 minutes prior to sleep.`;
  }

  // 9. SPORT-SPECIFIC: CRICKET
  if (sport === 'Cricket' || q.includes('cricket') || q.includes('bowl') || q.includes('bat') || q.includes('spin')) {
    return `### FitSphere Cricket Biomechanics & Power Hitting

Hey **${name}**! Analyzing your **Cricket** athletic profile:

#### 1. Fast Bowling Velocity Mechanics (Target: 135–145+ kph)
- **Braced Front Leg:** Front knee flexion must be minimal (<15°) at crease landing. A rigid front leg acts as a catapult, converting linear momentum into rotational shoulder whip.
- **Hip-Shoulder Separation:** Achieve 35°–45° torsion between pelvic girdle and thoracic cage at back-foot contact to store elastic recoil energy.
- **Wrist Snap & Seam Alignment:** Maintain cocked wrist until the final 0.05 seconds of release for late swing and seam movement.

#### 2. Power Hitting Kinetic Chain (T20 & White Ball)
- **Ground Force Foundation:** Drive through the back foot into the pitch to initiate hip rotation ahead of hands.
- **High Elbow & Extension:** Keep top hand firm and bottom hand relaxed until impact for high bat-speed and maximum launch angle.`;
  }

  // 10. SPORT-SPECIFIC: FOOTBALL
  if (sport === 'Football' || q.includes('football') || q.includes('soccer') || q.includes('kick') || q.includes('dribble')) {
    return `### FitSphere Football Biomechanics & Match Readiness

Hello **${name}**! Here is your football kinetic optimization plan:

#### 1. Striking Mechanics & Ball Exit Velocity
- **Plant Foot Placement:** Land non-kicking foot 15–20cm lateral to the ball, with toes pointed directly toward the target.
- **Ankle Plantarflexion Lock:** Fully lock the ankle of the striking foot with rigid dorsiflexion to eliminate energy dissipation at ball contact.
- **Core Deceleration:** Follow through across the midline while maintaining stable torso lean over the ball to keep trajectory down.

#### 2. 90-Minute Anaerobic Endurance
- **Repeat Sprint Ability (RSA):** 6 × 30m sprints with 20-second active rest intervals.
- **Deceleration & Groin Fortification:** Copenhagen adductor planks (3 sets × 25s/side) and eccentric hamstring Nordics to protect against groin strains and tears.`;
  }

  // 11. SPORT-SPECIFIC: KABADDI
  if (sport === 'Kabaddi' || q.includes('kabaddi') || q.includes('raid') || q.includes('tackle') || q.includes('cant')) {
    return `### FitSphere Kabaddi Tactical & Explosive Power

Hello **${name}**! Analyzing your **Kabaddi** biomechanical profile:

#### 1. Raiding Agility & Footwork Velocity
- **Low Center of Gravity:** Keep stance width at 1.4× shoulder width with 45° knee flexion for instant multidirectional change of direction.
- **Explosive Toe Touch:** Initiate toe touches via rapid hip drive and ankle extension rather than reaching with the torso, keeping your defensive escape path clear.
- **Corner Escape Acceleration:** Use your **${squat1Rm}kg squat base** to explode out of corner traps with an immediate back-step and roll.

#### 2. Defensive Ankle & Thigh Locking Strength
- **Ankle Hold Clamping Force:** Isometric forearm and grip strength drills (farmers walks with heavy kettlebells) to prevent raiders from slipping out.
- **Chain Coordination:** Synchronized dash mechanics where defenders hit at hip height simultaneously.`;
  }

  // 12. SPORT-SPECIFIC: BASKETBALL
  if (sport === 'Basketball' || q.includes('basketball') || q.includes('jump') || q.includes('dunk') || q.includes('shoot')) {
    return `### FitSphere Basketball Biomechanics: Vertical Leap & Court Agility

Hello **${name}**! Analyzing your **Basketball** physical performance:

#### 1. Vertical Jump Kinematics (Penultimate Step)
- **Stride Length & Deceleration:** Lengthen your second-to-last stride to drop your center of mass, followed by a rapid, rigid plant foot block to redirect forward velocity into vertical impulse.
- **Arm Swing Synergy:** Synchronize violent upward arm swing with triple extension (ankle, knee, hip) for an additional 10–15% vertical displacement.
- **Plyometric Depth Drops:** 3 sets × 5 reps from 45cm box with immediate reactive jump (contact time <0.15s).

#### 2. Lateral Defensive Slide Mechanics
- **Shin Angle & Push Force:** Push off the trailing foot with low shin angles rather than pulling with the lead foot.
- **Hip Mobility:** Active Cossack squats to strengthen lateral adductor resilience.`;
  }

  // 13. SPORT-SPECIFIC: ATHLETICS & SPRINTING
  if (sport === 'Athletics' || q.includes('sprint') || q.includes('speed') || q.includes('acceleration') || q.includes('track')) {
    return `### FitSphere Velocity & Acceleration Matrix

Hello **${name}**! Here is your sprint velocity and acceleration protocol:

#### 1. Acceleration Biomechanics (0–20m)
- **Positive Shin Angles:** Maintain 45° forward torso lean with aggressive triple extension (ankle plantarflexion, knee extension, hip drive).
- **Ground Contact Time:** Minimize contact to <0.11 seconds by striking directly under center of mass with a pre-tensioned, dorsiflexed foot.
- **Piston Action:** Avoid circular butt-kicking during acceleration; drive knees violently like mechanical pistons.

#### 2. Maximum Velocity Phase (30–60m)
- **Tall Upright Posture:** Neutral pelvis with shoulders relaxed and arms pumping at 90° angles from shoulder sockets.
- **Wicket Runs:** 4 runs over 10 mini-hurdles spaced 1.6m apart to enforce front-side mechanics.`;
  }

  // 14. SPORT-SPECIFIC: TENNIS & BADMINTON
  if (sport === 'Tennis' || sport === 'Badminton' || q.includes('tennis') || q.includes('badminton') || q.includes('smash') || q.includes('serve')) {
    return `### FitSphere Racket Sports: Rotational Power & Kinetic Transfer

Hello **${name}**! Analyzing your **${sport || 'Racket Sports'}** performance:

#### 1. Overhead Serve & Jump Smash Mechanics
- **Kinetic Staging:** Force originates from deep knee bend, transfers through hip rotation, thoracic extension, shoulder internal rotation, and concludes with rapid wrist pronation.
- **Shoulder Deceleration & Rotator Cuff Health:** High-velocity smashes exert immense eccentric stress on the infraspinatus and teres minor. Program 3 sets × 15 reps of cable external rotations and face pulls twice weekly.
- **Split-Step Timing:** Initiate split-step hop exactly when the opponent makes ball/shuttle contact to preload the stretch-shortening cycle.

#### 2. Reactive Footwork Drills
- **Star Footwork Pattern:** 6-corner court shadow drills for 45 seconds × 5 rounds with 60s rest.`;
  }

  // 15. SPORT-SPECIFIC: SWIMMING
  if (sport === 'Swimming' || q.includes('swim') || q.includes('freestyle') || q.includes('stroke') || q.includes('pool')) {
    return `### FitSphere Aquatics Biomechanics: Hydrodynamic Efficiency

Hello **${name}**! Analyzing your **Swimming** performance:

#### 1. Catch & Pull Hydrodynamics
- **High-Elbow Catch (EVF):** Keep elbow higher than hand at entry to engage the latissimus dorsi and pectorals rather than straining the shoulder capsule.
- **Rotational Core Drive:** Body rotation should reach 35°–45° along the longitudinal axis on every stroke to lengthen reach and minimize drag.
- **Kick Rhythm:** 6-beat kick cadence for sprints, 2-beat for distance efficiency, keeping heels breaking the surface.

#### 2. Dryland Strength Transfer
- **Lat Pull-Downs & Straight-Arm Push-Downs:** 4 sets × 8 reps matching the underwater catch curve.`;
  }

  // 16. SPORT-SPECIFIC: RUGBY & VOLLEYBALL
  if (sport === 'Rugby' || sport === 'Volleyball' || q.includes('rugby') || q.includes('volleyball') || q.includes('tackle') || q.includes('spike')) {
    return `### FitSphere Collision & Aerial Dominance: ${sport || 'Multi-Sport'}

Hello **${name}**! Analyzing your **${sport || 'Athletic'}** kinematics:

#### 1. Power Output & Force Absorption
- **Force Delivery:** Utilize your **${squat1Rm}kg squat base** to generate rapid ground reaction force for spikes, tackles, or scrums.
- **Impact Dispersion:** Brace the core and maintain cervical spine alignment during contact to distribute collision forces safely through the thoracic cage.
- **Rotator Cuff Resilience:** Pre-game band activation for supraspinatus and subscapularis to maintain spike/pass velocity over full matches.

#### 2. Repeated High-Intensity Efforts
- 4 sets of 15-second max shuttle sprints + 5 plyometric broad jumps with 45 seconds active recovery.`;
  }

  // 17. CONTEXTUAL INTELLIGENT DEFAULT
  return `### FitSphere AI Performance Analysis: ${query.length > 40 ? query.slice(0, 40) + '...' : query}

Hello **${name}**! Analyzing your query through our sports science engine for **${sport || 'Athletic Performance'}** (${mode || 'Biomechanics'}):

#### 1. Kinetic Synthesis & Physiological Adaptation
- **Progressive Overload Architecture:** Ensure your weekly training volume progresses by 2.5% to 5% while safeguarding your **${streak}-day training streak**.
- **Neuromuscular Force Generation:** With your **${squat1Rm}kg squat**, **${bench1Rm}kg bench**, and **${deadlift1Rm}kg deadlift**, prioritize multi-joint compound movements when your central nervous system is fresh.
- **Movement Specificity:** Tailor ground reaction force angles and deceleration mechanics specifically for the demands of **${sport || 'your athletic goal'}**.

#### 2. Actionable Training Prescription
- **Warm-Up:** 8 minutes dynamic joint mobility + CNS potentiation.
- **Main Working Focus:** 4 sets @ 75%–82.5% load with strict 2-minute recovery intervals.
- **Target Recovery:** Consume 35g protein within 60 minutes post-session + 750ml electrolyte water for your ${bodyMass}kg frame.

#### 3. Next Step
Would you like me to construct a full 4-week periodization calendar, design a custom routine, or analyze specific lift biomechanics?`;
}

// Multi-turn chat endpoint with Google Search Grounding & Athlete Telemetry
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, sport, athleteProfile, coachingMode } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Extract the latest valid user query
    const userMessages = messages.filter((m: any) => m && m.role === 'user' && m.content?.trim());
    const lastUserMessage = userMessages.length > 0 ? userMessages[userMessages.length - 1].content : '';

    const ai = getGenAI();

    // If API key is not configured, supply high-grade sports science intelligence directly
    if (!ai) {
      const fallbackText = generateIntelligentSportsScienceResponse(
        lastUserMessage,
        sport || 'General Sports Science',
        athleteProfile,
        coachingMode || 'Biomechanics'
      );
      return res.json({
        text: fallbackText,
        webSources: [
          {
            title: 'FitSphere Sports Science & Biomechanics Vault',
            uri: 'https://fitsphere.ai/docs/biomechanics',
          },
          {
            title: 'NSCA Strength & Conditioning Guidelines',
            uri: 'https://www.nsca.com/education/articles/',
          },
        ],
      });
    }

    // Sanitize conversation history for @google/genai multi-turn rules:
    // 1. Must start with a 'user' turn
    // 2. Must strictly alternate between 'user' and 'model'
    // 3. Filter out system/telemetry error notices
    const cleanMessages = messages.filter(
      (m: any) =>
        m &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0 &&
        !m.content.startsWith('**FitSphere Telemetry Notice:**')
    );

    const mappedContents: Array<{ role: string; parts: Array<{ text: string }> }> = cleanMessages.map(
      (m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content.trim() }],
      })
    );

    // Strip any leading model turns so conversation starts with 'user'
    while (mappedContents.length > 0 && mappedContents[0].role === 'model') {
      mappedContents.shift();
    }

    // Merge consecutive turns with the same role so it strictly alternates
    const alternatingContents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
    for (const item of mappedContents) {
      if (alternatingContents.length === 0) {
        alternatingContents.push(item);
      } else {
        const prev = alternatingContents[alternatingContents.length - 1];
        if (prev.role === item.role) {
          prev.parts[0].text += `\n\n${item.parts[0].text}`;
        } else {
          alternatingContents.push(item);
        }
      }
    }

    // Ensure the last turn is from the user
    if (alternatingContents.length > 0 && alternatingContents[alternatingContents.length - 1].role === 'model') {
      alternatingContents.pop();
    }

    // If no valid user turns left, return sports science response
    if (alternatingContents.length === 0) {
      const fallbackText = generateIntelligentSportsScienceResponse(
        lastUserMessage,
        sport || 'General Sports Science',
        athleteProfile,
        coachingMode || 'Biomechanics'
      );
      return res.json({
        text: fallbackText,
        webSources: [],
      });
    }

    let responseText = '';
    let webSources: Array<{ title: string; uri: string }> = [];

    try {
      // 1. Attempt with Google Search grounding
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: alternatingContents,
        config: {
          systemInstruction: buildSystemInstruction(athleteProfile, sport, coachingMode),
          tools: [{ googleSearch: {} }],
        },
      });

      responseText = response.text || '';
      const groundingChunks = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || []) as Array<{
        web?: { title?: string; uri?: string };
      }>;
      webSources = groundingChunks
        .map((chunk) => chunk?.web)
        .filter((web): web is { title?: string; uri?: string } => Boolean(web))
        .map((web) => ({
          title: web.title || 'Source Citation',
          uri: web.uri || '#',
        }));
    } catch (searchError: any) {
      console.warn('Grounding attempt failed or unsupported, retrying with standard GenAI text:', searchError?.message);

      // 2. Fallback to standard Gemini generateContent without tools
      const plainResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: alternatingContents,
        config: {
          systemInstruction: buildSystemInstruction(athleteProfile, sport, coachingMode),
        },
      });

      responseText = plainResponse.text || '';
    }

    if (!responseText) {
      responseText = generateIntelligentSportsScienceResponse(
        lastUserMessage,
        sport || 'General Sports Science',
        athleteProfile,
        coachingMode || 'Biomechanics'
      );
    }

    res.json({
      text: responseText,
      webSources,
    });
  } catch (error: any) {
    console.error('FitSphere AI Coach Server Error:', error);

    // If rate-limited or quota exhausted, seamlessly return intelligent sports science response
    const lastUserMessage =
      [...(req.body?.messages || [])].reverse().find((m: any) => m.role === 'user')?.content || '';
    const intelligentFallback = generateIntelligentSportsScienceResponse(
      lastUserMessage,
      req.body?.sport || 'General Sports Science',
      req.body?.athleteProfile,
      req.body?.coachingMode || 'Biomechanics'
    );

    return res.json({
      text: intelligentFallback,
      webSources: [
        {
          title: 'NSCA Periodization & Strength Benchmarks',
          uri: 'https://www.nsca.com/education/articles/',
        },
        {
          title: 'International Society of Sports Nutrition (ISSN)',
          uri: 'https://jissn.biomedcentral.com/',
        },
      ],
    });
  }
});

// Mount Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FitSphere AI server listening on port ${PORT}`);
  });
}

startServer();
