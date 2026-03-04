import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const LOG = process.env.NODE_ENV === "development";

function getFirebaseApp(): FirebaseApp | null {
  if (LOG) {
    console.log("[Firebase] env check:", {
      hasApiKey: Boolean(firebaseConfig.apiKey),
      hasProjectId: Boolean(firebaseConfig.projectId),
      projectId: firebaseConfig.projectId ?? "(missing)",
      isServer: typeof window === "undefined",
    });
  }
  if (typeof window === "undefined" && !firebaseConfig.projectId) {
    if (LOG) console.log("[Firebase] Skip init: server and no projectId");
    return null;
  }
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    if (LOG) console.log("[Firebase] Skip init: missing apiKey or projectId");
    return null;
  }
  try {
    const existing = getApps()[0];
    if (existing) {
      if (LOG) console.log("[Firebase] Using existing app");
      return existing as FirebaseApp;
    }
    const app = initializeApp(firebaseConfig);
    if (LOG) console.log("[Firebase] App initialized, projectId:", app.options.projectId);
    return app;
  } catch (err) {
    if (LOG) console.error("[Firebase] init error:", err);
    return null;
  }
}

function getFirestoreDb(): Firestore | null {
  try {
    const app = getFirebaseApp();
    if (!app) {
      if (LOG) console.log("[Firebase] No app, db = null");
      return null;
    }
    const firestore = getFirestore(app);
    if (LOG) console.log("[Firebase] Firestore db ready");
    return firestore;
  } catch (err) {
    if (LOG) console.error("[Firebase] getFirestore error:", err);
    return null;
  }
}

export const db = getFirestoreDb();
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

if (LOG) {
  console.log("[Firebase] isFirebaseConfigured:", isFirebaseConfigured, "db:", db ? "ok" : "null");
}
