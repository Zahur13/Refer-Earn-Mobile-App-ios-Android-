import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  browserLocalPersistence,
  indexedDBLocalPersistence,
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

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDOSPy-XiyeO6U5msKuzINnqvFqnD8C0e0",
  authDomain: "refer-earn-platform.firebaseapp.com",
  projectId: "refer-earn-platform",
  storageBucket: "refer-earn-platform.firebasestorage.app",
  messagingSenderId: "886797203704",
  appId: "1:886797203704:web:13a9b346c92d9fa0f2e30d",
  measurementId: "G-NV1ER35PM6",
};

console.log("🔍 Firebase config:", {
  apiKey: firebaseConfig.apiKey ? "✅ Present" : "❌ Missing",
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
});

// Validate
const requiredKeys = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
];
const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  console.error("❌ Firebase: Missing keys:", missingKeys);
  throw new Error(`Missing Firebase config keys: ${missingKeys.join(", ")}`);
}

console.log("✅ Firebase: All config keys present");

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log("✅ Firebase: App initialized");
  console.log("✅ Firebase: App name:", app.name);
} catch (error) {
  console.error("❌ Firebase: Init error:", error);
  throw error;
}

// Initialize Auth with proper iOS configuration
let auth;
try {
  if (Capacitor.isNativePlatform()) {
    console.log(
      "📱 Firebase Auth: Initializing for mobile with custom persistence"
    );

    // Use initializeAuth with browser persistence for iOS
    auth = initializeAuth(app, {
      persistence: browserLocalPersistence,
    });
  } else {
    console.log("🌐 Firebase Auth: Initializing for web");
    auth = getAuth(app);
  }

  console.log("✅ Firebase: Auth initialized");
  console.log("✅ Firebase: Auth app name:", auth.app.name);
} catch (error) {
  console.error("❌ Firebase: Auth initialization error:", error);
  // Fallback to default auth
  auth = getAuth(app);
  console.log("⚠️ Firebase: Using fallback auth initialization");
}

export { auth };

// Initialize Firestore
let db;
try {
  if (Capacitor.isNativePlatform()) {
    console.log("📱 Firebase: Mobile - using persistent cache");
    db = initializeFirestore(app, {
      localCache: persistentLocalCache(),
    });
  } else {
    console.log("🌐 Firebase: Web - using default Firestore");
    db = getFirestore(app);
  }
  console.log("✅ Firebase: Firestore initialized");
} catch (error) {
  console.error("❌ Firebase: Firestore error:", error);
  db = getFirestore(app);
}

export { db };
export const functions = getFunctions(app);

console.log("✅ Firebase: All services initialized");

export default app;
