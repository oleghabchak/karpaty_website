import { doc, getDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { friendlyMatchesFallback } from "@/data/friendlyMatchesData";
import type { FriendlyMatchRow } from "@/types/friendlyMatch";

const COLLECTION = "friendlyMatches";
const DOC_ID = "main";

type FriendlyMatchesDoc = {
  items: FriendlyMatchRow[];
};

function mapItems(input: unknown): FriendlyMatchRow[] | null {
  if (!Array.isArray(input)) return null;

  const mapped: FriendlyMatchRow[] = [];
  for (const item of input) {
    if (!item || typeof item !== "object") return null;
    const r = item as Record<string, unknown>;

    const id = Number(r.id);
    const date = typeof r.date === "string" ? r.date : "";
    const time = typeof r.time === "string" ? r.time : "";
    const homeTeam = typeof r.homeTeam === "string" ? r.homeTeam : "";
    const awayTeam = typeof r.awayTeam === "string" ? r.awayTeam : "";
    const homeScore = Number(r.homeScore);
    const awayScore = Number(r.awayScore);

    if (!Number.isFinite(id) || !date || !homeTeam || !awayTeam) return null;
    if (!Number.isFinite(homeScore) || !Number.isFinite(awayScore)) return null;

    mapped.push({
      id,
      date,
      time,
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
    });
  }

  return mapped;
}

export async function getFriendlyMatches(): Promise<FriendlyMatchRow[]> {
  if (!isFirebaseConfigured || !db) {
    return friendlyMatchesFallback;
  }

  try {
    const snapshot = await getDoc(doc(db, COLLECTION, DOC_ID));
    if (!snapshot.exists()) return friendlyMatchesFallback;

    const data = snapshot.data() as Partial<FriendlyMatchesDoc> | undefined;
    const items = mapItems(data?.items);
    return items ?? friendlyMatchesFallback;
  } catch {
    return friendlyMatchesFallback;
  }
}
