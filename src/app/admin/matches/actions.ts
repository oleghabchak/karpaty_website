"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated, createAdminSession, clearAdminSession, getAdminSecret } from "@/lib/admin-session";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminFirestore } from "@/lib/firebaseAdminServer";
import {
  MATCHES_COLLECTION,
  MATCHES_DOC_ID,
  stripUndefinedDeep,
  type MatchesFeaturedDoc,
} from "@/lib/matches";
import type { Match } from "@/types/match";

function getField(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function parseMatch(input: unknown): Match | null {
  if (!input || typeof input !== "object") return null;
  const m = input as Record<string, unknown>;

  const id = Number(m.id);
  const date = typeof m.date === "string" ? m.date : "";
  const time = typeof m.time === "string" ? m.time : undefined;
  const homeTeam = typeof m.homeTeam === "string" ? m.homeTeam : "";
  const awayTeam = typeof m.awayTeam === "string" ? m.awayTeam : "";

  const venue = typeof m.venue === "string" ? m.venue : undefined;
  const tourRaw = m.tour;
  const tour = tourRaw == null ? undefined : Number.isFinite(Number(tourRaw)) ? Number(tourRaw) : null;
  if (tour === null) return null;

  const competition = typeof m.competition === "string" ? m.competition : undefined;
  const postSlugRaw =
    typeof m.postSlug === "string"
      ? m.postSlug.trim()
      : typeof m.matchPageSlug === "string"
        ? m.matchPageSlug.trim()
        : "";
  const postSlug = postSlugRaw.length ? postSlugRaw : undefined;

  const homeScoreRaw = m.homeScore;
  const homeScore =
    homeScoreRaw == null
      ? undefined
      : Number.isFinite(Number(homeScoreRaw))
        ? Number(homeScoreRaw)
        : null;
  if (homeScore === null) return null;

  const awayScoreRaw = m.awayScore;
  const awayScore =
    awayScoreRaw == null
      ? undefined
      : Number.isFinite(Number(awayScoreRaw))
        ? Number(awayScoreRaw)
        : null;
  if (awayScore === null) return null;

  if (!Number.isFinite(id) || !date || !homeTeam || !awayTeam) return null;

  return {
    id,
    date,
    time,
    homeTeam,
    awayTeam,
    venue,
    ...(tour == null ? {} : { tour }),
    competition,
    postSlug,
    ...(homeScore == null ? {} : { homeScore }),
    ...(awayScore == null ? {} : { awayScore }),
  };
}

function parseMatchesPayload(payload: string): MatchesFeaturedDoc | null {
  if (!payload.trim()) return null;
  try {
    const parsed: unknown = JSON.parse(payload);
    if (!parsed || typeof parsed !== "object") return null;
    const p = parsed as Record<string, unknown>;

    const nextMatch = parseMatch(p.nextMatch);
    const upcomingMatchesRaw = p.upcomingMatches;
    if (!nextMatch || !Array.isArray(upcomingMatchesRaw)) return null;

    const upcomingMatches: Match[] = [];
    for (const item of upcomingMatchesRaw) {
      const m = parseMatch(item);
      if (!m) return null;
      upcomingMatches.push(m);
    }

    return { nextMatch, upcomingMatches };
  } catch {
    return null;
  }
}

function revalidateMatchesPages() {
  revalidatePath("/");
  revalidatePath("/matches");
  revalidatePath("/admin/matches");
}

export async function loginAdminMatches(formData: FormData) {
  const configuredSecret = getAdminSecret();
  const secret = getField(formData, "secret");

  if (!configuredSecret) {
    redirect("/admin/matches?error=missing-secret");
  }

  if (secret !== configuredSecret) {
    redirect("/admin/matches?error=invalid-secret");
  }

  await createAdminSession();
  redirect("/admin/matches");
}

export async function logoutAdminMatches() {
  await clearAdminSession();
  redirect("/admin/matches");
}

export async function saveMatches(formData: FormData) {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    return { ok: false as const, error: "unauthorized" };
  }

  const payload = getField(formData, "payload");
  const parsed = parseMatchesPayload(payload);
  if (!parsed) {
    return { ok: false as const, error: "invalid-payload" };
  }

  const sanitized = stripUndefinedDeep(parsed);
  const db = getAdminFirestore();
  await db.collection(MATCHES_COLLECTION).doc(MATCHES_DOC_ID).set(
    {
      ...sanitized,
      lastMatch: FieldValue.delete(),
    },
    { merge: true },
  );
  revalidateMatchesPages();
  return { ok: true as const };
}

export async function resetMatchesAction() {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    return { ok: false as const, error: "unauthorized" };
  }

  const db = getAdminFirestore();
  await db.collection(MATCHES_COLLECTION).doc(MATCHES_DOC_ID).delete();
  revalidateMatchesPages();
  return { ok: true as const };
}
