---
name: Urban Resilience Framework
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#5c5f61'
  on-secondary: '#ffffff'
  secondary-container: '#e0e3e5'
  on-secondary-container: '#626567'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#0d1c2f'
  on-tertiary-container: '#76859b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#e0e3e5'
  secondary-fixed-dim: '#c4c7c9'
  on-secondary-fixed: '#191c1e'
  on-secondary-fixed-variant: '#444749'
  tertiary-fixed: '#d5e3fd'
  tertiary-fixed-dim: '#b9c7e0'
  on-tertiary-fixed: '#0d1c2f'
  on-tertiary-fixed-variant: '#3a485c'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
  severity-moderate: '#EAB308'
  on-severity-moderate: '#3D2E00'
  severity-moderate-container: '#FEF3C7'
  on-severity-moderate-container: '#713F12'
  severity-severe: '#F97316'
  on-severity-severe: '#ffffff'
  severity-severe-container: '#FFEDD5'
  on-severity-severe-container: '#7C2D12'
  severity-critical: '#BA1A1A'
  on-severity-critical: '#ffffff'
  severity-critical-container: '#ffdad6'
  on-severity-critical-container: '#93000a'
  status-safe: '#16A34A'
  on-status-safe: '#ffffff'
  status-safe-container: '#DCFCE7'
  on-status-safe-container: '#14532D'
  alert-crowdsource: '#2563EB'
  on-alert-crowdsource: '#ffffff'
  alert-climatic: '#0D9488'
  on-alert-climatic: '#ffffff'
  alert-civil-defense: '#BA1A1A'
  on-alert-civil-defense: '#ffffff'
  live-indicator: '#DC2626'
  offline-banner: '#45464d'
  on-offline-banner: '#ffffff'
typography:
  display:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  numeric-data:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 24px
    fontFeatureSettings: "'tnum' 1"
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 48px
  max-width-content: 1280px
  touch-target-min: 48px
  bottom-nav-height: 64px
  fab-size: 56px
  map-marker-size: 32px
  list-row-min-height: 64px
elevation:
  level-0: 'none'
  level-1: '0 1px 3px 0 rgba(11, 28, 48, 0.08)'
  level-2: '0 4px 12px 0 rgba(11, 28, 48, 0.14)'
  level-3-backdrop-blur: 12px
  level-3-backdrop-color: 'rgba(11, 28, 48, 0.45)'
motion:
  duration-fast: 150ms
  duration-standard: 250ms
  duration-slow: 400ms
  easing-standard: cubic-bezier(0.2, 0, 0, 1)
  easing-decelerate: cubic-bezier(0, 0, 0, 1)
z-index:
  map: 0
  map-controls: 10
  floating-fab: 15
  bottom-nav: 20
  active-card: 25
  bottom-sheet: 40
  modal-backdrop: 50
  modal: 51
  toast: 60
---

## Escopo e fonte de verdade

Este documento é o design system do PWA em `app/`. Ele deve permanecer sincronizado com os cinco fluxos descritos em `dev-docs/fluxos/`:

1. [Mapa Interativo](../dev-docs/fluxos/01-mapa-interativo.md)
2. [Câmeras em Tempo Real](../dev-docs/fluxos/02-cameras-tempo-real.md)
3. [Avisos da Defesa Civil](../dev-docs/fluxos/03-avisos-defesa-civil.md)
4. [Alertas Recentes](../dev-docs/fluxos/04-alertas-recentes.md)
5. [Perfil e Configurações](../dev-docs/fluxos/05-perfil-configuracoes.md)

Toda vez que um fluxo mudar, revisar as seções correspondentes aqui. Toda vez que um componente novo for criado na implementação, ele deve ter uma entrada nesta página antes de ser considerado "pronto".

Nomes de componentes neste documento usam exatamente os nomes já definidos nos arquivos de fluxo (`AlertMarker`, `CameraPlayer`, `RiskBadge`, etc.), para que design e implementação nunca divirjam de nomenclatura.

---

## Brand & Style

The design system is engineered for high-stakes urban mobility and flood resilience in Joinville, SC. The brand personality is **authoritative, dependable, and calm**, prioritizing the delivery of critical information over decorative flair. The audience spans daily commuters checking a route before leaving home, and residents deciding in real time whether a street is safe to cross — the app has no login wall, so the first five seconds on the map screen carry the entire trust burden.

The design style follows a **Modern Corporate** approach with a heavy emphasis on **Functional Minimalism**: high-contrast information hierarchy and a utility-first aesthetic so the UI stays legible in direct sunlight, at night, and mid-storm. The emotional target is safety and controlled precision, not "tech-startup" playfulness — this reads as institutional infrastructure, closer to a transit agency's app than a consumer social app.

---

## Colors

### Brand identity

The palette pairs an **ink-black primary** (`primary: #000000`) with a **deep navy container** (`primary-container: #131b2e`). In practice these carry different jobs: `primary` drives solid buttons, the bottom navigation's active state, and primary CTAs — pure black reads as maximum-authority, "this is the action that matters." `primary-container` is the actual "water and institutional blue" brand signal described by the product: use it for the map screen's header scrim, the splash/loading background, and any full-bleed brand surface. Do not treat `primary` as if it were blue in mockups; it is literally black, by design, for contrast.

The background of every screen is `surface` / `background` (near-white, cool-tinted), maximizing contrast for map data overlays. Color mode is **locked to Light** for MVP to guarantee outdoor legibility. `inverse-surface` / `inverse-on-surface` / `inverse-primary` exist in the palette for transient inverted surfaces (toasts, snackbars) today; a full dark "Night Mode" is a documented future direction, not built for MVP — do not wire up a theme toggle in `SettingsPage` (Fluxo 5) until it exists here.

### Severity scale (map alerts and Defesa Civil risk levels)

Fluxo 1 (`Alerta` markers) and Fluxo 3 (avisos da Defesa Civil) both use a three-tier severity scale with different labels but identical meaning and identical color tokens. Reusing the same tokens keeps the color language consistent across the whole app — a driver who learns "orange means slow down" on the map should not have to relearn it in Defesa Civil.

| Token | Hex | Map (`Alerta`, Fluxo 1) | Defesa Civil (`RiskBadge`, Fluxo 3) |
|---|---|---|---|
| `severity-moderate` | `#EAB308` | Moderado | Atenção |
| `severity-severe` | `#F97316` | Grave | Alerta |
| `severity-critical` | `#BA1A1A` (= `error`) | Crítico | Emergência |

Each has a `-container` / `on-*-container` pair for badges and chips on light backgrounds, and a solid `on-severity-*` for filled backgrounds (map pins, severity bar on cards).

`status-safe` (`#16A34A`) is the fourth semantic state: used when a "Pista Limpa" report clears a marker, and for empty/all-clear states ("Nenhum alerta ativo", "Joinville está segura").

### Alert-type scale (Fluxo 4 — Alertas Recentes)

The unified feed distinguishes **source**, not severity, and needs its own three colors so a critical crowdsource report and a critical Defesa Civil warning are never visually confused:

| Token | Hex | Type | Label |
|---|---|---|---|
| `alert-crowdsource` | `#2563EB` | Relato de cidadão | "Cidadãos" |
| `alert-climatic` | `#0D9488` | Sensor / dado meteorológico | "Climático" |
| `alert-civil-defense` | `#BA1A1A` (= `severity-critical`) | Aviso grave da Defesa Civil | "Defesa Civil" |

`alert-civil-defense` intentionally aliases `severity-critical` — a grave Defesa Civil alert genuinely is the same "critical" signal as a red map marker, just from an official source.

### Rule: never color alone

Every place severity or alert type appears in the flows, it is paired with a label or icon (badge text like "Grave", tab labels, chip labels in `AlertTypeLegend`). Never introduce a UI element that relies on color as the only differentiator — this is both an accessibility requirement (color-blind users must be able to distinguish Moderado/Grave/Crítico) and already the pattern the flows establish.

### Utility colors

* `live-indicator` (`#DC2626`) — the "AO VIVO" dot on `CameraCard` (Fluxo 2). Distinct from `severity-critical` in intent (liveness, not danger) but visually close by design — both mean "pay attention now."
* `offline-banner` (`#45464d`, `on-surface-variant` family) — connectivity banners in Fluxo 2 ("Você está offline") and network-error toasts in Fluxos 1, 3, 4.

---

## Typography

Inter exclusively, tuned for **glanceability** — extracting a data point in under a second while walking or driving.

* **Headlines** (`headline-lg`, `title-md`): tighter letter-spacing, heavier weight, anchor each screen's top section (e.g. "Alertas Recentes", "Defesa Civil").
* **Screen title** (`ScreenHeader`): Inter 32px bold, line-height tight, `-0.02em` tracking, `on-surface`, left-aligned, followed by one supporting sentence at `body-lg` in `on-surface-variant`. This is the large type moment of every list screen; it replaces the small centered `FloatingBadge` pill on list screens.
* **Numeric data** (`numeric-data`, tabular figures via `tnum`): TTL countdowns ("Expira em 12 min"), confirmation counts ("3 confirmações"), notification badge counts. Tabular figures keep these aligned when they update live on the map.
* **Labels** (`label-caps`): severity badge text, chip labels ("Cidadãos", "Climático", "Defesa Civil"), section headers in `SettingsPage`.
* **Body** (`body-lg` for primary reading text, `body-sm` for secondary/truncated lines): aviso summaries, feed card summaries, form field text.
* **Mobile scaling**: `headline-lg` steps down to `headline-lg-mobile` (28px → 24px) below the desktop breakpoint to avoid wrapping in dense list views like `AlertFeed` and `CivilDefenseList`.

---

## Layout & Spacing

Map-centric, mobile-first, fluid grid.

* **Mobile (default)**: single column. The map (Fluxo 1) or a list (Fluxos 2–5) fills the viewport; a bottom sheet or full-width card layers over it for detail/context. Standard margins: 16px (`margin-mobile`).
* **Desktop**: fixed side panel, 360–400px, for navigation/lists; remaining viewport is the map. Applies mainly to Fluxo 1 — the PWA's primary target is still mobile.
* **Rhythm**: 8px linear spacing scale (`spacing.sm`) for internal component spacing.
* **Safe areas / thumb zone**: the FAB "+" (Fluxo 1.2), bottom sheet primary actions ("Confirmar" / "Pista Limpa"), and the bottom navigation bar all live in the bottom 30% of the screen for one-handed use. Respect `env(safe-area-inset-bottom)` on iOS PWA installs — the 64px `bottom-nav-height` token does not include the safe-area inset; add it on top.

### Bottom navigation (5 tabs — global)

Present on every screen per `dev-docs/fluxos/index.md`. Fixed height `bottom-nav-height` (64px) plus safe-area inset, `z-index.bottom-nav`. Max width `max-w-sm` for a compact, centered appearance.

| Position | Tab | Icon concept | Badge |
|---|---|---|---|
| 1 | Mapa | hand-drawn map | none |
| 2 | Câmeras | hand-drawn camera | none |
| 3 | Defesa Civil | hand-drawn shield with check | none (MVP) |
| 4 | Alertas | hand-drawn bell | none (MVP) |
| 5 | Perfil | hand-drawn user | none |

Icons are `lucide-react` at 22px with `strokeWidth={2}`. Labels are 12px semibold (`text-xs font-semibold`, line-height 1), never smaller: the earlier 10px medium labels were hard to read outdoors. Active tab uses `primary` (black) for icon + label on a sliding black pill (`h-14`, `rounded-xl`); inactive uses `on-surface-variant`, hovering to `on-surface`.

The bar is a solid white `surface-container-lowest` card (`rounded-2xl`, 1px `outline-variant/60` border, `0 4px 16px rgba(11,28,48,0.12)` shadow). It is deliberately not translucent and has no backdrop blur: content scrolling underneath bled through and made the icons and labels look soft. The pill's `translateX` and width are rounded to whole pixels for the same reason, since fractional offsets blur its edges. Each tab has a 2px `primary` focus ring. The Defesa Civil badge uses `severity-critical` red with white numeral, `label-caps`-scale digits, positioned top-right of the icon, minimum tap target still 48px including the badge overlap.

---

## Elevation & Depth

Hierarchy via **tonal layers**, crisp low-contrast outlines, and **glassmorphism** — the background is frequently a busy, multi-colored map, and blurry shadows read as "muddy" against it.

1. **Level 0 — Floor**: the map surface (`MapView`).
2. **Level 1 — Inlay**: search bars, `CameraCard` in its resting state. 1px `outline-variant` border plus `elevation.level-1` (subtle 4px ambient shadow).
3. **Level 2 — Active cards**: `AlertDetailSheet`, `AlertFeedCard` on interaction, expanded `CivilDefenseCard`. White (`surface-container-lowest`) background, `elevation.level-2` (12px shadow) to signal focus.
4. **Level 3 — Alerts/modals**: `NewReportModal`, `CameraPlayer` fullscreen, `CivilDefenseDetail` when presented as overlay. Semi-transparent backdrop at `elevation.level-3-backdrop-color` with `elevation.level-3-backdrop-blur` (12px blur) to dim the map and force focus onto the critical message.

### Glassmorphism (map controls and floating elements)

Map controls and floating elements use glassmorphism for a modern, layered appearance over the map:

* **Pattern**: `backdrop-blur-md bg-white/70 border border-white/40 rounded-2xl shadow-lg`
* **Used by**: `AlertSummaryBar`, `SeverityLegend`, FAB, zoom controls
* **Rationale**: Semi-transparent with blur creates depth without heavy shadows, keeping the map visible through controls while maintaining legibility.

---

## Motion & Interaction

Interaction timing tokens (`motion.*`) keep every sheet, modal, and marker transition feeling like one system.

* **Bottom sheets** (`AlertDetailSheet`, expanded `CivilDefenseDetail`): slide up from the bottom edge, `duration-standard` (250ms), `easing-decelerate`. Drag-to-dismiss follows the finger 1:1; releasing past 40% of the sheet height or a fast downward flick dismisses with the same easing reversed. Tapping the backdrop also dismisses.
* **Modals** (`NewReportModal`, `CameraPlayer`): fade + slight scale-in, `duration-standard`.
* **Map marker lifecycle**: a new `AlertMarker` drops in with a short bounce (`duration-fast` then settle); a marker removed by TTL expiry or by reaching 3 "Pista Limpa" reports fades out over `duration-standard` rather than disappearing instantly, so the user registers the change instead of losing track of the map.
* **Chip toggles** (`AlertTypeFilter`): instant color/opacity change on tap, `duration-fast`, no layout shift — list items fade out/in rather than reflowing abruptly.
* **List entrance** (`.rise-in` in `src/index.css`): list items rise 20px and fade in over 420ms (`cubic-bezier(0.22, 1, 0.36, 1)`), staggered 70ms per item through the `--rise-index` custom property, capped at index 6 so long lists never wait. Disabled under `prefers-reduced-motion`. Used by `CivilDefenseList` and `AlertFeed`. For a fixed set of children (the `SettingsPage` column), put `.rise-in-stagger` on the parent instead: it staggers its direct children by `nth-child` without per-item props.
* **Press feedback**: tappable cards scale to 0.99 and chips to 0.95 on `:active`.
* **Skeleton loaders**: used on first load for `CameraList`, `CivilDefenseList`, `AlertFeed` — a subtle shimmer, not a spinner, since these are list-shaped waits. `MapView`'s initial load uses a centered spinner instead, since there is no list shape to skeleton.
* **Micro-feedback**: action buttons ("Confirmar", "Pista Limpa", "Reportar") disable and show an inline progress indicator while their request is in flight — never a full-screen blocking spinner for these, per Fluxo 1.1's "Carregando ação" state.

---

## Shapes

Soft but structured.

* **Buttons**: `rounded.lg` (8px) — a light, deliberate softening; buttons are the most-tapped surface and read as friendlier without drifting from the utilitarian tone.
* **Inputs, chips, segmented segments**: `rounded.DEFAULT` (4px, `0.25rem`).
* **Information cards** (`AlertFeedCard`, `CameraCard`): `rounded.lg` (8px). `CivilDefenseCard` uses `rounded-2xl`, the same card language as `SettingsSection`, because it carries a full-width photo.
* **Severity indicators / status chips**: 4px radius, matching inputs, for system-wide consistency. Exception: `RiskBadge` and filter chips (`FilterChip`) are fully round (`rounded.full`) pills.
* **Map markers (`AlertMarker`)**: pin shape — sharp bottom point for precise geolocation, rounded top housing the severity icon and confirmation count. Size: `map-marker-size` (32px), scales up slightly on tap/selection.
* **Bottom sheets**: `rounded.xl` (12px) on the top two corners only.

---

## Components

Organized by flow. Every entry below is the design spec for a component name already established in the corresponding `dev-docs/fluxos/*.md` file — implementation should treat these as authoritative props/states, not just visual references.

### Fluxo 1 — Mapa Interativo

**`MapView`**
Full-screen map centered on Joinville (-26.3044, -48.8456) via MapCN. `z-index.map`. Hosts all `AlertMarker` instances and the `+` FAB. On load, requests geolocation permission; if granted, centers on user's position instead.

**Map tiles**: CartoDB Positron (monochromatic light base) for a clean, modern look that makes severity-colored markers stand out. Attribution includes both OSM and CartoDB.

**`AlertMarker`**
Pin-shaped marker, colored by `severity-moderate` / `severity-severe` / `severity-critical`. Displays confirmation count as a small numeric badge on the pin (uses `numeric-data` at reduced scale). Includes animated pulse effect — a concentric circle expands and fades behind the pin using the severity color, communicating urgency. Tap target extends beyond the visual pin to the full 48px minimum. Lifecycle motion per Motion & Interaction above.

**`AlertSummaryBar`**
Floating bar at top-center of map, `elevation.level-3-backdrop-blur` with glassmorphism (`bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl`). Shows count of active alerts ("3 alagamentos ativos") with mini severity dots. Empty state: "Nenhum alagamento ativo". `z-index.map-controls`.

**`SeverityLegend`**
Collapsible info button at top-left of map, glassmorphism style. Toggles a card showing the three severity levels with color dots and descriptions. `z-index.map-controls`.

**`AlertAreaCircle`**
Concentric gradient rings around each marker (10 rings with gradual opacity falloff), creating a soft glow effect that communicates the alert's affected area.

**Floating action button ("+")**
Bottom-right, thumb zone, `fab-size` (56px), glassmorphism style (`bg-white/80 backdrop-blur-md border border-white/40`), `elevation.level-2`. Opens `NewReportModal`. `z-index.floating-fab`.

**`LocateButton`**
Directly above the "+" FAB, same size and glassmorphism style. Requests a fresh GPS position and centers the map on it; shows a spinner while locating. Failure surfaces as an error toast and leaves the map where it is.

**`FarFromJoinvilleAlert`**
Glassmorphism card below the top controls, shown when the user is more than 50 km from `JOINVILLE_CENTER`. Primary action "Ir para Joinville" flies the map to the city; both it and the close button dismiss the card, which returns only if `LocateButton` is used again while still far away.

**Zoom controls**
Bottom-left, glassmorphism styled, positioned above bottom nav clearance. Custom styling with rounded corners and subtle shadow.

**`AlertDetailSheet`**
Bottom sheet (Level 2 elevation), triggered by tapping a marker. Content: reverse-geocoded location reference (never raw coordinates — see Accessibility & Content rules below), `RiskBadge`-style severity chip, TTL countdown ("Expira em 12 min", `numeric-data`), confirmation count. Two actions: **Confirmar** (`POST /api/alertas/{id}/confirmar`, resets TTL) and **Pista Limpa** (`POST /api/alertas/{id}/pista-limpa`; at 3 reports the marker fades out and the sheet auto-dismisses). Buttons disable with inline progress during the request (see Motion). Dismiss by tap-outside or drag-down.

**`NewReportModal`** (Level 3)
Five-step flow inside one modal/sheet:
1. Location — pin auto-placed via `useGeolocation`, draggable to adjust.
2. Name (optional) — single text input, empty defaults to "Anônimo" display, no validation.
3. Photos — "Adicionar foto" opens the device camera directly (gallery not permitted), 0–3 photos, horizontal thumbnail strip.
4. `SeveritySelector` (below).
5. Submit ("Reportar") — `POST /api/alertas`. On success: modal closes, map recenters and shows the new marker. On error: inline error message, form state preserved for retry.

**`SeveritySelector`**
Three side-by-side cards, single-select, using `severity-moderate` / `severity-severe` / `severity-critical` container colors with icon + short label + one-line description exactly as specified in the flow ("Trânsito lento, cuidado ao passar" / "Via parcialmente bloqueada" / "Via totalmente bloqueada ou risco de vida"). Selected card gets a 2px border in its own severity color plus a filled background; unselected cards stay at `surface-container-low`.

### Fluxo 2 — Câmeras em Tempo Real

**`CameraList`**
Vertical list of `CameraCard`. Skeleton state on first load.

**`CameraCard`**
`rounded.lg`, `elevation.level-1`. Shows point name, static thumbnail or live preview, and a `live-indicator` red dot + "AO VIVO" label (`label-caps`) when the stream is active. Unavailable state replaces the preview with centered text "Câmera temporariamente indisponível" on `surface-container` background — card remains in the list, not hidden.

**`CameraPlayer`** (Level 3, fullscreen or large modal)
Embeds the Prefeitura's iframe/embed directly — no local video processing or storage. States: connecting (spinner over frame), live (continuous playback), error ("Não foi possível carregar esta câmera" + "Tentar novamente" button). Controls: close (X or back), rotate-to-landscape affordance.

**Offline banner**
Top banner, `offline-banner` background, "Você está offline — câmeras indisponíveis"; all `CameraCard`s visually lock (reduced opacity, tap disabled) while shown.

### Fluxo 3 — Avisos da Defesa Civil

**`CivilDefenseList`**
Reverse-chronological list, skeleton on load. Empty state: illustration + "Nenhum aviso ativo no momento. Joinville está segura." using `status-safe` accent. Error state: retry button, cached data shown underneath if available.

**Screen layout**
Top to bottom: `ScreenHeader` ("Defesa Civil" / "Avisos oficiais e níveis de risco para Joinville.") scrolling with the page, then `RiskLevelFilter` in a sticky bar on `background`, then the list. The list has 16px side margins and 16px between cards.

**`RiskLevelFilter`**
Three `FilterChip`s (Emergência, Alerta, Atenção) with the level's dot and its notice count in tabular figures. The chips share the row width (`flex-auto`, centered content, 13px text, 4px gaps) and never overflow the screen; they fit on one line from 360px wide and wrap to a second line only on narrower screens. No horizontal scrolling. Active chips match `RiskBadge`: white `surface-container-lowest` background, 1px `outline-variant` gray border, label in the level's `on-*-container` color with the solid colored dot. Inactive chips keep the white background with an `on-surface-variant` label and a gray dot, so the state change is the color of the text and dot.

**`CivilDefenseCard`**
A real link (`<a target="_blank">`) to the official notice, not a button with `window.open`. Card: `rounded-2xl`, 1px `outline-variant/50` border, `surface-container-lowest`, `elevation.level-1`, stepping to `elevation.level-2` on hover. Content order: the thumbnail first, full card width at 16:9 (slow 1.05 zoom on hover); then a 16px-padded body with `RiskBadge` on the left and the relative time plus an external-link icon on the right (`body-sm`, `on-surface-variant`); then the notice title as an `h2` at 18px medium, `on-surface`, never truncated. Cards without a thumbnail show only the body. `CivilDefenseCardSkeleton` mirrors this exact shape.

**`RiskBadge`**
Reusable badge component, three states mapped 1:1 to the severity scale (`severity-moderate` = Atenção, `severity-severe` = Alerta, `severity-critical` = Emergência). Pill (`rounded.full`), 14px semibold in sentence case ("Atenção", never "ATENÇÃO"), white `surface-container-lowest` background with a 1px `outline-variant` gray border, label text in the level's `on-*-container` color and a leading 8px dot in the solid severity color. The dark `on-*-container` tone is used for text because the solid yellow of `severity-moderate` is not legible on white. Same token set as the map's severity chip, different label set.

**`CivilDefenseDetail`**
Full screen or expanded sheet. Title, `RiskBadge`, timestamp, issuing body ("Defesa Civil de Joinville"), full body text, geographic scope when available, instructions to the population when present. Back navigation via button or swipe.

**Nav badge**
Numeric badge on the "Defesa Civil" tab (see Bottom navigation above), shown when 1+ Alerta/Emergência-level avisos were issued in the last 24h; clears automatically once the tab is opened.

### Fluxo 4 — Alertas Recentes

**`AlertTypeLegend`**
Fixed (non-scrolling) row directly below the "Alertas Recentes" headline, three chips using `alert-crowdsource` / `alert-climatic` / `alert-civil-defense` with labels "Cidadãos" / "Climático" / "Defesa Civil". Purely informative, not interactive — stays pinned while the list below scrolls.

**Screen layout**
Same skeleton as Defesa Civil: `ScreenHeader` ("Alertas Recentes" / "Relatos de cidadãos, chuva e avisos oficiais.") scrolling with the page, `AlertTypeFilter` in a sticky bar on `background`, then the list with 16px side margins and 12px between cards. List items enter with `.rise-in`.

**`AlertTypeFilter`**
Row of three toggleable `FilterChip`s, same three colors, default all-active. Each chip carries the type's dot and its alert count in tabular figures. Same chip styling and row behavior as `RiskLevelFilter` (white background, gray border, label in the type's `on-*-container` color when active): chips share the width, one line from 360px, wrap below that, never overflow. Toggling removes/restores that type from `AlertFeed` instantly (`duration-fast`, list items fade rather than jump-reflow). If all three are deactivated, show inline message "Selecione ao menos um tipo de alerta." in place of the list.

**`AlertFeed`** / **`AlertFeedCard`**
Reverse-chronological list. Each card uses the same card language as `CivilDefenseCard`: `rounded-2xl`, 1px `outline-variant/50` border, `elevation.level-1` stepping to `level-2` on hover, 16px padding, 0.99 scale on press. Background is a very light diagonal tint that starts at the bottom-right corner, under the corner icon, and fades toward the top-left: the type's `-container` color at 20% opacity fading into `surface-container-lowest` by the middle of the card (`bg-linear-to-tl from-*-container/20 to-surface-container-lowest to-50%`, from `gradientFromClass` in `lib/alertType.ts`). Keep it this faint and keep it away from the top: the title row must always sit on plain white for contrast.

Content, top to bottom:
* Corner icon: the type icon is a background element, not a content element. 80px (`h-20 w-20`), `strokeWidth={2.25}`, solid type color (`accentTextClass`) at 25% opacity, positioned at `-right-4 -bottom-4` so its bottom-right quarter is cut off by the card edge (`overflow-hidden` on the card) and the rest sits inside, like a sticker pasted on the corner. It stacks behind the content (`isolate` on the card, `-z-10` on the icon) and is `aria-hidden`. Every main alert card uses this treatment.
* No visible type label: the corner icon, its color and the tint identify the type. The label stays as screen-reader-only text before the location.
* First row: the location at 16px bold, truncated, and the relative timestamp on the right (`body-sm`, "Agora mesmo", "Há 5 minutos"). Text runs over the corner icon; the Defesa Civil title and badge keep a 48px right padding (`pr-12`) so they do not sit on it.
* A detail block that depends on the type. Metrics sit in a `rounded-xl` panel on `surface-container-lowest/40` (translucent so the corner icon shows through) with two equal columns read left to right, stopping 56px short of the right edge (`mr-14`) to leave the corner icon clear, each a 13px `on-surface-variant` label over a 14px semibold tabular value:
  * Climático: "Últimas 24h" and "Última hora" (average rain in mm, pt-BR decimals). Missing readings show "Sem leitura".
  * Cidadãos: an "Expira em 34 min" line, then "Severidade" (severity dot plus label) and "Confirmações".
  * Never more than two metrics per card.
  * Defesa Civil: the notice title clamped to two lines, then its `RiskBadge`.
  * Any type without its detail payload falls back to the one-line `summary`.

Tap behavior branches by type:
* Crowdsource → opens `AlertDetailSheet` (reused from Fluxo 1, same "Confirmar"/"Pista Limpa" actions).
* Climático → opens an informative modal with sensor/source data and, when available, a link to the official source.
* Defesa Civil grave → navigates to `CivilDefenseDetail` (reused from Fluxo 3).

This reuse is intentional: never fork `AlertDetailSheet` or `CivilDefenseDetail` into feed-specific variants.

### Fluxo 5 — Perfil e Configurações

**`SettingsPage`**
Identity zone (`AccountSummary` when logged in, or the compact logged-out "Sua sessão" card) followed by grouped sections rendered via `SettingsSection`, in this order: Notificações, Exibição, Instalar o app (when installable), Sobre o app. Settings the user is most likely to change come first. No synced data: everything here is local-device state persisted to `localStorage` / PWA storage.

The identity zone and every `SettingsSection` share the same card language as the rest of the app (`CivilDefenseCard`, `CameraCard`): `rounded-2xl`, 1px `outline-variant/50` border, `surface-container-lowest` background, `elevation.level-1`-style shadow. When logged out, the identity card is compact: a circular `UserCircle` glyph, a small sentence-case "Sua sessão" line (`body-sm`, `on-surface-variant`) over a bold "Anônimo" and one sentence, then a single full-width secondary button "Entrar ou criar conta" that opens `AuthSheet`. The login form never sits inline on the page. When logged in it is `AccountSummary` (avatar/initial, a sentence-case "Conta" line over the name, a "Membro desde" row on a `bg-muted` inset, a `bg-muted` panel titled "Meus relatos ativos" at 16px semibold), with an inset `bg-muted` admin-access row (icon + "Abrir" button) appended for `role = ADMIN` accounts.

Each `SettingsSection` header pairs a 16px `lucide` icon in `on-surface-variant` with the title at 16px semibold, sentence case, `on-surface` (never `label-caps`), inside the card's own padding. Rows are separated by space only (`gap-1`), never by hairlines (`divide-y` was removed). Every row title is 16px medium (`text-base font-medium`) with its explanation at `body-sm` in `on-surface-variant`, and the control (switch, segmented control or button) on the right or below. Only one solid black (`primary`) button is shown on the page at a time, "Ativar notificações"; every other action ("Entrar ou criar conta", "Instalar app", "Reportar um problema", "Abrir") uses the `secondary` variant. The content column is capped at `max-w-md` and centered, with a `gap-4` rhythm between cards. The screen opens with `ScreenHeader` ("Perfil" / "Sua conta e as preferências deste aparelho."), aligned to the same `max-w-md` column. The cards enter in sequence through `.rise-in-stagger` on the column (70ms steps, capped at the fifth card).

**`NotificationSettings`**
Permission-gated: shows an "Ativar notificações" banner if permission was never requested; a disabled-toggles + "ative nas configurações do sistema" banner if permission was denied; three enabled toggles if granted:
* Alertas de cidadãos próximos — reveals `RadiusSelector` (1/3/5/10 km) when active.
* Alertas climáticos.
* Avisos graves da Defesa Civil.

**`RadiusSelector`**
Inline segmented control, four options (1/3/5/10 km), appears/collapses under its parent toggle.

**`DisplaySettings`**
Map type selector (Padrão / Satélite, controls the MapCN tile layer) and a distance unit toggle (km / m).

**`AppInfo`**
Four compact rows, no long lists inline: "Versão" with the version in tabular figures; "Código-fonte no GitHub" (external link); "Fontes de dados" (chevron) which opens `DataSourcesSheet`; and a full-width secondary "Reportar um problema" button linking to the GitHub issue form. Link rows are full-bleed tap targets (min 48px) with a `rounded-xl` `bg-muted` hover.

**`DataSourcesSheet`**
Bottom sheet (`Drawer`) titled "Fontes de dados", with the project credit as its description, listing every external source (CEMADEN, Open-Meteo, WorldTides, Defesa Civil de Joinville, Prefeitura de Joinville, OpenStreetMap, Esri World Imagery) as a link row: name at 16px medium, one-line description at `body-sm`, external-link icon on the right. Rows separated by space, not hairlines.

**`AuthSheet`**
Bottom sheet (`Drawer`) titled "Entrar ou criar conta" ("Acompanhe seus relatos em qualquer aparelho.") that hosts `AuthForm` unchanged: the Entrar / Criar conta `SegmentedControl`, e-mail and password fields, the solid submit button, a plain centered "ou" (no rules around it) and the Google button. It closes only after a successful login, register or Google sign-in; on failure it stays open with the error message.

### Fluxo 6 — Administração e Observabilidade

Tela restrita para contas administradoras, acessada a partir de `SettingsPage` e da rota escondida `/admin`. A finalidade é operacional: leitura rápida de números, estado atual da API e diagnóstico dos jobs automáticos.

**`AdminScreen`**
Painel em rolagem vertical com cinco blocos principais:
* hero/banner no topo com fundo `primary-container` em degradê sutil, título forte e contagens-chave;
* grade compacta de KPIs em cards brancos para contas, alertas e fontes oficiais;
* `AlertChartsSection`: filtro de período (7, 14 ou 30 dias) seguido dos gráficos de alertas, todos derivados da mesma série diária para que os números sempre concordem;
* seção de status da API em card próprio, com destaque para banco, versão e uptime;
* listas de schedulers e alertas com filtros, mantendo leitura imediata em mobile.

O hero é a assinatura visual da tela: um bloco mais escuro que o restante do app, com alto contraste e informação concentrada, para marcar o contexto de operação sem abandonar o sistema de cores do restante do produto.

**`AlertChartsSection`**
Cabeçalho "Gráficos" com um `SegmentedControl` de período (7 / 14 / 30 dias) em uma única linha acima dos gráficos; o filtro escopa todos eles. Estados: esqueleto na primeira carga, erro com "Tentar novamente", vazio com o tom calmo do app ("Nenhum alerta nos últimos N dias. Joinville está tranquila.") e, ao trocar o período, o gráfico anterior fica em opacidade reduzida até a nova série chegar (sem esqueleto nem salto de layout). Os dados vêm de `GET /api/admin/alerts/timeline`, nunca da lista paginada de alertas, que tem teto de 200 itens.

**`ChartCard`**
Contêiner de gráfico: `figure` com o mesmo card de `StatsCard` (`rounded-2xl`, borda, `shadow-sm`), rótulo `label-caps`, título e o botão "Ver tabela" / "Ver gráfico" no canto. Todo gráfico tem a tabela equivalente, que é a alternativa acessível e também cobre o contraste baixo do amarelo de severidade.

**`DailyAlertsChart`**
Colunas empilhadas por dia, uma cor por severidade usando exatamente os tokens `severity-moderate` / `severity-severe` / `severity-critical` (Moderado na base, Crítico no topo). Colunas com no máximo 24px, 4px de raio apenas na ponta de dados do segmento do topo, 2px de espaço entre segmentos, linha-base e grade em hairline sólido. Eixo Y com três marcas em números redondos, rótulo direto apenas no dia de pico, legenda sempre presente com o total do período por severidade. Cada coluna é o alvo de toque (largura total do slot, altura total do gráfico) e abre um tooltip com data, total e a contagem por severidade; o teclado mostra o mesmo tooltip via foco.

**`AlertsByTypeChart`**
Barras horizontais por origem (Cidadãos, Climático, Defesa Civil) nas cores `alert-user` / `alert-climatic` / `alert-civil-defense`, sempre com ícone e rótulo de texto ao lado, valor na ponta da barra e tooltip com a parcela do total.

**`StatsCard`**
Card de KPI com label em caixa alta, valor numérico dominante e descrição curta. Usa superfície clara, borda leve e sombra discreta para manter o foco no dado. Os valores devem usar `tabular-nums` quando numéricos.

**`ApiStatusSection`**
Card de diagnóstico da API, com badge de status no topo e quatro blocos compactos para banco, versão, uptime e última atualização. O estado `UP` usa `status-safe`; `DOWN` usa `severity-critical`.

**`SchedulerStatusList`**
Lista vertical de jobs agendados. Cada item mostra nome legível, descrição, intervalo, última execução, próxima previsão, duração e falhas. O estado do job nunca é cor apenas: sempre acompanha texto e badge.

**`SchedulerStatusBadge`**
Badge curto para o status operacional do job. `OK` usa verde, `FAILING` usa vermelho, `LATE` usa amarelo/laranja e `NEVER_RAN` usa neutro.

**`AdminAlertFilters`**
Painel de filtro em card único, com segmentados para escopo, tipo, severidade e ordenação. A opção de escopo deve manter a tela útil em uma mão só, com toque claro entre "Ativos" e "Todos". A ordem visual dos filtros vai de contexto mais geral para recorte mais específico.

**`AdminAlertCard`**
Card de alerta com uma faixa superior de severidade, chips para tipo e estado, referência visual de localização e métricas de confirmação, pista limpa e fotos. O card deve continuar legível mesmo com o texto do usuário ou o histórico do alerta vazio.

### Shared UI primitives (`components/ui/`)

Reusable controls used across the flows; defined once in the design so each screen does not re-specify interaction details.

**`ScreenHeader`** (`components/layout/ScreenHeader.tsx`)
Top of a list screen: `h1` title plus an optional one-line description (see Typography, "Screen title"). 16px side padding, top padding of `safe-area-inset-top + 28px`. Not sticky: the filters below it are what stays pinned. Adopted in Defesa Civil (Fluxo 3), Alertas Recentes (Fluxo 4) and Perfil (Fluxo 5), replacing the sticky `FloatingBadge`. `FloatingBadge` stays only where it floats over full-bleed media (map, camera player).

**`Switch`**
Toggle control with a 24px-high track and a 20px thumb. Track is `primary` when checked and `outline-variant`/`border` when off; thumb is white with a 1px `black/10` hairline border (no shadow — the app avoids shadows). 150ms color/position transitions, 2px `primary` focus ring. Disabled state at 50% opacity. `role="switch"` with `aria-checked`.

**`SegmentedControl`**
Single-select segmented control rendered as a row of equal-width pill segments (`rounded.full`, min 40px tall, 14px semibold) in a `muted` (`surface-container`) pill track with 4px padding and 4px gaps. The selected segment is a white `surface-container-lowest` pill with a 1px `outline-variant/60` ring and `on-surface` text; unselected segments are `on-surface-variant` with a hover to `on-surface`. No shadow, no reflow on change. 2px `primary` inset focus ring on each segment. Used by `RadiusSelector` (1/3/5/10 km), `DisplaySettings` (map type, distance unit), the login/register switch in `AuthForm`, and the admin filters. The active segment is never color-only: it also changes fill.

---

## Screens & states reference

Every primary screen defines the same four state categories in its flow doc. Centralizing them here so no screen ships without covering all four.

| Screen | Loading | Empty | Error / offline |
|---|---|---|---|
| Mapa (Fluxo 1) | Centered spinner while `GET /api/alertas` resolves | Clean map, FAB visible, subtle "Nenhum alerta ativo no momento" | Warning toast; map stays interactive using cached PWA data if available |
| Câmeras (Fluxo 2) | Skeleton cards | n/a (list is static config) | Per-card "Câmera temporariamente indisponível"; global offline banner locks the list |
| Defesa Civil (Fluxo 3) | Skeleton list | Illustration + "Nenhum aviso ativo no momento. Joinville está segura." | Error message + "Tentar novamente"; cached data shown if available |
| Alertas Recentes (Fluxo 4) | Skeleton of 3 cards | "Nenhum alerta recente. Joinville está tranquila no momento." | Error message + "Atualizar"; cached data shown if available |
| Perfil (Fluxo 5) | n/a (local state, no fetch) | n/a | Permission-denied banner is the closest analog — see `NotificationSettings` |

Empty-state copy across the app deliberately uses the same calm, reassuring register ("Joinville está segura" / "Joinville está tranquila") — keep this tone consistent in any new empty state rather than defaulting to a generic "No data" string.

---

## Accessibility

* **Touch targets**: minimum 48px (`touch-target-min`) on every interactive element, including map markers' effective tap area, chips, and nav icons.
* **Focus states**: 2px `primary` ring on all focusable inputs and buttons, required for keyboard/switch-access users on the desktop panel.
* **Color is never the sole signal**: every severity or type indicator ships with a text label or icon alongside its color, per the Colors section above.
* **No raw coordinates**: per `app/CLAUDE.md`, never display raw lat/lng to the user — always reverse-geocode to an address or visual reference. This applies to `AlertDetailSheet`, `AlertFeedCard`, and any future export/share feature.
* **Contrast**: severity and alert-type tokens are chosen to meet WCAG AA against both `surface` (light backgrounds, using the `-container` pairs) and their own solid fills (using the `on-severity-*` / `on-alert-*` pairs) — always use the matching `on-*` token for text/icons on a colored fill, never `on-surface`.
* **One-handed operation**: primary actions live in the bottom thumb zone (see Layout & Spacing); this matters most for `AlertDetailSheet` and `NewReportModal`, used in-motion or mid-storm.

---

## Content & tone

* User-facing copy is Portuguese, per `CLAUDE.md`; code identifiers stay English.
* Tone is calm and precise, never alarmist beyond what the severity level warrants — "Crítico" copy states facts ("Via totalmente bloqueada ou risco de vida"), it does not editorialize.
* TTL and relative time are always formatted for glanceability: "Expira em 12 min", "Há 5 minutos" — never raw timestamps or durations in seconds.
* Anonymous is the default identity, not an edge case: an unnamed report reads as "Anônimo", not blank or "Unknown".
