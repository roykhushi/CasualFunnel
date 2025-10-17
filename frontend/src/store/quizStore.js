import { create } from 'zustand';
import he from 'he';

const API_BASE_URL = 'https://quizmaster-knxg.onrender.com/api';

const useQuizStore = create((set, get) => ({
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: [],
  score: 0,
  
  isLoading: false,
  isQuizStarted: false,
  isQuizFinished: false,
  error: null,
  
  timeLeft: 30, // 30 seconds per question
  timerActive: false,

  fetchQuestions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/questions?amount=15`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch questions from server');
      }

      const data = await response.json();
      
      if (data.response_code !== 0) {
        throw new Error('Failed to fetch questions. Please try again.');
      }

      const processedQuestions = data.results.map((q) => {
        const incorrectAnswers = q.incorrect_answers.map(a => he.decode(a));
        const correctAnswer = he.decode(q.correct_answer);
        
        const allAnswers = [...incorrectAnswers, correctAnswer]
          .sort(() => Math.random() - 0.5);
        
        return {
          question: he.decode(q.question),
          correctAnswer: correctAnswer,
          answers: allAnswers,
          category: he.decode(q.category),
          difficulty: q.difficulty,
        };
      });

      set({ 
        questions: processedQuestions, 
        isLoading: false,
        userAnswers: new Array(processedQuestions.length).fill(null),
      });
    } catch (error) {
      console.error('Error fetching questions:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  startQuiz: () => {
    set({ 
      isQuizStarted: true, 
      currentQuestionIndex: 0,
      timerActive: true,
      timeLeft: 30,
    });
  },

  selectAnswer: (answer) => {
    const { currentQuestionIndex, userAnswers } = get();
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    set({ userAnswers: newAnswers });
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      set({ 
        currentQuestionIndex: currentQuestionIndex + 1,
        timeLeft: 30,
      });
    }
  },

 
  previousQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ 
        currentQuestionIndex: currentQuestionIndex - 1,
        timeLeft: 30,
      });
    }
  },

 
  finishQuiz: () => {
    const { questions, userAnswers } = get();
    let correctCount = 0;
    
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    set({ 
      score: correctCount, 
      isQuizFinished: true,
      timerActive: false,
    });
  },


  saveScore: async (username) => {
    const { score, questions } = get();
    const totalQuestions = questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    try {
      const response = await fetch(`${API_BASE_URL}/scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          score,
          totalQuestions,
          percentage,
          date: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save score');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error saving score:', error);
      throw error;
    }
  },

  resetQuiz: () => {
    set({
      questions: [],
      currentQuestionIndex: 0,
      userAnswers: [],
      score: 0,
      isLoading: false,
      isQuizStarted: false,
      isQuizFinished: false,
      error: null,
      timeLeft: 30,
      timerActive: false,
    });
  },


  decrementTimer: () => {
    const { timeLeft, timerActive } = get();
    if (timerActive && timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 });
    } else if (timeLeft === 0) {
      const { currentQuestionIndex, questions } = get();
      if (currentQuestionIndex < questions.length - 1) {
        get().nextQuestion();
      } else {
        get().finishQuiz();
      }
    }
  },

  setTimerActive: (active) => {
    set({ timerActive: active });
  },
}));

export default useQuizStore;

