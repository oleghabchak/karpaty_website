import "server-only";

import fs from "node:fs";
import path from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getProjectId(): string {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error("Missing FIREBASE_PROJECT_ID (or NEXT_PUBLIC_FIREBASE_PROJECT_ID).");
  }
  return projectId;
}

function getServiceAccount() {
  const jsonPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const jsonStr = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (jsonPath) {
    const resolved = path.isAbsolute(jsonPath) ? jsonPath : path.join(process.cwd(), jsonPath);
    const raw = fs.readFileSync(resolved, "utf8");
    return JSON.parse(raw);
  }

  if (jsonStr) {
    return JSON.parse(jsonStr.trim());
  }

  return null;
}

function ensureAdminApp() {
  const existing = getApps()[0];
  if (existing) return existing;

  const projectId = getProjectId();
  const serviceAccount = getServiceAccount();
  if (!serviceAccount) {
    throw new Error(
      "Missing Firebase Admin credentials. Set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON.",
    );
  }

  return initializeApp({
    credential: cert(serviceAccount),
    projectId,
  });
}

export function getAdminFirestore() {
  return getFirestore(ensureAdminApp());
}

