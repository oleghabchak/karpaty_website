export type MatchPage = {
  id: string;
  slug: string;
  title: string;
  date: string;
  time?: string;
  homeTeam: string;
  awayTeam: string;
  venue?: string;
  homeScore?: number;
  awayScore?: number;
  tour?: number;
  competition?: string;
  descriptionMarkdown: string;
  youtubeVideoId?: string;
  published: boolean;
  updatedAt: string;
};

export type MatchPageInput = Omit<MatchPage, "id" | "updatedAt"> & {
  id?: string;
};
