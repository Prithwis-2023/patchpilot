# PatchPilot

**Transform bug recordings into fixes with AI-powered automation.**

PatchPilot is an intelligent bug analysis platform that converts screen recordings into actionable bug reports, automated tests, and code patches. Built for the [Gemini 3 Hackathon](https://gemini3.devpost.com/resources).

## 🎯 The Idea

Instead of manually writing bug reports, PatchPilot:
1. **Analyzes** video recordings of bugs using Gemini AI
2. **Generates** Playwright test specifications automatically
3. **Runs** tests to reproduce the issue
4. **Suggests** code patches to fix the bug
5. **Exports** comprehensive bug reports

## 🏆 Hackathon Excellence

**Why PatchPilot Stands Out:**
- ✅ **Marathon Agent**: Autonomous workflow spanning multiple AI calls with state management
- ✅ **Vibe Engineering**: Real code generation with verification through Playwright execution
- ✅ **Multimodal Reasoning**: Video analysis → Test generation → Patch suggestion pipeline
- ✅ **Production-Ready**: Full-stack architecture with error handling, CORS, and health monitoring

**Not a simple prompt wrapper** — PatchPilot orchestrates complex multi-step workflows with real tool execution.

## 🛠️ Tech Stack

**Frontend:**
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Radix UI

**Backend:**
- FastAPI (Python)
- Google Gemini 2.5 Flash API
- Playwright (test execution)
- OpenCV + Decord (video processing)
- Pydantic (data validation)
- Python-dotenv (configuration)

**Architecture:**
- Adapter pattern (Sample/Backend modes)
- State machine workflow
- RESTful API with CORS
- Response normalization layer
- Health monitoring
- Dev tools for debugging

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Python 3.12+
- Google AI API key ([Get one here](https://ai.google.dev/))

### 1. Clone & Install

```bash
git clone <repo-url>
cd Patchpilot
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Install Playwright browsers
playwright install

# Create .env file
echo "GENAI_API_KEY=your_api_key_here" > .env

# Start server
uvicorn app:app --reload --port 8000
```

📖 [Full Backend Guide →](./backend/README.md)

### 3. Frontend Setup

```bash
cd frontend
pnpm install

# Create .env.local (optional, defaults to sample mode)
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:8000" > .env.local
echo "NEXT_PUBLIC_PIPELINE_MODE=sample" >> .env.local

# Start dev server
pnpm dev
```

📖 [Full Frontend Guide →](./frontend/README.md)

### 4. Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📐 Architecture

```
┌─────────────┐         ┌─────────────┐
│   Browser   │────────▶│  Next.js    │
│  (Frontend) │         │  Frontend   │
└─────────────┘         └─────────────┘
                              │
                              │ HTTP/REST
                              ▼
                        ┌─────────────┐
                        │   FastAPI   │
                        │   Backend   │
                        └─────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
              ┌─────▼─────┐      ┌─────▼─────┐
              │  Gemini   │      │ Playwright│
              │    API    │      │  Runner   │
              └───────────┘      └───────────┘
```

📖 [Detailed Architecture →](./ARCHITECTURE.md)

## 🎨 Features

- **Video Analysis**: Extract timeline and reproduction steps from screen recordings using Gemini AI
- **Test Generation**: Auto-generate Playwright tests from bug analysis
- **Test Execution**: Run tests and capture results/screenshots with Playwright
- **Patch Suggestions**: AI-generated code fixes with rationale and risk assessment
- **Bug Reports**: Export markdown reports with all artifacts
- **Health Monitoring**: Real-time backend connectivity status
- **Dev Tools**: API debugging panel for backend mode
- **Response Normalization**: Automatic conversion between backend and frontend data formats

## 🔧 Development Modes

**Sample Mode** (Default):
- Uses fixture data from `frontend/app/lib/sampleData.ts`
- No API calls required
- Perfect for UI development
- Simulates network delays

**Backend Mode**:
- Real API integration with FastAPI backend
- Requires backend server running on port 8000
- Full end-to-end workflow
- Health monitoring and dev tools enabled
- Automatic response normalization

## 📁 Project Structure

```
Patchpilot/
├── frontend/          # Next.js application
│   ├── app/           # App Router pages & components
│   │   ├── components/ # 30+ React components
│   │   ├── lib/       # Utilities, hooks, adapters
│   │   ├── page.tsx   # Home page
│   │   └── workflow/  # Workflow page
│   ├── public/        # Static assets
│   └── package.json
├── backend/           # FastAPI server
│   ├── app.py         # API endpoints & CORS
│   ├── gemini.py      # AI integration
│   ├── video_utils.py # Video processing
│   ├── playwright_runner.py # Test execution
│   ├── schemas.py     # Pydantic models
│   ├── requirements.txt
│   ├── guide.csv      # API reference
│   └── temp/          # Temporary files
├── ARCHITECTURE.md    # System architecture docs
└── README.md          # This file
```

## 📚 Documentation

- [Architecture Overview](./ARCHITECTURE.md) - System design & diagrams
- [Frontend Guide](./frontend/README.md) - Setup & development
- [Backend Guide](./backend/README.md) - API & deployment

## 🐛 Troubleshooting

**CORS Errors**: 
- Ensure backend is running and CORS middleware is configured
- Check `GET /debug/cors` endpoint to see current CORS settings
- Add production URLs via `CORS_ALLOWED_ORIGINS` environment variable

**Quota Limits**: 
- Use `gemini-3-flash-preview` model (free-tier friendly)
- Model is configured in `backend/gemini.py`

**Port Conflicts**: 
- Change ports in `.env` files if 3000/8000 are in use
- Backend port can be set via `PORT` environment variable

**Playwright Issues**:
- Run `playwright install` in backend directory
- Check `GET /selfcheck` endpoint to verify setup
- Ensure Node.js is installed for Playwright execution

**Backend Health**:
- Frontend shows health status in workflow page header
- Health check uses `GET /health` endpoint
- Updates every 30 seconds in backend mode

## 📄 License

See [LICENSE](./LICENSE) file.

---

**Built for Gemini 3 Hackathon** | [Devpost](https://gemini3.devpost.com) | [Resources](https://gemini3.devpost.com/resources)
