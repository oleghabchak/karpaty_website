/* eslint-disable no-console */
/**
 * Shared Firebase Admin initialization for local scripts (seed, create-user).
 * Prefers a JSON file path over inline env JSON (avoids .env escaping issues).
 */
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

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

function initFirebaseAdmin() {
  loadDotenvLocal();

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) {
    console.error(
      "[Firebase Admin] Missing FIREBASE_PROJECT_ID or NEXT_PUBLIC_FIREBASE_PROJECT_ID."
    );
    process.exit(1);
  }

  const jsonPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const jsonStr = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const hasAdcFile = Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS);

  if (jsonPath) {
    const resolved = path.isAbsolute(jsonPath) ? jsonPath : path.join(process.cwd(), jsonPath);
    if (!fs.existsSync(resolved)) {
      console.error(`[Firebase Admin] FIREBASE_SERVICE_ACCOUNT_PATH not found: ${resolved}`);
      process.exit(1);
    }
    let serviceAccount;
    try {
      serviceAccount = JSON.parse(fs.readFileSync(resolved, "utf8"));
    } catch (e) {
      console.error("[Firebase Admin] Invalid JSON in service account file:", e.message);
      process.exit(1);
    }
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId,
    });
    return projectId;
  }

  if (jsonStr) {
    let serviceAccount;
    try {
      serviceAccount = JSON.parse(jsonStr.trim());
    } catch (e) {
      console.error("[Firebase Admin] FIREBASE_SERVICE_ACCOUNT_JSON parse error:", e.message);
      console.error(
        "[Firebase Admin] Tip: download the key as *.json and add to .env.local:\n" +
          "  FIREBASE_SERVICE_ACCOUNT_PATH=./secrets/firebase-sa.json\n" +
          "(avoid pasting the whole JSON into .env — newlines / quotes often break it.)"
      );
      process.exit(1);
    }
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId,
    });
    return projectId;
  }

  if (hasAdcFile) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId,
    });
    return projectId;
  }

  console.error(`
[Firebase Admin] No credentials. "firebase login" does not supply them to Node scripts.

Choose one:
  1) FIREBASE_SERVICE_ACCOUNT_PATH=./secrets/firebase-sa.json  (recommended)
  2) FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'  (single line, valid JSON)
  3) GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/key.json
`);
  process.exit(1);
}

module.exports = { loadDotenvLocal, initFirebaseAdmin };
