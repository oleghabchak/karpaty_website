/* eslint-disable no-console */
const admin = require("firebase-admin");
const { initFirebaseAdmin } = require("./firebase-admin-init.cjs");

async function main() {
  initFirebaseAdmin();

  const standingsRows = [
    { position: 1, team: "«Карпати» (Східницька ТГ)", played: 0, won: 0, draw: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { position: 2, team: "ФК «Мостиська-2»", played: 0, won: 0, draw: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { position: 3, team: "«Прикарпаття» (Старий Самбір)", played: 0, won: 0, draw: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { position: 4, team: "ФК «Легіон» (Львів/Никонковичі)", played: 0, won: 0, draw: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { position: 5, team: "ФК «Стебник»", played: 0, won: 0, draw: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { position: 6, team: "ФК «Уличне» / «Трускавець-2»", played: 0, won: 0, draw: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
  ];

  const nextMatch = {
    id: 1,
    date: "10.05.2026",
    time: "17:00",
    homeTeam: "Стебник",
    awayTeam: "Уличне",
  };

  const lastMatch = {
  };

  const upcomingMatches = [
    { id: 3, date: "10.05.2026", time: "17:00", homeTeam: "Стебник", awayTeam: "Уличне" },
 
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
