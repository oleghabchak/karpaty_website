export type MatchCenterEntry = {
  id: string;
  title: string;
  tour?: number;
  postSlug?: string;
  published: boolean;
  updatedAt: string;
};

export type MatchCenterEntryInput = Omit<MatchCenterEntry, "id" | "updatedAt"> & {
  id?: string;
};

/** @deprecated Use MatchCenterEntry */
export type MatchPage = MatchCenterEntry;

/** @deprecated Use MatchCenterEntryInput */
export type MatchPageInput = MatchCenterEntryInput;
