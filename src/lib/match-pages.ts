import { unstable_noStore as noStore } from "next/cache";
import { getAdminFirestore } from "./firebaseAdminServer";
import { sortMatchPagesByRecency } from "./match-page-utils";
import type { MatchPage } from "@/types/matchPage";

export const MATCH_PAGES_COLLECTION = "matchPages";

export function mapMatchPage(id: string, input: unknown): MatchPage | null {
  if (!input || typeof input !== "object") return null;
  const data = input as Record<string, unknown>;

  const slug = typeof data.slug === "string" ? data.slug.trim() : "";
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const date = typeof data.date === "string" ? data.date.trim() : "";
  const time = typeof data.time === "string" ? data.time.trim() : undefined;
  const homeTeam = typeof data.homeTeam === "string" ? data.homeTeam.trim() : "";
  const awayTeam = typeof data.awayTeam === "string" ? data.awayTeam.trim() : "";
  const venue = typeof data.venue === "string" ? data.venue.trim() : undefined;
  const competition = typeof data.competition === "string" ? data.competition.trim() : undefined;
  const descriptionMarkdown =
    typeof data.descriptionMarkdown === "string" ? data.descriptionMarkdown : "";
  const youtubeVideoId =
    typeof data.youtubeVideoId === "string" ? data.youtubeVideoId.trim() : undefined;
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

  const homeScoreRaw = data.homeScore;
  const homeScore =
    homeScoreRaw == null
      ? undefined
      : typeof homeScoreRaw === "number" && Number.isFinite(homeScoreRaw)
        ? homeScoreRaw
        : Number.isFinite(Number(homeScoreRaw))
          ? Number(homeScoreRaw)
          : undefined;

  const awayScoreRaw = data.awayScore;
  const awayScore =
    awayScoreRaw == null
      ? undefined
      : typeof awayScoreRaw === "number" && Number.isFinite(awayScoreRaw)
        ? awayScoreRaw
        : Number.isFinite(Number(awayScoreRaw))
          ? Number(awayScoreRaw)
          : undefined;

  if (!slug || !title || !date || !homeTeam || !awayTeam) return null;

  return {
    id,
    slug,
    title,
    date,
    time: time || undefined,
    homeTeam,
    awayTeam,
    venue: venue || undefined,
    homeScore,
    awayScore,
    tour,
    competition: competition || undefined,
    descriptionMarkdown,
    youtubeVideoId: youtubeVideoId || undefined,
    published,
    updatedAt,
  };
}

function sortByUpdatedAtDesc(pages: MatchPage[]) {
  return pages.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

async function fetchAllMatchPagesFromAdmin(): Promise<MatchPage[]> {
  const snapshot = await getAdminFirestore().collection(MATCH_PAGES_COLLECTION).get();
  const pages: MatchPage[] = [];
  for (const doc of snapshot.docs) {
    const mapped = mapMatchPage(doc.id, doc.data());
    if (mapped) pages.push(mapped);
  }
  return sortByUpdatedAtDesc(pages);
}

export async function getPublishedMatchPages(): Promise<MatchPage[]> {
  noStore();
  if (typeof window !== "undefined") return [];

  try {
    const all = await fetchAllMatchPagesFromAdmin();
    return sortMatchPagesByRecency(all.filter((p) => p.published));
  } catch {
    return [];
  }
}

async function getMatchPageDocBySlug(slug: string): Promise<MatchPage | null> {
  const normalized = slug.trim();
  if (!normalized) return null;

  const snapshot = await getAdminFirestore()
    .collection(MATCH_PAGES_COLLECTION)
    .where("slug", "==", normalized)
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return mapMatchPage(doc.id, doc.data());
}

export async function getMatchPageBySlug(slug: string): Promise<MatchPage | null> {
  noStore();
  if (typeof window !== "undefined") return null;

  try {
    const mapped = await getMatchPageDocBySlug(slug);
    if (!mapped || !mapped.published) return null;
    return mapped;
  } catch {
    return null;
  }
}

/** For draft notice: returns page even when not published. */
export async function getMatchPageBySlugAny(slug: string): Promise<MatchPage | null> {
  noStore();
  if (typeof window !== "undefined") return null;

  try {
    return await getMatchPageDocBySlug(slug);
  } catch {
    return null;
  }
}

export async function getMatchPageByIdForAdmin(id: string): Promise<MatchPage | null> {
  noStore();
  if (!id.trim() || typeof window !== "undefined") return null;

  try {
    const doc = await getAdminFirestore().collection(MATCH_PAGES_COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return mapMatchPage(doc.id, doc.data());
  } catch {
    return null;
  }
}

export async function getAllMatchPagesForAdmin(): Promise<MatchPage[]> {
  noStore();
  if (typeof window !== "undefined") return [];

  try {
    return await fetchAllMatchPagesFromAdmin();
  } catch {
    return [];
  }
}
