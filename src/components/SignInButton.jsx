import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../utils/firebase';
import { BsGoogle } from 'react-icons/bs';

const SignInButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const user = await signInWithGoogle();
      
      if (user) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Sign-in failed. Please try again.');
      console.error('Sign-in error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-md">
      <button
        onClick={handleSignIn}
        disabled={loading}
        className={`
          w-full 
          flex 
          items-center 
          justify-center 
          space-x-3 
          py-3 
          px-6 
          rounded-lg 
          text-white 
          font-semibold 
          transition 
          duration-300 
          ease-in-out 
          transform 
          hover:scale-105 
          focus:outline-none 
          focus:ring-4 
          focus:ring-blue-300 
          bg-gradient-to-r 
          from-blue-500 
          to-blue-600 
          ${loading ? 'cursor-not-allowed opacity-70' : 'hover:shadow-lg'}
        `}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <svg 
              className="animate-spin h-5 w-5 text-white" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              ></circle>
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Signing In...</span>
          </div>
        ) : (
          <>
            <BsGoogle className="w-6 h-6" />
            <span>Sign in with Google</span>
          </>
        )}
      </button>

      {error && (
        <div 
          className="
            w-full 
            bg-red-50 
            border 
            border-red-300 
            text-red-700 
            px-4 
            py-2 
            rounded-lg 
            text-center 
            animate-pulse
          "
        >
          {error}
        </div>
      )}

      <div className="text-sm text-gray-500 text-center">
        Secure authentication powered by Google
      </div>
    </div>
  );
};

export default SignInButton;