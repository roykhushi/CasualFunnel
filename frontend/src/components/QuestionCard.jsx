import { motion } from 'framer-motion';
import useQuizStore from '../store/quizStore';

const QuestionCard = () => {
  const { 
    questions, 
    currentQuestionIndex, 
    userAnswers, 
    selectAnswer,
    timeLeft,
  } = useQuizStore();

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = userAnswers[currentQuestionIndex];

  if (!currentQuestion) return null;

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -100, transition: { duration: 0.3 } },
  };

  const answerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98 },
  };

  const getTimerColor = () => {
    if (timeLeft > 20) return 'text-success';
    if (timeLeft > 10) return 'text-warning';
    return 'text-danger';
  };

  const getDifficultyColor = () => {
    switch(currentQuestion.difficulty) {
      case 'easy':
        return 'bg-success/10 text-success';
      case 'medium':
        return 'bg-warning/10 text-warning';
      case 'hard':
        return 'bg-danger/10 text-danger';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <motion.div
      key={currentQuestionIndex}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 max-w-3xl w-full"
    >
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-block bg-primary/10 text-red-500 px-4 py-1 rounded-full text-sm font-medium">
            {currentQuestion.category}
          </span>
          <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${getDifficultyColor()}`}>
            {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
          </span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h3>
          <div className={`flex items-center gap-2 font-bold text-lg ${getTimerColor()}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{timeLeft}s</span>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
          {currentQuestion.question}
        </h2>
      </div>

      <div className="space-y-4">
        {currentQuestion.answers.map((answer, index) => {
          const isSelected = selectedAnswer === answer;
          
          return (
            <motion.button
              key={index}
              custom={index}
              variants={answerVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              onClick={() => selectAnswer(answer)}
              className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-primary bg-blue-200 text-white shadow-lg'
                  : 'border-gray-200 bg-gray-50 text-gray-800 hover:border-primary hover:bg-primary/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                  isSelected 
                    ? 'bg-white text-primary' 
                    : 'bg-white text-gray-400'
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1 text-lg font-medium">
                  {answer}
                </span>

                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex-shrink-0"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
      <div className="mt-8">
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-center text-sm text-gray-500 mt-2">
          {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% completed
        </p>
      </div>
    </motion.div>
  );
};

export default QuestionCard;

