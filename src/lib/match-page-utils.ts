import type { MatchCenterEntry } from "@/types/matchPage";

/** Публічний список: більший пріоритет зверху, при рівності — новіші записи. */
export function sortMatchCenterEntriesByPriorityDesc(entries: MatchCenterEntry[]) {
  return [...entries].sort((a, b) => {
    const priorityDiff = b.priority - a.priority;
    if (priorityDiff !== 0) return priorityDiff;
    return b.updatedAt.localeCompare(a.updatedAt);
  });
}

/** @deprecated Use sortMatchCenterEntriesByPriorityDesc for public lists */
export function sortMatchCenterEntriesByRecency(entries: MatchCenterEntry[]) {
  return sortMatchCenterEntriesByPriorityDesc(entries);
}

/** @deprecated Use sortMatchCenterEntriesByPriorityDesc */
export const sortMatchPagesByRecency = sortMatchCenterEntriesByPriorityDesc;
