# Quiz Master - Full Stack Quiz Application

A modern, interactive quiz application built with React (frontend) and Express (backend). Features real-time scoring, timer, animations, and persistent score storage.


## Features

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for beautiful, responsive UI
- **Framer Motion** for smooth animations
- **Zustand** for lightweight state management
- **Timer** - 30 seconds per question
- **Progress tracking** - Visual progress bar
- **Score calculation** - Instant results with detailed breakdown
- **Fully responsive** - Works on all devices

### Backend
- **Express.js** REST API
- **Persistent storage** - Scores saved to JSON file
- **API proxy** - Fetches questions from Open Trivia DB
- **Leaderboard** - Track top scores
- **Statistics** - Overall quiz stats

## 🛠️ Tech Stack

### Frontend (`/frontend`)
- React 18.3.1
- Vite 5.3.1
- Tailwind CSS 3.4.4
- Zustand 4.5.2
- Framer Motion 11.2.10

### Backend (`/backend`)
- Node.js (ES Modules)
- Express 4.18.2
- CORS 2.8.5
- node-fetch 3.3.2

## Project Structure

```
casual_funnel/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Quiz.jsx      # Main quiz logic
│   │   │   ├── QuestionCard.jsx
│   │   │   └── Result.jsx    # Results screen
│   │   ├── store/
│   │   │   └── quizStore.js  # Zustand state management
│   │   ├── App.jsx           # Root component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                  # Express backend
│   ├── data/                 # Persistent data storage
│   │   └── scores.json       # Saved scores
│   ├── server.js             # Express server
│   └── package.json
│
└── README.md                 # This file
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd casual_funnel
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

You need to run both frontend and backend servers:

#### Option 1: Run in Separate Terminals

**Terminal 1 - Backend Server:**
```bash
cd backend
npm start
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Frontend Dev Server:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:3000`

#### Option 2: Development Mode (with auto-reload)

**Backend (with auto-reload):**
```bash
cd backend
npm run dev
```

**Frontend (with hot-reload):**
```bash
cd frontend
npm run dev
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## How to Use

1. **Start Quiz** - Click the "Start Quiz" button on the home screen
2. **Answer Questions** - Select an answer from the multiple choices
3. **Navigate** - Use Previous/Next buttons to move between questions
4. **Timer** - Each question has a 30-second timer
5. **Finish** - Click "Finish Quiz" on the last question
6. **View Results** - See your score with detailed breakdown
7. **Save Score** - Enter your name to save your score
8. **Restart** - Take another quiz anytime

## API Endpoints

### Backend API (`http://localhost:5000/api`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/questions` | Fetch quiz questions |
| GET | `/scores` | Get all scores |
| POST | `/scores` | Save new score |
| GET | `/leaderboard` | Get top scores |
| GET | `/stats` | Get quiz statistics |
| DELETE | `/scores/:id` | Delete a score |

### Example API Calls

**Get Questions:**
```bash
curl http://localhost:5000/api/questions?amount=15
```

**Save Score:**
```bash
curl -X POST http://localhost:5000/api/scores \
  -H "Content-Type: application/json" \
  -d '{"username":"John Doe","score":12,"totalQuestions":15,"percentage":80}'
```

**Get Leaderboard:**
```bash
curl http://localhost:5000/api/leaderboard?limit=10
```

## API Data Source

Questions are fetched from the [Open Trivia Database](https://opentdb.com/):
- Free to use
- No API key required
- Various categories and difficulties
- Regular updates


# CasualFunnel
