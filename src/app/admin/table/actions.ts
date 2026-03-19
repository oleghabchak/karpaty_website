"use server";

import { redirect } from "next/navigation";
import { upsertStandingsRows, resetStandings } from "@/lib/standings";
import {
  clearAdminSession,
  createAdminSession,
  getAdminSecret,
  isAdminAuthenticated,
} from "@/lib/admin-session";
import type { TableRow } from "@/types/table";

function getField(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function parseRows(payload: string): TableRow[] | null {
  if (!payload.trim()) return null;
  try {
    const parsed: unknown = JSON.parse(payload);
    if (!Array.isArray(parsed)) return null;

    const rows: TableRow[] = [];
    for (const row of parsed) {
      if (!row || typeof row !== "object") return null;
      const r = row as Record<string, unknown>;

      const position = Number(r.position);
      const team = typeof r.team === "string" ? r.team : "";
      const played = Number(r.played);
      const won = Number(r.won);
      const draw = Number(r.draw);
      const lost = Number(r.lost);
      const goalsFor = Number(r.goalsFor);
      const goalsAgainst = Number(r.goalsAgainst);
      const points = Number(r.points);

      if (!Number.isFinite(position) || !team) return null;
      if (![played, won, draw, lost, goalsFor, goalsAgainst, points].every((n) => Number.isFinite(n))) {
        return null;
      }

      rows.push({
        position,
        team,
        played,
        won,
        draw,
        lost,
        goalsFor,
        goalsAgainst,
        points,
      });
    }

    return rows;
  } catch {
    return null;
  }
}

export async function loginAdminTable(formData: FormData) {
  const configuredSecret = getAdminSecret();
  const secret = getField(formData, "secret");

  if (!configuredSecret) {
    redirect("/admin/table?error=missing-secret");
  }

  if (secret !== configuredSecret) {
    redirect("/admin/table?error=invalid-secret");
  }

  await createAdminSession();
  redirect("/admin/table");
}

export async function logoutAdminTable() {
  await clearAdminSession();
  redirect("/admin/table");
}

export async function saveStandings(formData: FormData) {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    redirect("/admin/table?error=unauthorized");
  }

  const payload = getField(formData, "payload");
  const rows = parseRows(payload);
  if (!rows) {
    redirect("/admin/table?error=invalid-payload");
  }

  await upsertStandingsRows(rows);
  redirect("/admin/table?saved=1");
}

export async function resetStandingsAction() {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    redirect("/admin/table?error=unauthorized");
  }

  await resetStandings();
  redirect("/admin/table?reset=1");
}

