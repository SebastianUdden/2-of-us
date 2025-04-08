import { FirebaseApp, getApps, initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase only if it hasn't been initialized already
let app: FirebaseApp;
if (!getApps().length) {
  try {
    console.log("Initializing Firebase with config:", {
      ...firebaseConfig,
      apiKey: "***", // Hide the actual API key in logs
    });
    app = initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    throw error; // Re-throw the error to prevent further initialization
  }
} else {
  app = getApps()[0];
  console.log("Using existing Firebase app instance");
}

export const db = getFirestore(app);
export const auth = getAuth(app);
