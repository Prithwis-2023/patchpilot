# PatchPilot Architecture

System architecture and design patterns for PatchPilot.

## 🏗️ System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Next.js Frontend (Port 3000)            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │  │
│  │  │   Home Page  │  │ Workflow Page│  │ Components│ │  │
│  │  └──────────────┘  └──────────────┘  └───────────┘ │  │
│  │         │                  │                │        │  │
│  │         └──────────────────┴────────────────┘        │  │
│  │                        │                              │  │
│  │              ┌─────────▼─────────┐                   │  │
│  │              │  State Machine    │                   │  │
│  │              │  (Workflow Hook)  │                   │  │
│  │              └─────────┬─────────┘                   │  │
│  │                        │                              │  │
│  │              ┌─────────▼─────────┐                   │  │
│  │              │  Backend Adapter  │                   │  │
│  │              │  (Sample/HTTP)     │                   │  │
│  │              └─────────┬─────────┘                   │  │
│  └────────────────────────┼────────────────────────────┘  │
│                             │ HTTP/REST                      │
└─────────────────────────────┼────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              FastAPI Backend (Port 8000)                     │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                    API Endpoints                       │  │
│  │  /analyze  /generate-test  /run-test  /generate-patch │  │
│  └────────────────────────────────────────────────────────┘  │
│         │              │              │              │        │
│    ┌────▼────┐   ┌─────▼─────┐  ┌────▼────┐  ┌─────▼─────┐  │
│    │ Gemini │   │  Gemini   │  │Playwright│  │  Gemini  │  │
│    │  API   │   │    API    │  │  Runner  │  │    API    │  │
│    └────────┘   └───────────┘  └──────────┘  └───────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🎨 Frontend Architecture

### Component Hierarchy

```
app/
├── layout.tsx (Root)
│   ├── DynamicBackground
│   ├── FloatingParticles
│   ├── CustomCursor
│   └── {children}
│
├── page.tsx (Home)
│   ├── HeroSection
│   ├── WorkflowVisualizationImproved
│   ├── DemoWorkflow
│   ├── MacOSCodeEditor
│   └── CreatorSection
│
└── workflow/page.tsx
    ├── Navigation
    ├── Tabs (Upload/Analysis/Test/Results/Patch/Export)
    └── Dev Tools Panel
```

### State Management

```
usePatchpilotWorkflow Hook
├── Pipeline Mode (sample | backend)
├── Steps State Machine
│   ├── UPLOAD → idle/loading/success/error
│   ├── ANALYZE → idle/loading/success/error
│   ├── TEST → idle/loading/success/error
│   ├── RUN → idle/loading/success/error
│   ├── PATCH → idle/loading/success/error
│   └── EXPORT → idle/loading/success/error
├── Data Store
│   ├── analysis: AnalysisResult | null
│   ├── test: GeneratedTest | null
│   ├── runResult: RunResult | null
│   ├── patch: PatchResult | null
│   └── bugReport: BugReport | null
└── Adapter (SampleAdapter | HttpAdapter)
```

### Data Flow

```
User Action
    │
    ▼
Workflow Hook
    │
    ├─→ Sample Mode → SampleAdapter → Fixture Data
    │
    └─→ Backend Mode → HttpAdapter → FastAPI
                            │
                            ▼
                    Backend Adapter
                            │
                            ├─→ Normalize Response
                            │
                            └─→ Update State
                                    │
                                    ▼
                            UI Updates
```

## ⚙️ Backend Architecture

### Request Flow

```
HTTP Request
    │
    ▼
FastAPI Router
    │
    ├─→ CORS Middleware
    │
    ├─→ Exception Handler (CORS headers on errors)
    │
    └─→ Endpoint Handler
            │
            ├─→ /analyze
            │   ├─→ Save video file
            │   ├─→ extract_frames() → [frame1.jpg, ...]
            │   └─→ analyze_video() → Gemini API
            │
            ├─→ /generate-test
            │   └─→ generate_test() → Gemini API
            │
            ├─→ /run-test
            │   └─→ run_playwright_test() → Playwright
            │
            └─→ /generate-patch
                └─→ generate_patch() → Gemini API
```

### Video Processing Pipeline

```
Video File (MP4/WebM)
    │
    ▼
extract_frames()
    │
    ├─→ Decord VideoReader
    │
    ├─→ Scene Change Detection (OpenCV)
    │
    ├─→ Uniform Sampling
    │
    └─→ Save frames → temp/frames/
            │
            ▼
    [frame_000.jpg, frame_001.jpg, ...]
            │
            ▼
    Upload to Gemini API
            │
            ▼
    AI Analysis → AnalysisResponse
```

### Test Execution Flow

```
Generated Test Code
    │
    ▼
run_playwright_test()
    │
    ├─→ Write test file → temp/test_run.spec.ts
    │
    ├─→ Execute: npx playwright test
    │
    ├─→ Capture stdout/stderr
    │
    ├─→ Determine status (passed/failed)
    │
    └─→ Return RunResult
            │
            └─→ Cleanup test file
```

## 🔄 Adapter Pattern

### Interface

```typescript
interface BackendAdapter {
  analyzeVideo(file: File): Promise<AnalysisResult>
  generateTest(analysis: AnalysisResult): Promise<GeneratedTest>
  runTest(test: GeneratedTest): Promise<RunResult>
  generatePatch(input: {...}): Promise<PatchResult>
}
```

### Implementations

**SampleAdapter:**
- Returns fixture data from `sampleData.ts`
- Simulates network delays
- No API calls

**HttpAdapter:**
- Makes real HTTP requests
- Normalizes responses
- Handles errors with context
- Tracks API calls for debugging

## 📊 Data Models

### AnalysisResult
```typescript
{
  timeline: [{timestamp: string, description: string}]
  reproSteps: [{number: number, description: string}]
  expected: string
  actual: string
  targetUrl?: string
}
```

### GeneratedTest
```typescript
{
  filename: string
  playwrightSpec: string
}
```

### RunResult
```typescript
{
  status: "success" | "failed"
  stdout: string
  stderr: string
  screenshotUrl: string | null
}
```

### PatchResult
```typescript
{
  diff: string
  rationale: string
  risks: string[]
}
```

## 🔐 Security & Configuration

### CORS
- Configured for localhost origins
- Credentials enabled
- All methods allowed

### Environment Variables
- `GENAI_API_KEY` - Required for backend
- `NEXT_PUBLIC_BACKEND_URL` - Frontend config
- `NEXT_PUBLIC_PIPELINE_MODE` - Frontend mode

### Error Handling
- Global exception handler ensures CORS headers
- Normalization errors show missing fields
- Network errors include context

## 🚀 Deployment Architecture

### Development
```
Frontend (localhost:3000) ←→ Backend (localhost:8000)
```

### Production
```
┌─────────────┐
│   CDN/Vercel│ → Frontend (Static + SSR)
└──────┬──────┘
       │
       │ API Calls
       ▼
┌─────────────┐
│  FastAPI    │ → Backend (Python)
│  Server     │
└──────┬──────┘
       │
       ├─→ Gemini API
       └─→ Playwright (local execution)
```

## 📈 Scalability Considerations

**Current (Single Server):**
- All processing on one machine
- Playwright runs locally
- File storage in `temp/` directory

**Future Enhancements:**
- Queue system for test execution
- Distributed Playwright workers
- Cloud storage for videos/frames
- Database for workflow state
- WebSocket for real-time updates

---

**See Also:**
- [Root README](../README.md)
- [Frontend README](../frontend/README.md)
- [Backend README](../backend/README.md)
