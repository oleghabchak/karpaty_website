import { TableRow } from "@/types/table";

/**
 * Fallback when Firestore is empty.
 * Четверта ліга Львівської області: Група 2. Сезон-2026/2027.
 */
export const tableData: TableRow[] = [
  { position: 1, team: "ФК «Рода» (Родатичі)", played: 6, won: 6, draw: 0, lost: 0, goalsFor: 17, goalsAgainst: 4, points: 18 },
  { position: 2, team: "ФК «Хирів»", played: 6, won: 5, draw: 0, lost: 1, goalsFor: 17, goalsAgainst: 10, points: 15 },
  { position: 3, team: "ФК «Верес» (Великолюбінська ТГ)", played: 6, won: 4, draw: 0, lost: 2, goalsFor: 14, goalsAgainst: 9, points: 12 },
  { position: 4, team: "«Карпати» (Доброгостів)", played: 6, won: 3, draw: 1, lost: 2, goalsFor: 11, goalsAgainst: 7, points: 10 },
  { position: 5, team: "«Ураган» (Перемишляни)", played: 6, won: 3, draw: 0, lost: 3, goalsFor: 12, goalsAgainst: 11, points: 9 },
  { position: 6, team: "СФК Уличне/Трускавець-2", played: 6, won: 2, draw: 2, lost: 2, goalsFor: 9, goalsAgainst: 9, points: 8 },
  { position: 7, team: "«Захід» (Бібрка)", played: 6, won: 2, draw: 0, lost: 4, goalsFor: 13, goalsAgainst: 14, points: 6 },
  { position: 8, team: "ФК «Повстанець-Стефано» (Гринів)", played: 6, won: 2, draw: 0, lost: 4, goalsFor: 17, goalsAgainst: 21, points: 6 },
  { position: 9, team: "ФК «Місто Комфорту» (Пустомити)", played: 6, won: 1, draw: 1, lost: 4, goalsFor: 7, goalsAgainst: 14, points: 4 },
  { position: 10, team: "«Камула-Стріла» (Романів/Підгородище)", played: 6, won: 0, draw: 0, lost: 6, goalsFor: 4, goalsAgainst: 22, points: 0 },
];
