/* eslint-disable no-console */
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

async function main() {
  loadDotenvLocal();

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error(
      "Missing FIREBASE_PROJECT_ID (or NEXT_PUBLIC_FIREBASE_PROJECT_ID). Add it to your env and retry."
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

  const items = [
    {
      id: 1,
      date: "27.02.2026",
      time: "20:00",
      homeTeam: "Ураган Станків",
      awayTeam: "Уличне",
      homeScore: 2,
      awayScore: 5,
    },
    {
      id: 2,
      date: "08.03.2026",
      time: "13:00",
      homeTeam: "Стебник",
      awayTeam: "Уличне",
      homeScore: 3,
      awayScore: 5,
    },
    {
      id: 3,
      date: "14.03.2026",
      time: "16:00",
      homeTeam: "Стрілків",
      awayTeam: "Уличне",
      homeScore: 1,
      awayScore: 3,
    },
    {
      id: 4,
      date: "22.03.2026",
      time: "15:00",
      homeTeam: "Снятинка",
      awayTeam: "Уличне",
      homeScore: 3,
      awayScore: 2,
    },
    {
      id: 5,
      date: "19.04.2026",
      time: "13:00",
      homeTeam: "Стебник",
      awayTeam: "Уличне",
      homeScore: 3,
      awayScore: 2,
    },
  ];

  console.log("[Seed] Writing friendlyMatches/main ...");
  await admin.firestore().collection("friendlyMatches").doc("main").set({ items }, { merge: true });

  console.log("[Seed] Done.");
}

main().catch((err) => {
  console.error("[Seed] Failed:", err);
  process.exit(1);
});
