// src/utils/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAWoweOuv8eJO9BO_BwxMtbaJ9mVl3DQbM",
  authDomain: "typing-speed-app-9bf94.firebaseapp.com",
  projectId: "typing-speed-app-9bf94",
  storageBucket: "typing-speed-app-9bf94.firebasestorage.app",
  messagingSenderId: "856844346797",
  appId: "1:856844346797:web:5a652162c58ec617442d24",
  measurementId: "G-J6T4Q3G5LD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore
const provider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user data already exists in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // First-time login: Store user data
      await setDoc(userDocRef, {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
        firstLoggedIn: new Date().toISOString(),
        results: [], // Initialize with an empty array
      });
    }
    return user;
  } catch (error) {
    console.error(error);
    alert('Error signing in');
  }
};

const logResult = async (uid, result) => {
  const userDocRef = doc(db, 'users', uid);
  try {
    await updateDoc(userDocRef, {
      results: arrayUnion(result), // Add result to Firestore array
    });
  } catch (error) {
    console.error('Error logging result:', error);
  }
};

const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
    alert('Error signing out');
  }
};

export { auth, db, signInWithGoogle, signOutUser, logResult };