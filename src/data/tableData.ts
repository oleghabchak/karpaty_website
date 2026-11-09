import { TableRow } from "@/types/table";

/**
 * Fallback when Firestore is empty.
 * Четверта ліга Львівської області: Група 2. Сезон-2026/2027.
 */
export const tableData: TableRow[] = [
  { position: 1, team: "ФК «Рода» (Родатичі)", played: 9, won: 9, draw: 0, lost: 0, goalsFor: 31, goalsAgainst: 8, points: 27 },
  { position: 2, team: "ФК «Хирів»", played: 9, won: 7, draw: 1, lost: 1, goalsFor: 33, goalsAgainst: 16, points: 22 },
  { position: 3, team: "ФК «Верес» (Великолюбінська ТГ)", played: 9, won: 7, draw: 0, lost: 2, goalsFor: 25, goalsAgainst: 12, points: 21 },
  { position: 4, team: "«Карпати» (Доброгостів)", played: 9, won: 4, draw: 2, lost: 3, goalsFor: 19, goalsAgainst: 14, points: 14 },
  { position: 5, team: "«Ураган» (Перемишляни)", played: 9, won: 4, draw: 1, lost: 4, goalsFor: 15, goalsAgainst: 17, points: 13 },
  { position: 6, team: "СФК Уличне/Трускавець-2", played: 9, won: 3, draw: 2, lost: 4, goalsFor: 15, goalsAgainst: 17, points: 11 },
  { position: 7, team: "ФК «Місто Комфорту» (Пустомити)", played: 9, won: 2, draw: 3, lost: 4, goalsFor: 11, goalsAgainst: 17, points: 9 },
  { position: 8, team: "«Захід» (Бібрка)", played: 9, won: 2, draw: 1, lost: 6, goalsFor: 20, goalsAgainst: 26, points: 7 },
  { position: 9, team: "ФК «Повстанець-Стефано» (Гринів)", played: 9, won: 2, draw: 0, lost: 7, goalsFor: 21, goalsAgainst: 38, points: 6 },
  { position: 10, team: "«Камула-Стріла» (Романів/Підгородище)", played: 9, won: 0, draw: 0, lost: 9, goalsFor: 10, goalsAgainst: 35, points: 0 },
];
