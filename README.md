# AI Bill Guardian 🛡️

**Know Your Bills. Predict Your Costs. Save Smarter.**

AI Bill Guardian is a premium AI-powered utility bill intelligence SaaS application that helps users extract, parse, analyze, and forecast their electricity, water, gas, mobile, and internet expenses. It identifies anomalies (such as consumption spikes and water leaks), tracks subscription creeps, and suggests personalized savings tips.

---

## Technical Stack

- **Frontend**: Vite + React + TypeScript + Tailwind CSS + Lucide Icons + Recharts (data visualizations) + Framer Motion (micro-animations) + Canvas Confetti.
- **Backend**: Node.js + Express + Multer (multipart upload handler) + CORS.
- **Database**: Local JSON storage mimicking SQL, database schema designed for PostgreSQL.
- **AI Integration**: Custom time-series prediction curves, mock OCR parsing simulator, Web Speech API Voice synthesis & recognition.

---

## Repository Structure

```
├── backend/
│   ├── data/
│   │   └── db.json         # Mock database file (billing history, recommendations, alarms)
│   ├── uploads/            # Temporary storage container for uploads
│   ├── server.js           # Express API endpoints & ML seasonal predictions
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── VoiceChatbot.tsx  # Speech recognition & synthesis chatbot widget
│   │   ├── context/
│   │   │   └── AppContext.tsx    # Global state management & 8 local language maps
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx   # SaaS tech landing portal
│   │   │   ├── Dashboard.tsx     # Metrics, Recharts spends, category donuts
│   │   │   ├── UploadPage.tsx    # Drag-and-drop & scanning laser animations
│   │   │   ├── OcrPage.tsx       # Spreadsheet invoice verification sheet
│   │   │   ├── InsightsPage.tsx  # Natural language hike breakdown charts
│   │   │   ├── PredictionsPage.tsx # Composed forecast areas & confidence bounds
│   │   │   ├── RecommendationsPage.tsx # Savings catalog filters & apply hooks
│   │   │   ├── AnomaliesPage.tsx # Anomaly alarms hub
│   │   │   ├── WhatsAppBotPage.tsx # WhatsApp integration chat simulator
│   │   │   ├── DatabaseSchemaPage.tsx # Interactive PostgreSQL code explorer
│   │   │   ├── ApiDocsPage.tsx   # Swagger-style REST route specs
│   │   │   └── AdminPage.tsx     # SaaS statistics & support tickets console
│   │   ├── App.tsx         # Dashboard sidebar navigation shell
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   └── package.json
├── package.json            # Root configuration
└── README.md
```

---

## Local Development Execution

### 1. Prerequisite
Ensure you have **Node.js (v18+)** and **npm** installed.

### 2. Dependency Installation
Run the following helper script in the root directory to install dependencies for the root concurrently runner, the Express backend, and the Vite frontend:
```bash
npm run install-all
```

### 3. Startup dev server
Start both servers concurrently:
```bash
npm run dev
```
- **Vite Frontend**: [http://localhost:5173](http://localhost:5173)
- **Express Backend**: [http://localhost:5000](http://localhost:5000)

---

## Production Deployment Instructions

### Frontend Deployment (Vercel)
1. Push the repository to GitHub.
2. Link your GitHub repository in your Vercel Dashboard.
3. Configure settings:
   - **Framework Preset**: Vite / Other
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Set Environment Variables:
   - Add backend connection keys as needed.

### Backend Deployment (Render / AWS)
1. In Render, select **New Web Service**.
2. Connect your GitHub repository.
3. Configure settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add environment configurations (e.g. `PORT=5000`).

---

## PostgreSQL Database Schema Setup

To instantiate the relational schema on a live PostgreSQL database, select the **Database Schema** page inside the running application or execute the SQL queries from `frontend/src/pages/DatabaseSchemaPage.tsx` directly into your SQL console.
