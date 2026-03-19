/* eslint-disable no-console */
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const ADMIN_EMAIL = "admin@gmail.com";

function loadDotenvLocal() {
  const dotenvPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(dotenvPath)) return;

  const content = fs.readFileSync(dotenvPath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eqIndex = line.indexOf("=");
    if (eqIndex === -1) continue;

    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (process.env[key] == null) {
      process.env[key] = value;
    }
  }
}

async function main() {
  loadDotenvLocal();

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error(
      "Missing FIREBASE_PROJECT_ID (or NEXT_PUBLIC_FIREBASE_PROJECT_ID). Add it to your env and retry."
    );
  }

  const password = process.env.ADMIN_INITIAL_PASSWORD;
  if (!password || password.length < 6) {
    throw new Error(
      "Set ADMIN_INITIAL_PASSWORD (min 6 chars) in .env.local or env before running."
    );
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (serviceAccountJson) {
    const serviceAccount = JSON.parse(serviceAccountJson);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId,
    });
  } else {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId,
    });
  }

  try {
    const user = await admin.auth().createUser({
      email: ADMIN_EMAIL,
      password,
      emailVerified: true,
      displayName: "Admin",
    });
    console.log("[CreateAdmin] User created:", user.uid, user.email);
  } catch (err) {
    if (err.code === "auth/email-already-exists") {
      console.log("[CreateAdmin] User", ADMIN_EMAIL, "already exists. Nothing to do.");
      return;
    }
    throw err;
  }

  console.log("[CreateAdmin] Done.");
}

main().catch((err) => {
  console.error("[CreateAdmin] Failed:", err);
  process.exit(1);
});
