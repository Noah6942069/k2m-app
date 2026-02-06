import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Singleton pattern to prevent multiple initializations with error handling
let app: FirebaseApp | null = null;
let auth: Auth | null = null;

try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
} catch (error) {
    console.error("[Firebase] Failed to initialize Firebase:", error);
}

// Initialize Performance Monitoring (only in browser)
let perf;
if (typeof window !== "undefined" && app) {
    // Dynamically import to avoid SSR issues or check window
    import("firebase/performance").then(({ getPerformance }) => {
        perf = getPerformance(app!);
    }).catch(e => console.error("Firebase Perf init failed", e));
}

export { app, auth };
