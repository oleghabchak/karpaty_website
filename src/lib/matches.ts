import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { unstable_noStore as noStore } from "next/cache";
import { db, isFirebaseConfigured } from "./firebase";
import { getAdminFirestore } from "./firebaseAdminServer";
import { lastMatch, nextMatch, upcomingMatches } from "@/data/matchesData";
import type { Match } from "@/types/match";

export const MATCHES_COLLECTION = "matches";
export const MATCHES_DOC_ID = "main";

const defaultFeatured: MatchesFeaturedDoc = { nextMatch, lastMatch, upcomingMatches };

export type MatchesFeaturedDoc = {
  nextMatch: Match;
  lastMatch: Match;
  upcomingMatches: Match[];
};

export function stripUndefinedDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    const mapped = value.map((v) => stripUndefinedDeep(v)).filter((v) => v !== undefined);
    return mapped as unknown as T;
  }

  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v === undefined) continue;
      result[k] = stripUndefinedDeep(v);
    }
    return result as unknown as T;
  }

  return value;
}

function mapMatch(input: unknown): Match | null {
  if (!input || typeof input !== "object") return null;
  const m = input as Record<string, unknown>;

  const id = Number(m.id);
  const date = typeof m.date === "string" ? m.date : "";
  const time = typeof m.time === "string" ? m.time : undefined;
  const homeTeam = typeof m.homeTeam === "string" ? m.homeTeam : "";
  const awayTeam = typeof m.awayTeam === "string" ? m.awayTeam : "";
  const venue = typeof m.venue === "string" ? m.venue : undefined;
  const tour = typeof m.tour === "number" && Number.isFinite(m.tour) ? m.tour : m.tour != null ? Number(m.tour) : undefined;
  const competition = typeof m.competition === "string" ? m.competition : undefined;
  const matchPageSlug = typeof m.matchPageSlug === "string" ? m.matchPageSlug.trim() : undefined;
  const youtubeVideoId =
    typeof m.youtubeVideoId === "string" && m.youtubeVideoId.trim()
      ? m.youtubeVideoId.trim()
      : undefined;

  const homeScore =
    typeof m.homeScore === "number" && Number.isFinite(m.homeScore)
      ? m.homeScore
      : m.homeScore != null
        ? Number(m.homeScore)
        : undefined;
  const awayScore =
    typeof m.awayScore === "number" && Number.isFinite(m.awayScore)
      ? m.awayScore
      : m.awayScore != null
        ? Number(m.awayScore)
        : undefined;

  if (!Number.isFinite(id) || !date || !homeTeam || !awayTeam) return null;
  if (tour != null && !Number.isFinite(tour)) return null;

  return {
    id,
    date,
    time,
    homeTeam,
    awayTeam,
    venue,
    homeScore,
    awayScore,
    tour,
    competition,
    matchPageSlug: matchPageSlug || undefined,
    youtubeVideoId,
  };
}

function mapMatchesArray(input: unknown): Match[] | null {
  if (!Array.isArray(input)) return null;
  const mapped: Match[] = [];
  for (const item of input) {
    const m = mapMatch(item);
    if (!m) return null;
    mapped.push(m);
  }
  return mapped;
}

function mapFeaturedDoc(data: Partial<MatchesFeaturedDoc> | undefined): MatchesFeaturedDoc | null {
  const mappedNext = mapMatch(data?.nextMatch);
  const mappedLast = mapMatch(data?.lastMatch);
  const mappedUpcoming = mapMatchesArray(data?.upcomingMatches);
  if (!mappedNext || !mappedLast || !mappedUpcoming) return null;
  return {
    nextMatch: mappedNext,
    lastMatch: mappedLast,
    upcomingMatches: mappedUpcoming,
  };
}

export async function getMatchesFeatured(): Promise<MatchesFeaturedDoc> {
  noStore();

  if (typeof window === "undefined") {
    try {
      const snapshot = await getAdminFirestore()
        .collection(MATCHES_COLLECTION)
        .doc(MATCHES_DOC_ID)
        .get();
      if (snapshot.exists) {
        const mapped = mapFeaturedDoc(snapshot.data() as Partial<MatchesFeaturedDoc> | undefined);
        if (mapped) return mapped;
      }
    } catch {
      // Fall through to client SDK / fallback path below.
    }
  }

  if (!isFirebaseConfigured || !db) {
    return defaultFeatured;
  }

  try {
    const snapshot = await getDoc(doc(db, MATCHES_COLLECTION, MATCHES_DOC_ID));
    if (!snapshot.exists()) return defaultFeatured;

    const mapped = mapFeaturedDoc(snapshot.data() as Partial<MatchesFeaturedDoc> | undefined);
    return mapped ?? defaultFeatured;
  } catch {
    return defaultFeatured;
  }
}

export async function getUpcomingMatches(): Promise<Match[]> {
  const featured = await getMatchesFeatured();
  return featured.upcomingMatches;
}

export async function upsertMatchesFeatured(payload: MatchesFeaturedDoc) {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured for writing matches.");
  }

  const sanitized = stripUndefinedDeep(payload);
  await setDoc(doc(db, MATCHES_COLLECTION, MATCHES_DOC_ID), sanitized, { merge: true });
}

export async function resetMatches() {
  if (!isFirebaseConfigured || !db) {
    return;
  }

  await deleteDoc(doc(db, MATCHES_COLLECTION, MATCHES_DOC_ID));
}

