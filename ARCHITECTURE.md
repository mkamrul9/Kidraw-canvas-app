# 🎨 KidDraw — Complete Technical Architecture

> A production-grade, full-stack **infinite collaborative whiteboard** application with AI superpowers. Built on a modern Next.js 16 App Router monolith with Server-Sent Events for real-time collaboration, Konva.js for GPU-accelerated canvas rendering, and Google Gemini for AI-assisted diagramming.

> **Stack:** Next.js 16 (App Router) · React-Konva · Zustand · NextAuth · Prisma + PostgreSQL · SSE · @google/genai

---

## Table of Contents

1. [Project Overview & Philosophy](#1-project-overview--philosophy)
2. [Repository Structure — Every File & Folder](#2-repository-structure--every-file--folder)
3. [Technology Stack — What, Why & How](#3-technology-stack--what-why--how)
4. [Architecture Deep Dive](#4-architecture-deep-dive)
5. [The Canvas Engine — Core Rendering Pipeline](#5-the-canvas-engine--core-rendering-pipeline)
6. [State Management — Zustand Store in Detail](#6-state-management--zustand-store-in-detail)
7. [Real-Time Collaboration — SSE Architecture](#7-real-time-collaboration--sse-architecture)
8. [All API Routes — Request → Response Flow](#8-all-api-routes--request--response-flow)
9. [Database Schema — Every Model Explained](#9-database-schema--every-model-explained)
10. [Authentication System](#10-authentication-system)
11. [AI Feature Pipelines](#11-ai-feature-pipelines)
12. [Export System — Every Format](#12-export-system--every-format)
13. [Every Widget Explained](#13-every-widget-explained)
14. [Sharing & Permissions System](#14-sharing--permissions-system)
15. [Version History & Snapshots](#15-version-history--snapshots)
16. [Problems, Challenges & How They Were Solved](#16-problems-challenges--how-they-were-solved)
17. [What Could Be Better — Honest Analysis](#17-what-could-be-better--honest-analysis)
18. [Running Locally](#18-running-locally)

---

## 1. Project Overview & Philosophy

KidDraw is an **infinite canvas whiteboard** — the kind of tool used by engineering teams, designers, and educators to think spatially. It is modeled after tools like Excalidraw, Miro, and FigJam, but it is a single developer's full-stack implementation with a distinct AI layer baked in.

### Core User Flows

```
GUEST USER
  │
  ├─ Visits /
  │    └─ Sees Landing Page (marketing, feature showcase)
  │
  └─ Opens a Board (/board/[id])
       └─ Gets viewer/editor access based on board's publicRole setting
       └─ Can draw, pan, zoom (if editor or owner)

AUTHENTICATED USER
  │
  ├─ Visits /
  │    └─ Sees their personal Dashboard (board gallery)
  │
  ├─ Creates a new Board from Dashboard
  │    └─ Board is created with their userId as authorId
  │
  ├─ Opens a Board (/board/[id])
  │    └─ Full owner permissions — all tools enabled
  │
  └─ Invites Collaborators (via ShareModal)
       └─ Collaborators receive EDITOR or VIEWER role stored in BoardCollaborator
```

### Design Principles

1. **Monolithic Architecture** — Unlike many modern apps, KidDraw is a single Next.js application. The API routes, database layer, canvas, and UI all live in one repository. This is a conscious choice for a solo/small-team project — it eliminates network boundaries between frontend and backend.

2. **Canvas-First** — The drawing canvas (`Board.tsx` + `LayerRenderer.tsx`) is the entire product. All other UI (toolbars, sidebars, modals) exists purely to configure and augment what happens on the canvas.

3. **Layers as the Atomic Unit** — Every object on the canvas — a rectangle, a pen stroke, a sticky note, an embedded iframe, a PDF — is a `Layer` object. Layers live in a flat array in Zustand. Persistence is done by serializing this array to JSON and storing it in PostgreSQL.

4. **SSE over WebSockets** — Real-time collaboration is implemented via Server-Sent Events rather than a dedicated WebSocket server. This avoids the operational complexity of a persistent socket server and works within Next.js's serverless/edge constraints.

5. **AI as a Feature, Not a Gimmick** — The three AI features (Text-to-Diagram, Sketch-to-Vector, Diagram Explanation) all produce or consume the same `Layer[]` data structure. AI outputs are just more layers — they immediately integrate into the canvas and are fully editable.

---

## 2. Repository Structure — Every File & Folder

```
kidraw/                                    ← Project root (Next.js monolith)
│
├── ARCHITECTURE.md                         ← This document
├── package.json                            ← Dependencies & scripts
├── next.config.ts                          ← Next.js config (force-dynamic, etc.)
├── tsconfig.json                           ← TypeScript strict config
├── prisma.config.ts                        ← Prisma config (adapter-pg)
├── components.json                         ← Shadcn UI config
├── postcss.config.mjs                      ← Tailwind PostCSS integration
├── eslint.config.mjs                       ← ESLint rules
├── .env                                    ← Environment variables (gitignored)
│
├── prisma/
│   └── schema.prisma                       ← Database schema (5 models)
│
└── src/
    ├── app/                                ← Next.js App Router (all pages + API)
    │   ├── layout.tsx                      ← Root layout (SessionProvider, ThemeProvider, Toaster)
    │   ├── page.tsx                        ← Smart landing/dashboard router
    │   ├── globals.css                     ← Global CSS + Tailwind tokens
    │   │
    │   ├── auth/                           ← NextAuth UI pages
    │   │   ├── signin/page.tsx             ← OAuth sign-in page
    │   │   └── signout/page.tsx            ← Sign-out confirmation
    │   │
    │   ├── board/
    │   │   └── [id]/
    │   │       └── page.tsx                ← Board canvas page (loads Board.tsx)
    │   │
    │   ├── info/                           ← Static informational pages
    │   │   ├── about/page.tsx
    │   │   ├── privacy/page.tsx
    │   │   └── terms/page.tsx
    │   │
    │   └── api/                            ← Next.js Route Handlers (backend)
    │       ├── auth/
    │       │   └── [...nextauth]/route.ts  ← NextAuth catch-all handler
    │       │
    │       ├── ai/                         ← Google Gemini AI endpoints
    │       │   ├── generate-diagram/
    │       │   │   └── route.ts            ← Text → structured Layer[] JSON
    │       │   ├── clean-sketch/
    │       │   │   └── route.ts            ← Base64 image → vector Layer[] JSON
    │       │   └── explain-diagram/
    │       │       └── route.ts            ← Base64 image → Markdown explanation
    │       │
    │       ├── board/
    │       │   └── [id]/
    │       │       ├── route.ts            ← GET/POST/DELETE board data
    │       │       ├── presence/
    │       │       │   └── route.ts        ← GET (SSE stream) / POST (broadcast)
    │       │       ├── comments/
    │       │       │   └── [id]/route.ts   ← Comment CRUD
    │       │       ├── collaborators/
    │       │       │   └── route.ts        ← Invite/remove collaborators
    │       │       ├── share/
    │       │       │   └── route.ts        ← Update isPublic / publicRole
    │       │       ├── snapshots/
    │       │       │   └── route.ts        ← Version history CRUD
    │       │       ├── thumbnail/
    │       │       │   └── route.ts        ← Save board preview thumbnail
    │       │       └── title/
    │       │           └── route.ts        ← Rename board in-place
    │       │
    │       └── boards/
    │           └── route.ts                ← GET all boards for session user
    │
    ├── features/                           ← Feature-sliced architecture
    │   ├── auth/
    │   │   ├── config.ts                   ← NextAuth configuration (providers, callbacks)
    │   │   └── types.ts                    ← Session type augmentation
    │   │
    │   ├── canvas/                         ← The entire drawing engine
    │   │   ├── types.ts                    ← Layer, Tool, ShapeType, Camera types
    │   │   ├── constants.ts                ← Magic numbers (zoom limits, sizes, colors)
    │   │   │
    │   │   ├── components/                 ← Canvas-internal components
    │   │   │   ├── Board.tsx               ← 1926-line main canvas component (Konva Stage)
    │   │   │   ├── LayerRenderer.tsx       ← Renders every Layer type in Konva
    │   │   │   ├── AiDiagramGeneratorModal.tsx   ← Text-to-Diagram UI
    │   │   │   ├── CanvasContextMenu.tsx   ← Right-click context menu
    │   │   │   ├── CanvasSearch.tsx        ← Text search across all layers
    │   │   │   ├── CodeBlockOverlay.tsx    ← Syntax-highlighted code block overlay
    │   │   │   ├── CommentOverlay.tsx      ← Inline comment threads on canvas
    │   │   │   ├── IframeEmbedOverlay.tsx  ← Live website preview inside canvas
    │   │   │   ├── ImportMermaidModal.tsx  ← Paste Mermaid → parse → Layer[]
    │   │   │   ├── LiveCursors.tsx         ← Renders remote users' cursors + names
    │   │   │   ├── MindMapOverlay.tsx      ← Auto-layout mind map builder
    │   │   │   ├── PresentationHUD.tsx     ← Presentation mode controls + hotkeys
    │   │   │   ├── RoughShape.tsx          ← Renders sketch-style shapes via rough.js
    │   │   │   ├── SummaryExplainerDrawer.tsx  ← AI-generated diagram explanation panel
    │   │   │   └── VersionHistoryModal.tsx ← Browse and restore snapshots
    │   │   │
    │   │   ├── hooks/                      ← Canvas-specific React hooks
    │   │   │   ├── useCanvasExport.ts      ← PNG/JPEG/SVG/PDF export pipeline
    │   │   │   ├── useKeyboardShortcuts.ts ← All keyboard shortcuts (Ctrl+Z, etc.)
    │   │   │   └── usePresence.ts          ← SSE connection + cursor broadcasting
    │   │   │
    │   │   ├── store/                      ← Zustand stores
    │   │   │   ├── useCanvasStore.ts       ← Main store: layers, tools, history, camera
    │   │   │   ├── useCommentStore.ts      ← Comment thread state
    │   │   │   └── usePresenceStore.ts     ← Remote users' cursor positions
    │   │   │
    │   │   ├── lib/                        ← Pure computation utilities
    │   │   │   ├── background.ts           ← CSS background style generator (solid/grid/dots)
    │   │   │   ├── exportMermaid.ts        ← Layer[] → Mermaid diagram syntax
    │   │   │   ├── exportReact.ts          ← Layer[] → JSX/Tailwind component code
    │   │   │   ├── geometry.ts             ← Hit testing, snap point detection
    │   │   │   └── pdf.ts                  ← PDF.js page render + Data URL extraction
    │   │   │
    │   │   └── utils/                      ← More computation utilities
    │   │       ├── importMermaid.ts        ← Mermaid syntax → Layer[]
    │   │       ├── routing.ts              ← Arrow connector path calculation
    │   │       └── snapping.ts             ← Smart snapping guide computation
    │   │
    │   ├── dashboard/
    │   │   ├── actions/
    │   │   │   └── board-actions.ts        ← Server Actions for board CRUD
    │   │   └── components/
    │   │       └── DashboardView.tsx       ← Board gallery grid + create button
    │   │
    │   ├── landing/
    │   │   └── components/
    │   │       └── LandingPage.tsx         ← Marketing landing page
    │   │
    │   └── user/                           ← User profile utilities
    │
    ├── providers/                          ← React context providers
    │   ├── SessionProvider.tsx             ← NextAuth SessionProvider wrapper
    │   └── ThemeProvider.tsx               ← next-themes dark/light wrapper
    │
    ├── shared/                             ← Truly shared utilities
    │   ├── components/
    │   │   ├── ui/                         ← Shadcn/Radix primitive components
    │   │   │   ├── button.tsx
    │   │   │   ├── dialog.tsx
    │   │   │   ├── dropdown-menu.tsx
    │   │   │   ├── input.tsx
    │   │   │   ├── select.tsx
    │   │   │   ├── sonner.tsx              ← Toast wrapper
    │   │   │   ├── switch.tsx
    │   │   │   ├── tabs.tsx
    │   │   │   └── tooltip.tsx
    │   │   └── ToolButton.tsx              ← Reusable toolbar button with tooltip
    │   │
    │   ├── constants/                      ← App-wide constants
    │   └── lib/
    │       ├── prisma.ts                   ← Prisma client singleton (pg pool adapter)
    │       └── utils.ts                   ← `cn()` Tailwind class merge helper
    │
    └── widgets/                            ← Floating UI panels mounted over the canvas
        ├── ActionToolbar.tsx               ← Top-right: save, export, undo, AI, align
        ├── AiToolbar.tsx                   ← AI quick-access shortcut button
        ├── CommentSidebar.tsx              ← Scrollable list of all comment threads
        ├── ExportCodeModal.tsx             ← Display generated React/Mermaid code
        ├── LibrarySidebar.tsx              ← Shape template library
        ├── NavigationHUD.tsx               ← Mini-map + viewport navigation
        ├── PropertiesPanel.tsx             ← Right panel: selected layer properties
        ├── ShareModal.tsx                  ← Sharing, collaborators, public link
        ├── TimeTravelSlider.tsx            ← Drag through local undo history
        ├── Toolbar.tsx                     ← Left sidebar: tool selection
        └── ZoomHUD.tsx                     ← Bottom: zoom %, fit view, reset
```

---

## 3. Technology Stack — What, Why & How

### Core Application

| Technology | Version | What it is | Why it was chosen | Where it's used |
|---|---|---|---|---|
| **Next.js** | 16.2.6 | React full-stack framework | App Router provides file-system routing, server components, and API Route Handlers all in one — eliminating a separate backend server | Entire application |
| **React** | 19.2.4 | UI component library | Concurrent features (`useTransition`, streaming SSR) improve perceived performance on the canvas-heavy board page | All UI components |
| **TypeScript** | ^5 | Typed JavaScript | Strict typing across `Layer`, `Tool`, and `CanvasState` prevents entire categories of bugs (e.g., passing wrong layer property names) | All source files |
| **Tailwind CSS** | ^4 | Utility-first CSS | Rapid iteration on UI without context-switching to CSS files | All components |

### Canvas Rendering

| Technology | Version | What it is | Why it was chosen |
|---|---|---|---|
| **Konva.js** | ^10.3.0 | 2D HTML5 Canvas abstraction | Hardware-accelerated canvas rendering with declarative React API. Handles hit detection, transforms, and the Transformer control points for free. Selected over SVG (too slow at scale) and raw Canvas2D (no declarative model) |
| **react-konva** | ^19.2.4 | React bindings for Konva | Lets us describe the canvas as JSX (`<Stage>`, `<Layer>`, `<Rect>`, etc.) while Konva manages the imperative render loop |
| **roughjs** | ^4.6.6 | Sketch-style shape renderer | Generates SVG/canvas paths that look hand-drawn. Used in `RoughShape.tsx` when `isSketch` mode is enabled — each shape gets a rough fill and outline |
| **use-image** | ^1.1.4 | Konva image loading hook | Manages the async lifecycle of loading `HTMLImageElement` instances into Konva image nodes. Without this, images would flicker on first render |

### State Management

| Technology | Version | Why chosen |
|---|---|---|
| **Zustand** | ^5.0.13 | Lightweight, boilerplate-free global state. The canvas store needed a flat API (`get()`, `set()`) callable outside React (from event listeners, SSE handlers) — which Zustand's `useCanvasStore.getState()` provides. Redux's provider model would have made this awkward. |

### Database & Auth

| Technology | Version | Why chosen |
|---|---|---|
| **Prisma ORM** | ^5.22.0 | Type-safe database queries. Auto-generates TypeScript types from schema, making it impossible to query a field that doesn't exist |
| **@prisma/adapter-pg** | ^5.22.0 | Uses a native `pg` connection pool instead of Prisma's default driver — essential for Vercel/Neon serverless environments with connection limits |
| **PostgreSQL** | — | Relational model is ideal: boards belong to users, comments belong to boards, collaborators link users to boards. JSON columns for `layers` give us schema flexibility within the canvas |
| **NextAuth.js** | ^4.24.14 | Battle-tested auth framework for Next.js. GitHub and Google OAuth are one-liner configurations. The `@auth/prisma-adapter` auto-manages the `User`, `Account`, and `Session` tables |

### AI

| Technology | Version | Why chosen |
|---|---|---|
| **@google/genai** | ^2.7.0 | Google's official Gemini SDK. Used directly in Route Handlers — the API key never reaches the browser. `gemini-2.5-flash` is chosen for its speed (critical for diagram generation UX) and multimodal capability (image input for Sketch-to-Vector and Explain-Diagram) |

### UI & UX

| Technology | Version | Why chosen |
|---|---|---|
| **Shadcn UI + Radix** | — | Accessible, headless components. Dialogs (`ShareModal`), `DropdownMenu` (toolbar menus), and `Select` (collaborator role picker) are all Radix primitives styled with Tailwind |
| **Sonner** | ^2.0.7 | Non-blocking toast notifications for save confirmations, export success, and errors |
| **next-themes** | ^0.4.6 | Zero-flicker dark/light mode using the `class` strategy on `<html>` |
| **Lucide React** | ^1.14.0 | Over 50 icons used across toolbars, modals, and buttons |

### Export

| Technology | Version | Why chosen |
|---|---|---|
| **jsPDF** | ^4.2.1 | PDF generation client-side from a Canvas element's data URL. No server round-trip required |
| **uuid** | ^11.0.0 | RFC-compliant UUID v4 generation for every new Layer created on the canvas |

---

## 4. Architecture Deep Dive

### The Monolith Advantage

KidDraw is architected as a **monolith** — one Next.js repository handles both the React frontend and the Node.js backend (via API Route Handlers). There is no separate REST server, no microservice boundary, and no Axios setup. Fetches to `/api/board/[id]` are same-origin.

```
┌────────────────────────────────────────────────────────────────────────┐
│                         BROWSER (Vercel Edge)                           │
│                                                                        │
│   Next.js App Router                                                   │
│   ├── Server Components (page.tsx, layout.tsx)                         │
│   │    └─ Runs on server — fetches DB data directly via Prisma         │
│   │                                                                    │
│   ├── Client Components (Board.tsx, widgets/*.tsx)                     │
│   │    └─ Runs in browser — Konva canvas, Zustand stores              │
│   │                                                                    │
│   ├── /api/* Route Handlers                                            │
│   │    ├── /api/auth/[...nextauth]  ← NextAuth OAuth flows            │
│   │    ├── /api/board/[id]          ← Board CRUD + permissions        │
│   │    ├── /api/board/[id]/presence ← SSE real-time collaboration     │
│   │    └── /api/ai/*               ← Google Gemini proxy routes       │
│   │                                                                    │
│   └── Zustand Stores (in-memory, browser-side)                        │
│        ├── useCanvasStore     ← layers, tools, camera, history        │
│        ├── usePresenceStore   ← remote cursors map                    │
│        └── useCommentStore    ← comment threads                       │
│                                                                        │
│   SSE Connection ← GET /api/board/[id]/presence                       │
│   Cursor POSTs  → POST /api/board/[id]/presence                       │
└────────────────────────────────────────────────────────────────────────┘
                              │
                              │ (Prisma → @prisma/adapter-pg → pg Pool)
                              ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         PostgreSQL (Neon/Supabase)                      │
│   Tables: User, Account, Session, Board, Comment,                      │
│           BoardSnapshot, BoardCollaborator                             │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Flow: Drawing a Shape

```
User mousedown on canvas
        │
        ▼
Board.tsx handleMouseDown()
        │  (detects tool, calculates canvas coordinates from screen coords + camera + zoom)
        ▼
useCanvasStore.addLayer({ id: uuidv4(), type: 'rectangle', x, y, ... })
        │
        ├─→ Set state: layers array grows by 1 (React re-render)
        │
        └─→ broadcastUpdate(boardId, { type: 'draw-add', layer })
                │ (fire-and-forget fetch POST)
                ▼
            /api/board/[id]/presence (POST)
                │
                └─→ Iterate clientsMap.get(boardId)
                        └─→ SSE stream: data: {"type":"draw-add","layer":{...}}\n\n
                                │
                                ▼
                        Remote user's usePresence SSE handler
                                │
                                └─→ useCanvasStore.getState().addLayer(layer, isRemote=true)
                                        └─→ Layer appears on remote canvas instantly
```

### Request Lifecycle (Any API Route)

```
Browser fetch('/api/board/:id')
        │
        ▼
Next.js Edge Runtime / Node.js Runtime
        │
        ▼
Route Handler (GET route.ts)
        │
        ▼
getServerSession(authOptions)          ← NextAuth reads session cookie
        │
        ├─ No session? → Check board.isPublic → 403 if private
        └─ Session? → Check board.authorId === userId
                         OR BoardCollaborator exists for user's email
        │
        ▼
Prisma query (via pg connection pool → PostgreSQL)
        │
        ▼
JSON Response with { ...board, isReadOnly: boolean }
```

---

## 5. The Canvas Engine — Core Rendering Pipeline

### The `Board.tsx` Component (1,926 lines)

This is the most complex file in the project. It is a `"use client"` component that renders a Konva `<Stage>` occupying 100% of the viewport and handles every mouse, touch, keyboard, and drag event.

**Internal state (React `useState`):**
- `editingText` — when the user double-clicks a text layer, the Konva text node becomes invisible and a floating `<textarea>` appears on top. On blur, the textarea value is written back to the layer.
- `selectionBox` — the marquee (rubber band) rectangle drawn when the user drags on empty canvas with the select tool.
- `lassoPoints` — the free-form lasso selection polygon.
- `laserPoints` — the ephemeral laser pointer trail (fades via `LASER_FADE_INTERVAL_MS = 30ms` interval).
- `activeSnapPoint` — which snap point is highlighted when drawing an arrow connector.
- `contextMenuPos` — screen coordinates of the right-click context menu.
- `uploadProgress` — for PDF file drop rendering.

**The coordinate system:**
Every user-visible coordinate is in **canvas space**, not screen space. The `camera` (`{x, y}`) and `zoom` values in Zustand define the viewport transformation. Converting screen → canvas:
```
canvasX = (screenX - camera.x) / zoom
canvasY = (screenY - camera.y) / zoom
```
The Konva `<Stage>` applies this via `scale={{ x: zoom, y: zoom }}` and `x={camera.x}`, `y={camera.y}`.

**The tool dispatch pattern:**
`handleMouseDown` is a 400+ line switch-case on `activeTool`. Each case creates the starting state for that tool's draw interaction. `handleMouseMove` updates the in-progress shape. `handleMouseUp` finalizes it, calls `addLayer`, and triggers `saveHistory()` which auto-saves after 3 seconds.

### `LayerRenderer.tsx` (27,297 bytes)

Receives all `layers` from the store and renders each one as a Konva shape. The rendering logic for each layer type:

| Layer Type | Rendered as | Notes |
|---|---|---|
| `rectangle` | `<Rect>` | With optional `cornerRadius` and shadow |
| `ellipse` | `<Ellipse>` | cx/cy computed from x,y,width,height |
| `triangle` | `<RegularPolygon sides=3>` | Rotated to correct orientation |
| `diamond` | `<RegularPolygon sides=4>` | Rotated 45° |
| `star` | `<Star>` | Five-pointed |
| `hexagon` | `<RegularPolygon sides=6>` | |
| `arrow` | `<Arrow>` or `<Line>` | If bound to shapes, path computed by `routing.ts` |
| `straight-line` | `<Line>` | Two-point segment |
| `pen` / `pencil` | `<Line points={...}>` | Bézier smoothed freehand stroke |
| `text` | `<Text>` | With font, size, weight, style, decoration |
| `sticky` | `<Rect>` + `<Text>` | Yellow sticky note shape |
| `image` | `<Image>` | `use-image` hook for async load |
| `embed` | DOM `<iframe>` overlay | Positioned absolute over canvas, not in Konva |
| `frame` | `<Rect>` with clip | Acts as a container for other layers |
| `pdf` | `<Image>` | Each page rendered via `pdf.ts` to a Data URL |
| `code` | DOM `<pre>` overlay | Syntax highlighted via CSS |
| `group` | `<Rect>` (selection box) | Children positioned relative to group bounds |

**Rough (sketch) mode rendering:** When `layer.isSketch === true`, `LayerRenderer` instead renders `<RoughShape />` which uses the `roughjs` library to generate imperfect, hand-drawn-looking paths. The roughness and bowing parameters are configurable per-layer.

### Arrow Connector Routing (`utils/routing.ts`)

When an arrow has `startBinding` and `endBinding` (it's connected to shapes), the path must route around obstacles. Three modes:

```
ORTHOGONAL — Right-angle bends
  ┌─────┐       ┌─────┐
  │  A  ├───────┤  B  │
  └─────┘       └─────┘

CURVED — Smooth cubic Bézier
  ┌─────┐               ┌─────┐
  │  A  ├──╮    ╭───────┤  B  │
  └─────┘  ╰────╯       └─────┘

STRAIGHT — Direct line
  ┌─────┐              ┌─────┐
  │  A  ├──────────────┤  B  │
  └─────┘              └─────┘
```

`getOrthogonalPath`, `getCurvedPath`, and `getStraightPath` each accept the source and target bounding boxes and the snap points (top/right/bottom/left) and return a `number[]` array compatible with Konva's `<Line>` `points` prop.

### Snapping System (`utils/snapping.ts`)

When dragging a layer, `getSnappingGuides` computes whether the dragged shape is aligned with any other shape. It checks **9 axes** (left, center, right, top, middle, bottom of each shape) against the same axes of the dragged shape. Within a `SNAP_TOLERANCE = 5px` range, it snaps the position and returns a `GuideLine[]` for rendering the blue alignment indicators on screen.

---

## 6. State Management — Zustand Store in Detail

### `useCanvasStore.ts` — The Central Nervous System

The canvas store is the most important file in the application. It holds **all mutable canvas state** and provides every action. It is created with Zustand's `create<CanvasState>()`.

```
CanvasState
├── TOOL STATE
│   ├── activeTool: Tool                   'pen' | 'select' | 'shape' | 'text' | ...
│   ├── activeColor: Color                 Hex string, applied to new layers
│   ├── activeShape: ShapeType             Rectangle/ellipse/etc. when tool=shape
│   ├── penSize: number                    Stroke width for pen/pencil
│   ├── eraserSize: number
│   ├── activeEraserType: 'eraser'|'object-eraser'
│   ├── activeOpacity: number              0-1 for new layers
│   ├── activeDashPattern: number[]        [] = solid, [8,8] = dashed
│   ├── activeFontFamily: string
│   ├── activeRoughness: number            Rough.js roughness setting
│   └── activeBowing: number               Rough.js bowing setting
│
├── CANVAS STATE
│   ├── layers: Layer[]                    The entire drawing as flat array
│   ├── backgroundColor: string
│   ├── bgPattern: 'solid'|'dotted'|'grid'
│   ├── camera: { x: number, y: number }  Viewport offset
│   ├── zoom: number                       Scale factor (0.1–5)
│   ├── isLocked: boolean                  Locks all layers against editing
│   ├── isSketchMode: boolean              Global sketch mode toggle
│   ├── isPresenting: boolean              Presentation mode (hides toolbars)
│   ├── isReadOnly: boolean                Viewer-only mode
│   └── isSearchOpen: boolean
│
├── SELECTION STATE
│   ├── selectedLayerId: string | null     Primary selection
│   └── selectedLayerIds: string[]         Multi-selection
│
├── BOARD METADATA
│   ├── boardId: string | null
│   ├── boardTitle: string
│   ├── authorId: string | null
│   ├── isPublic: boolean
│   └── publicRole: string
│
├── HISTORY STATE
│   ├── history: Layer[][]                 Stack of layer snapshots
│   └── historyStep: number                Current position in stack
│
├── COLLABORATION STATE
│   └── followedUserId: string | null      Follow mode: mirror another user's view
│
└── PERMISSION STATE
    └── permissionRole: 'owner'|'editor'|'viewer'
```

### History System (Undo/Redo)

```
INITIAL STATE:  history = [[]]    historyStep = 0

User draws rect:  saveHistory() called
                  history = [[], [rect1]]    historyStep = 1

User draws circle: saveHistory()
                  history = [[], [rect1], [rect1, circle1]]    historyStep = 2

User presses Ctrl+Z: undo()
                  historyStep = 1
                  layers = history[1] = [rect1]     (circle gone)

User draws triangle: saveHistory()
                  history = [[], [rect1], [rect1, triangle1]]  (future erased!)
                  historyStep = 2
```

**Auto-save debounce:** Every `saveHistory()` call starts a 3-second debounce timer. When the timer fires, `saveToCloud(boardId)` is called — a `POST /api/board/[id]` with the current `layers` JSON and `backgroundColor`. The thumbnail generation function (registered by `Board.tsx` via `setGetThumbnailFn`) runs Konva's `stage.toDataURL()` to capture a preview image.

### Broadcast Architecture — Drawing Sync

`addLayer`, `updateLayer`, and `removeLayer` each accept an `isRemote: boolean` parameter:
- **`isRemote = false`** (default, local user actions) → also calls `broadcastUpdate` to notify other clients
- **`isRemote = true`** (incoming SSE events) → skips the broadcast to prevent infinite loops

`updateLayer` uses `throttledBroadcastUpdate` which batches all updates within an 85ms window into a single `draw-update-batch` payload. This prevents flooding the server with hundreds of messages during a drag operation.

### `usePresenceStore.ts`

A simple Zustand store mapping `userId → PresenceData`:
```typescript
{
    cursors: Record<string, { x, y, name, image, text }>,
    updatePresence: (userId, data) => void,
    removePresence: (userId) => void,
    clearPresence: () => void,
}
```
`LiveCursors.tsx` subscribes to this store and renders each cursor as an SVG arrow with the user's name and avatar.

### `useCommentStore.ts`

Manages comment threads:
```typescript
{
    comments: Comment[],
    fetchComments: (boardId) => Promise<void>,  // GET /api/board/[id]/comments/[id]
    addComment: (comment) => void,
    updateComment: (id, updates) => void,
    deleteComment: (id) => void,
}
```

---

## 7. Real-Time Collaboration — SSE Architecture

### Why SSE Instead of WebSockets

KidDraw uses **Server-Sent Events (SSE)** for real-time collaboration instead of WebSockets. This decision was driven by:

1. **Next.js compatibility** — WebSocket servers require persistent connections that don't fit Next.js's serverless/edge deployment model. SSE is a standard HTTP streaming response.
2. **Simplicity** — SSE is unidirectional (server → client). Client→server communication uses regular POST requests. This asymmetry maps perfectly to the use case: the server fans out canvas updates to all viewers.
3. **No infrastructure** — SSE needs no separate server (like a Socket.IO server). The `presenceClientsMap` lives in the Route Handler's module scope.

### SSE Flow Diagram

```
                        ┌───────────────────────────────┐
                        │   Next.js Server Process       │
                        │                                │
                        │  presenceClientsMap            │
                        │  Map<boardId, Set<SSEClient>>  │
                        └───────────────────────────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
         User A                  User B                  User C
              │                      │                      │
         GET /presence          GET /presence          GET /presence
         (EventSource)          (EventSource)          (EventSource)
              │                      │                      │
         [A added to Set]       [B added to Set]       [C added to Set]
              │
         User A moves cursor
              │
         POST /presence { x:100, y:200, name:"Alice" }
              │
         Server iterates clientsMap.get(boardId)
              ├───→ B's SSEClient.controller.enqueue("data: {...}\n\n")
              └───→ C's SSEClient.controller.enqueue("data: {...}\n\n")
                        │                      │
                   B's EventSource         C's EventSource
                   fires 'onmessage'       fires 'onmessage'
                        │                      │
              updatePresence(A, data)  updatePresence(A, data)
                        │                      │
              LiveCursors re-renders   LiveCursors re-renders
              cursor at (100, 200)     cursor at (100, 200)
```

### The `usePresence` Hook (`hooks/usePresence.ts`)

This hook is invoked inside `Board.tsx` with the current `boardId`. It:

1. **Establishes an SSE connection** via `new EventSource('/api/board/[id]/presence?guestId=...')`. The `guestId` is a session-scoped random ID stored in `sessionStorage` — this allows unauthenticated users to have a stable identity for the duration of their browser tab.

2. **Handles 5 incoming event types:**
   - `draw-add` → calls `useCanvasStore.getState().addLayer(data.layer, true)` directly (bypassing React's component tree)
   - `draw-update` → calls `updateLayer(id, attrs, true)`
   - `draw-update-batch` → batch applies multiple updates
   - `draw-remove` → calls `removeLayer(id, true)`
   - `comment-update` → triggers `useCommentStore.getState().fetchComments(boardId)`
   - Everything else → cursor presence data, passed to `updatePresence(userId, data)`

3. **Implements Follow Mode:** If `followedUserId` is set in the canvas store (user clicked "Follow" on another user's cursor), incoming presence data from that specific user also updates `camera` to keep their position centered in the viewport.

4. **Throttles outgoing cursor updates** to 4 per second (250ms minimum interval) to avoid overwhelming the server. Uses a pending-update + timeout pattern to ensure the final position is always sent even if it was throttled.

### The Presence Route Handler (`/api/board/[id]/presence/route.ts`)

**GET handler (SSE stream establishment):**
```
1. Parse guestId from query params
2. Create a ReadableStream with a controller
3. Register this client in clientsMap.get(boardId)
4. Set up a 15-second ping interval to keep the connection alive
5. Register an 'abort' listener on request.signal:
   - When the client disconnects (tab close, navigation):
     - Remove from clientsMap
     - Broadcast { userId, disconnected: true } to remaining clients
     - Clean up if no clients remain
6. Return Response(stream, { Content-Type: 'text/event-stream' })
```

**POST handler (broadcast):**
```
1. Parse guestId, get boardId from params, parse body
2. Look up clientsMap.get(boardId)
3. For each client in the set WHERE userId !== guestId:
   - Enqueue the payload as "data: {json}\n\n"
   - If enqueueing fails (broken pipe), remove that client
4. Return { success: true }
```

**Critical limitation:** `presenceClientsMap` is stored in `globalThis`. In development this survives Next.js hot reloads (guarded by `process.env.NODE_ENV !== 'production'` check). In **production on serverless platforms** (Vercel), each request may land on a different function instance, meaning the map is not shared across instances. This is a known architectural limitation — see [Section 17](#17-what-could-be-better--honest-analysis).

---

## 8. All API Routes — Request → Response Flow

### Auth

| Method | Path | Handler | Purpose |
|---|---|---|---|
| `GET/POST` | `/api/auth/[...nextauth]` | NextAuth | OAuth flows (GitHub, Google), session management |

### Board CRUD

#### `GET /api/board/[id]`
```
1. getServerSession() → check if authenticated
2. prisma.board.findUnique({ where: { id } })
3. If not found → prisma.board.create({ id, layers: [], ... })
   (Boards are created on-demand when first visited — no separate "create" step!)
4. Permission check:
   ├─ authorId === userId → owner (read-write)
   ├─ BoardCollaborator exists for email → check role → editor or viewer
   ├─ board.isPublic → check publicRole → editor or viewer
   └─ Otherwise → 403 Forbidden
5. Return { ...board, isReadOnly: boolean }
```

#### `POST /api/board/[id]` (Save Board)
```
1. Session required → 401 if missing
2. Find board, check write permission (same as GET but only allows editors/owners)
3. prisma.board.upsert({ where: { id }, update: { layers, backgroundColor, thumbnail } })
4. Return updated board
```

#### `DELETE /api/board/[id]`
```
1. Session required → 401
2. Find board → 404 if missing
3. board.authorId !== userId → 403
4. prisma.board.delete({ where: { id } })
5. Return { success: true }
```

### Presence / Real-Time

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/board/[id]/presence` | Establish SSE stream, register client in memory |
| `POST` | `/api/board/[id]/presence` | Broadcast cursor/drawing event to all other clients |

### Board Metadata

| Method | Path | Purpose |
|---|---|---|
| `PATCH` | `/api/board/[id]/title` | Rename board (inline edit in dashboard) |
| `PATCH` | `/api/board/[id]/share` | Toggle `isPublic`, set `publicRole` |
| `POST` | `/api/board/[id]/thumbnail` | Save base64 preview image |

### Collaborators

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/board/[id]/collaborators` | List all collaborators with email + role |
| `POST` | `/api/board/[id]/collaborators` | Add a collaborator by email |
| `DELETE` | `/api/board/[id]/collaborators` | Remove a collaborator |

### Snapshots (Version History)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/board/[id]/snapshots` | List all snapshots for a board |
| `POST` | `/api/board/[id]/snapshots` | Create a named snapshot of current `layers` |
| `DELETE` | `/api/board/[id]/snapshots` | Delete a snapshot |

### Comments

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/board/[id]/comments/[id]` | Fetch all comments for a board |
| `POST` | `/api/board/[id]/comments/[id]` | Create a comment (with x, y, elementId, parentId) |
| `PATCH` | `/api/board/[id]/comments/[id]` | Update content or mark resolved |
| `DELETE` | `/api/board/[id]/comments/[id]` | Delete a comment |

### AI Routes

#### `POST /api/ai/generate-diagram`
```
Body: { prompt: string }
↓
GoogleGenAI.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
        systemInstruction: "You are a technical architecture assistant...",
        temperature: 0.3
    }
})
↓
Parse text response → strip ```json fences → JSON.parse()
↓
Return { layers: Layer[] }
```

#### `POST /api/ai/clean-sketch`
```
Body: { imageBase64: string }  (base64 data URL from Konva stage.toDataURL())
↓
GoogleGenAI.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ role: 'user', parts: [{ inlineData: { data, mimeType: 'image/png' } }, { text: "..." }] }],
    config: { temperature: 0.1 }  // Low temp for structured JSON output
})
↓
Parse → Return { layers: Layer[] }
```

#### `POST /api/ai/explain-diagram`
```
Body: { imageBase64: string }
↓
GoogleGenAI multimodal request with the screenshot
↓
Return { markdown: string }
```

---

## 9. Database Schema — Every Model Explained

```
┌─────────────────────────────────────────────────────────────────────┐
│  User                            (Managed by NextAuth + PrismaAdapter)│
├─────────────────────────────────────────────────────────────────────┤
│  id            String   @id  CUID                                    │
│  name          String?                                               │
│  email         String?  @unique                                      │
│  emailVerified DateTime?                                             │
│  image         String?  (OAuth avatar URL)                           │
│  receiveEmails Boolean  @default(true)  (for future email features) │
│                                                                      │
│  accounts      Account[]  (OAuth tokens per provider)               │
│  sessions      Session[]  (active browser sessions)                 │
│  boards        Board[]    (boards this user owns)                   │
│  comments      Comment[]  (comments this user posted)               │
│  snapshots     BoardSnapshot[]  (snapshots this user created)       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  Account                         (NextAuth OAuth token storage)      │
├─────────────────────────────────────────────────────────────────────┤
│  id                 String  @id                                      │
│  userId             String  → User.id                                │
│  type               String  (e.g., 'oauth')                          │
│  provider           String  (e.g., 'github', 'google')              │
│  providerAccountId  String                                           │
│  refresh_token      String? @db.Text  (long tokens stored as Text)  │
│  access_token       String? @db.Text                                 │
│  expires_at         Int?    (Unix timestamp)                         │
│  id_token           String? @db.Text                                 │
│  @@unique([provider, providerAccountId])                            │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  Session                         (Active browser sessions)           │
├─────────────────────────────────────────────────────────────────────┤
│  id           String   @id                                           │
│  sessionToken String   @unique  (stored as HttpOnly cookie)         │
│  userId       String   → User.id                                     │
│  expires      DateTime                                               │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  Board                           (The core entity)                   │
├─────────────────────────────────────────────────────────────────────┤
│  id              String   @id  CUID                                  │
│  title           String   @default("Untitled Whiteboard")           │
│  description     String?                                             │
│  backgroundColor String   @default("#ffffff")                        │
│  layers          Json     @default("[]")                             │
│  │                                                                   │
│  │  NOTE: The entire canvas is stored as a JSON array here.          │
│  │  Each element is a serialized Layer object. On load, this         │
│  │  JSON is parsed and hydrated into Zustand's layers[] array.       │
│  │                                                                   │
│  thumbnail       String?  @db.Text  (Base64 PNG for gallery preview)│
│  isPublic        Boolean  @default(false)                            │
│  publicRole      String   @default("viewer")  ("viewer" or "editor")│
│                                                                      │
│  authorId        String?  → User.id  (null for anonymous boards)    │
│  collaborators   BoardCollaborator[]                                 │
│  comments        Comment[]                                           │
│  snapshots       BoardSnapshot[]                                     │
│                                                                      │
│  createdAt       DateTime @default(now())                            │
│  updatedAt       DateTime @updatedAt                                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  Comment                         (Canvas comment threads)            │
├─────────────────────────────────────────────────────────────────────┤
│  id        String   @id  CUID                                        │
│  content   String                                                    │
│  x         Float    (canvas-space X coordinate)                      │
│  y         Float    (canvas-space Y coordinate)                      │
│  resolved  Boolean  @default(false)                                  │
│  elementId String?  (Layer.id this comment is pinned to, if any)    │
│                                                                      │
│  boardId   String   → Board.id  (cascade delete)                    │
│  authorId  String   → User.id   (cascade delete)                    │
│                                                                      │
│  parentId  String?  → Comment.id  (null = root, non-null = reply)  │
│  replies   Comment[] @relation("CommentThread")                     │
│                                                                      │
│  createdAt DateTime @default(now())                                  │
│  updatedAt DateTime @updatedAt                                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  BoardSnapshot                   (Version history checkpoints)       │
├─────────────────────────────────────────────────────────────────────┤
│  id        String   @id  CUID                                        │
│  name      String   @default("Manual Snapshot")                     │
│  layers    Json     (full copy of Layer[] at snapshot time)         │
│                                                                      │
│  boardId   String   → Board.id  (cascade delete)                    │
│  authorId  String?  → User.id   (SetNull on delete)                 │
│                                                                      │
│  createdAt DateTime @default(now())                                  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  BoardCollaborator               (Invite-based access control)       │
├─────────────────────────────────────────────────────────────────────┤
│  id      String   @id  CUID                                          │
│  email   String   (invited by email — person may not be registered) │
│  role    String   ("VIEWER" or "EDITOR")                            │
│                                                                      │
│  boardId String   → Board.id  (cascade delete)                      │
│                                                                      │
│  @@unique([boardId, email])  (no duplicate invites per board)       │
│                                                                      │
│  createdAt DateTime @default(now())                                  │
│  updatedAt DateTime @updatedAt                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Entity Relationship Diagram

```
User ──────────────────────────────────────────┐
  │                                             │
  │ 1:N            1:N                          │
  │                │                            │
Account[]       Session[]   Board[] ────────────┘
                              │ (authorId)
                              │
              ┌───────────────┼────────────────┐
              │               │                │
              │ 1:N           │ 1:N            │ 1:N
              │               │                │
         Comment[]    BoardSnapshot[]   BoardCollaborator[]
              │
              │ self-referential
              │ (parentId for reply threads)
```
---

## 10. Authentication System

### NextAuth Configuration (`features/auth/config.ts`)

KidDraw uses **NextAuth v4** with OAuth-only sign-in (no passwords). Only GitHub and Google providers are configured.

```typescript
authOptions = {
    adapter: PrismaAdapter(prisma),   // Writes users/sessions to PostgreSQL
    providers: [GithubProvider, GoogleProvider],
    pages: {
        signIn: '/auth/signin',        // Custom sign-in page
        signOut: '/auth/signout',
    },
    callbacks: {
        session: async ({ session, user }) => {
            session.user.id = user.id; // Injects user.id into the session object
            return session;
        }
    }
}
```

The **`session` callback** is critical. NextAuth's default session object only contains `name`, `email`, and `image`. By injecting `user.id`, all Route Handlers and Server Components can call `getServerSession(authOptions)` and immediately read `session.user.id` without an extra DB query.

### Auth Flow

```
User clicks "Sign in with GitHub"
        │
        ▼
GET /api/auth/signin (NextAuth) → Redirect to GitHub OAuth
        │
        ▼
GitHub redirects back → GET /api/auth/callback/github
        │
        ▼
NextAuth PrismaAdapter:
    ├─ user.findFirst({ where: { email } })
    ├─ If exists → create new Account record (link provider)
    └─ If not → create User + Account
        │
        ▼
Set HttpOnly session cookie (sessionToken)
        │
        ▼
Redirect to / (dashboard or landing page)
        │
        ▼
page.tsx: getServerSession(authOptions) → session available
└─→ boards = prisma.board.findMany({ where: { authorId: session.user.id } })
└─→ Render DashboardView with boards
```

### Permission Matrix

| Action | Guest (no auth) | Viewer | Editor | Owner |
|---|---|---|---|---|
| View public board | ✅ | ✅ | ✅ | ✅ |
| View private board | ❌ | ✅ | ✅ | ✅ |
| Draw on public (editor) board | ✅ | ❌ | ✅ | ✅ |
| Draw on public (viewer) board | ❌ | ❌ | ❌ | ✅ |
| Save board to cloud | ❌ | ❌ | ✅ | ✅ |
| Delete board | ❌ | ❌ | ❌ | ✅ |
| Invite collaborators | ❌ | ❌ | ❌ | ✅ |
| Change share settings | ❌ | ❌ | ❌ | ✅ |
| Create snapshots | ❌ | ❌ | ✅ | ✅ |
| Post comments | ❌ | ✅ | ✅ | ✅ |

---

## 11. AI Feature Pipelines

### Feature 1: Text-to-Diagram (Generate Diagram)

**User journey:** User opens `AiDiagramGeneratorModal`, types "Show a microservices architecture with API Gateway, Auth Service, and Database" and clicks Generate.

```
AiDiagramGeneratorModal.tsx
        │
        ▼
POST /api/ai/generate-diagram
  body: { prompt: "Show a microservices architecture..." }
        │
        ▼
GoogleGenAI (gemini-2.5-flash)
  systemInstruction: "You are a technical architecture assistant..."
  temperature: 0.3 (lower = more structured, deterministic output)
        │
        ▼
Gemini Response (raw text):
  [
    { "type": "rectangle", "id": "n1", "x": 0, "y": 0, "width": 150, "height": 60, "fill": "#f8fafc", "text": "API Gateway" },
    { "type": "rectangle", "id": "n2", "x": 250, "y": 0, "width": 150, "height": 60, "fill": "#e0f2fe", "text": "Auth Service" },
    { "type": "arrow", "x": 150, "y": 30, "width": 100, "height": 0, "fill": "#94a3b8" },
    ...
  ]
        │
        ▼
Strip markdown fences → JSON.parse() → return { layers }
        │
        ▼
AiDiagramGeneratorModal:
  useCanvasStore.getState().addLayers(layers)
  useCanvasStore.getState().saveHistory()
```

**AI challenge:** Gemini sometimes wraps JSON in ````json` markdown fences despite being told not to. The route handler strips them with:
```typescript
const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
```

**Fallback:** If `GEMINI_API_KEY` is not set in the environment, the API returns a hardcoded 3-node mock diagram. This allows local development without an API key.

### Feature 2: Sketch-to-Vector (Clean Sketch)

**User journey:** User draws rough boxes and arrows, then clicks "Clean Sketch with AI".

```
ActionToolbar.tsx (or SummaryExplainerDrawer)
  │
  ▼
stage.toDataURL() → base64 PNG of current viewport
  │
  ▼
POST /api/ai/clean-sketch
  body: { imageBase64: "data:image/png;base64,..." }
  │
  ▼
GoogleGenAI (gemini-2.5-flash) — multimodal
  Sends: base64 image as inlineData + "Analyze this sketch..."
  systemInstruction: Shape recognition → JSON output
  temperature: 0.1 (very low — needs precise structured output)
  │
  ▼
Response: JSON array of perfect vector shapes
  │
  ▼
Board replaces (or overlays) existing layers with the clean vector shapes
```

**Challenge:** Gemini may misidentify relative coordinates. The AI generates positions relative to the image it sees (which is the Konva stage's output at a specific camera/zoom), not the canvas coordinate space. The current implementation places shapes using the raw AI-returned coordinates — a future improvement would be to apply a coordinate transform.

### Feature 3: Diagram Explanation (Explain Diagram)

**User journey:** User selects layers, then clicks "Explain" in the right-click context menu or `SummaryExplainerDrawer`.

```
SummaryExplainerDrawer.tsx
  │
  ▼
stage.toDataURL() → base64 PNG snapshot of the board
  │
  ▼
POST /api/ai/explain-diagram
  body: { imageBase64: "..." }
  │
  ▼
GoogleGenAI (gemini-2.5-flash) — vision model
  systemInstruction: "You are a technical architect... write Markdown"
  │
  ▼
Response: { markdown: "# System Architecture\n## Components\n..." }
  │
  ▼
SummaryExplainerDrawer renders with react-markdown + remark-gfm
```

### AI Temperature Strategy

| Feature | Temperature | Rationale |
|---|---|---|
| Text-to-Diagram | 0.3 | Needs creative spatial layout but deterministic JSON structure |
| Sketch-to-Vector | 0.1 | Highest precision needed — misidentified shapes break the canvas |
| Explain-Diagram | 0.3 | Some creative latitude for explanation quality |

---

## 12. Export System — Every Format

The export system is coordinated through a **Custom Event bus** — the `ActionToolbar` dispatches a `CustomEvent('export-canvas', { detail: format })` which `useCanvasExport` hook listens for. This decouples the export trigger from the implementation.

### Export Pipeline

```
User clicks "Export as PNG"
        │
        ▼
ActionToolbar.handleExport('png')
        │
window.dispatchEvent(new CustomEvent('export-canvas', { detail: 'png' }))
        │
        ▼
useCanvasExport hook (event listener in Board.tsx)
        │
        ▼
Compute bounding box of ALL layers (not just the viewport):
  ├─ For pen layers: iterate all points[]
  └─ For shape layers: use x, y, width, height
  → Add 40px padding
        │
        ▼
stage.scale({ x: 1, y: 1 }); stage.position({ x: 0, y: 0 });
        │  (Reset Konva stage to 1:1 coordinates for accurate capture)
        ▼
konvaDataURL = stage.toDataURL({
    x: minX, y: minY,
    width: exportWidth, height: exportHeight,
    pixelRatio: 2  (2x resolution for Retina displays)
})
        │
stage.scale(oldScale); stage.position(oldPos);  (Restore viewport)
        │
        ▼
Create off-screen <canvas> at exportWidth*2 × exportHeight*2
        │
        ▼
1. Draw solid background color
2. Draw grid or dot pattern natively (Konva doesn't render CSS backgrounds)
3. Draw the Konva data URL overlay
        │
        ▼
For PNG/JPEG: canvas.toBlob() → Blob → File System Access API or <a download>
For PDF: jsPDF.addImage() → pdf.save()
For SVG: generateSVG(layers, ...) → Blob → download
```

### Why the Two-Step Canvas Process?

Konva renders shapes on an HTML5 Canvas. The background pattern (dots, grid) is a CSS `background-image` on the container `<div>`, not painted on the Konva canvas. A direct `stage.toDataURL()` would produce an image with a transparent background — the dots/grid would be missing.

The solution: create a **compiler canvas** that first paints the background pattern natively, then composites the Konva drawing on top.

### SVG Export

The `generateSVG` function inside `useCanvasExport.ts` walks the layers array and produces SVG markup string. This is a custom serializer — it does not use Konva's built-in SVG export (which doesn't exist). It handles: rectangles, ellipses, pen paths, text, images, and sticky notes.

### Code Export (React / Mermaid)

Two special exports that produce **source code**, not images:

**React Export (`exportReact.ts`):**
- Groups layers by spatial proximity into flex containers
- Uses a tree layout algorithm to detect horizontal vs. vertical groupings
- Produces JSX with Tailwind classes — a component that approximates the diagram visually

**Mermaid Export (`exportMermaid.ts`):**
- Scans for `rectangle`, `ellipse`, `diamond`, `hexagon`, `sticky` layers WITH text
- Scans for `arrow` layers with `startBinding` + `endBinding`
- Maps layer IDs to simple `N1`, `N2` node IDs
- Produces `graph TD` Mermaid syntax

---

## 13. Every Widget Explained

Widgets are the floating UI panels mounted over the Konva canvas. They are positioned with `absolute` CSS and have `z-index` values to stack correctly.

### `Toolbar.tsx` (Left sidebar, tool selection)

Renders the primary tool palette: select, hand, shapes, pen, pencil, text, eraser, sticky, frame, image, embed, PDF, code, comment, lasso, laser. Each button calls `setActiveTool()`. The shapes button expands into a sub-palette of shape types (`rectangle`, `ellipse`, `diamond`, etc.).

### `ActionToolbar.tsx` (Top-right, actions)

The most feature-dense widget (459 lines). Contains:
- **Contextual controls** — Font family picker (when text/sticky is active), stroke style, layer ordering (Bring Forward, Send to Back), group/ungroup
- **Text formatting** — Bold, italic, underline, strikethrough, align left/center/right (conditional on selected layer type)
- **Canvas operations** — Lock, Sketch Mode toggle, Presentation Mode, Reset (with confirmation dialog)
- **Save** — Manual cloud save button with `isSaving` spinner feedback
- **AI triggers** — Opens `AiDiagramGeneratorModal`; Import Mermaid, Version History
- **Export** — Dropdown: PNG, JPEG, SVG, PDF, React Code, Mermaid Code
- **Comment toggle** — Opens/closes `CommentSidebar`
- **Mobile** — Collapses to a `...` button on small screens

### `PropertiesPanel.tsx` (Right panel)

Appears when a layer is selected. Shows:
- Fill color picker + custom color palette + recent colors
- Stroke color (for shapes and lines)
- Opacity slider
- Border radius (for rectangles)
- Shadow toggle
- Roughness/Bowing sliders (for sketch mode shapes)
- Link input (makes the element clickable)
- Pen size / eraser size
- Lock/unlock individual layer
- Delete button

### `ZoomHUD.tsx` (Bottom center)

- Current zoom percentage display (click to reset to 100%)
- Zoom in/out buttons
- "Fit View" — calculates the bounding box of all layers and adjusts camera/zoom to show everything
- "Reset View" — returns to origin at 100% zoom
- Background pattern selector (solid, dotted, grid)
- Background color picker

### `NavigationHUD.tsx` (Bottom-left)

A minimap of the entire canvas. Renders a scaled-down SVG representation of all layers. The viewport rectangle is shown as an overlay on the mini-map — clicking/dragging it pans the main canvas. Particularly useful on very large boards.

### `CommentSidebar.tsx` (Slides in from the right)

Lists all `Comment` threads for the board. Each thread shows the root comment and a collapse/expand for replies. Allows marking threads resolved (strikes them through and fades). The "Go to comment" button sets the camera to center on the comment's `x, y` position on the canvas.

### `LibrarySidebar.tsx` (Slides in from the left)

A template library with pre-built shape combinations (e.g., "Flowchart", "ERD", "Network Diagram" starters). Clicking a template calls `addLayers()` with a pre-defined `Layer[]` array. Users can also save their own selections as library items.

### `ShareModal.tsx` (Dialog)

Two sections:
1. **Public link sharing** — Toggle `isPublic` on/off + select `publicRole` (Viewer or Editor). PATCH request to `/api/board/[id]/share`.
2. **Collaborator management** — Invite by email + role. Lists existing collaborators with remove buttons.

Calls `PATCH /api/board/[id]/share` for settings and `POST/DELETE /api/board/[id]/collaborators` for invites.

### `TimeTravelSlider.tsx`

A horizontal slider that maps to `history.length`. Dragging left calls `jumpToHistoryStep(step)` which replaces the current `layers` with `history[step]`. This is the "time travel" through local undo history. Distinct from `VersionHistoryModal` which shows cloud snapshots.

### `VersionHistoryModal.tsx`

Lists all `BoardSnapshot` records for the board (fetched from `/api/board/[id]/snapshots`). Each snapshot shows its name, timestamp, and author. Restoring a snapshot replaces the current board's `layers` with the snapshot's `layers` JSON and saves it to the cloud.
---

## 14. Sharing & Permissions System

The permission system uses a role-based access control (RBAC) matrix checked on the server (API routes) and enforced on the client (hiding UI, setting `isReadOnly`).

### Authentication Matrix

1. **Owner (Author)**
   - Automatically assigned to the user matching `board.authorId`.
   - Has ultimate control: delete board, manage public access, invite collaborators.
2. **Editor**
   - Granted via `BoardCollaborator` (invite) OR if the board is public with `publicRole="editor"`.
   - Can draw, edit, comment, and manually save.
   - Cannot delete the board or manage sharing settings.
3. **Viewer**
   - Granted via `BoardCollaborator` OR if the board is public with `publicRole="viewer"`.
   - `isReadOnly` is set to `true` in Zustand.
   - Can only pan, zoom, and add comments (if authenticated). All drawing tools are disabled.
4. **Guest (Unauthenticated)**
   - Only has access if `isPublic=true`.
   - Follows the `publicRole`. If `publicRole="editor"`, anonymous users can draw (their cursor is assigned a random animal name).

### Client-Side Enforcement

When `/api/board/[id]` is fetched, it returns `{ ...board, isReadOnly: boolean, permissionRole: string }`. These are loaded into `useCanvasStore`.

In `Toolbar.tsx` and `ActionToolbar.tsx`, `if (isReadOnly) return null;` prevents rendering the tools. In `Board.tsx`, `if (isReadOnly)` short-circuits pointer events (except middle-click panning).

---

## 15. Version History & Snapshots

KidDraw implements two orthogonal history systems: **Local Undo/Redo** and **Cloud Snapshots**.

### Local Undo/Redo (Ephemeral)

- **Storage:** `CanvasState.history` (Array of arrays of layers)
- **Persistence:** Lives only in RAM while the tab is open.
- **Trigger:** Automatic on `mouseUp` for drawing actions, or manual layer property changes.
- **Limit:** Retains up to 50 steps (oldest dropped).
- **Navigation:** Ctrl+Z / Ctrl+Y, or the `TimeTravelSlider` widget.

### Cloud Snapshots (Persistent)

- **Storage:** `BoardSnapshot` table in PostgreSQL.
- **Persistence:** Permanent until manually deleted.
- **Trigger:** Manual user action ("Create Snapshot" button in `VersionHistoryModal`).
- **Data:** A full copy of the `layers` JSON array at that moment.
- **Restoration:** When a snapshot is restored, it overwrites the current board `layers` both in UI and on the server.

---

## 16. Problems, Challenges & How They Were Solved

### 1. Canvas Rendering Performance at Scale

**Problem:** React is fast, but re-rendering 1,000 DOM elements (SVG paths) on every mouse move (60 FPS) is not fast enough. The browser drops frames, causing severe lag when dragging shapes or freehand drawing.
**Solution:** Migrated from SVG to HTML5 Canvas via `react-konva`. Konva batches draws and uses a display list. For freehand drawing (the most performance-intensive operation), the stroke is kept in an ephemeral `currentPath` array and only pushed to the main `layers` array on mouse-up. This avoids re-rendering the entire scene 60 times a second.

### 2. The Great Coordinate Shift (Zooming & Panning)

**Problem:** A mouse click happens at `clientX = 500, clientY = 300` on the screen. The user has zoomed to 200% (`zoom = 2`) and panned the camera down 1000px (`camera.y = -1000`). If we insert a rectangle at `x=500, y=300`, it appears in the wrong place on the infinite canvas.
**Solution:** Math. The `screenToCanvas` coordinate transformation utility function is the backbone of the entire app:
```typescript
function screenToCanvas(screenPoint: { x, y }, camera: { x, y }, zoom: number) {
  return {
    x: (screenPoint.x - camera.x) / zoom,
    y: (screenPoint.y - camera.y) / zoom
  };
}
```
*Every single interaction* runs through this function before touching the layer data.

### 3. Server-Sent Events (SSE) in Serverless Next.js

**Problem:** Building real-time collaboration without a dedicated Node.js socket server. Next.js edge functions kill long-lived requests.
**Solution:** Switched to standard Node.js runtime for the `/presence` API route (removed `export const runtime = 'edge'`). Implemented a keep-alive interval: the server sends an empty comment `:\n\n` every 15 seconds to prevent browser/proxy timeouts. `EventSource` handles automatic reconnection if the connection drops.

### 4. Bounding Box Calculations for Rotated Shapes

**Problem:** For the "Fit View" feature, we need to know the min/max X and Y of the entire drawing. A rectangle drawn at `[0,0]` with `width=100`, `height=100`, but rotated `45deg` has a bounding box that is *not* `[0, 100, 0, 100]`.
**Solution:** Trigonometry. We calculate the four corners of the unrotated shape, apply a 2D rotation matrix using the shape's rotation angle (converted to radians), and find the min/max of the resulting coordinates.

### 5. Multi-selection Drag Performance

**Problem:** Dragging 50 selected items simultaneously floods the SSE server with 50 update payloads per frame.
**Solution:** Batching. When multiple items are selected, they are temporarily moved into a Konva `Group`. The user drags the Group (one item). Only on `dragend` do we unpack the Group, compute the new absolute positions of all 50 items, and fire a single `draw-update-batch` event.

---

## 17. What Could Be Better — Honest Analysis

No system is perfect. Here are the architectural compromises made in KidDraw and how they should be fixed in a v2.0:

1. **The Global Memory Leak (SSE in Serverless)**
   - **Flaw:** `presenceClientsMap` is a global variable in the API route. In Vercel, requests hit different Lambda instances. Instance A has 2 users, Instance B has 3. User A cannot see User B's cursor. Even worse, memory is never garbage collected between cold starts.
   - **Fix:** Replace the in-memory map with **Redis Pub/Sub (Upstash)** or **Pusher/Ably**. The API route should publish events to Redis, and a separate edge subscription should stream the Redis channel to the client.

2. **JSON Blob Scalability**
   - **Flaw:** The entire canvas is saved as one massive JSON string in `board.layers`. If a board has 5,000 layers, every 3-second auto-save transmits a 2MB JSON payload. The `pg` database stores the entire JSON block.
   - **Fix:** Move `Layer` to its own Prisma model (`id`, `boardId`, `type`, `properties(JSON)`). Use delta-updates (CRDTs like Yjs) so the client only sends the 1 layer that changed, and the database only executes a single `UPDATE layer SET ...`.

3. **Conflict Resolution (The "Last Write Wins" Problem)**
   - **Flaw:** If User A and User B are both drawing offline, then reconnect, whoever saves last overwrites the other's work completely.
   - **Fix:** Implement a CRDT (Conflict-free Replicated Data Type) like Yjs or Automerge. Zustand stores the Yjs doc, and SSE broadcasts Yjs state vectors instead of raw JSON layers.

4. **Missing Object Grouping**
   - **Flaw:** Users can multi-select, but they cannot press `Ctrl+G` to group items permanently into a single selectable entity.
   - **Fix:** Introduce a `Group` layer type that contains child IDs, and update `LayerRenderer` to recurse into groups.

5. **AI Hallucinations in Clean Sketch**
   - **Flaw:** Gemini sometimes hallucinates nodes that weren't in the sketch, or struggles with complex handwriting.
   - **Fix:** Multi-modal prompt tuning. Break the request into two steps: 1) "Extract text with OCR", 2) "Convert shapes to vector data using the extracted text".

---

## 18. Running Locally

**Prerequisites:** Node.js 18+, PostgreSQL (local or Neon/Supabase), Google Gemini API Key.

1. **Clone & Install:**
   ```bash
   git clone https://github.com/mkamrul9/kidraw.git
   cd kidraw
   npm install
   ```

2. **Environment Variables (`.env`):**
   ```env
   DATABASE_URL="postgresql://user:pass@localhost:5432/kidraw"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   GITHUB_ID="your-github-oauth-client-id"
   GITHUB_SECRET="your-github-oauth-client-secret"
   GEMINI_API_KEY="your-google-ai-studio-key"
   ```

3. **Database Setup:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   # App runs on http://localhost:3000
   ```
