# PatchPilot Frontend

Next.js application with cybernetic brutalism design system.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit http://localhost:3000

## 📦 Available Scripts

```bash
pnpm dev          # Start dev server (port 3000)
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm typecheck    # TypeScript type checking
```

## ⚙️ Configuration

### Environment Variables

Create `.env.local`:

```env
# Backend API URL (required for backend mode)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Pipeline mode: "sample" (default) or "backend"
NEXT_PUBLIC_PIPELINE_MODE=sample
```

**Default**: Sample mode (uses fixture data, no backend required)

## 🏗️ Project Structure

```
frontend/
├── app/
│   ├── components/        # React components (30+ components)
│   │   ├── ui/           # UI kit (buttons, cards, tabs)
│   │   └── *.tsx         # Feature components
│   ├── lib/              # Utilities & hooks
│   │   ├── backendAdapter.ts    # API client with normalization
│   │   ├── usePatchpilotWorkflow.ts  # State machine
│   │   ├── useBackendHealth.ts  # Backend health monitoring
│   │   ├── useCopyFeedback.ts   # Copy feedback hook
│   │   ├── types.ts      # TypeScript types
│   │   ├── config.ts    # Configuration
│   │   ├── sampleData.ts # Fixture data
│   │   ├── theme.ts     # Theme configuration
│   │   ├── utils.ts     # Utility functions
│   │   ├── motion.ts    # Animation utilities
│   │   └── uiTokens.ts  # Design tokens
│   ├── page.tsx          # Home page
│   ├── workflow/         # Workflow page
│   │   └── page.tsx
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── public/               # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
└── eslint.config.mjs
```

## 🎨 Design System

**Cybernetic Brutalism Theme:**
- Deep charcoal backgrounds
- Neon accents (cyan, magenta, lime)
- Geometric forms with glitch effects
- Scanline overlays
- Custom cursor with trail

**Typography:**
- JetBrains Mono (headings)
- IBM Plex Sans (body)
- Fira Code (code)

## 🔄 Development Modes

### Sample Mode (Default)
- Uses fixture data from `lib/sampleData.ts`
- No backend required
- Perfect for UI/UX development
- Simulates network delays for realistic UX

### Backend Mode
- Connects to FastAPI backend
- Real API calls with normalization
- Requires backend server running
- Shows backend health indicator in header
- Includes dev tools panel for API debugging

**Backend Health Monitoring:**
- Automatically checks `/health` endpoint
- Updates every 30 seconds
- Shows connection status in workflow page header
- Uses `useBackendHealth` hook

**Dev Tools Panel:**
- View last API call details
- Inspect request/response payloads
- Debug normalization errors
- Only visible in backend mode
- Accessible via "Dev Tools" button in workflow page

**Response Normalization:**
The `HttpAdapter` automatically normalizes backend responses:
- `timeline`: `[{t: number, event: string}]` → `[{timestamp: string, description: string}]`
- `reproSteps`: `string[]` → `[{number: number, description: string}]`
- `status`: `"passed"` → `"success"`
- `rationale`: `string[]` → `string` (joined with newlines)

Switch modes via dropdown in workflow page header.

## 🧩 Key Components

**Workflow State Machine** (`lib/usePatchpilotWorkflow.ts`):
- Manages pipeline steps (Upload → Analyze → Test → Run → Patch → Export)
- Handles state transitions and errors
- Supports both Sample and Backend adapters

**Backend Adapter** (`lib/backendAdapter.ts`):
- Abstraction layer for API calls
- Response normalization (converts backend formats to frontend types)
- Error handling with detailed context
- API call tracking for debug panel
- Two implementations:
  - `SampleAdapter` - Returns fixture data
  - `HttpAdapter` - Makes real HTTP requests

**UI Components**:
- `HeroSection` - Landing hero with CTAs
- `DemoWorkflow` - Interactive workflow demo
- `MacOSCodeEditor` - Code display component
- `WorkflowVisualizationImproved` - Pipeline visualization
- `DiffViewer` - Code diff display
- `MarkdownPreview` - Markdown rendering
- `CustomCursor` - Custom cursor with trail effect
- `DynamicBackground` - Animated background
- `FloatingParticles` - Particle effects
- `Footer` - Site footer
- `CreatorSection` - Creator information
- `UploadCard` - File upload component
- `TimelinePanel` - Timeline visualization
- `StepsPanel` - Workflow steps display
- `RunOutputPanel` - Test execution output
- `ExportPanel` - Bug report export
- `ApiContractPanel` - API contract display
- `Inspector` - Data inspection tool
- `AppShell` - Application shell layout
- `CommandBar` - Command interface
- `Workspace` - Main workspace component
- `ArtifactGraph` - Artifact visualization
- `CodePanel` - Code display panel
- `Stepper` - Step indicator
- `SyntaxHighlightedCode` - Syntax highlighting
- `ThemeToggle` - Theme switcher

**Additional Hooks**:
- `useBackendHealth` - Backend connectivity monitoring
- `useCopyFeedback` - Copy-to-clipboard feedback

## 🐛 Troubleshooting

**Build Errors:**
```bash
# Clear Next.js cache
rm -rf .next
pnpm build
```

**Type Errors:**
```bash
pnpm typecheck
```

**Lint Issues:**
```bash
pnpm lint --fix
```

## 📦 Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

**Deployment:**
- Vercel (recommended for Next.js)
- Netlify
- Any Node.js hosting

## 🔗 Related

- [Backend README](../backend/README.md)
- [Architecture Docs](../ARCHITECTURE.md)
- [Root README](../README.md)
