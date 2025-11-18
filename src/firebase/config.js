import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  browserLocalPersistence,
} from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
} from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { Capacitor } from "@capacitor/core";

console.log("🔍 Firebase config.js loading...");
console.log("🔍 Platform:", Capacitor.getPlatform());
console.log("🔍 Is Native:", Capacitor.isNativePlatform());

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOSPy-XiyeO6U5msKuzINnqvFqnD8C0e0",
  authDomain: "refer-earn-platform.firebaseapp.com",
  projectId: "refer-earn-platform",
  storageBucket: "refer-earn-platform.firebasestorage.app",
  messagingSenderId: "886797203704",
  appId: "1:886797203704:web:13a9b346c92d9fa0f2e30d",
  measurementId: "G-NV1ER35PM6",
};

console.log("🔍 Firebase config validated");

// Initialize Firebase App
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log("✅ Firebase: App initialized");
} catch (error) {
  console.error("❌ Firebase: Init error:", error);
  throw error;
}

// Initialize Auth
let auth;
try {
  if (Capacitor.isNativePlatform()) {
    console.log("📱 Firebase Auth: Mobile mode");
    auth = initializeAuth(app, {
      persistence: browserLocalPersistence,
    });
  } else {
    console.log("🌐 Firebase Auth: Web mode");
    auth = getAuth(app);
  }
  console.log("✅ Firebase: Auth initialized");
} catch (error) {
  console.error("❌ Firebase: Auth error:", error);
  auth = getAuth(app);
}

// Initialize Firestore
let db;
try {
  if (Capacitor.isNativePlatform()) {
    console.log("📱 Firebase: Firestore with persistent cache");
    db = initializeFirestore(app, {
      localCache: persistentLocalCache(),
    });
  } else {
    console.log("🌐 Firebase: Firestore default mode");
    db = getFirestore(app);
  }
  console.log("✅ Firebase: Firestore initialized");
} catch (error) {
  console.error("❌ Firebase: Firestore error:", error);
  db = getFirestore(app);
}

// Initialize Functions
export const functions = getFunctions(app);

// Export services
export { auth, db };
export default app;

console.log("✅ Firebase: All services ready");
