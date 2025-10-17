import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for scores
let scores = [];

// File path for persistent storage
const SCORES_FILE = path.join(__dirname, 'data', 'scores.json');

/**
 * Ensure data directory exists
 */
async function ensureDataDirectory() {
  const dataDir = path.join(__dirname, 'data');
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

/**
 * Load scores from file on server start
 */
async function loadScores() {
  try {
    const data = await fs.readFile(SCORES_FILE, 'utf-8');
    scores = JSON.parse(data);
    console.log('✓ Loaded', scores.length, 'scores from file');
  } catch (error) {
    // File doesn't exist yet, start with empty array
    scores = [];
    console.log('✓ Starting with empty scores');
  }
}

/**
 * Save scores to file
 */
async function saveScores() {
  try {
    await fs.writeFile(SCORES_FILE, JSON.stringify(scores, null, 2));
  } catch (error) {
    console.error('✗ Error saving scores:', error);
  }
}

// Initialize
await ensureDataDirectory();
await loadScores();

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Quiz Backend API is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * @route   GET /api/questions
 * @desc    Fetch questions from Open Trivia DB
 * @query   amount, category, difficulty, type
 */
app.get('/api/questions', async (req, res) => {
  try {
    const amount = req.query.amount || 15;
    const category = req.query.category || '';
    const difficulty = req.query.difficulty || '';
    const type = req.query.type || '';

    // Build API URL
    let apiUrl = `https://opentdb.com/api.php?amount=${amount}`;
    if (category) apiUrl += `&category=${category}`;
    if (difficulty) apiUrl += `&difficulty=${difficulty}`;
    if (type) apiUrl += `&type=${type}`;

    console.log(`📥 Fetching questions: amount=${amount}`);

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.response_code !== 0) {
      return res.status(400).json({
        error: 'Failed to fetch questions',
        code: data.response_code,
        message: 'The API request failed. Please try again.'
      });
    }

    console.log(`✓ Fetched ${data.results.length} questions`);
    res.json(data);
  } catch (error) {
    console.error('❌ Error fetching questions:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch questions from the API'
    });
  }
});

/**
 * @route   GET /api/scores
 * @desc    Get all scores
 * @query   limit
 */
app.get('/api/scores', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || scores.length;
    const sortedScores = [...scores]
      .sort((a, b) => b.score - a.score || new Date(b.date) - new Date(a.date))
      .slice(0, limit);
    
    res.json({
      total: scores.length,
      scores: sortedScores,
    });
  } catch (error) {
    console.error('❌ Error fetching scores:', error);
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

/**
 * @route   POST /api/scores
 * @desc    Save a new quiz score
 * @body    { username, score, totalQuestions, percentage, date }
 */
app.post('/api/scores', async (req, res) => {
  try {
    const { username, score, totalQuestions, percentage, date } = req.body;

    // Validate input
    if (!username || score === undefined || totalQuestions === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['username', 'score', 'totalQuestions']
      });
    }

    const newScore = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      username: username.trim(),
      score: parseInt(score),
      totalQuestions: parseInt(totalQuestions),
      percentage: percentage || Math.round((score / totalQuestions) * 100),
      date: date || new Date().toISOString(),
    };

    scores.push(newScore);
    
    // Save to file
    await saveScores();

    console.log(`💾 Score saved: ${newScore.username} - ${newScore.score}/${newScore.totalQuestions} (${newScore.percentage}%)`);

    res.status(201).json({
      message: 'Score saved successfully',
      score: newScore,
    });
  } catch (error) {
    console.error('❌ Error saving score:', error);
    res.status(500).json({ error: 'Failed to save score' });
  }
});

/**
 * @route   GET /api/leaderboard
 * @desc    Get top scores (best score per user)
 * @query   limit
 */
app.get('/api/leaderboard', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // Calculate best scores per user
    const userBestScores = {};
    scores.forEach(score => {
      if (!userBestScores[score.username] || 
          score.percentage > userBestScores[score.username].percentage ||
          (score.percentage === userBestScores[score.username].percentage && 
           score.score > userBestScores[score.username].score)) {
        userBestScores[score.username] = score;
      }
    });

    const leaderboard = Object.values(userBestScores)
      .sort((a, b) => b.percentage - a.percentage || b.score - a.score)
      .slice(0, limit)
      .map((score, index) => ({
        ...score,
        rank: index + 1
      }));

    res.json({
      total: Object.keys(userBestScores).length,
      leaderboard,
    });
  } catch (error) {
    console.error('❌ Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

/**
 * @route   GET /api/stats
 * @desc    Get overall quiz statistics
 */
app.get('/api/stats', (req, res) => {
  try {
    if (scores.length === 0) {
      return res.json({
        totalQuizzes: 0,
        uniqueUsers: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
      });
    }

    const totalQuizzes = scores.length;
    const uniqueUsers = new Set(scores.map(s => s.username)).size;
    const averageScore = scores.reduce((sum, s) => sum + s.percentage, 0) / totalQuizzes;
    const highestScore = Math.max(...scores.map(s => s.percentage));
    const lowestScore = Math.min(...scores.map(s => s.percentage));

    res.json({
      totalQuizzes,
      uniqueUsers,
      averageScore: Math.round(averageScore * 10) / 10,
      highestScore,
      lowestScore,
    });
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

/**
 * @route   DELETE /api/scores/:id
 * @desc    Delete a score by ID
 */
app.delete('/api/scores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const initialLength = scores.length;
    
    scores = scores.filter(score => score.id !== id);

    if (scores.length === initialLength) {
      return res.status(404).json({ error: 'Score not found' });
    }

    await saveScores();

    console.log(`🗑️  Score deleted: ${id}`);
    res.json({ message: 'Score deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting score:', error);
    res.status(500).json({ error: 'Failed to delete score' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('💥 Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║          🎯 Quiz App Backend Server                   ║
║                                                       ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║  Status:  ✓ Running                                   ║
║  Port:    ${PORT}                                         ║
║  URL:     http://localhost:${PORT}                        ║
║  API:     http://localhost:${PORT}/api                    ║
║                                                       ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║  Available Endpoints:                                 ║
║  ────────────────────                                 ║
║  GET    /api/health        - Health check             ║
║  GET    /api/questions     - Fetch quiz questions     ║
║  GET    /api/scores        - Get all scores           ║
║  POST   /api/scores        - Save new score           ║
║  GET    /api/leaderboard   - Get top scores           ║
║  GET    /api/stats         - Get statistics           ║
║  DELETE /api/scores/:id    - Delete score             ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

export default app;


