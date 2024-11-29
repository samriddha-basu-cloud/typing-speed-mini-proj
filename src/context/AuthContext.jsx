import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../utils/firebase';
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for auth

  useEffect(() => {
    // Set persistence to local (across refreshes)
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setLoading(false); // Done loading
        });
        return unsubscribe;
      })
      .catch((error) => {
        console.error('Error setting persistence:', error);
        setLoading(false); // Even on error, stop loading
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    ); // Show a loading screen while checking auth
  }

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};