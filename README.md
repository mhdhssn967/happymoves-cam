# Happy Moves Cam: B2B Camera-Based Rehabilitation Module Library

A physiotherapist-facing web app. Clinicians pick **Upper Body** or **Lower Body**, open a rehabilitation
**category**, and launch an exercise **module** that runs from the webcam. Camera video is processed in the browser
(MediaPipe) and is never uploaded.

The catalog (12 categories, 88 activities) comes from `Happymoves_CamVision.md`. Two modules are implemented; every
other activity shows a "planned" placeholder until its module is built.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run typecheck
```

Camera access needs **HTTPS or `localhost`**. The app shows a clear message if it is opened any other way.

### MediaPipe model files

The WASM runtime is already bundled in `public/mediapipe/wasm`. The `.task` model files are loaded from Google's CDN
by default. For clinics with poor connectivity, or to work offline, download them into `public/models/` (details in
`public/models/README.md`). Local files are used first automatically.

## Tech stack (and why)

| Choice | Reason |
| --- | --- |
| **React 19 + TypeScript** | Component model suits reusable UI; strict types enforce the module contract. |
| **Vite** | Fast dev server, built-in code splitting, `import.meta.glob` powers module auto-registration. |
| **React Router** | Section → category → module URLs that can be bookmarked and shared. |
| **@mediapipe/tasks-vision** | Official in-browser pose and hand tracking (WASM + GPU), no backend needed. |
| **Plain CSS + design tokens** | No styling framework to learn; one `global.css` holds colours and spacing. |
| **lucide-react** | Consistent, accessible icon set. |

## Directory structure

```
public/
  mediapipe/wasm/            MediaPipe runtime (served locally, works offline)
  models/                    optional local .task model files
src/
  app/                       Core application
    App.tsx, router.tsx        router provider
    routes.tsx                 route table (rarely changes)
  core/                      Framework-free shared code
    types/                     catalog.ts, module.ts (THE module contract), session.ts
    config/                    app.ts (name, routes), icons.ts (icon-name map)
    utils/                     geometry, slug, format, accent helpers
  catalog/                   Clinical content as plain data (no logic)
    sections.ts                Upper Body / Lower Body
    upper-body/categories.ts   categories 1–7
    lower-body/categories.ts   categories 8–12
    index.ts                   lookups
  modules/                   One folder per exercise / game
    registry.ts                central registry (auto-discovers modules/*/index.ts)
    general-template/          reusable template module (mock mouse input)
    camera-tracking-demo/      MediaPipe hand + pose tracking demo
  services/                  No React in here
    camera/                    CameraService (getUserMedia), error wording
    tracking/                  MediaPipe loader, PoseTracker, HandTracker, drawing, types
  hooks/                     React glue
    useCamera, useTracker, useExerciseSession, useDocumentTitle
  components/
    ui/                        Button, Badge, NavCard, Breadcrumbs, Callout, ErrorBoundary…
    layout/                    AppLayout (header, nav, footer, skip link)
    catalog/                   CategoryCard, ModuleCard, PlannedModule, status badges
    camera/                    CameraView + permission / busy / error overlays (reusable)
    exercise/                  SessionStats, SessionControls, SessionSummary (reusable)
  pages/                     Dashboard, Section, Category, Module (shell), NotFound
  styles/global.css          design tokens + base styles
```

**Layering rule:** `core` and `services` know nothing about React or the UI. `hooks` adapt services to React.
`components` and `pages` are presentation. Each module composes these pieces and keeps its own logic inside its own
folder.

## How navigation works

```
/                                              Dashboard (two area cards + working modules)
/section/upper-body                            Category cards for that area
/section/upper-body/hand-gross-motor           Modules for that category
/section/upper-body/hand-gross-motor/hand-opening-and-closing    The module screen
```

`ModulePage` is a generic shell: it looks the module up in the registry, adds breadcrumbs, a loading state and an
error boundary (a crashing module cannot take down the app), then renders the module's lazy-loaded screen. If the
activity has no module yet, it shows a placeholder.

## The module contract

Every module default-exports a `ModuleDefinition` (see `src/core/types/module.ts`):

```ts
export default defineModule({
  id: 'shoulder-flexion',               // unique, matches the folder name
  title: 'Shoulder Flexion',
  summary: 'One or two sentences for the card.',
  categoryId: 'shoulder-mobility',      // must exist in the catalog
  activityId: 'shoulder-flexion',       // optional: replaces that catalog activity's placeholder
  status: 'beta',                       // 'template' | 'demo' | 'beta' | 'stable'
  requiresCamera: true,
  tracking: ['pose'],                   // optional
  component: lazy(() => import('./ShoulderFlexionModule')),
});
```

The registry validates this in dev mode and logs an error for duplicate ids or unknown categories or activities.

## How to add a new rehabilitation module

1. **Copy a starting point.**
   - No camera yet: copy `src/modules/general-template`.
   - Camera-driven: copy `src/modules/camera-tracking-demo`.
2. **Rename the folder** to your module id, e.g. `src/modules/shoulder-flexion`.
3. **Edit `index.ts`**: set `id`, `title`, `summary`, `categoryId`, and `activityId`. The activity id is the
   activity name in kebab-case. The "planned" placeholder page for any activity prints the exact values to use.
4. **Write the exercise.** Keep the layers apart:
   - `logic/` for pure rules (rep detection, angles, scoring), with no React or DOM.
   - `components/` for the visuals.
   - `config.ts` for thresholds and targets.
   - Reuse `useExerciseSession` (timer, reps, pause, completion) and `SessionStats` / `SessionControls` /
     `SessionSummary`. Call `session.addRep()` when your logic detects a repetition.
   - For camera input, use `useCamera` and `useTracker` and the `CameraView` overlays. Do the per-frame work in the
     `onFrame` callback of `useTracker`, not in React state.
5. **Reload.** No registry edit, no routing edit. The card, the route and the breadcrumbs appear automatically.

Modules without an `activityId` appear under "Platform modules" in their category (used for templates and demos).

## How to add a new category

1. Open `src/catalog/upper-body/categories.ts` or `src/catalog/lower-body/categories.ts`.
2. Append an object:

   ```ts
   {
     id: 'neck-mobility',                 // unique kebab-case, used in the URL
     number: 13,
     sectionId: 'upper-body',
     title: 'Neck Mobility',
     description: 'Cervical range-of-motion exercises.',
     icon: 'person',                      // a key of ICONS in src/core/config/icons.ts
     priority: 'P2',
     activities: ['Neck Flexion', 'Neck Rotation'],
     initialFocus: ['Neck Rotation'],
   }
   ```
3. Need a new icon? Import it from `lucide-react` and add one line to `ICONS` in `src/core/config/icons.ts`.
4. The category card, category page and all of its activity placeholders appear automatically.

A whole new **section** (e.g. "Core and Trunk") is one entry in `src/catalog/sections.ts`, plus a new
`<section>/categories.ts` file included in `src/catalog/index.ts`. Add its id to `SectionId` in
`src/core/types/catalog.ts`.

## Camera and MediaPipe notes

- `CameraService` wraps `getUserMedia` and classifies failures into typed errors: permission denied, no camera,
  camera busy, insecure context, unsupported browser. `errorMessages.ts` turns each into plain-language guidance
  shown in the camera overlay with a **Try again** button.
- Camera access is only requested after the user clicks **Enable camera**, never on page load.
- Trackers (`PoseTracker`, `HandTracker`) share one lazily loaded MediaPipe runtime. They try the GPU delegate and
  fall back to CPU. Model-load failures show their own error state.
- Frames expose normalised landmarks plus the video `aspect` ratio; use the helpers in `core/utils/geometry.ts`
  for angles and distances, and the index constants in `services/tracking/landmarks.ts`.
- Hand labels are corrected for the un-mirrored camera frame (MediaPipe assumes a selfie-mirrored image). The video
  and overlay are mirrored together on screen so patients see a natural mirror view.
- MediaPipe is a separate lazy chunk, loaded only when a camera module starts tracking.

## Accessibility

Skip link, semantic landmarks and headings, one tab stop per card, visible focus rings, `aria-live` status and
`role="alert"` errors, labelled meters and progress bars, keyboard-operable template game, `prefers-reduced-motion`
respected, and colour is never the only signal.

## Suggested next steps

- Implement the P0 modules (shoulder, elbow, hand gross and fine motor, hand-eye) following the priority table.
- Add patient and session persistence behind a `services/` API client; `SessionResult` is the data shape to store.
- Add unit tests for pure `logic/` files (they are framework-free by design) with Vitest.
- Calibrate per-patient range of motion before scoring.
- Consider a clinician-facing disclaimer and consent screen before camera use, per local regulations.
