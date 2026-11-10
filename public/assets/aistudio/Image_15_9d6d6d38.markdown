---
name: Kinetic Obsidian
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#bccbb9'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#869585'
  outline-variant: '#3d4a3d'
  surface-tint: '#4ae176'
  primary: '#4be277'
  on-primary: '#003915'
  primary-container: '#22c55e'
  on-primary-container: '#004b1e'
  inverse-primary: '#006e2f'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#ffba61'
  on-tertiary: '#472a00'
  tertiary-container: '#ef9900'
  on-tertiary-container: '#5c3800'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6bff8f'
  primary-fixed-dim: '#4ae176'
  on-primary-fixed: '#002109'
  on-primary-fixed-variant: '#005321'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-hero:
    fontFamily: Space Grotesk
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Manrope
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-data:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-telemetry:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 1.5rem
  margin-mobile: 1rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes a high-performance, precision-engineered sports technology atmosphere. It merges the focused endurance of high-altitude training with the surgical exactitude of telemetry data analytics. The visual narrative relies on a refined, dark-mode-first environment punctuated by luminous, hyper-charged signals of achievement and athletic momentum.

The design movement combines **Modern High-Contrast Technical Minimalism** with **Subtle Cybernetic Radiance**. Interfaces present deep, layered graphite surfaces that eliminate eye fatigue during high-intensity trackside or gym use, offset by deliberate, electric kinetic accents. Elements feel chiseled, responsive, and performance-tuned—conveying power, telemetry-grade precision, and continuous personal progression.

## Colors

The foundation is built upon deep obsidian and rich slate strata, ensuring sustained visual comfort and maximum dynamic range for luminous data presentation:

- **Primary (`#22C55E` / Electric Kinetic Green):** Signals momentum, successful recovery phases, active tracking states, and positive biometric deltas.
- **Secondary (`#06B6D4` / Cyber Cyan):** Represents telemetric diagnostics, machine learning model insights, pacing paths, and aggregate sports statistics.
- **Tertiary (`#F59E0B` / High-Velocity Amber):** Used strictly for physiological thresholds, pacing warnings, cardiac target ranges, and performance alarms.
- **Neutral Foundation:** Layered from `#0F172A` (deep canvas background) into `#1E293B` (elevated control surfaces) and `#111827` (nested metrics and contrasting wells).
- **Text & Accents:** High-fidelity foreground text leverages `#F8FAFC` for primary labels with `#94A3B8` for secondary telemetry markers.

Gradients should be used sparingly, applied only to data progression paths or subtle directional borders rather than entire canvas backdrops.

## Typography

The typographic hierarchy communicates athleticism and data-dense clarity:

- **Space Grotesk** commands the display and headline layers. Its angular, geometric cuts reflect precision biomechanics and futuristic agility.
- **Manrope** anchors body copy and descriptive operational states, offering open apertures and superior legibility across shifting ambient lighting conditions.
- **JetBrains Mono** powers all telemetry outputs, live biometric counters, timestamps, and target indicators. Tabular numerals (`tnum`) must be enforced globally on mono labels to prevent layout jitter during real-time data streaming.

## Layout & Spacing

The layout operates on a fluid 12-column dynamic grid designed for instant readability under movement. 

- **Grid Behavior:** Content spans 12 columns on desktop (`>1024px`), 8 columns on tablet (`768px–1023px`), and 4 columns on mobile (`<768px`).
- **Touch-First Hit Targets:** To accommodate workout environments where users are in motion or wearing training gloves, interactive elements must adhere to a minimum hit zone of `48px × 48px`, expanding to `56px` vertical targets on mobile session views.
- **Rhythm:** Internal card padding utilizes `space-lg` (`1.5rem`), while micro metrics inside data clusters leverage `space-xs` and `space-sm` for dense, cohesive relationship grouping.

## Elevation & Depth

Visual hierarchy does not rely on heavy drop shadows, which muddies dark interfaces. Instead, the system uses a combination of tonal layering, razor-thin structural borders, and targeted ambient photon glows:

- **Level 0 (Canvas Base):** Ground layer at `#0F172A`. Deep, matte, and non-reflective.
- **Level 1 (Card & Module Layer):** `#1E293B` elevated with a 1px border rendered in `rgba(148, 163, 184, 0.08)` to clearly define boundaries without visual noise.
- **Level 2 (Active Overlays & Modals):** `#111827` with a subtle diffuse shadow: `0 16px 32px -8px rgba(0, 0, 0, 0.5)`.
- **Kinetic Glow Accents:** Active biometric tracking, high-performance thresholds, or selected toggles cast a specialized ambient halo: `0 0 20px rgba(34, 197, 94, 0.15)` for green states and `0 0 20px rgba(6, 182, 212, 0.15)` for cyan states.

## Shapes

The design system implements a rounded geometry that balances athletic agility with structural authority:

- **Core Cards & Modules:** Styled with a modern `rounded-2xl` profile (1rem / 16px), giving complex telemetric panels an approachable, high-end consumer-device feel.
- **Controls & Buttons:** Micro-controls use medium rounding (`0.5rem` / 8px), while primary session triggers use continuous full-pill rounding (`9999px`) to immediately telegraph actionable, fluid interaction.
- **Data Wells & Nested Trackers:** Inner graphic elements inside cards adopt `rounded-lg` (`0.5rem` / 8px) to mirror the outer container curvature harmoniously.

## Components

### Buttons & Action Controls
- **Primary Kinetic Button:** Solid `#22C55E` fill, `#0F172A` bold text, rounded full-pill. Hover adds a `0 0 16px rgba(34, 197, 94, 0.35)` glow. Active states scale down slightly to `98%`.
- **Secondary Telemetry Button:** Translucent `#06B6D4` with 10% opacity, bordered by a 1px solid `rgba(6, 182, 212, 0.4)`. Text rendered in `#F8FAFC`.
- **Destructive/Halt:** Ghost border with `#F59E0B` warning text on dark canvas.

### Segmented Controls & Interval Switchers
- Housed within an integrated `#111827` track container with `rounded-xl` and `0.25rem` padding.
- Selected tab features `#1E293B` background, subtle 1px border highlight (`rgba(255,255,255,0.08)`), crisp `#F8FAFC` label, and smooth spring physics transitions.

### Cards & Data Panels
- Encapsulated in `#1E293B` with `rounded-2xl` geometry and a 1px crisp outline of `rgba(148, 163, 184, 0.08)`.
- Metric cards feature monospace uppercase telemetry headers (`label-telemetry`), a large dynamic scalar (`Space Grotesk`, tabular numerals), and localized glowing sparklines.

### Chips, Pills & Status Badges
- Compact `rounded-full` enclosures with `0.25rem` vertical and `0.75rem` horizontal padding.
- Employs self-tinted background fills at 12% opacity with 100% solid text and an embedded pulsing `6px` status dot (e.g., green for "HR Connected", amber for "Anaerobic Zone").

### Form Fields & Inputs
- Dark recessed background `#111827` with an inset 1px border `rgba(148, 163, 184, 0.15)`.
- Focus states transition border to `#06B6D4` accompanied by a localized `0 0 0 3px rgba(6, 182, 212, 0.2)` ring. Generous `48px` minimum height across all inputs.

### Checkboxes & Toggle Switches
- Toggles utilize a sleek mechanical pill slot (`#111827`) with a glowing green or cyan thumb when engaged.
- Checkboxes maintain a squircle outline that snaps to full `#22C55E` fill with an obsidian checkmark icon upon selection.