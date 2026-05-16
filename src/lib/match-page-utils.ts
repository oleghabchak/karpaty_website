import { slugify } from "./post-utils";
import type { MatchPage } from "@/types/matchPage";

export function buildMatchPageSlugFromFields(homeTeam: string, awayTeam: string, date: string) {
  const base = `${homeTeam} vs ${awayTeam} ${date}`.trim();
  return slugify(base);
}

/** Parses common UA date strings like 10.05.2026 for sorting. */
export function parseMatchDateSortKey(date: string): number {
  const trimmed = date.trim();
  const dotted = trimmed.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})$/);
  if (dotted) {
    const [, d, m, y] = dotted;
    const ts = new Date(Number(y), Number(m) - 1, Number(d)).getTime();
    return Number.isFinite(ts) ? ts : 0;
  }
  const iso = Date.parse(trimmed);
  return Number.isFinite(iso) ? iso : 0;
}

export function sortMatchPagesByRecency(pages: MatchPage[]) {
  return [...pages].sort((a, b) => {
    const dateDiff = parseMatchDateSortKey(b.date) - parseMatchDateSortKey(a.date);
    if (dateDiff !== 0) return dateDiff;
    return b.updatedAt.localeCompare(a.updatedAt);
  });
}
