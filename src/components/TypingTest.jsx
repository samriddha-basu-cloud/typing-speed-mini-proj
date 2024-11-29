import React, { useState, useEffect, useRef } from 'react';
import { RefreshCwIcon, ClockIcon, TargetIcon } from 'lucide-react';

const TypingTest = ({ onComplete, mode = '30-second' }) => {
  const sentences = [
    'The quick brown fox jumps over the lazy dog.',
    'Practice makes a man perfect.',
    'Typing fast is a skill worth mastering.',
    'Coding is both an art and a science.',
    'Good things come to those who wait.',
    'Success is not final, failure is not fatal.',
    'Believe you can and you are halfway there.',
    'The only way to do great work is to love what you do.',
    'Every great dream begins with a dreamer always remembering the impossible is possible.',
    'The future belongs to those who believe in the beauty of their dreams.',
    'Innovation distinguishes between a leader and a follower in the world of technology.',
    'Learning never exhausts the mind, it only opens up new horizons of understanding.',
    'Perseverance is not a long race; it is many short races one after the other.',
    'Creativity is intelligence having fun with the endless possibilities of imagination.',
    'Your attitude determines your direction in life and work.',
    'Continuous improvement is better than delayed perfection in every endeavor.',
    'Knowledge is power, but enthusiasm pulls the switch and lights up the world.',
    'The best way to predict the future is to create it with consistent hard work.',
    'Challenges are what make life interesting, overcoming them is what makes life meaningful.',
    'Passion is energy, feel the power that comes from focusing on what excites you.',
    'Success is not how high you have climbed, but how you make a positive difference.',
    'Intelligent people learn from everything and everyone around them constantly.',
    'The harder you work, the luckier you become in achieving your goals.',
    'Embrace change, learn to adapt quickly, and stay curious about new opportunities.',
    'Your mind is a powerful tool that can transform dreams into remarkable realities.',
    'Kindness is a language which the deaf can hear and the blind can see.',
    'Great things never come from comfort zones and mediocre efforts.',
    'Every moment is a fresh beginning to create something extraordinary.',
    'Discipline is the bridge between goals and accomplishments in life.',
    'Imagination is more important than knowledge in solving complex problems.',
    'The best investment you can make is in yourself and your continuous growth.',
    'Courage is not the absence of fear, but the triumph over it.',
    'Your potential is limited only by your own imagination and determination.',
    'Simplicity is the ultimate sophistication in design and problem solving.',
    'Success requires both hard work and smart strategies.',
    'Learn from yesterday, live for today, hope for tomorrow.',
    'Consistency is the key to unlocking your true potential and mastery.',
    'Small progress is still progress, no matter how slow you go.',
    'Adaptability is the key to survival and success in a changing world.'
];

  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [accuracy, setAccuracy] = useState(100);
  const [timeLeft, setTimeLeft] = useState(0);
  const [wpm, setWpm] = useState(0);
  const inputRef = useRef(null);

  // Determine test duration based on mode
  const testDurations = {
    '30-second': 30,
    '1-minute': 60,
    '3-minute': 180
  };

  // Initialize text and timer
  useEffect(() => {
    // Pick a random sentence
    const randomIndex = Math.floor(Math.random() * sentences.length);
    setText(sentences[randomIndex]);
    
    // Set initial time based on mode
    setTimeLeft(testDurations[mode]);
    
    // Focus input on mount
    inputRef.current?.focus();
  }, [mode]);

  // Timer and test completion logic
  useEffect(() => {
    let timer;
    if (startTime && timeLeft > 0) {
      timer = setInterval(() => {
        const currentTime = Math.max(0, Math.floor(testDurations[mode] - (new Date() - startTime) / 1000));
        setTimeLeft(currentTime);

        // Calculate WPM 
        if (startTime) {
          const elapsedMinutes = (new Date() - startTime) / 60000;
          const wordsTyped = input.trim().split(/\s+/).length;
          const calculatedWpm = Math.round(wordsTyped / elapsedMinutes);
          setWpm(calculatedWpm);
        }

        // Test completion when time runs out
        if (currentTime <= 0) {
          clearInterval(timer);
          handleTestCompletion();
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [startTime, mode, input]);

  // Accuracy calculation
  useEffect(() => {
    const calculateAccuracy = () => {
      const correctChars = input
        .split('')
        .filter((char, index) => char === text[index]).length;
      const inputLength = input.length;
      const calculatedAccuracy = inputLength === 0 ? 100 : (correctChars / inputLength) * 100;
      setAccuracy(calculatedAccuracy.toFixed(2));
    };

    calculateAccuracy();
  }, [input, text]);

  const handleChange = (e) => {
    if (!startTime) {
      setStartTime(new Date()); // Start timer on first character
    }
    setInput(e.target.value);

    // Complete test if entire text is typed correctly
    if (e.target.value === text) {
      handleTestCompletion();
    }
  };

  const handleTestCompletion = () => {
    const duration = startTime ? (new Date() - startTime) / 1000 : 0;
    
    // Final WPM calculation at test completion
    const wordsTyped = input.trim().split(/\s+/).length;
    const finalWpm = Math.round(wordsTyped / (duration / 60));
    
    onComplete(duration, parseFloat(accuracy), finalWpm);
  };

  const handleReset = () => {
    // Pick a new random sentence
    const randomIndex = Math.floor(Math.random() * sentences.length);
    setText(sentences[randomIndex]);
    setInput('');
    setStartTime(null);
    setTimeLeft(testDurations[mode]);
    setWpm(0);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    // Complete test if Enter is pressed and input matches the text
    if (e.key === 'Enter' || input === text) {
      handleTestCompletion();
    }
  };

  // Highlight correct and incorrect characters
  const renderText = () => {
    return text.split('').map((char, index) => {
      const isCorrect = input[index] === char;
      const hasTyped = index < input.length;
      
      return (
        <span
          key={index}
          className={`
            transition-colors 
            ${hasTyped 
              ? (isCorrect 
                  ? 'text-emerald-600' 
                  : 'text-red-600 underline') 
              : 'text-gray-500'}
          `}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  return (
    <div className="space-y-6 bg-white rounded-2xl p-8 shadow-lg">
      {/* Test Information */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
            <ClockIcon className="w-4 h-4 text-blue-600" />
            <span className="text-blue-800 font-medium">
              {mode.replace('-', ' ').toUpperCase()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <TargetIcon className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Accuracy:</span>
            <span 
              className={`
                font-bold 
                ${accuracy >= 90 
                  ? 'text-emerald-600' 
                  : accuracy >= 70 
                    ? 'text-yellow-600' 
                    : 'text-red-600'}
              `}
            >
              {accuracy}%
            </span>
          </div>
        </div>
        
        {/* Timer and WPM */}
        <div className="flex items-center space-x-4">
          <div 
            className={`
              text-2xl font-bold 
              flex items-center space-x-2
              ${timeLeft <= 10 ? 'text-red-600' : 'text-blue-600'}
            `}
          >
            <ClockIcon className="w-5 h-5" />
            <span>{timeLeft}s</span>
          </div>
          <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1 rounded-full">
            <span className="text-purple-800 font-medium">WPM: {wpm}</span>
          </div>
        </div>
      </div>

      {/* Text Display */}
      <div 
        className="
          text-xl 
          font-medium 
          text-center 
          p-6 
          bg-gray-100 
          rounded-xl 
          min-h-[120px] 
          flex 
          items-center 
          justify-center
          shadow-inner
        "
      >
        {renderText()}
      </div>

      {/* Input Area */}
      <div className="relative">
        <input
          ref={inputRef}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="
            w-full 
            p-4 
            border-2 
            border-gray-300
            rounded-xl 
            focus:outline-none 
            focus:border-blue-500 
            focus:ring-2
            focus:ring-blue-200
            transition-all
            text-lg
            shadow-sm
          "
          placeholder="Start typing here..."
          disabled={timeLeft <= 0}
        />
        
        {/* Reset Button */}
        <button 
          onClick={handleReset}
          className="
            absolute 
            right-2 
            top-1/2 
            transform 
            -translate-y-1/2 
            text-gray-400 
            hover:text-blue-600 
            transition
            focus:outline-none
            focus:ring-2
            focus:ring-blue-300
            rounded-full
            p-1
          "
          aria-label="Reset Test"
        >
          <RefreshCwIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TypingTest;