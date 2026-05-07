/* eslint-disable no-console */
const admin = require("firebase-admin");
const { initFirebaseAdmin } = require("./firebase-admin-init.cjs");

async function main() {
  initFirebaseAdmin();

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
