import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDOXINyVnMHBSiFlmfWmM971Toq3h8O8s",
  authDomain: "byd-go.firebaseapp.com",
  projectId: "byd-go",
  storageBucket: "byd-go.firebasestorage.app",
  messagingSenderId: "834970748149",
  appId: "1:834970748149:web:d39363ec13eba4530f31bc",
  measurementId: "G-DL8NBTP3RX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only works on web)
let analytics;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.log('Analytics initialization error:', error);
  }
}

// Initialize Auth
// Note: Firebase Auth automatically persists auth state in React Native
// using AsyncStorage under the hood, so we don't need to configure it manually
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { auth, db, storage, analytics };
