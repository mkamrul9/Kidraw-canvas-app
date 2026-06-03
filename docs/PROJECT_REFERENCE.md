# 📋 Kidraw — Complete Project Reference

> **Purpose:** This is the single source of truth for the Kidraw canvas application. It documents every file, route, feature, component, and architectural decision currently implemented. Use this as a reference to know exactly what exists before planning or building new features.
>
> **Last Updated:** 2026-06-03

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
9. [State Management (Zustand Stores)](#9-state-management-zustand-stores)
10. [UI Components](#10-ui-components)
11. [Type System](#11-type-system)
12. [Design System & Styling](#12-design-system--styling)
13. [Real-Time Collaboration System](#13-real-time-collaboration-system)
14. [Comment & Threading System](#14-comment--threading-system)
15. [Library & Templates System](#15-library--templates-system)
16. [Feature Matrix (Implemented vs. Planned)](#16-feature-matrix-implemented-vs-planned)
17. [Environment Variables](#17-environment-variables)
18. [Configuration Files](#18-configuration-files)
19. [Deployment & Infrastructure](#19-deployment--infrastructure)
20. [Known Architectural Patterns & Decisions](#20-known-architectural-patterns--decisions)
21. [Development Phase History](#21-development-phase-history)

---

## 1. Project Overview

**Kidraw** is a production-grade, infinite canvas SaaS whiteboard application with real-time collaboration. It targets full-stack developers, system architects, product managers, and UI/UX designers who need a visual workspace for mapping architectures, wireframing UIs, and collaborating with teams.

| Attribute            | Value                                          |
|----------------------|------------------------------------------------|
| **Name**             | Kidraw (package name: `canvas-app`)            |
| **Version**          | `0.1.0`                                        |
| **Live URL**         | https://kidraw-canvas-app.vercel.app/          |
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
| Rough.js         | `^4.6.6`  | Hand-drawn/sketchy rendering engine              |

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
|--------------------------|-----------|---------------------------------------------|
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
| next-themes              | `^0.4.6`  | Theme provider (dark/light mode)           |

### Export & Document Generation

| Technology       | Version   | Purpose                                         |
|------------------|-----------|--------------------------------------------------|
| jsPDF            | `^4.2.1`  | Client-side PDF document generation              |

### Utilities

| Technology       | Version   | Purpose                                         |
|------------------|-----------|--------------------------------------------------|
| uuid             | `^11.0.0` | UUID v4 generation for unique IDs                |

---

## 3. Directory Structure & File Map

```
kidraw/
├── .env                                  # Environment variables (secrets, DB URL, OAuth keys)
├── .gitignore                            # Git ignore rules
├── AGENTS.md                             # AI agent rules (Next.js breaking-change warnings)
├── CLAUDE.md                             # AI assistant configuration
├── LICENSE                               # MIT License
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
│   └── schema.prisma                     # Database schema (User, Account, Session, Board, Comment)
│
├── docs/
│   ├── PROJECT_REFERENCE.md              # THIS FILE — complete project reference
│   ├── ARCHITECTURE_MIGRATION.md         # Architecture migration documentation
│   └── FUTURE_ROADMAP.md                 # Future roadmap documentation
│
└── src/
    ├── app/                              # Next.js App Router (THIN WRAPPERS ONLY)
    │   ├── globals.css                   # Global styles, CSS variables, Tailwind config
    │   ├── layout.tsx                    # Root layout (Inter font, SessionProvider, ThemeProvider, Toaster)
    │   ├── page.tsx                      # Home page (delegates to LandingPage/DashboardView)
    │   ├── auth/
    │   │   ├── signin/page.tsx           # Custom OAuth sign-in page
    │   │   └── signout/page.tsx          # Custom sign-out confirmation page
    │   ├── board/[id]/page.tsx           # Canvas workspace page (dynamic route)
    │   ├── info/
    │   │   ├── [slug]/page.tsx           # Generic info/legal placeholder pages
    │   │   ├── billing/page.tsx          # Billing & subscription page
    │   │   ├── blog/page.tsx             # Blog page (dedicated)
    │   │   ├── changelog/page.tsx        # Changelog page (dedicated)
    │   │   ├── community/page.tsx        # Community page (dedicated)
    │   │   ├── developers-api/page.tsx   # Developers API page (dedicated)
    │   │   ├── features/page.tsx         # Features showcase page (dedicated)
    │   │   ├── help-center/page.tsx      # Help center page (dedicated)
    │   │   ├── integrations/page.tsx     # Integrations page (dedicated)
    │   │   ├── keyboard-shortcuts/page.tsx # Keyboard shortcuts reference page (dedicated)
    │   │   ├── profile/page.tsx          # User profile management page
    │   │   ├── settings/page.tsx         # System settings page
    │   │   └── templates/page.tsx        # Templates page (dedicated)
    │   └── api/
    │       ├── auth/[...nextauth]/route.ts  # NextAuth API handler
    │       ├── board/[id]/
    │       │   ├── route.ts              # Board CRUD API
    │       │   ├── comments/route.ts     # Board comments API (GET, POST)
    │       │   └── presence/route.ts     # Real-time presence SSE & broadcast API
    │       └── comments/[id]/route.ts    # Comment reply & resolve API (POST, PATCH)
    │
    ├── features/                         # BUSINESS DOMAIN MODULES
    │   ├── auth/
    │   │   ├── config.ts                 # NextAuth configuration (providers, adapter, callbacks)
    │   │   └── types.ts                  # NextAuth session type augmentation
    │   ├── canvas/
    │   │   ├── types.ts                  # Layer, Tool, ShapeType, Camera types
    │   │   ├── constants.ts              # Pen/eraser sizes, zoom limits, export ratio, sticky/comment dims
    │   │   ├── constants/
    │   │   │   └── library.ts            # Template & UI component library definitions (679 lines)
    │   │   ├── store/
    │   │   │   ├── useCanvasStore.ts      # Zustand global canvas state store
    │   │   │   ├── useCommentStore.ts     # Zustand comment threads state store
    │   │   │   └── usePresenceStore.ts    # Zustand real-time cursor presence store
    │   │   ├── lib/
    │   │   │   ├── geometry.ts           # isPointInPolygon (lasso selection)
    │   │   │   ├── background.ts         # CSS background pattern generator
    │   │   │   ├── exportMermaid.ts       # Canvas-to-Mermaid.js diagram export
    │   │   │   ├── exportReact.ts         # Canvas-to-React/Tailwind code export
    │   │   │   └── pdf.ts                # PDF.js loader & multi-page renderer
    │   │   ├── utils/
    │   │   │   ├── routing.ts            # A* orthogonal pathfinding for smart arrow routing
    │   │   │   └── snapping.ts           # Magnetic snap-to-alignment guide engine
    │   │   ├── hooks/
    │   │   │   ├── useCanvasExport.ts     # Off-screen export pipeline hook (PNG/JPEG/SVG/PDF)
    │   │   │   ├── useKeyboardShortcuts.ts# Global keyboard shortcuts hook
    │   │   │   └── usePresence.ts         # SSE presence connection & cursor broadcast hook
    │   │   └── components/
    │   │       ├── Board.tsx             # Main Konva Stage orchestration (~77KB)
    │   │       ├── LayerRenderer.tsx     # Layer → Konva element mapper (~22KB)
    │   │       ├── RoughShape.tsx         # Rough.js sketch-mode shape renderer
    │   │       ├── CommentOverlay.tsx     # Canvas comment pins & thread popovers
    │   │       └── LiveCursors.tsx        # Real-time multi-user cursor overlay
    │   ├── dashboard/
    │   │   ├── actions/board-actions.ts   # Server action for board creation (with templates)
    │   │   └── components/
    │   │       ├── DashboardView.tsx      # Logged-in dashboard with board grid
    │   │       └── BoardGrid.tsx          # Board card grid with show-more toggle
    │   ├── landing/
    │   │   └── components/
    │   │       └── LandingPage.tsx        # Full SaaS landing page (hero + sections)
    │   └── user/
    │       └── actions/
    │           └── user-actions.ts        # Server actions: updateProfileName, updateNotificationSettings, deleteAccount, getUserSettings
    │
    ├── widgets/                          # COMPOSITE UI PANELS (canvas overlays)
    │   ├── Toolbar.tsx                   # Top-center drawing tools toolbar
    │   ├── ActionToolbar.tsx             # Top-right actions (save, export, lock, reset, code export)
    │   ├── PropertiesPanel.tsx           # Right-side color/opacity/background panel
    │   ├── ZoomHUD.tsx                   # Bottom-left zoom/minimap/share HUD
    │   ├── NavigationHUD.tsx             # Top-left logo/user navigation HUD
    │   ├── CommentSidebar.tsx            # Right-side comment threads sidebar panel
    │   ├── LibrarySidebar.tsx            # Left-side templates & UI library sidebar
    │   ├── TimeTravelSlider.tsx          # Bottom-center history playback slider
    │   └── ExportCodeModal.tsx           # Code export dialog (React/Mermaid)
    │
    ├── shared/                           # CROSS-CUTTING INFRASTRUCTURE
    │   ├── lib/
    │   │   ├── utils.ts                  # cn() utility (clsx + tailwind-merge)
    │   │   └── prisma.ts                 # Prisma client singleton (dev hot-reload safe)
    │   ├── constants/index.ts            # App-wide constants (colors, limits)
    │   └── components/
    │       ├── ToolButton.tsx            # Unified tool button (consolidated from 4 duplicates)
    │       ├── Footer.tsx               # Shared footer component
    │       ├── GlobalNavbar.tsx          # Shared global navigation bar (auth-aware, theme toggle)
    │       ├── KidrawLogo.tsx            # Reusable branded logo component (SVG + text)
    │       └── ui/                      # Shadcn UI primitives
    │           ├── avatar.tsx           # Avatar component (Radix-based)
    │           ├── button.tsx           # Button component (CVA variants)
    │           ├── dialog.tsx           # Dialog/modal component (Radix-based)
    │           ├── dropdown-menu.tsx    # Dropdown menu component (Radix-based)
    │           ├── sonner.tsx           # Toast notification wrapper
    │           └── tooltip.tsx          # Tooltip component (Radix-based)
    │
    └── providers/
        ├── SessionProvider.tsx           # NextAuth client session provider wrapper
        └── ThemeProvider.tsx             # next-themes ThemeProvider wrapper (dark/light/system)
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
| `receiveEmails` | `Boolean`  | `@default(true)`     | Email notification preference  |
| `accounts`      | `Account[]`|                      | Linked OAuth accounts          |
| `sessions`      | `Session[]`|                      | Active sessions                |
| `boards`        | `Board[]`  |                      | User's canvas boards           |
| `comments`      | `Comment[]`|                      | User's comments                |

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
| `comments`        | `Comment[]`|                                      | Board's comment threads          |
| `createdAt`       | `DateTime` | `@default(now())`                    | Creation timestamp               |
| `updatedAt`       | `DateTime` | `@updatedAt`                         | Last modification timestamp      |

#### `Comment` (Canvas Threads & Commenting)
| Field       | Type       | Attributes                           | Description                      |
|-------------|------------|--------------------------------------|----------------------------------|
| `id`        | `String`   | `@id @default(cuid())`               | Primary key                      |
| `content`   | `String`   |                                      | Comment text content             |
| `x`         | `Float`    |                                      | Canvas X coordinate              |
| `y`         | `Float`    |                                      | Canvas Y coordinate              |
| `resolved`  | `Boolean`  | `@default(false)`                    | Whether thread is resolved       |
| `boardId`   | `String`   | FK → `Board.id` (cascade delete)     | Parent board                     |
| `authorId`  | `String`   | FK → `User.id` (cascade delete)      | Comment author                   |
| `parentId`  | `String?`  | FK → `Comment.id` (self-ref, cascade)| Parent comment (for replies)     |
| `replies`   | `Comment[]`| `@relation("CommentThread")`         | Nested replies                   |
| `createdAt` | `DateTime` | `@default(now())`                    | Creation timestamp               |
| `updatedAt` | `DateTime` | `@updatedAt`                         | Last modification timestamp      |

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
| `/info/features`        | `src/app/info/features/page.tsx`   | Dedicated       | No            | Features showcase page                                   |
| `/info/keyboard-shortcuts` | `src/app/info/keyboard-shortcuts/page.tsx` | Dedicated | No      | Keyboard shortcuts reference                             |
| `/info/templates`       | `src/app/info/templates/page.tsx`  | Dedicated       | No            | Templates showcase page                                  |
| `/info/blog`            | `src/app/info/blog/page.tsx`       | Dedicated       | No            | Blog page                                                |
| `/info/changelog`       | `src/app/info/changelog/page.tsx`  | Dedicated       | No            | Changelog page                                           |
| `/info/community`       | `src/app/info/community/page.tsx`  | Dedicated       | No            | Community page                                           |
| `/info/developers-api`  | `src/app/info/developers-api/page.tsx` | Dedicated   | No            | Developer API docs page                                  |
| `/info/help-center`     | `src/app/info/help-center/page.tsx`| Dedicated       | No            | Help center page                                         |
| `/info/integrations`    | `src/app/info/integrations/page.tsx`| Dedicated      | No            | Integrations page                                        |
| `/info/[slug]`          | `src/app/info/[slug]/page.tsx`     | Server Component| No            | Catch-all for remaining info/legal pages (placeholder)   |

> \* Board route loads canvas data from the API. Board is accessible without auth, but saving requires authentication.

### Info Slug Pages (Placeholder — catch-all only)

The following slugs still use the catch-all `[slug]` template:

| Category  | Slugs                                                         |
|-----------|---------------------------------------------------------------|
| Legal     | `/info/privacy-policy`, `/info/terms-of-service`, `/info/cookie-policy`, `/info/security` |

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

### `GET /api/board/[id]/comments`
- **Auth:** Not required
- **Behavior:**
  - Fetches all top-level comments for the board (where `parentId` is null)
  - Includes author info (id, name, image) and nested replies with their authors
  - Returns comments ordered by `createdAt desc`
- **Config:** `dynamic = 'force-dynamic'`

### `POST /api/board/[id]/comments`
- **Auth:** Required (returns 401 if no session)
- **Body:** `{ content: string, x: number, y: number }`
- **Behavior:**
  - Creates a new top-level comment thread at the specified canvas coordinates
  - Returns the created comment with author info and empty replies array
- **Validation:** Requires `content`, `x` (number), `y` (number)

### `GET /api/board/[id]/presence`
- **Auth:** Guest-supported (uses `guestId` query param)
- **Behavior:**
  - Establishes a Server-Sent Events (SSE) stream for real-time presence
  - Maintains global `clientsMap` on `globalThis` (dev-safe singleton)
  - Sends periodic keepalive pings every 15 seconds
  - Broadcasts disconnect events when client closes connection
  - Delivers cursor positions, drawing updates (`draw-add`, `draw-update`, `draw-update-batch`, `draw-remove`), and chat text
- **Config:** `dynamic = 'force-dynamic'`

### `POST /api/board/[id]/presence`
- **Auth:** Guest-supported (uses `guestId` query param)
- **Body:** Flexible JSON (cursor position, drawing updates, or chat text)
- **Behavior:**
  - Broadcasts the payload to all other SSE clients on the same board
  - Skips broadcasting to the sender

### `POST /api/comments/[id]`
- **Auth:** Required (returns 401 if no session)
- **Body:** `{ content: string }`
- **Behavior:**
  - Adds a reply to the comment thread identified by `id`
  - Inherits board coordinates from parent comment
  - Returns the created reply with author info

### `PATCH /api/comments/[id]`
- **Auth:** Required (returns 401 if no session)
- **Body:** `{ resolved: boolean }`
- **Behavior:**
  - Toggles the resolved status on a comment thread
  - Returns the updated comment with author, replies

---

## 8. Canvas Engine & Drawing System

### Core Architecture

The canvas uses **React-Konva** (a React wrapper around Konva.js) for declarative HTML5 Canvas rendering. The `Board.tsx` component is dynamically imported with `ssr: false` to avoid server-side rendering issues with the `window` object.

A **Sketch Mode** toggle enables hand-drawn/sketchy rendering via **Rough.js** — shapes and lines render with a hand-drawn aesthetic instead of clean geometric edges.

### Supported Drawing Tools

| Tool               | Type Key          | Behavior                                                          |
|--------------------|-------------------|----------------------------------------------------------------------|
| **Select (Box)**   | `select`          | Click to select single layer; drag to box-select multiple layers   |
| **Select (Lasso)** | `lasso`           | Freehand lasso selection using ray-casting point-in-polygon algo   |
| **Hand (Pan)**     | `hand`            | Click-drag to pan the infinite canvas                              |
| **Pen (Freehand)** | `pen`             | Freehand drawing with tension-smoothed lines                       |
| **Pencil**         | `pencil`          | Rough/sketchy freehand line (rendered via Rough.js in sketch mode) |
| **Shapes**         | `shape`           | Draw geometric shapes (see Shape Types below)                      |
| **Text**           | `text`            | Click to place text; inline textarea editing with Enter to confirm |
| **Image**          | `image`           | Upload image via file picker; renders as Base64 on canvas          |
| **Laser Pointer**  | `laser`           | Red fading laser trail for presentations                           |
| **Eraser**         | `eraser`          | Pixel eraser using `globalCompositeOperation: destination-out`     |
| **Object Eraser**  | `object-eraser`   | Click-to-delete entire layers/objects                              |
| **Sticky Note**    | `sticky`          | Auto-scaling text inside a styled rectangle container              |
| **Comment**        | `comment`         | Place threaded comment pins on canvas (persisted to database)      |
| **Frame**          | `frame`           | Artboards/Frames for grouping and organizing canvas content        |
| **PDF**            | `pdf`             | Embedded PDF pages with custom pagination controls                 |
| **Code**           | `code`            | Embedded code snippets/blocks                                      |
| **Embed**          | `embed`           | Embedded external content (URL-based)                              |

### Supported Shape Types

| Shape          | Type Key         | Konva Element      | Rendering                                     |
|----------------|------------------|--------------------|------------------------------------------------|
| Rectangle      | `rectangle`      | `Rect`             | Width × Height with corner radius              |
| Ellipse        | `ellipse`        | `Ellipse`          | RadiusX × RadiusY from center                  |
| Triangle       | `triangle`       | `RegularPolygon`   | 3-sided regular polygon                        |
| Diamond        | `diamond`        | `RegularPolygon`   | 4-sided regular polygon (rotated square)       |
| Hexagon        | `hexagon`        | `RegularPolygon`   | 6-sided regular polygon                        |
| Star           | `star`           | `Star`             | 5-pointed star with inner/outer radius         |
| Arrow          | `arrow`          | `Arrow`            | Line with arrowhead pointer + smart routing    |
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
| Sticky-note comments          | ✅     | Yellow sticky notes with text editing; 5 color options                            |
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
| Keyboard Shortcuts            | ✅     | Full implementation: copy, paste, undo, redo, delete, group/ungroup, z-order, single-key tool switching |
| Magnetic Smart Guides         | ✅     | Snaps objects into alignment with nearby objects horizontally and vertically       |
| Contextual Alignment Tools    | ✅     | Distribute evenly, align edges (left/center/right/top/middle/bottom) via store    |
| Laser pointer                 | ✅     | Red trail with fading animation (30ms interval decay)                             |
| Per-shape opacity             | ✅     | Opacity slider (10% – 100%) applies to new and selected shapes                   |
| Custom fill colors            | ✅     | Native color picker + 8 preset colors + 5 recent custom colors                   |
| Background patterns           | ✅     | Solid, Dotted grid, Line grid; CSS-rendered (no Konva overhead)                   |
| Background color picker       | ✅     | Full color picker for canvas background                                           |
| Undo/Redo                     | ✅     | Full history stack; undo/redo with state snapshots                                |
| Time Travel / History Slider  | ✅     | Visual slider to scrub through history; play/pause animation of history           |
| Canvas lock/unlock            | ✅     | Lock toggle prevents all drawing & editing                                        |
| Clear/reset canvas            | ✅     | Confirmation dialog → clears all layers (with undo support)                       |
| Export PNG                    | ✅     | Off-screen canvas compilation with background patterns baked in                   |
| Export JPEG                   | ✅     | Same off-screen compilation pipeline                                              |
| Export SVG                    | ✅     | Full SVG generation with background patterns, text, images, shapes                |
| Export PDF                    | ✅     | jsPDF-based export with proper orientation and pixel ratio                        |
| Export React/Tailwind Code    | ✅     | Converts canvas layers to React JSX + Tailwind CSS code                           |
| Export Mermaid.js Diagram     | ✅     | Converts labeled shapes + connected arrows into Mermaid flowchart syntax          |
| Cloud save                   | ✅     | POST to `/api/board/[id]` with toast feedback                                    |
| Cloud load                   | ✅     | GET from `/api/board/[id]` on page mount                                         |
| Window resize handling        | ✅     | Canvas auto-resizes to fill viewport                                             |
| Touch support                 | ✅     | `onTouchStart`, `onTouchMove`, `onTouchEnd` handlers                             |
| Sketch Mode (Rough.js)        | ✅     | Toggle hand-drawn aesthetic for all shapes via `RoughShape` component             |
| Layer z-index ordering        | ✅     | Bring to front, send to back, bring forward, send backward                       |
| Layer grouping/ungrouping     | ✅     | `Ctrl+G` to group, `Ctrl+Shift+G` to ungroup; parent-child relationships         |
| Copy/Paste layers             | ✅     | `Ctrl+C` / `Ctrl+V` with 20px offset on paste; consecutive paste cascading       |
| Smart Arrow Routing           | ✅     | A* orthogonal pathfinding that routes arrows around obstacles                     |
| Real-time collaboration       | ✅     | SSE-based presence with live cursor positions & drawing sync                      |
| Threaded Canvas Comments      | ✅     | Database-persisted comment threads with pins, replies, resolve toggle             |
| Templates & UI Library        | ✅     | Pre-built flowcharts, kanban, mind maps, UI components insertable from sidebar    |
| Interactive minimap           | ✅     | Minimap with drag-to-navigate in ZoomHUD                                         |
| Minimap drag-to-navigate      | ✅     | Drag the viewport indicator within the minimap to pan                             |
| Zoom percentage display       | ✅     | Zoom level display with click-to-reset in ZoomHUD                                |
| Share dialog                  | ✅     | Copy link + role selector UI (Viewer/Commenter/Editor)                            |
| Dark/Light theme toggle       | ✅     | `next-themes` integrated via `ThemeProvider`; toggle in `GlobalNavbar`            |

### Export Engine Architecture

The export system supports **five formats** (PNG, JPEG, SVG, PDF, Code):

**Raster (PNG/JPEG):**
1. Compute bounding box of all layers (with 40px padding)
2. Temporarily reset Konva stage scale/position to 1:1
3. Get transparent drawing from bounding box via `stageRef.toDataURL()`
4. Restore stage state
5. Create off-screen `<canvas>` at 2× pixel ratio
6. Draw solid background color
7. Natively render CSS background patterns (dots/grid) with `ctx.arc()` / `ctx.moveTo()`
8. Overlay the Konva drawing
9. Export as PNG/JPEG blob via `showSaveFilePicker` API (with fallback to `<a download>`)

**SVG:**
- Generates a standalone SVG string with background, patterns (via `<defs>`/`<pattern>`), and all layers converted to SVG elements
- Supports rectangles, ellipses, pens, text, images, stickies, and frames

**PDF:**
- Uses jsPDF to create a PDF with the raster export as an embedded image
- Auto-detects landscape/portrait orientation

**Code Export (React / Mermaid):**
- **React/Tailwind:** Converts visible layers into absolute-positioned `<div>` elements with Tailwind classes
- **Mermaid.js:** Maps labeled shapes (rectangle → `[]`, ellipse → `()`, diamond → `{}`, hexagon → `{{}}`) and connected arrows to Mermaid graph syntax

---

## 9. State Management (Zustand Stores)

### Store 1: `useCanvasStore`

**File:** `src/features/canvas/store/useCanvasStore.ts`

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
| `activeOpacity`     | `number`                             | `0.25`             | Opacity for new/selected shapes                 |
| `isSketchMode`      | `boolean`                            | `false`            | Rough.js sketch mode toggle                     |
| `permissionRole`    | `'owner' \| 'editor' \| 'viewer'`   | `'owner'`          | User's role on the board                        |
| `activeGuides`      | `GuideLine[]`                        | `[]`               | Active magnetic snapping guide lines            |
| `history`           | `Layer[][]`                          | `[[]]`             | Undo/redo history stack                         |
| `historyStep`       | `number`                             | `0`                | Current position in history                     |
| `exportCodeContent` | `string \| null`                     | `null`             | Generated code for export modal                 |
| `exportType`        | `'react' \| 'mermaid' \| null`       | `null`             | Type of code export                             |

#### Actions

| Action                | Parameters                              | Description                                      |
|-----------------------|-----------------------------------------|---------------------------------------------------|
| `setActiveTool`       | `(tool: Tool)`                          | Switch active drawing tool                        |
| `setActiveColor`      | `(color: Color)`                        | Change active color (also applies to selected layer) |
| `setBackgroundColor`  | `(color: string)`                       | Change canvas background color                    |
| `setIsDrawing`        | `(isDrawing: boolean)`                  | Set drawing state                                 |
| `setBoardId`          | `(id: string)`                          | Set current board ID                              |
| `setSelectedLayerId`  | `(id: string \| null)`                  | Select/deselect single layer                      |
| `setSelectedLayerIds` | `(ids: string[])`                       | Set multi-selection                               |
| `setBgPattern`        | `(pattern: ...)`                        | Change background pattern                         |
| `setActiveEraserType` | `(type: ...)`                           | Switch eraser mode (also sets activeTool)         |
| `setEraserSize`       | `(size: number)`                        | Change eraser size                                |
| `addCustomColor`      | `(color: string)`                       | Add to recent colors (max 5, deduped)             |
| `removeLayer`         | `(id: string, isRemote?: boolean)`      | Delete a layer by ID; broadcasts if not remote    |
| `setCamera`           | `(pos: {x, y})`                         | Set camera pan position                           |
| `setZoom`             | `(zoom: number)`                        | Set zoom level                                    |
| `toggleLock`          | `()`                                    | Toggle canvas lock state                          |
| `setActiveShape`      | `(shape: ShapeType)`                    | Set active shape type (also sets tool to 'shape') |
| `setPenSize`          | `(size: number)`                        | Change pen stroke width                           |
| `setOpacity`          | `(opacity: number)`                     | Change active opacity                             |
| `toggleSketchMode`    | `()`                                    | Toggle Rough.js sketch rendering mode             |
| `setPermissionRole`   | `(role: ...)`                           | Set permission role                               |
| `setExportCodeContent`| `(code: string \| null, type?: ...)`    | Set code export modal content                     |
| `setActiveGuides`     | `(guides: GuideLine[])`                 | Set active snapping guides                        |
| `addLayer`            | `(layer: Layer, isRemote?: boolean)`    | Add a new layer; auto-assigns zIndex; broadcasts  |
| `addLayers`           | `(layers: Layer[])`                     | Batch-add layers (for library/template insertion)  |
| `updateLayer`         | `(id, attrs, isRemote?)`               | Update layer properties; throttled broadcast      |
| `bringToFront`        | `(id: string)`                          | Move layer to highest zIndex                      |
| `sendToBack`          | `(id: string)`                          | Move layer to lowest zIndex                       |
| `bringForward`        | `(id: string)`                          | Move layer one step up in z-order                 |
| `sendBackward`        | `(id: string)`                          | Move layer one step down in z-order               |
| `groupLayers`         | `(ids: string[])`                       | Create a group layer wrapping selected layers     |
| `ungroupLayers`       | `(groupId: string)`                     | Dissolve group, releasing children                |
| `alignSelectedLayers` | `(type: ...)`                           | Align/distribute selected layers (8 modes)        |
| `saveHistory`         | `()`                                    | Snapshot current layers to history stack           |
| `undo`                | `()`                                    | Step back in history                              |
| `redo`                | `()`                                    | Step forward in history                           |
| `jumpToHistoryStep`   | `(step: number)`                        | Jump to any history step (for time travel slider) |
| `clear`               | `()`                                    | Clear all layers (saves to history)               |
| `saveToCloud`         | `(boardId: string)`                     | POST layers + background to API                   |
| `loadFromCloud`       | `(boardId: string)`                     | GET board data from API and populate store         |

#### Real-Time Broadcasting

The store integrates real-time collaboration via helper functions:
- **`broadcastUpdate`**: POSTs drawing events to the presence API
- **`throttledBroadcastUpdate`**: Batches layer updates every ~85ms to prevent network spam
- **Guest ID**: Generated via `sessionStorage` for unauthenticated users

### Store 2: `useCommentStore`

**File:** `src/features/canvas/store/useCommentStore.ts`

| Property / Action    | Type                                  | Description                                    |
|----------------------|---------------------------------------|------------------------------------------------|
| `comments`           | `CanvasComment[]`                     | All comments for the current board             |
| `isLoading`          | `boolean`                             | Comment fetch loading state                    |
| `activeThreadId`     | `string \| null`                      | Currently expanded thread                      |
| `isSidebarOpen`      | `boolean`                             | Whether comment sidebar is open                |
| `fetchComments`      | `(boardId) => Promise`                | Fetch all comments from API                    |
| `addComment`         | `(boardId, content, x, y) => Promise` | Create new comment thread at coordinates       |
| `addReply`           | `(commentId, content) => Promise`     | Reply to existing thread                       |
| `toggleResolved`     | `(commentId, resolved) => Promise`    | Mark thread as resolved/unresolved             |

### Store 3: `usePresenceStore`

**File:** `src/features/canvas/store/usePresenceStore.ts`

| Property / Action  | Type                                 | Description                                    |
|--------------------|--------------------------------------|------------------------------------------------|
| `others`           | `Record<string, PresenceUser>`       | Map of remote user presence data               |
| `updatePresence`   | `(userId, data) => void`            | Add/update a remote user's cursor/info         |
| `removePresence`   | `(userId) => void`                  | Remove a disconnected user                     |
| `clearPresence`    | `() => void`                        | Clear all presence data                        |

**`PresenceUser` type:** `{ userId, x, y, name, image, color, text, lastActive }`

Cursor colors are deterministically assigned from an 8-color palette based on userId hash.

---

## 10. UI Components

### Application Components

| Component              | File                                          | Type   | Description                                                          |
|------------------------|-----------------------------------------------|--------|-----------------------------------------------------------------------|
| `Board`                | `src/features/canvas/components/Board.tsx`    | Client | Main Konva Stage; handles all drawing, selection, and erasing logic (~77KB) |
| `LayerRenderer`        | `src/features/canvas/components/LayerRenderer.tsx` | Client | Layer → Konva element mapper; handles all layer types (~22KB)       |
| `RoughShape`           | `src/features/canvas/components/RoughShape.tsx`| Client | Rough.js hand-drawn shape renderer for sketch mode                  |
| `CommentOverlay`       | `src/features/canvas/components/CommentOverlay.tsx` | Client | Canvas comment pin markers with thread popovers & new comment input |
| `LiveCursors`          | `src/features/canvas/components/LiveCursors.tsx`| Client | Real-time remote user cursors with name tags & chat bubbles         |
| `BoardGrid`            | `src/features/dashboard/components/BoardGrid.tsx` | Client | Responsive grid of board cards with show-more/less toggle           |
| `DashboardView`        | `src/features/dashboard/components/DashboardView.tsx` | Client | Full dashboard with board grid, new board dialog with templates    |
| `LandingPage`          | `src/features/landing/components/LandingPage.tsx` | Client | Full SaaS landing page (hero + sections)                          |
| `Toolbar`              | `src/widgets/Toolbar.tsx`                     | Client | Top-center drawing tools (Responsive & collapsible on mobile)       |
| `ActionToolbar`        | `src/widgets/ActionToolbar.tsx`               | Client | Top-right actions (save, export PNG/JPEG/SVG/PDF, code export, lock, reset) |
| `PropertiesPanel`      | `src/widgets/PropertiesPanel.tsx`             | Client | Right-side panel (opacity, background, color) (Collapsible)         |
| `ZoomHUD`              | `src/widgets/ZoomHUD.tsx`                     | Client | Bottom-left HUD (share, minimap, zoom in/out, zoom percentage)      |
| `NavigationHUD`        | `src/widgets/NavigationHUD.tsx`               | Client | Top-left HUD (logo, user avatar, navigation dropdown)               |
| `CommentSidebar`       | `src/widgets/CommentSidebar.tsx`              | Client | Right-side comment threads list with tabs (Open/Resolved), reply input, resolve toggle |
| `LibrarySidebar`       | `src/widgets/LibrarySidebar.tsx`              | Client | Left-side templates & UI library with search, tabs (Templates/Components/Shortcuts) |
| `TimeTravelSlider`     | `src/widgets/TimeTravelSlider.tsx`            | Client | Bottom-center history playback slider with play/pause animation     |
| `ExportCodeModal`      | `src/widgets/ExportCodeModal.tsx`             | Client | Code export dialog showing React/Tailwind or Mermaid.js code with copy button |
| `GlobalNavbar`         | `src/shared/components/GlobalNavbar.tsx`      | Client | Shared navbar with auth-aware menu, theme toggle, mobile hamburger  |
| `KidrawLogo`           | `src/shared/components/KidrawLogo.tsx`        | Client | Reusable branded logo (gradient icon + text, configurable)          |
| `Footer`               | `src/shared/components/Footer.tsx`            | Client | Shared footer with product/resources/legal links                    |
| `ToolButton`           | `src/shared/components/ToolButton.tsx`        | Client | Unified tool button component (tooltip-wrapped)                     |
| `SessionProvider`      | `src/providers/SessionProvider.tsx`           | Client | Wraps app with NextAuth `SessionProvider`                           |
| `ThemeProvider`        | `src/providers/ThemeProvider.tsx`              | Client | Wraps app with next-themes `ThemeProvider` (dark/light/system)      |

### Shadcn UI Primitives (in `shared/components/ui/`)

| Component          | File                          | Usage                                                    |
|--------------------|-------------------------------|-----------------------------------------------------------|
| `Avatar`           | `ui/avatar.tsx`               | User avatars (dashboard nav, profile page, board HUD)     |
| `Button`           | `ui/button.tsx`               | All buttons app-wide (CVA variants: default, ghost, outline)|
| `Dialog`           | `ui/dialog.tsx`               | Modals (new board, reset canvas, delete account, share, code export) |
| `DropdownMenu`     | `ui/dropdown-menu.tsx`        | User menu (GlobalNavbar, NavigationHUD)                   |
| `Sonner`           | `ui/sonner.tsx`               | Toast notifications (save, export, settings)               |
| `Tooltip`          | `ui/tooltip.tsx`              | Tool button labels (all toolbars)                          |

---

## 11. Type System

### File: `src/features/canvas/types.ts`

```typescript
export type Color = string;

export type ShapeType = 'rectangle' | 'ellipse' | 'triangle' | 'diamond'
                      | 'star' | 'arrow' | 'straight-line' | 'hexagon';

export type LayerType = ShapeType | 'pen' | 'pencil' | 'text' | 'eraser'
                      | 'comment' | 'image' | 'embed' | 'sticky' | 'frame'
                      | 'pdf' | 'group' | 'code';

export type Tool = 'select' | 'lasso' | 'hand' | 'shape' | 'pen' | 'pencil'
                 | 'text' | 'eraser' | 'object-eraser' | 'comment' | 'laser'
                 | 'image' | 'embed' | 'sticky' | 'frame' | 'pdf' | 'code';

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
    points?: number[];         // For pen/eraser freehand paths
    text?: string;             // For text/comment/sticky/code layers
    eraserSize?: number;       // Pixel eraser brush size
    penSize?: number;          // Pen stroke width
    opacity?: number;          // Per-shape opacity (0-1)
    src?: string;              // Base64 image data for image layers
    embedUrl?: string;         // URL for embed layers
    startBinding?: { elementId: string; snapPoint: 'top' | 'right' | 'bottom' | 'left' };
    endBinding?: { elementId: string; snapPoint: 'top' | 'right' | 'bottom' | 'left' };
    parentId?: string;         // Group/frame parent ID
    frameId?: string;          // Frame container ID
    fontSize?: number;         // Text font size
    pdfPages?: string[];       // PDF page data URLs
    pdfPageIndex?: number;     // Current PDF page index
    zIndex?: number;           // Z-order index for layer ordering
    codeLanguage?: string;     // Programming language for code layers
};
```

### File: `src/features/canvas/utils/snapping.ts`

```typescript
export type GuideLine = {
    orientation: 'V' | 'H';
    line: [number, number, number, number]; // [x1, y1, x2, y2]
};
```

### File: `src/features/canvas/store/useCommentStore.ts`

```typescript
export type CommentAuthor = { id: string; name: string | null; image: string | null };
export type CommentReply = { id: string; content: string; author: CommentAuthor; createdAt: string };
export type CanvasComment = {
    id: string; content: string; x: number; y: number;
    resolved: boolean; boardId: string; author: CommentAuthor;
    replies: CommentReply[]; createdAt: string; updatedAt: string;
};
```

### File: `src/features/canvas/store/usePresenceStore.ts`

```typescript
export type PresenceUser = {
    userId: string; x: number; y: number;
    name: string | null; image: string | null;
    color: string; text: string; lastActive: number;
};
```

### File: `src/features/auth/types.ts`

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

### Theme System

- **Provider:** `next-themes` via `ThemeProvider` wrapper
- **Default Theme:** `dark`
- **Toggle:** Sun/Moon button in `GlobalNavbar` switches between light/dark
- **System Support:** `enableSystem` is true; respects OS preference
- **Implementation:** CSS variables adapt based on `class="dark"` on `<html>`

### Design Patterns

- **Glassmorphism:** Frosted glass panels with `backdrop-blur-xl` and semi-transparent backgrounds
- **Aurora Glow:** Gradient blurred circles (`blur-[150px]`) for ambient lighting effects
- **Dot Grid Background:** Radial gradient patterns for the landing page hero section
- **3D Perspective:** Hero canvas mockup with CSS `perspective` and `rotate-x/y` transforms
- **Micro-interactions:** `hover:scale-[1.02]`, `hover:-translate-y-2`, `group-hover:` transitions
- **Cursor Chat Animation:** Custom `animate-cursor-chat-pop` for cursor chat bubbles

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

## 13. Real-Time Collaboration System

### Architecture

The real-time system uses **Server-Sent Events (SSE)** for unidirectional server→client streaming and **HTTP POST** for client→server updates. No WebSocket library is required.

### Components

| Component              | File                                        | Purpose                                          |
|------------------------|---------------------------------------------|--------------------------------------------------|
| Presence API (GET)     | `src/app/api/board/[id]/presence/route.ts` | SSE endpoint; maintains global client map         |
| Presence API (POST)    | `src/app/api/board/[id]/presence/route.ts` | Broadcast cursor/drawing updates to other clients |
| `usePresence` hook     | `src/features/canvas/hooks/usePresence.ts` | Client-side SSE connection & throttled broadcasts |
| `usePresenceStore`     | `src/features/canvas/store/usePresenceStore.ts` | Remote cursor state management              |
| `LiveCursors`          | `src/features/canvas/components/LiveCursors.tsx` | Visual cursor rendering with labels & chat  |

### Data Flow

1. **Connection:** Client connects to `GET /api/board/[id]/presence?guestId=xxx` → SSE stream opened
2. **Cursor Updates:** Client POSTs cursor position every 250ms (throttled) with name, image, text
3. **Drawing Sync:** `addLayer`, `updateLayer`, `removeLayer` actions broadcast events (`draw-add`, `draw-update`, `draw-update-batch`, `draw-remove`) to the presence API
4. **Reception:** SSE delivers events to all other connected clients on the same board
5. **Rendering:** `LiveCursors` renders Figma-style colored cursor SVGs with username tags and optional chat bubbles
6. **Cleanup:** 6-second idle timeout auto-removes stale cursors; disconnect events clear presence

### Guest Support

Unauthenticated users get a deterministic guest ID stored in `sessionStorage` (`kidraw_guest_id`), allowing them to participate in real-time collaboration without signing in.

---

## 14. Comment & Threading System

### Architecture

Canvas comments are **database-persisted** (Prisma `Comment` model) with spatial coordinates, threaded replies, and resolved/unresolved state.

### Components

| Component           | File                                           | Purpose                                         |
|---------------------|------------------------------------------------|--------------------------------------------------|
| `CommentOverlay`    | `src/features/canvas/components/CommentOverlay.tsx` | Renders comment pins on canvas; handles new comment input |
| `CommentSidebar`    | `src/widgets/CommentSidebar.tsx`               | List view of all threads with Open/Resolved tabs |
| `useCommentStore`   | `src/features/canvas/store/useCommentStore.ts` | Zustand store for comment CRUD operations        |
| Comments API        | `src/app/api/board/[id]/comments/route.ts`     | GET (fetch), POST (create) board comments        |
| Reply API           | `src/app/api/comments/[id]/route.ts`           | POST (reply), PATCH (toggle resolved)            |

### Features

- **Spatial Pins:** Comments are placed at canvas coordinates and rendered as floating pins
- **Pin Styling:** Unresolved = violet with ping animation; Resolved = emerald with checkmark
- **Hover Preview:** Shows author avatar, name, timestamp, and truncated content
- **Thread Popover:** Click a pin to expand full thread with all replies
- **Reply Input:** Inline reply with Enter-to-submit
- **Resolve Toggle:** Mark threads as resolved/unresolved from pin or sidebar
- **Sidebar Navigation:** Click "Go to comment" icon pans the canvas to center on that comment
- **Badge Count:** Pin shows reply count; sidebar trigger shows open comment count

---

## 15. Library & Templates System

### Architecture

The library system provides **pre-built templates and UI components** that can be inserted onto the canvas at the current viewport center.

### Components

| Component         | File                                           | Purpose                                         |
|-------------------|------------------------------------------------|--------------------------------------------------|
| `LibrarySidebar`  | `src/widgets/LibrarySidebar.tsx`               | UI for browsing, searching, and inserting items  |
| `library.ts`      | `src/features/canvas/constants/library.ts`     | Template & component definitions (679 lines)     |

### Available Templates

| Template       | Description                                                      |
|----------------|------------------------------------------------------------------|
| **Flowchart**  | Process flowchart with Start → Decision → Yes/No branches; uses frames, rectangles, diamonds, arrows |
| **Kanban Board** | 3-column board (To Do / In Progress / Done) with nested frames and pre-filled sticky notes |
| **Mind Map**   | Central topic with 3 radiating branches; uses ellipses and connecting arrows |

### Available UI Components

| Component          | Description                                              |
|--------------------|----------------------------------------------------------|
| **Button**         | CTA button with label text                               |
| **Input Field**    | Text input with placeholder                              |
| **Card Container** | Layout card with title and body text                     |
| **Toggle Switch**  | Green active toggle with knob                            |
| **Checkbox Option**| Checked checkbox with descriptive label                  |
| **Dropdown Selector** | Dropdown control with indicator                       |

### Board Creation Templates

The `createNewBoard` server action supports template-based board creation:

| Template        | Description                                                      |
|-----------------|------------------------------------------------------------------|
| **Blank**       | Empty board (default)                                            |
| **Flowchart**   | Pre-populated with Start → Decision → End flow using connected arrows |
| **Wireframe**   | Browser frame with header, sidebar, hero section, and card grid  |
| **Architecture**| System architecture diagram with Web Client → Services → Database |

### Library Sidebar Tabs

1. **Templates** — Pre-built multi-layer templates with miniature HTML previews
2. **Components** — Single UI component widgets
3. **Shortcuts** — Full keyboard shortcuts reference (23 shortcuts listed)

---

## 16. Feature Matrix (Implemented vs. Planned)

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
| **Dashboard**     | "New Board" creation dialog with template selection            |
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
| **Canvas**        | Sticky-note comments (5 color options)                         |
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
| **Canvas**        | Time travel history slider with play/pause                     |
| **Canvas**        | Canvas lock/unlock toggle                                      |
| **Canvas**        | Reset canvas (with confirmation dialog)                        |
| **Canvas**        | Export to PNG (off-screen compilation)                          |
| **Canvas**        | Export to JPEG (off-screen compilation)                         |
| **Canvas**        | Export to SVG (full SVG generation)                             |
| **Canvas**        | Export to PDF (via jsPDF)                                      |
| **Canvas**        | Export to React/Tailwind code                                  |
| **Canvas**        | Export to Mermaid.js diagram code                              |
| **Canvas**        | Cloud save (manual)                                            |
| **Canvas**        | Cloud load (on page mount)                                     |
| **Canvas**        | Touch event support                                            |
| **Canvas**        | Window resize handling                                         |
| **Canvas**        | Sketch mode (Rough.js hand-drawn rendering)                    |
| **Canvas**        | Layer z-index ordering (4 operations)                          |
| **Canvas**        | Layer grouping / ungrouping (Ctrl+G / Ctrl+Shift+G)           |
| **Canvas**        | Copy/Paste layers (Ctrl+C / Ctrl+V)                           |
| **Canvas**        | Delete selected (Delete / Backspace)                           |
| **Canvas**        | Smart arrow routing (A* pathfinding)                           |
| **Canvas**        | Arrow element binding (snap points)                            |
| **Canvas**        | Magnetic smart guides (snap-to-alignment)                      |
| **Canvas**        | Contextual alignment (6 align + 2 distribute)                  |
| **Canvas**        | Interactive minimap with drag-to-navigate                      |
| **Canvas**        | Zoom percentage display & reset                                |
| **Canvas**        | Share dialog (copy link + role selector UI)                    |
| **Canvas**        | Keyboard shortcuts (23 shortcuts implemented)                  |
| **Collab**        | Real-time cursor presence (SSE-based)                          |
| **Collab**        | Live cursor rendering with Figma-style name tags               |
| **Collab**        | Cursor chat bubbles                                            |
| **Collab**        | Real-time drawing sync (add/update/remove broadcast)           |
| **Collab**        | Guest support (no auth required for presence)                  |
| **Collab**        | Throttled updates (250ms cursor, 85ms drawing)                 |
| **Comments**      | Database-persisted threaded comments                           |
| **Comments**      | Spatial comment pins on canvas                                 |
| **Comments**      | Comment thread popovers with reply input                       |
| **Comments**      | Comment sidebar with Open/Resolved tabs                        |
| **Comments**      | Resolve/unresolve threads                                      |
| **Comments**      | Pan-to-comment navigation                                      |
| **Library**       | Templates sidebar (Flowchart, Kanban, Mind Map)                |
| **Library**       | UI Components sidebar (Button, Input, Card, Toggle, Checkbox, Dropdown) |
| **Library**       | Keyboard shortcuts reference tab                               |
| **Library**       | Search filtering                                               |
| **Library**       | Template-based board creation (Flowchart, Wireframe, Architecture) |
| **Canvas HUD**    | NavigationHUD (logo + user menu on board page)                 |
| **Canvas HUD**    | Top-center Toolbar (all tools)                                 |
| **Canvas HUD**    | Top-right ActionToolbar (save, export, lock, reset, code export) |
| **Canvas HUD**    | Right-side PropertiesPanel (colors, opacity, background)       |
| **Canvas HUD**    | Bottom-left ZoomHUD (zoom, minimap, share)                     |
| **Canvas HUD**    | Right-side CommentSidebar                                      |
| **Canvas HUD**    | Left-side LibrarySidebar                                       |
| **Canvas HUD**    | Bottom-center TimeTravelSlider                                 |
| **Canvas HUD**    | Mobile-responsive collapsible logic for all toolbars           |
| **Theme**         | Dark/Light mode via next-themes with ThemeProvider              |
| **Theme**         | Theme toggle in GlobalNavbar                                   |
| **Theme**         | System preference support                                      |
| **Pages**         | User profile page (avatar, name edit, email, OAuth badge)      |
| **Pages**         | System settings page (theme, notifications, danger zone)       |
| **Pages**         | Billing page (plan info, features, payment methods)            |
| **Pages**         | Dedicated info pages (features, templates, blog, changelog, community, developers-api, help-center, integrations, keyboard-shortcuts) |
| **Pages**         | Generic info/legal placeholder pages (catch-all)               |
| **Pages**         | GlobalNavbar with auth-aware menu & mobile hamburger           |
| **Pages**         | Reusable KidrawLogo component                                  |
| **User**          | Profile name editing (persisted via server action)             |
| **User**          | Notification email preference (persisted via server action)    |
| **User**          | Account deletion (via server action)                           |
| **Infra**         | Prisma schema with User, Account, Session, Board, Comment      |
| **Infra**         | NeonDB serverless PostgreSQL                                   |
| **Infra**         | Vercel deployment                                              |
| **Infra**         | Dev hot-reload safe Prisma singleton                           |

### ⚠️ Partially Implemented / Stubbed

| Feature                         | Status         | Details                                                     |
|---------------------------------|----------------|--------------------------------------------------------------|
| Share link with roles           | UI only        | Dialog with Viewer/Commenter/Editor dropdown exists. Copies current URL but doesn't enforce permissions server-side. |
| Permission/role system          | Store only     | `permissionRole` state exists in Zustand but is not connected to any backend logic or UI enforcement. |
| Board title/description editing | Not in canvas  | Set at creation time only; no way to edit after creation.    |

### 🔲 Not Yet Implemented (Planned / Linked but Missing)

| Feature                         | Evidence                                                    |
|---------------------------------|--------------------------------------------------------------|
| WebSocket-based real-time       | Current SSE implementation works but doesn't scale to many concurrent users |
| Real-time auto-save             | Only manual cloud save exists                                |
| Board search & filtering        | Dashboard shows all boards without search                    |
| Board deletion                  | No delete board functionality                                |
| Board sorting                   | Always sorted by `updatedAt desc`; no user control           |
| Board thumbnails                | Board cards show a generic icon, not a preview of the canvas |
| Version history / revisions     | No board version tracking (time travel is in-memory only)    |
| File attachments / comment files| Only text-based commenting                                   |
| Stripe billing integration      | Billing page is informational only; no payment processing    |
| Email-based auth                | Only OAuth (GitHub + Google)                                 |
| Font size/family selection      | Text uses configurable `fontSize` but no font family picker  |
| Line style options (dash, dot)  | All lines are solid                                          |
| Arrow/connector smart labels    | Arrows can be routed but don't support inline text labels    |

---

## 17. Environment Variables

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

## 18. Configuration Files

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

## 19. Deployment & Infrastructure

| Aspect         | Details                                                      |
|----------------|--------------------------------------------------------------|
| **Host**       | Vercel (auto-deploy from GitHub)                             |
| **Database**   | NeonDB (serverless PostgreSQL, `eastus2.azure` region)       |
| **Domain**     | `kidraw-canvas-app.vercel.app`                               |
| **Build**      | `next build` (standard Next.js build)                        |
| **Dev Server** | `next dev` on `localhost:3000`                               |
| **DB Setup**   | `npx prisma generate` + `npx prisma db push`                |
| **Postinstall**| `prisma generate` runs automatically on `npm install`        |

---

## 20. Known Architectural Patterns & Decisions

### SSR Bypass for Canvas
The `Board.tsx` component is loaded via `next/dynamic` with `ssr: false` because React-Konva requires browser APIs (`window`, `HTMLCanvasElement`) that don't exist on the server.

### Prisma Singleton Pattern
`src/shared/lib/prisma.ts` implements the standard dev-safe singleton pattern: stores the Prisma client on `globalThis` to prevent connection pool exhaustion during hot module reloading.

### Event-Driven Canvas Communication
The `Board.tsx` component and `Toolbar.tsx`/`ActionToolbar.tsx` communicate through **custom DOM events** (`window.dispatchEvent`):
- `insert-image` — Toolbar dispatches → Board listens and places the image
- `export-canvas` — ActionToolbar dispatches → Board listens and runs export pipeline

### Server Actions for Board Creation
The "New Board" dialog on the dashboard uses a **Next.js Server Action** (`'use server'`) in `board-actions.ts`. The form submits directly to the server function, which creates the board in the database (with optional template layers) and redirects to the new board.

### Server Actions for User Management
User profile updates, notification preferences, and account deletion are handled via **Server Actions** in `user-actions.ts`, using Prisma operations with `revalidatePath` for cache invalidation.

### Off-Screen Canvas Export Compilation
To include CSS background patterns (dots, grids) in exported images — which Konva's native `toDataURL()` cannot capture — the export engine creates a hidden `<canvas>`, manually draws the background with Canvas 2D API calls, then composites the Konva output on top.

### CSS-Based Infinite Background
Background patterns are rendered via CSS `background-image` (radial/linear gradients) instead of Konva elements, eliminating the performance cost of rendering thousands of grid lines in the canvas layer. The background syncs with `camera.x/y` and `zoom` via React state.

### SSE-Based Presence (Not WebSocket)
Real-time collaboration uses **Server-Sent Events** instead of WebSockets. The `presenceClientsMap` is stored on `globalThis` (similar to the Prisma singleton pattern) to survive dev hot reloads. SSE connections are uni-directional (server→client); client→server updates use regular HTTP POST with throttling.

### Throttled Broadcasting
- **Cursor presence:** 250ms throttle (4 updates/second) via `usePresence` hook
- **Drawing updates:** 85ms batched throttle via `throttledBroadcastUpdate` in the canvas store
- **Purpose:** Prevents overwhelming the server with rapid mouse/draw events

### Rough.js Sketch Mode
The `RoughShape` component uses Rough.js to render shapes with a hand-drawn aesthetic. It creates a fake canvas-like object wrapping Konva's context and delegates rendering to `rough.canvas()` methods. The `sceneFunc` draws directly to the context without calling `fillStrokeShape`.

### A* Smart Arrow Routing
Arrows with element bindings use an **A* orthogonal pathfinding algorithm** (`routing.ts`) that:
1. Generates a sparse grid from obstacle bounding boxes
2. Finds the shortest path avoiding obstacles with turn penalties
3. Simplifies collinear points for clean right-angle routing
4. Falls back to straight lines if A* exceeds 1000 iterations

### Magnetic Snapping Guides
The snapping engine (`snapping.ts`) compares left/center/right (vertical) and top/middle/bottom (horizontal) axes of the dragged shape against all other shapes. Within a 5px tolerance, it snaps the position and generates guide lines for visual feedback.

---

## 21. Development Phase History

| Phase     | Milestone                                                    |
|-----------|--------------------------------------------------------------|
| Phase 1   | Project setup, Next.js + TypeScript architecture             |
| Phase 2   | Zustand store, responsive Board component                    |
| Phase 3   | Mouse events, drawing logic, pen tool                        |
| Phase 4   | Professional UI (Toolbar, PropertiesPanel)                   |
| Phase 5+  | Shapes, text, eraser, undo/redo, colors                      |
| Phase 6+  | OAuth authentication, database persistence                   |
| Phase 7+  | Dashboard, board CRUD, cloud save/load                       |
| Phase 8+  | Landing page, info pages, navigation                         |
| Phase 9+  | Image upload, laser, lasso, minimap, export engine           |
| Phase 10+ | Profile, settings, billing pages, UI polish                  |
| Phase 11+ | Keyboard shortcuts, copy/paste, delete, z-ordering, grouping |
| Phase 12+ | Smart arrow routing (A*), magnetic snapping guides           |
| Phase 13+ | Sketch mode (Rough.js), pencil tool                          |
| Phase 14+ | Real-time collaboration (SSE presence, live cursors, drawing sync) |
| Phase 15+ | Threaded canvas comments (database-persisted, sidebar, overlay) |
| Phase 16+ | Templates & UI library sidebar, board creation templates     |
| Phase 17+ | Code export (React/Tailwind, Mermaid.js), SVG/PDF export     |
| Phase 18+ | Time travel slider, history playback                         |
| Phase 19+ | Dark/light theme integration (next-themes), GlobalNavbar     |
| Phase 20+ | User server actions (profile edit, notifications, account deletion) |
| Phase 21+ | Dedicated info pages, KidrawLogo component, export code modal |

> Detailed phase reports are available in the `docs/` directory:
> - [ARCHITECTURE_MIGRATION.md](file:///d:/dev/UNIQUE%20WORK/kidraw/docs/ARCHITECTURE_MIGRATION.md)
> - [FUTURE_ROADMAP.md](file:///d:/dev/UNIQUE%20WORK/kidraw/docs/FUTURE_ROADMAP.md)

---

## Appendix: NPM Scripts

| Script          | Command             | Description                        |
|-----------------|---------------------|------------------------------------|
| `dev`           | `next dev`          | Start development server           |
| `build`         | `next build`        | Production build                   |
| `start`         | `next start`        | Start production server            |
| `lint`          | `eslint`            | Run ESLint                         |
| `postinstall`   | `prisma generate`   | Auto-generate Prisma client        |

---

## Appendix: Keyboard Shortcuts Reference

| Shortcut        | Action                     |
|-----------------|----------------------------|
| `V`             | Select tool                |
| `L`             | Lasso select               |
| `H`             | Hand / Pan tool            |
| `P`             | Pen tool                   |
| `S`             | Shapes menu                |
| `R`             | Rectangle shape            |
| `C`             | Circle (ellipse) shape     |
| `A`             | Arrow shape                |
| `T`             | Text tool                  |
| `N`             | Sticky note tool           |
| `F`             | Frame tool                 |
| `K`             | Laser pointer              |
| `E`             | Pixel eraser               |
| `Shift+E`       | Object eraser              |
| `Ctrl+C`        | Copy selected layer        |
| `Ctrl+V`        | Paste (with 20px offset)   |
| `Ctrl+Z`        | Undo                       |
| `Ctrl+Shift+Z`  | Redo                       |
| `Ctrl+Y`        | Redo (alt)                 |
| `Ctrl+G`        | Group selected layers      |
| `Ctrl+Shift+G`  | Ungroup                    |
| `]`             | Bring forward              |
| `[`             | Send backward              |
| `Shift+]`       | Bring to front             |
| `Shift+[`       | Send to back               |
| `Delete/Backspace` | Delete selected         |

---

> **How to use this document:**
> - Before building a new feature, check the **Feature Matrix** (§16) to confirm it's not already implemented or stubbed.
> - Before creating a new file, check the **File Map** (§3) for existing patterns and naming conventions.
> - Before adding a new route, check **Routes & Pages** (§6) for conflicts.
> - Before modifying state, review the **Zustand Stores** (§9) for existing properties and actions.
> - Before adding a new shape or tool, review the **Type System** (§11) for the correct type unions.
> - Before adding real-time features, review the **Collaboration System** (§13) for the SSE architecture.
> - Before adding comment features, review the **Comment System** (§14) for the existing threading architecture.
