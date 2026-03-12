import { TableRow } from "@/types/table";

export type ScorerRow = { position: number; player: string; team: string; goals: number };

/** Чемпіонат Дрогобиччини U-19, сезон 2025. Карпати Уличне — чемпіон 2025. */
export const u19Table2025: TableRow[] = [
  { position: 1, team: "Карпати Уличне", played: 12, won: 9, draw: 1, lost: 2, goalsFor: 27, goalsAgainst: 11, points: 28 },
  { position: 2, team: "Іскра Грушів", played: 12, won: 8, draw: 2, lost: 2, goalsFor: 31, goalsAgainst: 14, points: 26 },
  { position: 3, team: "ФК Долішній лужок", played: 12, won: 6, draw: 1, lost: 5, goalsFor: 24, goalsAgainst: 18, points: 19 },
  { position: 4, team: "Прикарпаття Дережичі", played: 12, won: 6, draw: 1, lost: 5, goalsFor: 15, goalsAgainst: 16, points: 19 },
  { position: 5, team: "Зоря Унятичі", played: 12, won: 5, draw: 1, lost: 6, goalsFor: 15, goalsAgainst: 20, points: 16 },
  { position: 6, team: "ФК Рихтичі", played: 12, won: 3, draw: 2, lost: 7, goalsFor: 17, goalsAgainst: 23, points: 11 },
  { position: 7, team: "ФК Підбуж/Сторона", played: 12, won: 1, draw: 0, lost: 11, goalsFor: 7, goalsAgainst: 34, points: 3 },
];

/** Бомбардири Чемпіонату Дрогобиччини U-19, 2025. Колотило Ростислав — найкращий бомбардир. */
export const u19Scorers2025: ScorerRow[] = [
  { position: 1, player: "Колотило Ростислав", team: "ФК Долішній лужок", goals: 9 },
  { position: 2, player: "Дєнєжкін Олександр", team: "Іскра Грушів", goals: 9 },
  { position: 3, player: "Блюмгарт Віталій", team: "Прикарпаття Дережичі", goals: 7 },
  { position: 4, player: "Гнатишин Ярослав", team: "Зоря Унятичі", goals: 7 },
  { position: 5, player: "Комаричко Олег", team: "Карпати Уличне", goals: 6 },
  { position: 6, player: "Кучминда Максим", team: "Карпати Уличне", goals: 5 },
  { position: 7, player: "Палій Євген", team: "Іскра Грушів", goals: 5 },
  { position: 8, player: "Сідіков Рустам", team: "ФК Долішній лужок", goals: 5 },
  { position: 9, player: "Жирик Артем", team: "Іскра Грушів", goals: 4 },
  { position: 10, player: "Стецюк Давид", team: "Іскра Грушів", goals: 4 },
  { position: 11, player: "Боднар Олег", team: "Прикарпаття Дережичі", goals: 3 },
  { position: 12, player: "Ридель Максим", team: "ФК Підбуж/Сторона", goals: 3 },
  { position: 13, player: "Смолень Остап", team: "ФК Рихтичі", goals: 3 },
];
