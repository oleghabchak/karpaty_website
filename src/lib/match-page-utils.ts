import type { MatchCenterEntry } from "@/types/matchPage";

/** Публічний список «Останні матчі»: від більшого туру до меншого. */
export function sortMatchCenterEntriesByTourDesc(entries: MatchCenterEntry[]) {
  return [...entries].sort((a, b) => {
    if (a.tour == null && b.tour == null) {
      return b.updatedAt.localeCompare(a.updatedAt);
    }
    if (a.tour == null) return 1;
    if (b.tour == null) return -1;
    const tourDiff = b.tour - a.tour;
    if (tourDiff !== 0) return tourDiff;
    return b.updatedAt.localeCompare(a.updatedAt);
  });
}

/** @deprecated Use sortMatchCenterEntriesByTourDesc for public lists */
export function sortMatchCenterEntriesByRecency(entries: MatchCenterEntry[]) {
  return sortMatchCenterEntriesByTourDesc(entries);
}

/** @deprecated Use sortMatchCenterEntriesByTourDesc */
export const sortMatchPagesByRecency = sortMatchCenterEntriesByTourDesc;
