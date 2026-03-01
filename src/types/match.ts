export type Match = {
  id: number;
  date: string;
  time?: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo?: string;
  awayLogo?: string;
  venue?: string;
  homeScore?: number;
  awayScore?: number;
  tour?: number;
  competition?: string;
};
