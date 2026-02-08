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
│   ├── components/        # React components
│   │   ├── ui/           # UI kit (buttons, cards, tabs)
│   │   └── *.tsx         # Feature components
│   ├── lib/              # Utilities & hooks
│   │   ├── backendAdapter.ts    # API client
│   │   ├── usePatchpilotWorkflow.ts  # State machine
│   │   └── types.ts      # TypeScript types
│   ├── page.tsx          # Home page
│   ├── workflow/         # Workflow page
│   │   └── page.tsx
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── public/               # Static assets
└── package.json
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

### Backend Mode
- Connects to FastAPI backend
- Real API calls
- Requires backend server running

Switch modes via dropdown in workflow page header.

## 🧩 Key Components

**Workflow State Machine** (`lib/usePatchpilotWorkflow.ts`):
- Manages pipeline steps (Upload → Analyze → Test → Run → Patch → Export)
- Handles state transitions and errors
- Supports both Sample and Backend adapters

**Backend Adapter** (`lib/backendAdapter.ts`):
- Abstraction layer for API calls
- Response normalization
- Error handling with detailed context

**UI Components**:
- `HeroSection` - Landing hero with CTAs
- `DemoWorkflow` - Interactive workflow demo
- `MacOSCodeEditor` - Code display component
- `WorkflowVisualizationImproved` - Pipeline visualization

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
