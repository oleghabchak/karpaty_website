import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import { u19Table2025 } from "@/data/u19TableData";
import { getAdminFirestore } from "@/lib/firebaseAdminServer";
import type { TableRow } from "@/types/table";

const COLLECTION = "u19Standings";
const DOC_ID = "main";

type U19StandingsDoc = {
  rows: TableRow[];
};

function mapRows(input: unknown): TableRow[] | null {
  if (!Array.isArray(input)) return null;

  const mapped: TableRow[] = [];
  for (const row of input) {
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
    if (
      ![played, won, draw, lost, goalsFor, goalsAgainst, points].every((n) => Number.isFinite(n))
    ) {
      return null;
    }

    mapped.push({
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

  return mapped.sort((a, b) => a.position - b.position);
}

export type GetU19StandingsOptions = {
  /** Якщо true і документа немає — порожній масив (адмінка), без fallback на статику. */
  forAdmin?: boolean;
};

/**
 * Турнірна таблиця U-19 для публічних сторінок (fallback `u19Table2025`) або для адмінки.
 */
export async function getU19StandingsRows(options?: GetU19StandingsOptions): Promise<TableRow[]> {
  noStore();
  const forAdmin = options?.forAdmin ?? false;

  try {
    const snapshot = await getAdminFirestore().collection(COLLECTION).doc(DOC_ID).get();
    if (!snapshot.exists) {
      return forAdmin ? [] : u19Table2025;
    }
    const data = snapshot.data() as Partial<U19StandingsDoc> | undefined;
    const rows = mapRows(data?.rows);
    if (rows) return rows;
    return forAdmin ? [] : u19Table2025;
  } catch {
    return forAdmin ? [] : u19Table2025;
  }
}
