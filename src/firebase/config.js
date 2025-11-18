import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
} from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { Capacitor } from "@capacitor/core";

// Firebase configuration with fallbacks
const firebaseConfig = {
  apiKey:
    process.env.REACT_APP_FIREBASE_API_KEY ||
    "AIzaSyDOSPy-XiyeO6U5msKuzINnqvFqnD8C0e0",
  authDomain:
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ||
    "refer-earn-platform.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "refer-earn-platform",
  storageBucket:
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ||
    "refer-earn-platform.firebasestorage.app",
  messagingSenderId:
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "886797203704",
  appId:
    process.env.REACT_APP_FIREBASE_APP_ID ||
    "1:886797203704:web:13a9b346c92d9fa0f2e30d",
  measurementId:
    process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-NV1ER35PM6",
};

// Validate configuration
const requiredConfigKeys = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
];

const missingKeys = requiredConfigKeys.filter((key) => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  console.error("Missing Firebase configuration keys:", missingKeys);
  throw new Error(
    `Missing Firebase configuration. Missing keys: ${missingKeys.join(", ")}`
  );
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);

// Use new persistence method for mobile
let db;
if (Capacitor.isNativePlatform()) {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache(),
  });
} else {
  db = getFirestore(app);
}

export { db };
export const functions = getFunctions(app);

export default app;
