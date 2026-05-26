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
import type { MatchCenterEntryInput } from "@/types/matchPage";

function getField(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function parseOptionalNumber(v: string) {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function parseMatchCenterPayload(
  payload: string
): (MatchCenterEntryInput & { id?: string }) | null {
  if (!payload.trim()) return null;
  try {
    const parsed: unknown = JSON.parse(payload);
    if (!parsed || typeof parsed !== "object") return null;
    const p = parsed as Record<string, unknown>;

    const id = typeof p.id === "string" ? p.id.trim() : undefined;
    const title = typeof p.title === "string" ? p.title.trim() : "";
    const postSlug = typeof p.postSlug === "string" ? p.postSlug.trim() : "";
    const published = p.published === true;

    const tour = parseOptionalNumber(String(p.tour ?? "").trim());
    if (tour === null) return null;

    if (!title) return null;

    return {
      id,
      title,
      postSlug: postSlug || undefined,
      published,
      ...(tour == null ? {} : { tour }),
    };
  } catch {
    return null;
  }
}

async function postExists(slug: string) {
  const doc = await getAdminFirestore().collection("posts").doc(slug).get();
  return doc.exists;
}

function revalidateMatchCenterPaths(postSlug?: string) {
  revalidatePath("/matches");
  revalidatePath("/");
  revalidatePath("/admin/match-pages");
  if (postSlug) {
    revalidatePath(`/news/${postSlug}`);
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
  const parsed = parseMatchCenterPayload(payload);
  if (!parsed) {
    return { ok: false as const, error: "invalid-payload" };
  }

  if (parsed.postSlug) {
    const exists = await postExists(parsed.postSlug);
    if (!exists) {
      return { ok: false as const, error: "post-not-found" };
    }
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
    revalidateMatchCenterPaths(parsed.postSlug);
    return { ok: true as const, id, postSlug: parsed.postSlug };
  }

  const ref = await collection.add(docData);
  revalidateMatchCenterPaths(parsed.postSlug);
  return { ok: true as const, id: ref.id, postSlug: parsed.postSlug };
}

export async function deleteMatchPage(formData: FormData) {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    return { ok: false as const, error: "unauthorized" };
  }

  const id = getField(formData, "id");
  const postSlug = getField(formData, "postSlug");
  if (!id) {
    return { ok: false as const, error: "invalid-payload" };
  }

  await getAdminFirestore().collection(MATCH_PAGES_COLLECTION).doc(id).delete();
  revalidateMatchCenterPaths(postSlug || undefined);
  return { ok: true as const };
}

export async function publishMatchPage(formData: FormData) {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    return { ok: false as const, error: "unauthorized" };
  }

  const id = getField(formData, "id");
  const postSlug = getField(formData, "postSlug");
  if (!id) {
    return { ok: false as const, error: "invalid-payload" };
  }

  if (postSlug) {
    const exists = await postExists(postSlug);
    if (!exists) {
      return { ok: false as const, error: "post-not-found" };
    }
  }

  const now = new Date().toISOString();
  await getAdminFirestore().collection(MATCH_PAGES_COLLECTION).doc(id).set(
    stripUndefinedDeep({
      published: true,
      ...(postSlug ? { postSlug } : {}),
      updatedAt: now,
    }),
    { merge: true },
  );
  revalidateMatchCenterPaths(postSlug || undefined);
  return { ok: true as const };
}
