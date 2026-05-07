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

    // Remove surrounding quotes (basic .env handling).
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

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
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
    // Works if you have GOOGLE_APPLICATION_CREDENTIALS set to a service account JSON file path.
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId,
    });
  }

  const standingsRows = [
    { position: 1, team: "Шахтар", played: 18, won: 12, draw: 5, lost: 1, goalsFor: 46, goalsAgainst: 12, points: 41 },
    { position: 2, team: "ЛНЗ", played: 18, won: 12, draw: 2, lost: 4, goalsFor: 23, goalsAgainst: 11, points: 38 },
    { position: 3, team: "Полісся", played: 18, won: 11, draw: 3, lost: 4, goalsFor: 31, goalsAgainst: 12, points: 36 },
    { position: 4, team: "Динамо", played: 18, won: 9, draw: 5, lost: 4, goalsFor: 40, goalsAgainst: 21, points: 32 },
    { position: 5, team: "Кривбас", played: 18, won: 8, draw: 6, lost: 4, goalsFor: 31, goalsAgainst: 25, points: 30 },
    { position: 6, team: "Металіст 1925", played: 17, won: 7, draw: 7, lost: 3, goalsFor: 19, goalsAgainst: 12, points: 28 },
    { position: 7, team: "Колос", played: 18, won: 7, draw: 7, lost: 4, goalsFor: 18, goalsAgainst: 15, points: 28 },
    { position: 8, team: "Зоря", played: 18, won: 6, draw: 6, lost: 6, goalsFor: 22, goalsAgainst: 23, points: 24 },
    { position: 9, team: "Верес", played: 17, won: 5, draw: 6, lost: 6, goalsFor: 16, goalsAgainst: 20, points: 21 },
    { position: 10, team: "Оболонь", played: 17, won: 5, draw: 5, lost: 7, goalsFor: 13, goalsAgainst: 27, points: 20 },
    { position: 11, team: "Уличне", played: 18, won: 4, draw: 7, lost: 7, goalsFor: 20, goalsAgainst: 25, points: 19 },
    { position: 12, team: "Рух", played: 18, won: 6, draw: 1, lost: 11, goalsFor: 15, goalsAgainst: 25, points: 19 },
  ];

  const nextMatch = {
    id: 1,
    date: "08.03.2026",
    time: "15:30",
    homeTeam: "Уличне",
    awayTeam: "Кудрівка",
    venue: "м. Львів, стадіон «Україна»",
    tour: 19,
    competition: "Прем'єр-Ліга",
  };

  const lastMatch = {
    id: 2,
    date: "01.03.2026",
    homeTeam: "Уличне",
    awayTeam: "Колос",
    homeScore: 0,
    awayScore: 1,
    tour: 18,
  };

  const upcomingMatches = [
    { id: 3, date: "08.03.2026", time: "15:30", homeTeam: "Уличне", awayTeam: "Кудрівка", tour: 19 },
    { id: 4, date: "13.03.2026", time: "13:00", homeTeam: "СК Полтава", awayTeam: "Уличне", tour: 20 },
    { id: 5, date: "21.03.2026", time: "17:00", homeTeam: "Уличне", awayTeam: "Оболонь", tour: 21 },
    { id: 6, date: "04.04.2026", time: "17:00", homeTeam: "Динамо", awayTeam: "Уличне", tour: 22 },
  ];

  console.log("[Seed] Writing standings/main ...");
  await admin
    .firestore()
    .collection("standings")
    .doc("main")
    .set({ rows: standingsRows }, { merge: true });

  console.log("[Seed] Writing matches/main ...");
  await admin
    .firestore()
    .collection("matches")
    .doc("main")
    .set(
      {
        nextMatch,
        lastMatch,
        upcomingMatches,
      },
      { merge: true }
    );

  console.log("[Seed] Done.");
}

main().catch((err) => {
  console.error("[Seed] Failed:", err);
  process.exit(1);
});

