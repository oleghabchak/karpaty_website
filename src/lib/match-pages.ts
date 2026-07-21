import { unstable_noStore as noStore } from "next/cache";
import { getAdminFirestore } from "./firebaseAdminServer";
import { sortMatchCenterEntriesByPriorityDesc } from "./match-page-utils";
import type { MatchCenterEntry } from "@/types/matchPage";

export const MATCH_PAGES_COLLECTION = "matchPages";

export function mapMatchCenterEntry(id: string, input: unknown): MatchCenterEntry | null {
  if (!input || typeof input !== "object") return null;
  const data = input as Record<string, unknown>;

  const title = typeof data.title === "string" ? data.title.trim() : "";
  const postSlug = typeof data.postSlug === "string" ? data.postSlug.trim() : "";
  const published = data.published === true;
  const updatedAt = typeof data.updatedAt === "string" ? data.updatedAt : "";
  const priorityValue = Number(data.priority);
  const priority = Number.isFinite(priorityValue) ? priorityValue : 0;

  const tourRaw = data.tour;
  let tour: string | undefined;
  if (tourRaw == null) {
    tour = undefined;
  } else if (typeof tourRaw === "number" && Number.isFinite(tourRaw)) {
    tour = String(tourRaw);
  } else if (typeof tourRaw === "string") {
    const trimmed = tourRaw.trim();
    tour = trimmed || undefined;
  } else {
    tour = undefined;
  }

  if (!title) return null;

  return {
    id,
    title,
    tour,
    priority,
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
    return sortMatchCenterEntriesByPriorityDesc(all.filter((e) => e.published));
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
