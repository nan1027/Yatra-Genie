# ✈️ Yatra Genie — AI-Powered Travel Planner

Yatra Genie is an **AI-powered travel planning web application** that generates personalized travel itineraries based on a user's destination, number of days, travel type, budget, interests, and preferred trip pace.

Instead of relying on a single AI prompt, Yatra Genie uses a **multi-agent architecture** where specialized AI agents independently handle different aspects of trip planning and work together to produce a complete itinerary.

---

## 🚀 Live Demo

🌐 **Live Application:**  
https://yatra-genie.vercel.app

💻 **GitHub Repository:**  
https://github.com/nan1027/Yatra-Genie

⚙️ **Backend Health Check:**  
https://yatra-genie-api.onrender.com/api/health

---

## ✨ Features

- 🤖 AI-powered personalized travel planning
- 🧠 Multi-agent AI architecture
- 🌦️ Real-time weather information using Open-Meteo
- 🗺️ Day-wise travel itinerary generation
- 💰 Budget-aware travel recommendations
- 🍴 Food and local experience recommendations
- 💡 Travel tips and practical suggestions
- 🎯 Personalized recommendations based on user interests
- ⚡ Parallel AI agent execution using `Promise.all()`
- 🔐 Environment-variable based API configuration
- 💾 Local storage for authentication and saved trips
- 📱 Responsive web interface
- 🛡️ Fallback responses when external AI/weather services are unavailable

---

## 🧠 Multi-Agent Architecture

Yatra Genie uses four specialized AI agents:

### 🌦️ 1. Weather Agent
Provides weather-related information and recommendations for the selected destination.

### 🗺️ 2. Itinerary Agent
Creates a structured day-wise itinerary based on the destination, duration, interests, travel type, budget, and trip pace.

### 💰 3. Budget Agent
Provides budget-conscious recommendations and helps align the itinerary with the selected budget level.

### 💡 4. Tips Agent
Generates practical travel advice, local suggestions, and destination-specific tips.

These agents are executed **in parallel using `Promise.all()`**, reducing unnecessary waiting time and improving overall response speed.

---

## 🏗️ System Architecture

```text
                         👤 USER
                           │
                           ▼
                ┌─────────────────────┐
                │    React Frontend   │
                │   Vite + TypeScript  │
                └──────────┬──────────┘
                           │
                           │ REST API
                           ▼
                ┌─────────────────────┐
                │   Express Backend   │
                │      Node.js        │
                └──────────┬──────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
        🌦️ Weather    🗺️ Itinerary   💰 Budget
           Agent          Agent         Agent
              │            │            │
              └────────────┼────────────┘
                           │
                           ▼
                       💡 Tips Agent
                           │
                           ▼
                  Google Gemini API
                           │
                           ▼
                    📋 Final Itinerary
```

---

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- HTML5
- CSS3

### Backend
- Node.js
- Express.js
- REST APIs

### AI
- Google Gemini API
- Multi-Agent AI Architecture
- Parallel Agent Execution

### APIs
- Open-Meteo API

### Deployment
- Vercel — Frontend
- Render — Backend

### Storage
- Browser `localStorage`

---

## 📂 Project Structure

```text
Yatra-Genie/
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── data/
│   └── ...
│
├── server/
│   ├── agents/
│   │   ├── weatherAgent.js
│   │   ├── itineraryAgent.js
│   │   ├── budgetAgent.js
│   │   └── tipsAgent.js
│   │
│   ├── planTrip.js
│   └── index.js
│
├── .env
├── .env.example
├── package.json
├── vite.config.ts
└── README.md
```

---

## ⚙️ How It Works

1. The user enters:
   - Destination
   - Number of days
   - Travel type
   - Budget level
   - Interests
   - Trip pace

2. The frontend sends the travel preferences to the Express backend.

3. The backend validates the request.

4. The backend invokes the specialized AI agents.

5. The agents process their respective tasks in parallel.

6. Google Gemini generates AI-powered recommendations.

7. Open-Meteo provides weather information.

8. The backend combines the generated information.

9. The final personalized itinerary is returned to the frontend.

10. The frontend displays the complete travel plan to the user.

---

## ⚡ Parallel Agent Execution

A key optimization in Yatra Genie is the parallel execution of independent agents.

Instead of waiting for each agent sequentially:

```text
Weather → Itinerary → Budget → Tips
```

the agents can execute concurrently:

```text
             ┌── Weather Agent ────┐
             │                     │
             ├── Itinerary Agent ──┤
User Request ├── Budget Agent ─────┤ → Final Response
             │                     │
             └── Tips Agent ───────┘
```

This reduces unnecessary waiting and improves the overall response time of the application.

---

## 🔐 Environment Variables

### Frontend

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8787
```

For production:

```env
VITE_API_BASE_URL=https://yatra-genie-api.onrender.com
```

> `VITE_API_BASE_URL` is used by the frontend to communicate with the deployed backend.

---

### Backend

Create the required environment variables for the backend:

```env
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:8080
```

For production:

```env
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=https://yatra-genie.vercel.app
```

⚠️ **Never expose `GEMINI_API_KEY` in the frontend or commit it to GitHub.**

---

## 💻 Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/nan1027/Yatra-Genie.git
cd Yatra-Genie
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create the required `.env` files and add your Gemini API key and backend/frontend URLs.

### 4. Start the backend

```bash
node server/index.js
```

The backend runs on:

```text
http://localhost:8787
```

### 5. Start the frontend

In another terminal:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:8080
```

### 6. Open the application

Visit:

```text
http://localhost:8080
```

---

## 🚀 Deployment

### Frontend — Vercel

The React/Vite frontend is deployed on **Vercel**.

Production URL:

https://yatra-genie.vercel.app

Required environment variable:

```env
VITE_API_BASE_URL=https://yatra-genie-api.onrender.com
```

---

### Backend — Render

The Express/Node.js backend is deployed on **Render**.

Production API:

https://yatra-genie-api.onrender.com

Required environment variables:

```env
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=https://yatra-genie.vercel.app
```

Backend health endpoint:

```text
https://yatra-genie-api.onrender.com/api/health
```

A successful response looks like:

```json
{
  "ok": true
}
```

---

## 🔑 Authentication & Storage

The current application uses:

- `localStorage` for authentication-related state
- `localStorage` for saved trips

The architecture can be extended in the future with cloud-based authentication and persistent database storage.

---

## 🌍 Supported Travel Planning

Yatra Genie provides travel planning across a range of destinations and can generate recommendations based on:

- Destination
- Trip duration
- Travel type
- Budget
- Interests
- Preferred trip pace
- Weather conditions

---

## 🛡️ Error Handling & Fallbacks

Yatra Genie includes fallback handling for external service failures.

If an AI or weather service fails, the application can provide fallback information instead of completely failing the trip-planning experience.

The backend also exposes a health-check endpoint:

```text
GET /api/health
```

---

## 🔮 Future Improvements

Potential future improvements include:

- 🔐 Firebase or OAuth-based authentication
- 🗄️ Cloud database for persistent trips
- 💳 Real-time flight and hotel pricing
- 🗺️ Interactive maps and route optimization
- 💬 AI travel chatbot
- 📍 Location-aware recommendations
- 🌐 Multi-language support
- 📊 Personalized travel history and analytics
- ⚡ API rate limiting and authentication
- 📱 Progressive Web App support

---

## 📸 Project Highlights

### 🤖 AI-Powered Planning
Personalized travel plans generated using specialized AI agents.

### 🌦️ Weather-Aware Recommendations
Weather information is incorporated into the travel planning experience.

### 💰 Budget Personalization
Recommendations are adapted to the user's selected budget level.

### ⚡ Multi-Agent Optimization
Independent agents run concurrently to improve response time.

---

## ⭐ Project Links

🚀 **Live Demo:**  
https://yatra-genie.vercel.app

💻 **Source Code:**  
https://github.com/nan1027/Yatra-Genie

⚙️ **Backend Health Check:**  
https://yatra-genie-api.onrender.com/api/health

---

## 👩‍💻 Author

**Nandita Rishishwar**

B.Tech — Computer Science & Engineering  
VIT Bhopal University

GitHub:  
https://github.com/nan1027

---

## 📄 License

This project is developed for educational, portfolio, and demonstration purposes.
