import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { RefreshCwIcon, ClockIcon, TargetIcon } from 'lucide-react';
import { db } from '../utils/firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const Results = ({ duration, accuracy, mode, onRetry }) => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState({
    averageWpm: 50,
    bestWpm: 95,
    averageAccuracy: 85,
    bestAccuracy: 95
  });

  const words = 6; // Example: Calculate words based on average word length in the sentences
  const wordsPerMinute = Math.round((words / duration) * 60);

  // Fetch user stats and save current result
  useEffect(() => {
    const saveResultAndFetchStats = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          
          // Prepare the new result object
          const newResult = {
            date: new Date().toISOString(),
            wpm: wordsPerMinute,
            accuracy: accuracy,
            time: duration.toFixed(2),
            mode: mode
          };

          // Update user document with new result
          await updateDoc(userDocRef, {
            results: arrayUnion(newResult)
          });

          // Fetch updated user stats
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const results = userDoc.data().results || [];
            
            // Calculate stats
            const averageWpm = results.length 
              ? Math.round(results.reduce((sum, result) => sum + (result.wpm || 0), 0) / results.length)
              : 0;
            
            const bestWpm = results.length 
              ? Math.max(...results.map(r => r.wpm || 0))
              : 0;
            
            const averageAccuracy = results.length 
              ? results.reduce((sum, result) => sum + parseFloat(result.accuracy), 0) / results.length
              : 0;
            
            const bestAccuracy = results.length 
              ? Math.max(...results.map(r => parseFloat(r.accuracy)))
              : 0;

            setUserStats({
              averageWpm,
              bestWpm,
              averageAccuracy: parseFloat(averageAccuracy.toFixed(2)),
              bestAccuracy: parseFloat(bestAccuracy.toFixed(2))
            });
          }
        } catch (error) {
          console.error("Error saving result or fetching stats:", error);
        }
      }
    };

    saveResultAndFetchStats();
  }, [user, wordsPerMinute, accuracy, duration, mode]);

  // Prepare data for charts
  const wpmData = [
    { name: 'Current Test', wpm: wordsPerMinute },
    { name: 'Average', wpm: userStats.averageWpm }, 
    { name: 'Best', wpm: userStats.bestWpm }
  ];

  const accuracyData = [
    { name: 'Current Test', accuracy: accuracy },
    { name: 'Average', accuracy: userStats.averageAccuracy },
    { name: 'Best', accuracy: userStats.bestAccuracy }
  ];

  // Color mapping for performance
  const getPerformanceColor = (wpm) => {
    if (wpm < 30) return 'text-red-600';
    if (wpm < 50) return 'text-orange-600';
    if (wpm < 70) return 'text-blue-600';
    return 'text-green-600';
  };

  return (
    <div className="p-8 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Typing Test Results</h2>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4">
          <ClockIcon className="w-10 h-10 text-blue-600" />
          <div>
            <p className="text-gray-500 text-sm">Time</p>
            <p className="text-xl font-bold text-gray-800">{duration.toFixed(2)} sec ({mode})</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4">
          <TargetIcon className="w-10 h-10 text-green-600" />
          <div>
            <p className="text-gray-500 text-sm">Accuracy</p>
            <p className={`text-xl font-bold ${accuracy >= 90 ? 'text-green-600' : accuracy >= 70 ? 'text-orange-600' : 'text-red-600'}`}>
              {accuracy}%
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4">
          <RefreshCwIcon className="w-10 h-10 text-purple-600" />
          <div>
            <p className="text-gray-500 text-sm">Words Per Minute</p>
            <p className={`text-xl font-bold ${getPerformanceColor(wordsPerMinute)}`}>
              {wordsPerMinute} WPM
            </p>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {/* WPM Line Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Words Per Minute</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={wpmData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'WPM', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#f9f9f9', 
                  border: '1px solid #e0e0e0', 
                  borderRadius: '8px' 
                }}
              />
              <Line 
                type="monotone" 
                dataKey="wpm" 
                stroke="#3b82f6" 
                strokeWidth={3}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Accuracy Bar Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Accuracy</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={accuracyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Accuracy %', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#f9f9f9', 
                  border: '1px solid #e0e0e0', 
                  borderRadius: '8px' 
                }}
              />
              <Bar 
                dataKey="accuracy" 
                fill="#10b981" 
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <button
        onClick={onRetry}
        className="
          flex 
          items-center 
          justify-center 
          mx-auto 
          mt-6
          space-x-2 
          bg-blue-600 
          text-white 
          px-6 
          py-3 
          rounded-lg 
          hover:bg-blue-700 
          transition 
          duration-300 
          ease-in-out 
          shadow-md 
          hover:shadow-lg
        "
      >
        <RefreshCwIcon className="w-5 h-5 mr-2" />
        Try Again
      </button>
    </div>
  );
};

export default Results;