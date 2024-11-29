import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { 
  ChartColumnBig, 
  ClockIcon, 
  CheckCircleIcon, 
  TrendingUpIcon,
  Flame
} from 'lucide-react';
import { db } from '../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const UserHistory = forwardRef((props, ref) => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    totalTests: 0,
    averageSpeed: 0,
    averageAccuracy: 0,
    bestScore: 0,
    bestWpm: 0
  });
  const { user } = useAuth();

  const fetchHistory = async () => {
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const results = userDoc.data().results || [];
          
          // Sort results by date, most recent first
          const sortedResults = results.sort((a, b) => new Date(b.date) - new Date(a.date));
          
          // Limit to last 10 results
          const limitedResults = sortedResults.slice(0, 10);
          
          setHistory(limitedResults);
          
          // Calculate stats
          calculateStats(results);
        }
      } catch (error) {
        console.error("Error fetching user history:", error);
      }
    }
  };

  const calculateStats = (results) => {
    if (results.length === 0) return;

    const totalTests = results.length;
    const averageSpeed = results.reduce((sum, result) => sum + (result.wpm || 0), 0) / totalTests;
    const averageAccuracy = results.reduce((sum, result) => sum + parseFloat(result.accuracy), 0) / totalTests;
    const bestScore = Math.max(...results.map(r => parseFloat(r.accuracy)));
    const bestWpm = Math.max(...results.map(r => r.wpm || 0));

    setStats({
      totalTests,
      averageSpeed: Math.round(averageSpeed),
      averageAccuracy: averageAccuracy.toFixed(2),
      bestScore: bestScore.toFixed(2),
      bestWpm
    });
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  // Expose the refreshHistory method to the parent
  useImperativeHandle(ref, () => ({
    refreshHistory: fetchHistory,
  }));

  return (
    <div className="space-y-8">
      {/* Performance Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-5 border-b-4 border-blue-500 hover:shadow-xl transition-all">
          <ChartColumnBig className="w-12 h-12 text-blue-600 flex-shrink-0" />
          <div>
            <p className="text-gray-500 text-sm uppercase tracking-wider">Total Tests</p>
            <p className="text-2xl font-bold text-blue-800">{stats.totalTests}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-5 border-b-4 border-green-500 hover:shadow-xl transition-all">
          <Flame className="w-12 h-12 text-green-600 flex-shrink-0" />
          <div>
            <p className="text-gray-500 text-sm uppercase tracking-wider">Best WPM</p>
            <p className="text-2xl font-bold text-green-800">{stats.bestWpm}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-5 border-b-4 border-purple-500 hover:shadow-xl transition-all">
          <CheckCircleIcon className="w-12 h-12 text-purple-600 flex-shrink-0" />
          <div>
            <p className="text-gray-500 text-sm uppercase tracking-wider">Avg Accuracy</p>
            <p className="text-2xl font-bold text-purple-800">{stats.averageAccuracy}%</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-5 border-b-4 border-red-500 hover:shadow-xl transition-all">
          <TrendingUpIcon className="w-12 h-12 text-red-600 flex-shrink-0" />
          <div>
            <p className="text-gray-500 text-sm uppercase tracking-wider">Avg WPM</p>
            <p className="text-2xl font-bold text-red-800">{stats.averageSpeed}</p>
          </div>
        </div>
      </div>

      {/* Test History */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center border-b pb-4">
          <ClockIcon className="mr-4 w-7 h-7 text-blue-600" />
          Recent Test History
        </h2>
        
        {history.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl">
            <p className="text-xl text-gray-600 font-semibold">No typing tests taken yet</p>
            <p className="text-sm text-gray-500 mt-3">Complete a typing test to track your progress!</p>
          </div>
        ) : (
          <div className="space-y-5">
            {history.map((result, index) => (
              <div 
                key={index} 
                className="
                  bg-gray-50 
                  border-l-4 
                  border-blue-500 
                  p-5 
                  rounded-lg
                  transition 
                  hover:bg-gray-100
                  hover:shadow-md
                "
              >
                <div className="flex justify-between items-center">
                  <div className="flex-grow">
                    <p className="text-gray-500 text-sm mb-2">
                      {new Date(result.date).toLocaleString()}
                    </p>
                    <div className="flex space-x-6">
                      <div className="flex items-center space-x-2">
                        <Flame className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700 font-medium">{result.wpm || 'N/A'} WPM</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700 font-medium">{result.time}s</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-5 h-5 text-purple-600" />
                        <span className="text-gray-700 font-medium">{result.accuracy}%</span>
                      </div>
                    </div>
                  </div>
                  <div 
                    className={`
                      px-4 
                      py-2 
                      rounded-full 
                      text-sm 
                      font-semibold
                      ${
                        parseFloat(result.accuracy) >= 90 
                          ? 'bg-green-100 text-green-800'
                          : parseFloat(result.accuracy) >= 70 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }
                    `}
                  >
                    {
                      parseFloat(result.accuracy) >= 90 
                        ? 'Excellent' 
                        : parseFloat(result.accuracy) >= 70 
                          ? 'Good' 
                          : 'Needs Improvement'
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default UserHistory;