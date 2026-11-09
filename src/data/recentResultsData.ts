export type RecentResultRow = {
  id: number;
  date: string;
  tour: string;
  opponent: string;
  goalsFor: number;
  goalsAgainst: number;
};

/** Замокані результати сезону 2026/2027 для головної. */
export const recentResults: RecentResultRow[] = [
  { id: 1, date: "23.08.2026", tour: "1 тур", opponent: "ФК «Хирів»", goalsFor: 0, goalsAgainst: 2 },
  { id: 2, date: "30.08.2026", tour: "2 тур", opponent: "«Карпати» (Доброгостів)", goalsFor: 1, goalsAgainst: 1 },
  { id: 3, date: "06.09.2026", tour: "3 тур", opponent: "ФК «Рода»", goalsFor: 0, goalsAgainst: 2 },
  { id: 4, date: "13.09.2026", tour: "4 тур", opponent: "«Повстанець-Стефано»", goalsFor: 4, goalsAgainst: 2 },
  { id: 5, date: "27.09.2026", tour: "5 тур", opponent: "«Захід» (Бібрка)", goalsFor: 3, goalsAgainst: 1 },
  { id: 6, date: "04.10.2026", tour: "6 тур", opponent: "«Місто Комфорту»", goalsFor: 1, goalsAgainst: 1 },
  { id: 7, date: "11.10.2026", tour: "7 тур", opponent: "«Камула-Стріла»", goalsFor: 5, goalsAgainst: 4 },
  { id: 8, date: "18.10.2026", tour: "8 тур", opponent: "«Ураган» (Перемишляни)", goalsFor: 1, goalsAgainst: 2 },
  { id: 9, date: "01.11.2026", tour: "9 тур", opponent: "ФК «Верес»", goalsFor: 0, goalsAgainst: 2 },
];
