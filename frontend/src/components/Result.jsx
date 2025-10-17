import { useState } from 'react';
import { motion } from 'framer-motion';
import useQuizStore from '../store/quizStore';

const Result = () => {
  const { score, questions, userAnswers, resetQuiz, saveScore } = useQuizStore();
  const [username, setUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const totalQuestions = questions.length;
  const percentage = Math.round((score / totalQuestions) * 100);

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { text: 'Outstanding! 🎉', color: 'text-success', emoji: '🏆' };
    if (percentage >= 70) return { text: 'Great Job! 👏', color: 'text-primary', emoji: '⭐' };
    if (percentage >= 50) return { text: 'Good Effort! 💪', color: 'text-warning', emoji: '👍' };
    return { text: 'Keep Practicing! 📚', color: 'text-danger', emoji: '💡' };
  };

  const performance = getPerformanceMessage();

  const handleSaveScore = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setSaveMessage('Please enter your name');
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    try {
      await saveScore(username.trim());
      setSaveMessage('Score saved successfully! 🎉');
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    } catch (error) {
      setSaveMessage('Failed to save score. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-4xl w-full"
    >
      <motion.div variants={itemVariants} className="text-center mb-10">
        <div className="text-6xl mb-4">{performance.emoji}</div>
        <h1 className={`text-4xl md:text-5xl font-bold mb-2 ${performance.color}`}>
          {performance.text}
        </h1>
        <p className="text-gray-500 text-lg">
          Quiz Completed!
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="text-center mb-10">
        <div className="relative inline-block">
          <svg className="transform -rotate-90 w-48 h-48">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-gray-200"
            />
            <motion.circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - percentage / 100)}`}
              className="text-primary"
              strokeLinecap="round"
              initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - percentage / 100) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-gray-800">{percentage}%</span>
            <span className="text-gray-500 text-sm">Score</span>
          </div>
        </div>
        <p className="mt-6 text-xl text-gray-700">
          You got <span className="font-bold text-primary">{score}</span> out of{' '}
          <span className="font-bold">{totalQuestions}</span> correct!
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-8">
        <form onSubmit={handleSaveScore} className="max-w-md mx-auto">
          <label className="block text-center mb-2 font-semibold text-gray-700">
            Save Your Score
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              disabled={isSaving}
            />
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
          {saveMessage && (
            <p className={`mt-2 text-center text-sm ${saveMessage.includes('success') ? 'text-success' : 'text-danger'}`}>
              {saveMessage}
            </p>
          )}
        </form>
      </motion.div>

 
      <motion.div variants={itemVariants} className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Review Your Answers
        </h3>
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {questions.map((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  isCorrect 
                    ? 'bg-success/5 border-success' 
                    : 'bg-danger/5 border-danger'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    isCorrect 
                      ? 'bg-success text-white' 
                      : 'bg-danger text-white'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 mb-2">{question.question}</p>
                    <div className="text-sm space-y-1">
                      {userAnswer ? (
                        <>
                          <p className={isCorrect ? 'text-success' : 'text-danger'}>
                            Your answer: <span className="font-medium">{userAnswer}</span>
                            {isCorrect ? ' ✓' : ' ✗'}
                          </p>
                          {!isCorrect && (
                            <p className="text-success">
                              Correct answer: <span className="font-medium">{question.correctAnswer}</span> ✓
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-500">
                          Not answered. Correct answer: <span className="font-medium text-success">{question.correctAnswer}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetQuiz}
          className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          Take Another Quiz
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.print()}
          className="px-8 py-4 bg-white border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary/5 transition-colors"
        >
          Print Results
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Result;

