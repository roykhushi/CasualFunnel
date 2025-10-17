import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useQuizStore from '../store/quizStore';
import QuestionCard from './QuestionCard';
import Result from './Result';
import { ArrowRight, BookOpenCheck } from 'lucide-react';

const Quiz = () => {
  const {
    questions,
    currentQuestionIndex,
    userAnswers,
    isLoading,
    isQuizStarted,
    isQuizFinished,
    error,
    fetchQuestions,
    startQuiz,
    nextQuestion,
    previousQuestion,
    finishQuiz,
    resetQuiz,
    decrementTimer,
    timerActive,
  } = useQuizStore();

  useEffect(() => {
    let interval;
    if (timerActive && isQuizStarted && !isQuizFinished) {
      interval = setInterval(() => {
        decrementTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, isQuizStarted, isQuizFinished, decrementTimer]);

  useEffect(() => {
    if (questions.length === 0 && !isLoading) {
      fetchQuestions();
    }
  }, []);

  const currentAnswer = userAnswers[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleNext = () => {
    if (isLastQuestion) {
      finishQuiz();
    } else {
      nextQuestion();
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading questions...</p>
          <p className="text-sm text-gray-500 mt-2">Fetching from server</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-danger mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => {
              resetQuiz();
              fetchQuestions();
            }}
            className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!isQuizStarted && questions.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center"
        >
          <div className="mb-8">
            <motion.div 
              className="text-7xl mb-6"
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              🧠
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-red-500 bg-clip-text text-transparent">
              Quiz Challenge
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Test your knowledge with exciting questions!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <motion.div 
              className="bg-gray-200 rounded-xl p-4"
              whileHover={{ scale: 1.05 }}
            >
              <p className="font-bold text-gray-800">{questions.length} Questions</p>
              <p className="text-sm text-gray-600">Multiple Choice</p>
            </motion.div>
            <motion.div 
              className="bg-gray-200 rounded-xl p-4"
              whileHover={{ scale: 1.05 }}
            >
              <p className="font-bold text-gray-800">30 Seconds</p>
              <p className="text-sm text-gray-600">Per Question</p>
            </motion.div>
            <motion.div 
              className="bg-gray-200 rounded-xl p-4"
              whileHover={{ scale: 1.05 }}
            >
              <p className="font-bold text-gray-800">Instant Results</p>
              <p className="text-sm text-gray-600">With Breakdown</p>
            </motion.div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-bold text-lg mb-3 text-gray-800 flex items-center gap-2">
              <span className="text-2xl"><BookOpenCheck /></span>
              Instructions
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Each question has 30 seconds to answer</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Select your answer before the timer runs out</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>You can navigate between questions using Previous/Next buttons</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Your score will be calculated at the end</span>
              </li>
            </ul>
          </div>

          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={startQuiz}
            className="px-12 py-4 bg-red-500 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            Start Quiz 
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (isQuizFinished) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <Result />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <AnimatePresence mode="wait">
        <QuestionCard key={currentQuestionIndex} />
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-3xl"
      >
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
          className={`flex-1 px-6 py-3 font-bold rounded-xl shadow-lg transition-all ${
            currentQuestionIndex === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-white text-primary border-2 border-primary hover:bg-primary/5'
          }`}
        >
          ← Previous
        </motion.button>

        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={handleNext}
          disabled={!currentAnswer}
          className={`flex-1 px-6 py-3 font-bold rounded-xl shadow-lg transition-all ${
            !currentAnswer
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isLastQuestion
              ? 'bg-gradient-to-r from-success to-emerald-600 text-white hover:shadow-xl'
              : 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-xl'
          }`}
        >
          {isLastQuestion ? 'Finish Quiz ✓' : 'Next →'}
        </motion.button>
      </motion.div>

      {!currentAnswer && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-sm text-gray-500"
        >
          Please select an answer to continue
        </motion.p>
      )}
    </div>
  );
};

export default Quiz;

