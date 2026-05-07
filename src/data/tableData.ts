import { TableRow } from "@/types/table";

/** Fallback when Firestore is empty; усі числові показники — 0. */
export const tableData: TableRow[] = [
  { position: 0, team: "«Карпати» (Східницька ТГ)", played: 0, won: 0, draw: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
  { position: 0, team: "ФК «Мостиська-2»", played: 0, won: 0, draw: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
  { position: 0, team: "«Прикарпаття» (Старий Самбір)", played: 0, won: 0, draw: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
  { position: 0, team: "ФК «Легіон» (Львів/Никонковичі)", played: 0, won: 0, draw: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
  { position: 0, team: "ФК «Стебник»", played: 0, won: 0, draw: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
  { position: 0, team: "ФК «Уличне» / «Трускавець-2»", played: 0, won: 0, draw: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
];
