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

Icons are custom SVG with hand-drawn aesthetic (`strokeWidth="1.8"`, rounded caps/joins) for a friendly, approachable feel. Active tab uses `primary` (black) for icon + label; inactive uses `on-surface-variant`. The Defesa Civil badge uses `severity-critical` red with white numeral, `label-caps`-scale digits, positioned top-right of the icon, minimum tap target still 48px including the badge overlap.

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
* **Skeleton loaders**: used on first load for `CameraList`, `CivilDefenseList`, `AlertFeed` — a subtle shimmer, not a spinner, since these are list-shaped waits. `MapView`'s initial load uses a centered spinner instead, since there is no list shape to skeleton.
* **Micro-feedback**: action buttons ("Confirmar", "Pista Limpa", "Reportar") disable and show an inline progress indicator while their request is in flight — never a full-screen blocking spinner for these, per Fluxo 1.1's "Carregando ação" state.

---

## Shapes

Soft but structured.

* **Standard elements** (buttons, inputs, chips): `rounded.DEFAULT` (4px, `0.25rem`).
* **Information cards** (`AlertFeedCard`, `CameraCard`, `CivilDefenseCard`): `rounded.lg` (8px).
* **Severity indicators / status chips / `RiskBadge`**: same 4px radius as buttons, for system-wide consistency.
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

**`CivilDefenseCard`**
List row, `list-row-min-height` (64px). Leading `RiskBadge`, title, timestamp, first line of body truncated (`body-sm`).

**`RiskBadge`**
Reusable badge component, three states mapped 1:1 to the severity scale (`severity-moderate` = Atenção, `severity-severe` = Alerta, `severity-critical` = Emergência). Same visual spec as the map's severity chip — this is the same token set, different label set.

**`CivilDefenseDetail`**
Full screen or expanded sheet. Title, `RiskBadge`, timestamp, issuing body ("Defesa Civil de Joinville"), full body text, geographic scope when available, instructions to the population when present. Back navigation via button or swipe.

**Nav badge**
Numeric badge on the "Defesa Civil" tab (see Bottom navigation above), shown when 1+ Alerta/Emergência-level avisos were issued in the last 24h; clears automatically once the tab is opened.

### Fluxo 4 — Alertas Recentes

**`AlertTypeLegend`**
Fixed (non-scrolling) row directly below the "Alertas Recentes" headline, three chips using `alert-crowdsource` / `alert-climatic` / `alert-civil-defense` with labels "Cidadãos" / "Climático" / "Defesa Civil". Purely informative, not interactive — stays pinned while the list below scrolls.

**`AlertTypeFilter`**
Row of three toggleable chips directly below the legend, same three colors, default all-active. Toggling removes/restores that type from `AlertFeed` instantly (`duration-fast`, list items fade rather than jump-reflow). If all three are deactivated, show inline message "Selecione ao menos um tipo de alerta." in place of the list.

**`AlertFeed`** / **`AlertFeedCard`**
Reverse-chronological list. Each card: colored left border (6px, matching its type token — same "severity bar" pattern as Alert Cards described in the base component spec), type icon, type label, location, relative timestamp ("Há 5 minutos" or absolute "14h32"), one-line truncated summary. Tap behavior branches by type:
* Crowdsource → opens `AlertDetailSheet` (reused from Fluxo 1, same "Confirmar"/"Pista Limpa" actions).
* Climático → opens an informative modal with sensor/source data and, when available, a link to the official source.
* Defesa Civil grave → navigates to `CivilDefenseDetail` (reused from Fluxo 3).

This reuse is intentional: never fork `AlertDetailSheet` or `CivilDefenseDetail` into feed-specific variants.

### Fluxo 5 — Perfil e Configurações

**`SettingsPage`**
Three grouped sections: Notificações, Exibição, Sobre o app. No login, no synced data — everything here is local-device state persisted to `localStorage` / PWA storage.

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
App version, GitHub repository link, credits, list of external data sources (Prefeitura de Joinville, CEMADEN, Defesa Civil), and a "Reportar um problema" button linking to the GitHub issue form.

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
