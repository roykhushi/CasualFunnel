import { Brain } from 'lucide-react';
import Quiz from './components/Quiz';

function App() {
  return (
    <div className="min-h-screen">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl"><Brain /></div>
              <div>
                <h1 className="text-2xl font-bold bg-red-500 bg-clip-text text-transparent">
                  Quiz Master
                </h1>
                <p className="text-xs text-gray-500">Test Your Knowledge</p>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                <span className='font-bold'>Connected</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <Quiz />
      </main>
      <footer className="bg-white/80 backdrop-blur-sm py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <div className="flex flex-col items-center gap-2">
            <p className="font-semibold">Quiz Master Built by Khushi Roy for Casual Funnel</p>
            <p className="flex items-center gap-2 flex-wrap justify-center">
              <span>Data from</span>
              <a
                href="https://opentdb.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 hover:underline font-medium"
              >
                Open Trivia Database
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

