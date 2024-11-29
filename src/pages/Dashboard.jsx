import React, { useState, useRef, Suspense } from 'react';
import { 
  RefreshCwIcon, 
  ChartColumnIcon, 
  ClockIcon, 
  TrendingUpIcon, 
  BookOpenIcon 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import TypingTest from '../components/TypingTest';
import Results from '../components/Results';
import UserHistory from '../components/UserHistory';
import { useAuth } from '../context/AuthContext';
import { logResult } from '../utils/firebase';

const Dashboard = () => {
  const [testResult, setTestResult] = useState(null);
  const [testMode, setTestMode] = useState('30-second');
  const { user } = useAuth();
  const historyRef = useRef(null);

  const handleComplete = async (timeTaken, typingAccuracy, wordsPerMinute) => {
  const result = {
    time: timeTaken.toFixed(2),
    accuracy: typingAccuracy,
    wpm: wordsPerMinute,
    mode: testMode,
    date: new Date().toISOString(),
  };

  // Set the test result state
  setTestResult({
    duration: timeTaken,
    accuracy: typingAccuracy,
    wpm: wordsPerMinute
  });

  // Log result if user is authenticated
  if (user) {
    try {
      await logResult(user.uid, result);
      // Refresh history if component is available
      if (historyRef.current?.refreshHistory) {
        historyRef.current.refreshHistory();
      }
    } catch (error) {
      console.error('Failed to log result:', error);
    }
  }
};

  const handleRetry = () => {
    setTestResult(null);
  };

  const testModes = [
    { 
      label: '30 sec', 
      value: '30-second', 
      icon: <ClockIcon className="w-5 h-5 text-blue-500" />
    },
    { 
      label: '1 min', 
      value: '1-minute', 
      icon: <TrendingUpIcon className="w-5 h-5 text-green-500" />
    },
    { 
      label: '3 min', 
      value: '3-minute', 
      icon: <BookOpenIcon className="w-5 h-5 text-purple-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 selection:bg-blue-200">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Test Mode Selector */}
        <div className="flex justify-center mb-8 space-x-4">
          {testModes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => setTestMode(mode.value)}
              className={`
                flex 
                items-center 
                space-x-2 
                px-4 
                py-2 
                rounded-lg 
                transition 
                transform 
                hover:scale-105 
                focus:outline-none 
                focus:ring-2 
                focus:ring-blue-500 
                ${testMode === mode.value 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-blue-50 shadow-md'}
              `}
            >
              {mode.icon}
              <span className="font-medium">{mode.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="space-y-6">
          {/* Typing Test Column */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-b-4 border-blue-500 transition-all hover:shadow-2xl">
            {!testResult ? (
              <TypingTest 
                onComplete={handleComplete} 
                mode={testMode}
              />
            ) : (
              <Results 
                duration={testResult.duration} 
                accuracy={testResult.accuracy} 
                wpm={testResult.wpm}
                mode={testMode}
                onRetry={handleRetry} 
              />
            )}
          </div>

          {/* User History Column */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-b-4 border-green-500 transition-all hover:shadow-2xl">
            <Suspense fallback={
              <div className="text-center text-gray-500 animate-pulse flex items-center justify-center space-x-2">
                <ChartColumnIcon className="w-6 h-6 animate-bounce" />
                <span>Loading history...</span>
              </div>
            }>
              <UserHistory ref={historyRef} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;