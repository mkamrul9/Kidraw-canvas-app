# 📋 Kidraw — Complete Project Reference

> **Purpose:** This is the single source of truth for the Kidraw canvas application. It documents every file, route, feature, component, and architectural decision currently implemented. Use this as a reference to know exactly what exists before planning or building new features.
>
> **Last Updated:** 2026-05-30

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Directory Structure & File Map](#3-directory-structure--file-map)
4. [Database Schema](#4-database-schema)
5. [Authentication System](#5-authentication-system)
6. [Routes & Pages](#6-routes--pages)
7. [API Endpoints](#7-api-endpoints)
8. [Canvas Engine & Drawing System](#8-canvas-engine--drawing-system)
9. [State Management (Zustand Store)](#9-state-management-zustand-store)
10. [UI Components](#10-ui-components)
11. [Type System](#11-type-system)
12. [Design System & Styling](#12-design-system--styling)
13. [Feature Matrix (Implemented vs. Planned)](#13-feature-matrix-implemented-vs-planned)
14. [Environment Variables](#14-environment-variables)
15. [Configuration Files](#15-configuration-files)
16. [Deployment & Infrastructure](#16-deployment--infrastructure)
17. [Known Architectural Patterns & Decisions](#17-known-architectural-patterns--decisions)
18. [Development Phase History](#18-development-phase-history)

---

## 1. Project Overview

**Kidraw** is a production-grade, infinite canvas SaaS whiteboard application. It targets full-stack developers, system architects, product managers, and UI/UX designers who need a visual workspace for mapping architectures, wireframing UIs, and collaborating with teams.

| Attribute            | Value                                          |
|----------------------|------------------------------------------------|
| **Name**             | Kidraw (package name: `canvas-app`)            |
| **Version**          | `0.1.0`                                        |
| **Live URL**         | https://kidraw-canvas.vercel.app/              |
| **Repository**       | `mkamrul9/Kidraw-canvas-app`                   |
| **Author**           | Md. Kamrul Islam (@mkamrul9)                   |
| **License**          | MIT                                            |

---

## 2. Tech Stack & Dependencies

### Core Framework & Language

| Technology       | Version   | Purpose                                         |
|------------------|-----------|--------------------------------------------------|
| Next.js          | `16.2.6`  | Full-stack React framework (App Router)          |
| React            | `19.2.4`  | UI rendering library                             |
| React DOM        | `19.2.4`  | DOM bindings for React                           |
| TypeScript       | `^5`      | Type-safe JavaScript superset                    |

### Canvas Engine

| Technology       | Version   | Purpose                                         |
|------------------|-----------|--------------------------------------------------|
| Konva            | `^10.3.0` | HTML5 Canvas 2D framework                        |
| React-Konva      | `^19.2.4` | React bindings for Konva                         |
| use-image        | `^1.1.4`  | React hook for loading images into Konva         |

### State Management

| Technology       | Version   | Purpose                                         |
|------------------|-----------|--------------------------------------------------|
| Zustand          | `^5.0.13` | Lightweight global state management              |

### Database & ORM

| Technology        | Version    | Purpose                                        |
|-------------------|------------|------------------------------------------------|
| Prisma Client     | `^5.22.0`  | Type-safe database ORM                          |
| Prisma (dev)      | `^5.22.0`  | Schema management & migrations                  |
| @prisma/adapter-pg| `^5.22.0`  | PostgreSQL adapter for Prisma                   |
| pg                | `^8.12.0`  | Node.js PostgreSQL client                       |

### Authentication

| Technology           | Version     | Purpose                                     |
|----------------------|-------------|----------------------------------------------|
| NextAuth.js          | `^4.24.14`  | OAuth-based authentication                   |
| @auth/prisma-adapter | `^2.11.2`   | Prisma adapter for NextAuth session storage  |

### UI & Styling

| Technology               | Version   | Purpose                                    |
|--------------------------|-----------|--------------------------------------------|
| Tailwind CSS             | `^4`      | Utility-first CSS framework                |
| @tailwindcss/postcss     | `^4`      | PostCSS integration for Tailwind           |
| tw-animate-css           | `^1.4.0`  | Tailwind animation utilities               |
| Shadcn UI (shadcn)       | `^4.7.0`  | Pre-built Radix-based UI components        |
| Radix UI                 | `^1.4.3`  | Accessible headless UI primitives          |
| class-variance-authority | `^0.7.1`  | Component variant utility                  |
| clsx                     | `^2.1.1`  | Conditional className utility              |
| tailwind-merge           | `^3.6.0`  | Tailwind class deduplication               |
| Lucide React             | `^1.14.0` | Icon library                               |
| Sonner                   | `^2.0.7`  | Toast notification library                 |
| next-themes              | `^0.4.6`  | Theme provider (installed, not yet active) |

### Utilities

| Technology       | Version   | Purpose                                         |
|------------------|-----------|--------------------------------------------------|
| uuid             | `^14.0.0` | UUID v4 generation for unique IDs                |

---

## 3. Directory Structure & File Map

```
kidraw/
├── .env                                  # Environment variables (secrets, DB URL, OAuth keys)
├── .gitignore                            # Git ignore rules
├── AGENTS.md                             # AI agent rules (Next.js breaking-change warnings)
├── CLAUDE.md                             # AI assistant configuration
├── README.md                             # Project overview & setup instructions
├── components.json                       # Shadcn UI configuration (aliases → src/shared/)
├── eslint.config.mjs                     # ESLint configuration (Next.js Core Web Vitals + TS)
├── next-env.d.ts                         # Next.js TypeScript environment declarations
├── next.config.ts                        # Next.js configuration (allowedDevOrigins)
├── package.json                          # Dependencies & scripts
├── package-lock.json                     # Dependency lock file
├── postcss.config.mjs                    # PostCSS configuration for Tailwind
├── prisma.config.ts                      # Prisma configuration (schema path, migrations)
├── tsconfig.json                         # TypeScript config (@/* → ./src/*)
│
├── prisma/
│   └── schema.prisma                     # Database schema (User, Account, Session, Board)
│
├── docs/
│   └── PROJECT_REFERENCE.md             # THIS FILE — complete project reference
│
└── src/
    ├── app/                              # Next.js App Router (THIN WRAPPERS ONLY)
    │   ├── globals.css                   # Global styles, CSS variables, Tailwind config
    │   ├── layout.tsx                    # Root layout (Inter font, SessionProvider, Toaster)
    │   ├── page.tsx                      # Home page (delegates to LandingPage/DashboardView)
    │   ├── auth/
    │   │   ├── signin/page.tsx           # Custom OAuth sign-in page
    │   │   └── signout/page.tsx          # Custom sign-out confirmation page
    │   ├── board/[id]/page.tsx           # Canvas workspace page (dynamic route)
    │   ├── info/
    │   │   ├── [slug]/page.tsx           # Generic info/legal placeholder pages
    │   │   ├── billing/page.tsx          # Billing & subscription page
    │   │   ├── profile/page.tsx          # User profile management page
    │   │   └── settings/page.tsx         # System settings page
    │   └── api/
    │       ├── auth/[...nextauth]/route.ts  # NextAuth API handler
    │       └── board/[id]/route.ts          # Board CRUD API
    │
    ├── features/                         # BUSINESS DOMAIN MODULES
    │   ├── auth/
    │   │   ├── config.ts                 # NextAuth configuration (providers, adapter, callbacks)
    │   │   └── types.ts                  # NextAuth session type augmentation
    │   ├── canvas/
    │   │   ├── types.ts                  # Layer, Tool, ShapeType, Camera types
    │   │   ├── constants.ts              # Pen/eraser sizes, zoom limits, export ratio
    │   │   ├── store/useCanvasStore.ts    # Zustand global state store
    │   │   ├── lib/
    │   │   │   ├── geometry.ts           # isPointInPolygon (lasso selection)
    │   │   │   └── background.ts         # CSS background pattern generator
    │   │   ├── hooks/
    │   │   │   └── useCanvasExport.ts     # Off-screen export pipeline hook
    │   │   └── components/
    │   │       ├── Board.tsx             # Main Konva Stage orchestration (~215 lines)
    │   │       └── LayerRenderer.tsx     # Layer → Konva element mapper
    │   ├── dashboard/
    │   │   ├── actions/board-actions.ts   # Server action for board creation
    │   │   └── components/
    │   │       ├── DashboardView.tsx      # Logged-in dashboard with board grid
    │   │       └── BoardGrid.tsx          # Board card grid with show-more toggle
    │   └── landing/
    │       └── components/
    │           └── LandingPage.tsx        # Full SaaS landing page (hero + sections)
    │
    ├── widgets/                          # COMPOSITE UI PANELS (canvas overlays)
    │   ├── Toolbar.tsx                   # Top-center drawing tools toolbar
    │   ├── ActionToolbar.tsx             # Top-right actions (save, export, lock, reset)
    │   ├── PropertiesPanel.tsx           # Right-side color/opacity/background panel
    │   ├── ZoomHUD.tsx                   # Bottom-left zoom/minimap/share HUD
    │   └── NavigationHUD.tsx             # Top-left logo/user navigation HUD
    │
    ├── shared/                           # CROSS-CUTTING INFRASTRUCTURE
    │   ├── lib/
    │   │   ├── utils.ts                  # cn() utility (clsx + tailwind-merge)
    │   │   └── prisma.ts                 # Prisma client singleton (dev hot-reload safe)
    │   ├── constants/index.ts            # App-wide constants (colors, limits)
    │   └── components/
    │       ├── ToolButton.tsx            # Unified tool button (consolidated from 4 duplicates)
    │       ├── Footer.tsx               # Shared footer component
    │       └── ui/                      # Shadcn UI primitives
    │           ├── avatar.tsx           # Avatar component (Radix-based)
    │           ├── button.tsx           # Button component (CVA variants)
    │           ├── dialog.tsx           # Dialog/modal component (Radix-based)
    │           ├── dropdown-menu.tsx    # Dropdown menu component (Radix-based)
    │           ├── sonner.tsx           # Toast notification wrapper
    │           └── tooltip.tsx          # Tooltip component (Radix-based)
    │
    └── providers/
        └── SessionProvider.tsx           # NextAuth client session provider wrapper
```

---

## 4. Database Schema

**Provider:** NeonDB (Serverless PostgreSQL)
**ORM:** Prisma with `binary` engine type

### Models

#### `User`
| Field           | Type       | Attributes           | Description                    |
|-----------------|------------|----------------------|--------------------------------|
| `id`            | `String`   | `@id @default(cuid())`| Primary key                   |
| `name`          | `String?`  |                      | Display name (from OAuth)      |
| `email`         | `String?`  | `@unique`            | Email address (from OAuth)     |
| `emailVerified` | `DateTime?`|                      | Email verification timestamp   |
| `image`         | `String?`  |                      | Avatar URL (from OAuth)        |
| `accounts`      | `Account[]`|                      | Linked OAuth accounts          |
| `sessions`      | `Session[]`|                      | Active sessions                |
| `boards`        | `Board[]`  |                      | User's canvas boards           |

#### `Account` (OAuth accounts linked to users)
| Field               | Type      | Attributes                              |
|---------------------|-----------|-----------------------------------------|
| `id`                | `String`  | `@id @default(cuid())`                  |
| `userId`            | `String`  | FK → `User.id` (cascade delete)         |
| `type`              | `String`  | Account type                            |
| `provider`          | `String`  | OAuth provider name                     |
| `providerAccountId` | `String`  | Provider-specific account ID            |
| `refresh_token`     | `String?` | `@db.Text`                              |
| `access_token`      | `String?` | `@db.Text`                              |
| `expires_at`        | `Int?`    | Token expiration timestamp              |
| `token_type`        | `String?` | Token type                              |
| `scope`             | `String?` | OAuth scope                             |
| `id_token`          | `String?` | `@db.Text`                              |
| `session_state`     | `String?` | Session state                           |

**Unique constraint:** `@@unique([provider, providerAccountId])`

#### `Session`
| Field          | Type       | Attributes                            |
|----------------|------------|---------------------------------------|
| `id`           | `String`   | `@id @default(cuid())`                |
| `sessionToken` | `String`   | `@unique`                             |
| `userId`       | `String`   | FK → `User.id` (cascade delete)       |
| `expires`      | `DateTime` | Session expiration                    |

#### `Board`
| Field             | Type       | Attributes                           | Description                      |
|-------------------|------------|--------------------------------------|----------------------------------|
| `id`              | `String`   | `@id @default(cuid())`               | Primary key (UUID v4)            |
| `title`           | `String`   | `@default("Untitled Whiteboard")`    | Board title                      |
| `description`     | `String?`  |                                      | Optional description             |
| `backgroundColor` | `String`   | `@default("#ffffff")`                | Canvas background color          |
| `layers`          | `Json`     | `@default("[]")`                     | All canvas layers (shapes, text) |
| `authorId`        | `String?`  | FK → `User.id` (optional)           | Board creator                    |
| `createdAt`       | `DateTime` | `@default(now())`                    | Creation timestamp               |
| `updatedAt`       | `DateTime` | `@updatedAt`                         | Last modification timestamp      |

---

## 5. Authentication System

### Configuration

| Setting              | Value                                            |
|----------------------|--------------------------------------------------|
| **Library**          | NextAuth.js v4 with Prisma Adapter               |
| **Session Strategy** | Database sessions (via Prisma Adapter)            |
| **Providers**        | GitHub OAuth, Google OAuth                        |
| **Custom Pages**     | Sign-in: `/auth/signin`, Sign-out: `/auth/signout`|
| **Session Callback** | Injects `user.id` into the session object         |
| **Type Augmentation**| `next-auth.d.ts` extends Session with `user.id`   |

### Flow

1. User clicks "Sign up free" or "Log in" → redirected to `/auth/signin`
2. Custom sign-in page shows GitHub and Google OAuth buttons
3. On successful OAuth → session created in database → redirect to `/` (dashboard)
4. Session is provided app-wide via `SessionProvider` wrapper in root layout
5. Sign-out redirects to `/auth/signout` confirmation page → clears session → redirects to `/`

---

## 6. Routes & Pages

### Page Routes (Next.js App Router)

| Route                   | File                               | Type            | Auth Required | Description                                             |
|-------------------------|-------------------------------------|-----------------|---------------|----------------------------------------------------------|
| `/`                     | `src/app/page.tsx`                 | Server Component| No            | **Conditional:** Shows landing page (guest) or dashboard (authenticated) |
| `/?view=landing`        | `src/app/page.tsx`                 | Server Component| No            | Forces landing page view even for authenticated users    |
| `/auth/signin`          | `src/app/auth/signin/page.tsx`     | Client Component| No            | Custom OAuth sign-in page (GitHub + Google)              |
| `/auth/signout`         | `src/app/auth/signout/page.tsx`    | Client Component| No            | Sign-out confirmation page                               |
| `/board/[id]`           | `src/app/board/[id]/page.tsx`      | Client Component| No*           | Canvas workspace (dynamically loaded)                    |
| `/info/profile`         | `src/app/info/profile/page.tsx`    | Client Component| Soft          | User profile management                                 |
| `/info/settings`        | `src/app/info/settings/page.tsx`   | Client Component| No            | System settings (theme, notifications, danger zone)      |
| `/info/billing`         | `src/app/info/billing/page.tsx`    | Server Component| No            | Billing & subscription information                       |
| `/info/[slug]`          | `src/app/info/[slug]/page.tsx`     | Server Component| No            | Catch-all for info/legal pages (placeholder content)     |

> \* Board route loads canvas data from the API. Board is accessible without auth, but saving requires authentication.

### Info Slug Pages (Placeholder)

The following slugs are linked from the footer and dashboard but all render the same placeholder template:

| Category  | Slugs                                                                          |
|-----------|--------------------------------------------------------------------------------|
| Product   | `/info/features`, `/info/templates`, `/info/integrations`, `/info/changelog`   |
| Resources | `/info/help-center`, `/info/community`, `/info/blog`, `/info/developers-api`   |
| Legal     | `/info/privacy-policy`, `/info/terms-of-service`, `/info/cookie-policy`, `/info/security` |
| Other     | `/info/keyboard-shortcuts`                                                     |

---

## 7. API Endpoints

### `GET /api/auth/[...nextauth]`
- **Handler:** NextAuth catch-all route
- **Purpose:** Handles all OAuth flows (sign-in, sign-out, callbacks, session, CSRF)

### `POST /api/auth/[...nextauth]`
- **Handler:** NextAuth catch-all route
- **Purpose:** Handles OAuth POST operations (credential submission, CSRF validation)

### `GET /api/board/[id]`
- **Auth:** Not required
- **Behavior:**
  - Finds board by ID
  - If not found → auto-creates a new blank board with that ID
  - Returns full board JSON (id, title, description, layers, backgroundColor, timestamps)
- **Config:** `dynamic = 'force-dynamic'` (no caching)

### `POST /api/board/[id]`
- **Auth:** Required (returns 401 if no session)
- **Body:** `{ layers: Layer[], backgroundColor: string }`
- **Behavior:**
  - Upserts board: updates if exists, creates if not (with `authorId`)
  - Returns updated board JSON
- **Used by:** Cloud save from canvas store

---

## 8. Canvas Engine & Drawing System

### Core Architecture

The canvas uses **React-Konva** (a React wrapper around Konva.js) for declarative HTML5 Canvas rendering. The `Board.tsx` component is dynamically imported with `ssr: false` to avoid server-side rendering issues with the `window` object.

### Supported Drawing Tools

| Tool               | Type Key          | Behavior                                                          |
|--------------------|-------------------|--------------------------------------------------------------------|
| **Select (Box)**   | `select`          | Click to select single layer; drag to box-select multiple layers   |
| **Select (Lasso)** | `lasso`           | Freehand lasso selection using ray-casting point-in-polygon algo   |
| **Hand (Pan)**     | `hand`            | Click-drag to pan the infinite canvas                              |
| **Pen (Freehand)** | `pen`             | Freehand drawing with tension-smoothed lines                       |
| **Shapes**         | `shape`           | Draw geometric shapes (see Shape Types below)                      |
| **Text**           | `text`            | Click to place text; inline textarea editing with Enter to confirm |
| **Image**          | `image`           | Upload image via file picker; renders as Base64 on canvas          |
| **Laser Pointer**  | `laser`           | Red fading laser trail for presentations                           |
| **Eraser**         | `eraser`          | Pixel eraser using `globalCompositeOperation: destination-out`     |
| **Object Eraser**  | `object-eraser`   | Click-to-delete entire layers/objects                              |
| **Sticky Note**    | `sticky`          | Auto-scaling text inside a styled rectangle container              |
| **Comment**        | `comment`         | Place yellow sticky-note comments on canvas                        |
| **Frame**          | `frame`           | Artboards/Frames for grouping and organizing canvas content        |
| **PDF**            | `pdf`             | Embedded PDF pages with custom pagination controls                 |
| **Code**           | `code`            | Embedded code snippets/blocks                                      |

### Supported Shape Types

| Shape          | Type Key         | Konva Element      | Rendering                                     |
|----------------|------------------|--------------------|------------------------------------------------|
| Rectangle      | `rectangle`      | `Rect`             | Width × Height with corner radius              |
| Ellipse        | `ellipse`        | `Ellipse`          | RadiusX × RadiusY from center                  |
| Triangle       | `triangle`       | `RegularPolygon`   | 3-sided regular polygon                        |
| Diamond        | `diamond`        | `RegularPolygon`   | 4-sided regular polygon (rotated square)       |
| Hexagon        | `hexagon`        | `RegularPolygon`   | 6-sided regular polygon                        |
| Star           | `star`           | `Star`             | 5-pointed star with inner/outer radius         |
| Arrow          | `arrow`          | `Arrow`            | Line with arrowhead pointer                    |
| Straight Line  | `straight-line`  | `Line`             | Point-to-point straight line                   |

### Canvas Features

| Feature                       | Status | Description                                                                      |
|-------------------------------|--------|-----------------------------------------------------------------------------------|
| Infinite pan & scroll         | ✅     | Scroll to pan; hold hand tool to drag                                             |
| Pinch/scroll zoom             | ✅     | `Ctrl/Cmd + Scroll` for zoom; clamped range `0.1x – 5x`                          |
| Freehand pen with sizes       | ✅     | 3 pen sizes: 2px, 4px, 8px with tension smoothing                                |
| Shape drawing                 | ✅     | 8 shapes; click-drag to draw                                                     |
| Text placement & editing      | ✅     | Click to place, double-click to re-edit, Enter to confirm                         |
| Image insertion               | ✅     | File picker → Base64 encode → render on canvas (max 800px scale)                  |
| Sticky-note comments          | ✅     | Yellow sticky notes with text editing                                             |
| Object selection              | ✅     | Click-to-select with Konva Transformer (resize handles)                           |
| Multi-select (box)            | ✅     | Drag to create selection rectangle, captures objects within                        |
| Multi-select (lasso)          | ✅     | Freehand lasso with ray-casting point-in-polygon detection                        |
| Drag to reposition            | ✅     | Selected objects can be dragged                                                   |
| Resize via transformer        | ✅     | Selected objects show resize handles (min 5px constraint)                         |
| Pixel eraser                  | ✅     | 3 sizes: 10px, 20px, 50px; uses `destination-out` compositing                    |
| Object eraser                 | ✅     | Click any object to delete it instantly                                           |
| Canvas Frames / Artboards     | ✅     | Parent container bounding boxes for grouping designs                              |
| Auto-scaling Sticky Notes     | ✅     | Notes with heuristic font size scaling based on bounds                            |
| PDF Annotation                | ✅     | Multi-page PDF viewer directly embedded on the canvas                             |
| Keyboard Shortcuts            | ✅     | Copy, Paste, Undo, Redo, Group, Order, and single-key tool swapping               |
| Magnetic Smart Guides         | ✅     | Snaps objects into alignment with nearby objects horizontally and vertically      |
| Contextual Alignment Tools    | ✅     | Distribute evenly, align edges, etc. via multi-select toolbar                     |
| Laser pointer                 | ✅     | Red trail with fading animation (30ms interval decay)                             |
| Per-shape opacity             | ✅     | Opacity slider (10% – 100%) applies to new and selected shapes                   |
| Custom fill colors            | ✅     | Native color picker + 8 preset colors + 5 recent custom colors                   |
| Background patterns           | ✅     | Solid, Dotted grid, Line grid; CSS-rendered (no Konva overhead)                   |
| Background color picker       | ✅     | Full color picker for canvas background                                           |
| Undo/Redo                     | ✅     | Full history stack; undo/redo with state snapshots                                |
| Canvas lock/unlock             | ✅     | Lock toggle prevents all drawing & editing                                        |
| Clear/reset canvas            | ✅     | Confirmation dialog → clears all layers (with undo support)                       |
| Export PNG                    | ✅     | Off-screen canvas compilation with background patterns baked in                   |
| Export JPEG                   | ✅     | Same off-screen compilation pipeline                                              |
| Export SVG                    | ⚠️     | Stub implemented (toast only), full SVG export not yet built                      |
| Cloud save                   | ✅     | POST to `/api/board/[id]` with toast feedback                                    |
| Cloud load                   | ✅     | GET from `/api/board/[id]` on page mount                                         |
| Window resize handling        | ✅     | Canvas auto-resizes to fill viewport                                             |
| Touch support                 | ✅     | `onTouchStart`, `onTouchMove`, `onTouchEnd` handlers                             |

### Export Engine Architecture

The export system uses an **off-screen canvas compilation** strategy:

1. Get transparent drawing layer from Konva (`stageRef.toDataURL()`)
2. Create an off-screen `<canvas>` at 2× pixel ratio
3. Draw solid background color
4. Natively render CSS background patterns (dots/grid) with `ctx.arc()` / `ctx.moveTo()`
5. Overlay the Konva drawing
6. Export as PNG/JPEG blob
7. Use `showSaveFilePicker` API (with fallback to `<a download>`)

---

## 9. State Management (Zustand Store)

### Store: `useCanvasStore`

**File:** `src/store/useCanvasStore.ts`

#### State Properties

| Property            | Type                                 | Default            | Description                                    |
|---------------------|--------------------------------------|--------------------|-------------------------------------------------|
| `activeTool`        | `Tool`                               | `'pen'`            | Currently selected drawing tool                 |
| `activeColor`       | `Color` (string)                     | `'#000000'`        | Active fill/stroke color                        |
| `backgroundColor`   | `string`                             | `'#f8fafc'`        | Canvas background color                         |
| `layers`            | `Layer[]`                            | `[]`               | All canvas objects                              |
| `isDrawing`         | `boolean`                            | `false`            | Whether user is actively drawing                |
| `isSaving`          | `boolean`                            | `false`            | Whether cloud save is in progress               |
| `boardId`           | `string \| null`                     | `null`             | Current board ID                                |
| `selectedLayerId`   | `string \| null`                     | `null`             | Single selected layer ID                        |
| `selectedLayerIds`  | `string[]`                           | `[]`               | Multi-selected layer IDs                        |
| `bgPattern`         | `'solid' \| 'dotted' \| 'grid'`     | `'dotted'`         | Background pattern type                         |
| `activeEraserType`  | `'eraser' \| 'object-eraser'`        | `'eraser'`         | Current eraser mode                             |
| `eraserSize`        | `number`                             | `20`               | Pixel eraser brush size                         |
| `customColors`      | `string[]`                           | `[]`               | User's recent custom colors (max 5)             |
| `camera`            | `{ x: number; y: number }`          | `{ x: 0, y: 0 }`  | Camera position (pan offset)                    |
| `zoom`              | `number`                             | `1`                | Zoom level (0.1 – 5.0)                          |
| `isLocked`          | `boolean`                            | `false`            | Canvas lock state                               |
| `activeShape`       | `ShapeType`                          | `'rectangle'`      | Currently selected shape type                   |
| `penSize`           | `number`                             | `4`                | Pen stroke width                                |
| `activeOpacity`     | `number`                             | `1`                | Opacity for new/selected shapes                 |
| `permissionRole`    | `'owner' \| 'editor' \| 'viewer'`   | `'owner'`          | User's role on the board                        |
| `history`           | `Layer[][]`                          | `[[]]`             | Undo/redo history stack                         |
| `historyStep`       | `number`                             | `0`                | Current position in history                     |

#### Actions

| Action              | Parameters                              | Description                                      |
|---------------------|-----------------------------------------|---------------------------------------------------|
| `setActiveTool`     | `(tool: Tool)`                          | Switch active drawing tool                        |
| `setActiveColor`    | `(color: Color)`                        | Change active color                               |
| `setBackgroundColor`| `(color: string)`                       | Change canvas background color                    |
| `setIsDrawing`      | `(isDrawing: boolean)`                  | Set drawing state                                 |
| `setBoardId`        | `(id: string)`                          | Set current board ID                              |
| `setSelectedLayerId`| `(id: string \| null)`                  | Select/deselect single layer                      |
| `setSelectedLayerIds`| `(ids: string[])`                      | Set multi-selection                               |
| `setBgPattern`      | `(pattern: ...)`                        | Change background pattern                         |
| `setActiveEraserType`| `(type: ...)`                          | Switch eraser mode                                |
| `setEraserSize`     | `(size: number)`                        | Change eraser size                                |
| `addCustomColor`    | `(color: string)`                       | Add to recent colors (max 5, deduped)             |
| `removeLayer`       | `(id: string)`                          | Delete a layer by ID                              |
| `setCamera`         | `(pos: {x, y})`                         | Set camera pan position                           |
| `setZoom`           | `(zoom: number)`                        | Set zoom level                                    |
| `toggleLock`        | `()`                                    | Toggle canvas lock state                          |
| `setActiveShape`    | `(shape: ShapeType)`                    | Set active shape type (also sets tool to 'shape') |
| `setPenSize`        | `(size: number)`                        | Change pen stroke width                           |
| `setOpacity`        | `(opacity: number)`                     | Change active opacity                             |
| `setPermissionRole` | `(role: ...)`                           | Set permission role                               |
| `addLayer`          | `(layer: Layer)`                        | Add a new layer                                   |
| `updateLayer`       | `(id: string, attrs: Partial<Layer>)`   | Update layer properties                           |
| `saveHistory`       | `()`                                    | Snapshot current layers to history stack           |
| `undo`              | `()`                                    | Step back in history                              |
| `redo`              | `()`                                    | Step forward in history                           |
| `clear`             | `()`                                    | Clear all layers (saves to history)               |
| `saveToCloud`       | `(boardId: string)`                     | POST layers + background to API                   |
| `loadFromCloud`     | `(boardId: string)`                     | GET board data from API and populate store         |

---

## 10. UI Components

### Application Components

| Component              | File                                          | Type   | Description                                                          |
|------------------------|-----------------------------------------------|--------|-----------------------------------------------------------------------|
| `Board`                | `src/components/canvas/Board.tsx`             | Client | Main Konva Stage; handles all drawing, selection, and erasing logic   |
| `BoardGrid`            | `src/components/dashboard/BoardGrid.tsx`      | Client | Responsive grid of board cards with show-more/less toggle             |
| `Toolbar`              | `src/widgets/Toolbar.tsx`                     | Client | Top-center drawing tools (Responsive & collapsible on mobile)         |
| `ActionToolbar`        | `src/widgets/ActionToolbar.tsx`               | Client | Top-right actions (save, export, lock) (Collapsible on mobile)        |
| `PropertiesPanel`      | `src/widgets/PropertiesPanel.tsx`             | Client | Right-side panel (opacity, background, color) (Collapsible on mobile) |
| `ZoomHUD`              | `src/widgets/ZoomHUD.tsx`                     | Client | Bottom-left HUD (share, minimap, zoom in/out, zoom percentage)        |
| `NavigationHUD`        | `src/widgets/NavigationHUD.tsx`               | Client | Top-left HUD (logo, user avatar, navigation dropdown)                 |
| `SessionProvider`      | `src/components/providers/SessionProvider.tsx` | Client | Wraps app with NextAuth `SessionProvider`                             |
| `Footer`               | `src/app/page.tsx` (inline)                   | Server | Shared footer with product/resources/legal links                      |

### Shadcn UI Primitives (in `components/ui/`)

| Component          | File                          | Usage                                                    |
|--------------------|-------------------------------|-----------------------------------------------------------|
| `Avatar`           | `components/ui/avatar.tsx`    | User avatars (dashboard nav, profile page, board HUD)     |
| `Button`           | `components/ui/button.tsx`    | All buttons app-wide (CVA variants: default, ghost, outline)|
| `Dialog`           | `components/ui/dialog.tsx`    | Modals (new board, reset canvas, delete account, share)    |
| `DropdownMenu`     | `components/ui/dropdown-menu.tsx`| User menu (dashboard, board NavigationHUD)              |
| `Sonner`           | `components/ui/sonner.tsx`    | Toast notifications (save, export, settings)               |
| `Tooltip`          | `components/ui/tooltip.tsx`   | Tool button labels (all toolbars)                          |

---

## 11. Type System

### File: `src/types/canvas.ts`

```typescript
export type Color = string;

export type ShapeType = 'rectangle' | 'ellipse' | 'triangle' | 'diamond'
                      | 'star' | 'arrow' | 'straight-line' | 'hexagon';

export type LayerType = ShapeType | 'pen' | 'text' | 'eraser' | 'comment' | 'image';

export type Tool = 'select' | 'lasso' | 'hand' | 'shape' | 'pen' | 'text'
                 | 'eraser' | 'object-eraser' | 'comment' | 'laser' | 'image';

export type Camera = { x: number; y: number };

export type Layer = {
    id: string;
    type: LayerType;
    x: number;
    y: number;
    height: number;
    width: number;
    fill: Color;
    stroke?: Color;
    points?: number[];       // For pen/eraser freehand paths
    text?: string;           // For text/comment layers
    eraserSize?: number;     // Pixel eraser brush size
    penSize?: number;        // Pen stroke width
    opacity?: number;        // Per-shape opacity (0-1)
    src?: string;            // Base64 image data for image layers
};
```

### File: `src/types/next-auth.d.ts`

Augments NextAuth's `Session` interface to include `user.id: string`.

---

## 12. Design System & Styling

### Typography

- **Primary Font:** Inter (Google Fonts, via `next/font/google`)
- **CSS Variable:** `--font-inter`

### Color Palette

| Usage             | Color                                                    |
|-------------------|----------------------------------------------------------|
| Page background   | `#0B0F19` (Midnight), `#05070B` (Dashboard)              |
| Card/panel bg     | `rgba(255,255,255,0.02)` with `backdrop-blur-xl`         |
| Primary accent    | Violet-600 (`#7c3aed`) → Fuchsia-600 gradient            |
| Secondary accent  | Amber-400, Emerald-400, Rose-400                          |
| Text primary      | White / Slate-50                                          |
| Text secondary    | Slate-400                                                 |
| Text muted        | Slate-500                                                 |
| Borders           | `rgba(255,255,255,0.05)` to `rgba(255,255,255,0.10)`     |
| Destructive       | Red-600                                                   |

### Design Patterns

- **Glassmorphism:** Frosted glass panels with `backdrop-blur-xl` and semi-transparent backgrounds
- **Aurora Glow:** Gradient blurred circles (`blur-[150px]`) for ambient lighting effects
- **Dot Grid Background:** Radial gradient patterns for the landing page hero section
- **3D Perspective:** Hero canvas mockup with CSS `perspective` and `rotate-x/y` transforms
- **Micro-interactions:** `hover:scale-[1.02]`, `hover:-translate-y-2`, `group-hover:` transitions

### Shadcn Configuration

| Setting       | Value          |
|---------------|----------------|
| Style         | `radix-nova`   |
| RSC           | `true`         |
| TSX           | `true`         |
| Base Color    | `neutral`      |
| CSS Variables | `true`         |
| Icon Library  | `lucide`       |

---

## 13. Feature Matrix (Implemented vs. Planned)

### ✅ Fully Implemented

| Category          | Feature                                                        |
|-------------------|----------------------------------------------------------------|
| **Auth**          | GitHub OAuth sign-in                                           |
| **Auth**          | Google OAuth sign-in                                           |
| **Auth**          | Custom sign-in page with branded UI                            |
| **Auth**          | Custom sign-out confirmation page                              |
| **Auth**          | Session management via Prisma Adapter                          |
| **Auth**          | NextAuth type augmentation (user.id in session)                |
| **Dashboard**     | Conditional rendering (landing vs. dashboard based on session) |
| **Dashboard**     | Board grid with card previews                                  |
| **Dashboard**     | "New Board" creation dialog (title + description)              |
| **Dashboard**     | Board cards show title, description, last updated date         |
| **Dashboard**     | "Show more / Show less" toggle for boards (>4)                 |
| **Dashboard**     | User avatar dropdown with navigation links                     |
| **Landing**       | Animated SaaS landing page with hero section                   |
| **Landing**       | "How it works" 3-step section                                  |
| **Landing**       | "Built for builders" use-case cards (4 personas)               |
| **Landing**       | "Wall of Love" testimonials section                            |
| **Landing**       | Responsive navigation bar with CTA buttons                     |
| **Landing**       | Footer with Product/Resources/Legal link columns               |
| **Landing**       | 3D perspective floating canvas mockup in hero                  |
| **Canvas**        | Infinite pan (scroll + hand tool)                              |
| **Canvas**        | Pinch-to-zoom / Ctrl+Scroll zoom (0.1x – 5x)                 |
| **Canvas**        | Freehand pen drawing (3 sizes)                                 |
| **Canvas**        | 8 geometric shapes                                            |
| **Canvas**        | Text placement with inline editing                             |
| **Canvas**        | Image upload (Base64)                                          |
| **Canvas**        | Sticky-note comments                                           |
| **Canvas**        | Laser pointer with fading trail                                |
| **Canvas**        | Pixel eraser (3 sizes)                                         |
| **Canvas**        | Object eraser (click-to-delete)                                |
| **Canvas**        | Box selection                                                  |
| **Canvas**        | Lasso selection (ray-casting algorithm)                        |
| **Canvas**        | Multi-object Transformer (resize/move)                         |
| **Canvas**        | Per-shape opacity control                                      |
| **Canvas**        | Color palette (8 presets + 5 recent + custom picker)           |
| **Canvas**        | Background patterns (solid, dotted, grid)                      |
| **Canvas**        | Background color picker                                        |
| **Canvas**        | Full undo/redo history                                         |
| **Canvas**        | Canvas lock/unlock toggle                                      |
| **Canvas**        | Reset canvas (with confirmation dialog)                        |
| **Canvas**        | Export to PNG (off-screen compilation)                          |
| **Canvas**        | Export to JPEG (off-screen compilation)                         |
| **Canvas**        | Cloud save (manual)                                            |
| **Canvas**        | Cloud load (on page mount)                                     |
| **Canvas**        | Touch event support                                            |
| **Canvas**        | Window resize handling                                         |
| **Canvas**        | Interactive minimap                                            |
| **Canvas**        | Minimap drag-to-navigate                                       |
| **Canvas**        | Zoom percentage display & reset                                |
| **Canvas**        | Share dialog (copy link + role selector UI)                    |
| **Canvas HUD**    | NavigationHUD (logo + user menu on board page)                 |
| **Canvas HUD**    | Top-center Toolbar (all tools)                                 |
| **Canvas HUD**    | Top-right ActionToolbar (save, export, lock, reset, comment)   |
| **Canvas HUD**    | Right-side PropertiesPanel (colors, opacity, background)       |
| **Canvas HUD**    | Bottom-left ZoomHUD (zoom, minimap, share)                     |
| **Canvas HUD**    | Mobile-responsive collapsible logic for all toolbars           |
| **Core App**      | Resolved next-themes hydration mismatches                      |
| **Pages**         | User profile page (avatar, name edit, email display, OAuth badge)|
| **Pages**         | System settings page (theme toggle, notifications toggle, danger zone)|
| **Pages**         | Billing page (current plan info, feature list, payment methods)|
| **Pages**         | Generic info/legal placeholder pages                           |
| **Infra**         | Prisma schema with User, Account, Session, Board models        |
| **Infra**         | NeonDB serverless PostgreSQL                                   |
| **Infra**         | Vercel deployment                                              |
| **Infra**         | Dev hot-reload safe Prisma singleton                           |

### ⚠️ Partially Implemented / Stubbed

| Feature                         | Status         | Details                                                     |
|---------------------------------|----------------|--------------------------------------------------------------|
| SVG export                      | Stub           | Button exists, dispatches event, but only shows toast. No actual SVG generation. |
| Share link with roles           | UI only        | Dialog with Viewer/Commenter/Editor dropdown exists. Copies current URL but doesn't enforce permissions server-side. |
| Theme toggle (light/dark)       | UI only        | Dark mode is hardcoded. Light mode button shows "beta" error toast. `next-themes` is installed but not integrated. |
| Notification emails             | UI only        | Toggle exists in settings but has no backend integration.    |
| Account deletion                | UI only        | Button shows "disabled in preview" toast. No actual deletion logic. |
| Profile name editing            | UI only        | Edit mode toggles, shows success toast, but doesn't persist to database. |
| Permission/role system          | Store only     | `permissionRole` state exists in Zustand but is not connected to any backend logic or UI enforcement. |
| Board title/description editing | Not in canvas  | Set at creation time only; no way to edit after creation.    |

### 🔲 Not Yet Implemented (Planned / Linked but Missing)

| Feature                         | Evidence                                                    |
|---------------------------------|--------------------------------------------------------------|
| Real-time multiplayer (WebSocket/LiveKit) | Mentioned in README & landing page copy            |
| Collaborative cursors           | Marketing copy references it                                 |
| Real-time auto-save             | Only manual cloud save exists                                |
| Board search & filtering        | Dashboard shows all boards without search                    |
| Board deletion                  | No delete board functionality                                |
| Board sorting                   | Always sorted by `updatedAt desc`; no user control           |
| Keyboard shortcuts              | `/info/keyboard-shortcuts` page linked but no actual shortcuts implemented (no `useEffect` keydown handlers for tools) |
| Board thumbnails                | Board cards show a generic icon, not a preview of the canvas |
| Version history / revisions     | No board version tracking                                    |
| File attachments / comments threads | Only single-text sticky notes                           |
| Template boards                 | Footer links to `/info/templates` but no template system     |
| Integrations                    | Footer links to `/info/integrations` but nothing exists      |
| Developers API                  | Footer links to `/info/developers-api` but no public API     |
| Stripe billing integration      | Billing page is informational only; no payment processing    |
| Email-based auth                | Only OAuth (GitHub + Google)                                 |
| Image drag/resize on canvas     | Images are placed and selectable but have no dedicated resize handles |
| Layer ordering (z-index)        | Layers render in array order with no reordering UI           |
| Grouping/ungrouping             | No layer grouping functionality                              |
| Alignment/distribution tools    | No snap-to-grid or align-to-selection                        |
| Copy/paste layers               | No clipboard functionality                                   |
| Line style options (dash, dot)  | All lines are solid                                          |
| Font size/family selection      | Text is always 24px sans-serif                               |
| Arrow/connector smart routing   | Arrows are simple point-to-point                             |
| Mobile responsive canvas        | Touch events exist but no mobile-optimized toolbar layout    |

---

## 14. Environment Variables

| Variable              | Purpose                                  | Required |
|----------------------|------------------------------------------|----------|
| `DATABASE_URL`        | PostgreSQL connection string (NeonDB)    | ✅        |
| `NEXTAUTH_SECRET`     | Secret key for NextAuth token encryption | ✅        |
| `NEXTAUTH_URL`        | Base URL of the application              | ✅        |
| `GITHUB_ID`           | GitHub OAuth App client ID               | ✅        |
| `GITHUB_SECRET`       | GitHub OAuth App client secret           | ✅        |
| `GOOGLE_CLIENT_ID`    | Google OAuth client ID                   | ✅        |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret              | ✅        |

---

## 15. Configuration Files

| File                  | Purpose                                                       |
|----------------------|----------------------------------------------------------------|
| `next.config.ts`      | Next.js config; allows dev origin `192.168.0.103`             |
| `tsconfig.json`       | TypeScript config; strict mode, `@/*` path alias to root      |
| `eslint.config.mjs`   | ESLint config; Core Web Vitals + TypeScript rules              |
| `postcss.config.mjs`  | PostCSS config; integrates `@tailwindcss/postcss`              |
| `prisma.config.ts`    | Prisma config; schema path + migration path + datasource URL   |
| `components.json`     | Shadcn UI config; `radix-nova` style, aliases, icon library    |
| `.gitignore`          | Standard Next.js + node_modules ignore rules                   |

---

## 16. Deployment & Infrastructure

| Aspect         | Details                                                      |
|----------------|--------------------------------------------------------------|
| **Host**       | Vercel (auto-deploy from GitHub)                             |
| **Database**   | NeonDB (serverless PostgreSQL, `eastus2.azure` region)       |
| **Domain**     | `kidraw-canvas.vercel.app`                                   |
| **Build**      | `next build` (standard Next.js build)                        |
| **Dev Server** | `next dev` on `localhost:3000`                               |
| **DB Setup**   | `npx prisma generate` + `npx prisma db push`                |

---

## 17. Known Architectural Patterns & Decisions

### SSR Bypass for Canvas
The `Board.tsx` component is loaded via `next/dynamic` with `ssr: false` because React-Konva requires browser APIs (`window`, `HTMLCanvasElement`) that don't exist on the server.

### Prisma Singleton Pattern
`src/lib/prisma.ts` implements the standard dev-safe singleton pattern: stores the Prisma client on `globalThis` to prevent connection pool exhaustion during hot module reloading.

### Event-Driven Canvas Communication
The `Board.tsx` component and `Toolbar.tsx`/`ActionToolbar.tsx` communicate through **custom DOM events** (`window.dispatchEvent`):
- `insert-image` — Toolbar dispatches → Board listens and places the image
- `export-canvas` — ActionToolbar dispatches → Board listens and runs export pipeline

### Server Actions for Board Creation
The "New Board" dialog on the dashboard uses a **Next.js Server Action** (`'use server'`) declared inline in `page.tsx`. The form submits directly to the server function, which creates the board in the database and redirects to the new board.

### Off-Screen Canvas Export Compilation
To include CSS background patterns (dots, grids) in exported images — which Konva's native `toDataURL()` cannot capture — the export engine creates a hidden `<canvas>`, manually draws the background with Canvas 2D API calls, then composites the Konva output on top.

### CSS-Based Infinite Background
Background patterns are rendered via CSS `background-image` (radial/linear gradients) instead of Konva elements, eliminating the performance cost of rendering thousands of grid lines in the canvas layer. The background syncs with `camera.x/y` and `zoom` via React state.

---

## 18. Development Phase History

| Phase     | Milestone                                           |
|-----------|------------------------------------------------------|
| Phase 1   | Project setup, Next.js + TypeScript architecture     |
| Phase 2   | Zustand store, responsive Board component            |
| Phase 3   | Mouse events, drawing logic, pen tool                |
| Phase 4   | Professional UI (Toolbar, PropertiesPanel)            |
| Phase 5+  | Shapes, text, eraser, undo/redo, colors              |
| Phase 6+  | OAuth authentication, database persistence           |
| Phase 7+  | Dashboard, board CRUD, cloud save/load               |
| Phase 8+  | Landing page, info pages, navigation                 |
| Phase 9+  | Image upload, laser, lasso, minimap, export engine   |
| Phase 10+ | Profile, settings, billing pages, UI polish          |

> Detailed phase reports are available in the `docs/` directory:
> - [till_phase11.md](file:///d:/dev/UNIQUE%20WORK/kidraw/docs/till_phase11.md)
> - [till_phase21.md](file:///d:/dev/UNIQUE%20WORK/kidraw/docs/till_phase21.md)
> - [till_phase33.md](file:///d:/dev/UNIQUE%20WORK/kidraw/docs/till_phase33.md)
> - [till_phase4.md](file:///d:/dev/UNIQUE%20WORK/kidraw/docs/till_phase4.md)

---

## Appendix: NPM Scripts

| Script          | Command             | Description                        |
|-----------------|---------------------|------------------------------------|
| `dev`           | `next dev`          | Start development server           |
| `build`         | `next build`        | Production build                   |
| `start`         | `next start`        | Start production server            |
| `lint`          | `eslint`            | Run ESLint                         |

---

> **How to use this document:**
> - Before building a new feature, check the **Feature Matrix** (§13) to confirm it's not already implemented or stubbed.
> - Before creating a new file, check the **File Map** (§3) for existing patterns and naming conventions.
> - Before adding a new route, check **Routes & Pages** (§6) for conflicts.
> - Before modifying state, review the **Zustand Store** (§9) for existing properties and actions.
> - Before adding a new shape or tool, review the **Type System** (§11) for the correct type unions.
