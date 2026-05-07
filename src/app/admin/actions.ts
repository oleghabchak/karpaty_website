"use server";

import { redirect } from "next/navigation";
import {
  clearAdminSession,
  createAdminSession,
  getAdminSecret,
} from "@/lib/admin-session";

function getField(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function loginAdminPanel(formData: FormData) {
  const configuredSecret = getAdminSecret();
  const secret = getField(formData, "secret");

  if (!configuredSecret) {
    redirect("/admin?error=missing-secret");
  }

  if (secret !== configuredSecret) {
    redirect("/admin?error=invalid-secret");
  }

  await createAdminSession();
  redirect("/admin");
}

export async function logoutAdminPanel() {
  await clearAdminSession();
  redirect("/admin");
}

/** Clears cookie session; use with client-side Firebase signOut for one "Вийти" UX. */
export async function logoutAdminEverywhere() {
  await clearAdminSession();
  redirect("/admin");
}

