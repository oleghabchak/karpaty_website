import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { tableData } from "@/data/tableData";
import type { TableRow } from "@/types/table";

const STANDINGS_COLLECTION = "standings";
const STANDINGS_DOC_ID = "main";

type StandingsDoc = {
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

  return mapped;
}

/**
 * Read standings rows for the public UI.
 * If Firebase is not configured or the doc is missing - fallback to local static `tableData`.
 */
export async function getStandingsRows(): Promise<TableRow[]> {
  if (!isFirebaseConfigured || !db) {
    return tableData;
  }

  try {
    const snapshot = await getDoc(doc(db, STANDINGS_COLLECTION, STANDINGS_DOC_ID));
    if (!snapshot.exists()) return tableData;

    const data = snapshot.data() as Partial<StandingsDoc> | undefined;
    const rows = mapRows(data?.rows);
    return rows ?? tableData;
  } catch {
    return tableData;
  }
}

/**
 * Upsert standings rows from admin panel.
 * Writes require Firebase to be configured.
 */
export async function upsertStandingsRows(rows: TableRow[]) {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured for writing standings.");
  }

  const payload: StandingsDoc = { rows };
  await setDoc(doc(db, STANDINGS_COLLECTION, STANDINGS_DOC_ID), payload, { merge: true });
}

export async function resetStandings() {
  if (!isFirebaseConfigured || !db) {
    return;
  }

  await deleteDoc(doc(db, STANDINGS_COLLECTION, STANDINGS_DOC_ID));
}

