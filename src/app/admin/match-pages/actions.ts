"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearAdminSession,
  createAdminSession,
  getAdminSecret,
  isAdminAuthenticated,
} from "@/lib/admin-session";
import { getAdminFirestore } from "@/lib/firebaseAdminServer";
import { MATCH_PAGES_COLLECTION } from "@/lib/match-pages";
import { stripUndefinedDeep } from "@/lib/matches";
import { parseYoutubeVideoId } from "@/lib/youtube-utils";
import { slugify } from "@/lib/post-utils";
import type { MatchPageInput } from "@/types/matchPage";

function getField(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function parseOptionalString(v: string) {
  return v.length ? v : undefined;
}

function parseOptionalNumber(v: string) {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function parseMatchPagePayload(payload: string): (MatchPageInput & { id?: string }) | null {
  if (!payload.trim()) return null;
  try {
    const parsed: unknown = JSON.parse(payload);
    if (!parsed || typeof parsed !== "object") return null;
    const p = parsed as Record<string, unknown>;

    const id = typeof p.id === "string" ? p.id.trim() : undefined;
    const title = typeof p.title === "string" ? p.title.trim() : "";
    let slug = typeof p.slug === "string" ? p.slug.trim() : "";
    const date = typeof p.date === "string" ? p.date.trim() : "";
    const time = typeof p.time === "string" ? parseOptionalString(p.time.trim()) : undefined;
    const homeTeam = typeof p.homeTeam === "string" ? p.homeTeam.trim() : "";
    const awayTeam = typeof p.awayTeam === "string" ? p.awayTeam.trim() : "";
    const venue = typeof p.venue === "string" ? parseOptionalString(p.venue.trim()) : undefined;
    const competition =
      typeof p.competition === "string" ? parseOptionalString(p.competition.trim()) : undefined;
    const descriptionMarkdown =
      typeof p.descriptionMarkdown === "string" ? p.descriptionMarkdown : "";
    const published = p.published === true;

    const tour = parseOptionalNumber(String(p.tour ?? "").trim());
    if (tour === null) return null;
    const homeScore = parseOptionalNumber(String(p.homeScore ?? "").trim());
    if (homeScore === null) return null;
    const awayScore = parseOptionalNumber(String(p.awayScore ?? "").trim());
    if (awayScore === null) return null;

    const youtubeInput = typeof p.youtubeUrl === "string" ? p.youtubeUrl.trim() : "";
    const youtubeVideoId = youtubeInput ? parseYoutubeVideoId(youtubeInput) : undefined;
    if (youtubeInput && !youtubeVideoId) return null;

    if (!title || !date || !homeTeam || !awayTeam) return null;

    if (!slug) {
      slug = slugify(title) || slugify(`${homeTeam}-${awayTeam}-${date}`);
    }
    if (!slug) return null;

    return {
      id,
      slug,
      title,
      date,
      time,
      homeTeam,
      awayTeam,
      venue,
      competition,
      descriptionMarkdown,
      youtubeVideoId,
      published,
      ...(tour == null ? {} : { tour }),
      ...(homeScore == null ? {} : { homeScore }),
      ...(awayScore == null ? {} : { awayScore }),
    };
  } catch {
    return null;
  }
}

async function isSlugTaken(slug: string, excludeId?: string) {
  const snapshot = await getAdminFirestore()
    .collection(MATCH_PAGES_COLLECTION)
    .where("slug", "==", slug)
    .limit(1)
    .get();

  if (snapshot.empty) return false;
  if (!excludeId) return true;
  return snapshot.docs[0].id !== excludeId;
}

function revalidateMatchPagePaths(slug?: string) {
  revalidatePath("/matches");
  revalidatePath("/");
  revalidatePath("/admin/match-pages");
  if (slug) {
    revalidatePath(`/matches/${slug}`);
  }
}

export async function loginAdminMatchPages(formData: FormData) {
  const configuredSecret = getAdminSecret();
  const secret = getField(formData, "secret");

  if (!configuredSecret) {
    redirect("/admin/match-pages?error=missing-secret");
  }

  if (secret !== configuredSecret) {
    redirect("/admin/match-pages?error=invalid-secret");
  }

  await createAdminSession();
  redirect("/admin/match-pages");
}

export async function logoutAdminMatchPages() {
  await clearAdminSession();
  redirect("/admin/match-pages");
}

export async function saveMatchPage(formData: FormData) {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    return { ok: false as const, error: "unauthorized" };
  }

  const payload = getField(formData, "payload");
  const parsed = parseMatchPagePayload(payload);
  if (!parsed) {
    return { ok: false as const, error: "invalid-payload" };
  }

  const taken = await isSlugTaken(parsed.slug, parsed.id);
  if (taken) {
    return { ok: false as const, error: "duplicate-slug" };
  }

  const now = new Date().toISOString();
  const { id, ...rest } = parsed;
  const docData = stripUndefinedDeep({
    ...rest,
    updatedAt: now,
  });

  const db = getAdminFirestore();
  const collection = db.collection(MATCH_PAGES_COLLECTION);

  if (id) {
    await collection.doc(id).set(docData, { merge: true });
    revalidateMatchPagePaths(parsed.slug);
    return { ok: true as const, id, slug: parsed.slug };
  }

  const ref = await collection.add(docData);
  revalidateMatchPagePaths(parsed.slug);
  return { ok: true as const, id: ref.id, slug: parsed.slug };
}

export async function deleteMatchPage(formData: FormData) {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    return { ok: false as const, error: "unauthorized" };
  }

  const id = getField(formData, "id");
  const slug = getField(formData, "slug");
  if (!id) {
    return { ok: false as const, error: "invalid-payload" };
  }

  await getAdminFirestore().collection(MATCH_PAGES_COLLECTION).doc(id).delete();
  revalidateMatchPagePaths(slug || undefined);
  return { ok: true as const };
}

export async function publishMatchPage(formData: FormData) {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    return { ok: false as const, error: "unauthorized" };
  }

  const id = getField(formData, "id");
  const slug = getField(formData, "slug");
  if (!id) {
    return { ok: false as const, error: "invalid-payload" };
  }

  const now = new Date().toISOString();
  await getAdminFirestore().collection(MATCH_PAGES_COLLECTION).doc(id).set(
    { published: true, updatedAt: now },
    { merge: true },
  );
  revalidateMatchPagePaths(slug || undefined);
  return { ok: true as const };
}
