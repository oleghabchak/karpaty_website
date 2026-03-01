import { Match } from "@/types/match";

export const nextMatch: Match = {
  id: 1,
  date: "08.03.2026",
  time: "15:30",
  homeTeam: "Уличне",
  awayTeam: "Кудрівка",
  venue: "м. Львів, стадіон «Україна»",
  tour: 19,
  competition: "Прем'єр-Ліга",
};

export const lastMatch: Match = {
  id: 2,
  date: "01.03.2026",
  homeTeam: "Уличне",
  awayTeam: "Колос",
  homeScore: 0,
  awayScore: 1,
  tour: 18,
};

export const upcomingMatches: Match[] = [
  { id: 3, date: "08.03.2026", time: "15:30", homeTeam: "Уличне", awayTeam: "Кудрівка", tour: 19 },
  { id: 4, date: "13.03.2026", time: "13:00", homeTeam: "СК Полтава", awayTeam: "Уличне", tour: 20 },
  { id: 5, date: "21.03.2026", time: "17:00", homeTeam: "Уличне", awayTeam: "Оболонь", tour: 21 },
  { id: 6, date: "04.04.2026", time: "17:00", homeTeam: "Динамо", awayTeam: "Уличне", tour: 22 },
];
