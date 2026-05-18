# 🧞 Yatra Genie

**An AI-powered multi-agent travel planner for India — generate personalised day-by-day itineraries in seconds.**

Yatra Genie uses a four-agent AI system powered by Google Gemini 2.0 Flash to plan complete trips across 22 Indian cities. Just fill in your destination, days, budget, and interests — and the multi-agent pipeline handles everything else.

---

## ✨ What it does

- Generates a full **day-by-day itinerary** personalised to your interests, pace, and budget
- Fetches **live weather** from Open-Meteo and adapts recommendations accordingly
- **AI budget allocation** across accommodation, food, transport, activities, and shopping
- Produces a **personalised packing checklist**, travel tips, and assistant highlights
- Filter activities by category, sort by cost or rating, view on a map
- Save, export as `.txt`, and share via WhatsApp

---

## 🤖 Multi-Agent Architecture

The core of Yatra Genie is a **four-agent AI orchestration pipeline**:

```
User Input
     ↓
Orchestrator
     ↓
[Phase 1]  Weather Agent  →  fetches live weather + Gemini writes strategy
     ↓ (weather context passed down)
[Phase 2 - Promise.all()]
  Itinerary Agent  |  Budget Agent  |  Tips Agent
  (run in parallel — 60% faster than sequential)
     ↓
Aggregated Itinerary → React Frontend
```

| Agent | Responsibility |
|---|---|
| **Weather Agent** | Open-Meteo live data + Gemini weather strategy |
| **Itinerary Agent** | Gemini generates day-by-day activity plan |
| **Budget Agent** | Gemini allocates budget across 5 categories |
| **Tips Agent** | Gemini writes packing list, checklist, tips |

Each agent has a **graceful fallback** — if Gemini is unavailable, the app continues working using rule-based logic.

---

## 🛠️ Tech Stack

**Frontend**
- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui + Radix UI
- Framer Motion, Lucide React, Recharts
- React Hook Form + Zod, TanStack Query

**Backend**
- Node.js + Express 5
- Google Gemini 2.0 Flash (`@google/genai`)
- Open-Meteo API (free, no key needed)

**Auth & Storage**
- localStorage (Firebase-ready architecture)

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/yatra-genie.git
cd yatra-genie
```

### 2. Set up environment variables
Create a `.env` file in the root:
```
VITE_API_BASE_URL=http://localhost:8787
GEMINI_API_KEY=your_gemini_api_key_here
```
Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com/app/apikey)

### 3. Install and run
```bash
npm install
npm run dev
```

- Frontend runs at `http://localhost:8080`
- Backend runs at `http://localhost:8787`

---

## 🗺️ Cities Covered

Agra · Ahmedabad · Amritsar · Bangalore · Chennai · Delhi · Goa · Hyderabad · Jaipur · Jaisalmer · Jodhpur · Kochi · Kolkata · Leh-Ladakh · Manali · Mumbai · Mysore · Pondicherry · Rishikesh · Shimla · Udaipur · Varanasi

---

## 📁 Project Structure

```
yatra-genie/
├── src/                        # React frontend
│   ├── pages/                  # Index, MyTrips, TripDetail, Login
│   ├── components/travel/      # All UI components
│   ├── services/               # API client + localStorage
│   ├── contexts/               # AuthContext
│   └── types/                  # TypeScript interfaces
└── server/                     # Node.js backend
    ├── orchestrator.js          # Coordinates all agents
    ├── planTrip.js              # Entry point + validation
    ├── cityData.js              # Curated data for 22 cities
    └── agents/
        ├── weatherAgent.js
        ├── itineraryAgent.js
        ├── budgetAgent.js
        └── tipsAgent.js
```

--

This project was developed as part of the EPICS (Engineering Projects in Community Service) program at **VIT Bhopal University**.

---

Just replace `your-username` in the clone URL with your actual GitHub username before pasting. You can paste the entire thing directly into your `README.md` file.
