import { unstable_noStore as noStore } from "next/cache";
import { getAdminFirestore } from "./firebaseAdminServer";
import { sortMatchCenterEntriesByTourDesc } from "./match-page-utils";
import type { MatchCenterEntry } from "@/types/matchPage";

export const MATCH_PAGES_COLLECTION = "matchPages";

export function mapMatchCenterEntry(id: string, input: unknown): MatchCenterEntry | null {
  if (!input || typeof input !== "object") return null;
  const data = input as Record<string, unknown>;

  const title = typeof data.title === "string" ? data.title.trim() : "";
  const postSlug = typeof data.postSlug === "string" ? data.postSlug.trim() : "";
  const published = data.published === true;
  const updatedAt = typeof data.updatedAt === "string" ? data.updatedAt : "";

  const tourRaw = data.tour;
  const tour =
    tourRaw == null
      ? undefined
      : typeof tourRaw === "number" && Number.isFinite(tourRaw)
        ? tourRaw
        : Number.isFinite(Number(tourRaw))
          ? Number(tourRaw)
          : undefined;

  if (!title) return null;

  return {
    id,
    title,
    tour,
    postSlug: postSlug || undefined,
    published,
    updatedAt: updatedAt || new Date(0).toISOString(),
  };
}

/** @deprecated Use mapMatchCenterEntry */
export const mapMatchPage = mapMatchCenterEntry;

function sortByUpdatedAtDesc(entries: MatchCenterEntry[]) {
  return entries.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

async function fetchAllMatchCenterEntriesFromAdmin(): Promise<MatchCenterEntry[]> {
  const snapshot = await getAdminFirestore().collection(MATCH_PAGES_COLLECTION).get();
  const entries: MatchCenterEntry[] = [];
  for (const doc of snapshot.docs) {
    const mapped = mapMatchCenterEntry(doc.id, doc.data());
    if (mapped) entries.push(mapped);
  }
  return sortByUpdatedAtDesc(entries);
}

export async function getPublishedMatchCenterEntries(): Promise<MatchCenterEntry[]> {
  noStore();
  if (typeof window !== "undefined") return [];

  try {
    const all = await fetchAllMatchCenterEntriesFromAdmin();
    return sortMatchCenterEntriesByTourDesc(all.filter((e) => e.published));
  } catch {
    return [];
  }
}

/** @deprecated Use getPublishedMatchCenterEntries */
export const getPublishedMatchPages = getPublishedMatchCenterEntries;

export async function getMatchCenterEntryByIdForAdmin(id: string): Promise<MatchCenterEntry | null> {
  noStore();
  if (!id.trim() || typeof window !== "undefined") return null;

  try {
    const doc = await getAdminFirestore().collection(MATCH_PAGES_COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return mapMatchCenterEntry(doc.id, doc.data());
  } catch {
    return null;
  }
}

/** @deprecated Use getMatchCenterEntryByIdForAdmin */
export const getMatchPageByIdForAdmin = getMatchCenterEntryByIdForAdmin;

export async function getAllMatchCenterEntriesForAdmin(): Promise<MatchCenterEntry[]> {
  noStore();
  if (typeof window !== "undefined") return [];

  try {
    return await fetchAllMatchCenterEntriesFromAdmin();
  } catch {
    return [];
  }
}

/** @deprecated Use getAllMatchCenterEntriesForAdmin */
export const getAllMatchPagesForAdmin = getAllMatchCenterEntriesForAdmin;
