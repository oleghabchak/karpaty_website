"use client";

import { useState } from "react";
import type { Match } from "@/types/match";
import type { MatchesFeaturedDoc } from "@/lib/matches";
import { useRouter } from "next/navigation";
import { resetMatches, upsertMatchesFeatured } from "@/lib/matches";

type AdminMatchesEditorProps = {
  initialFeatured: MatchesFeaturedDoc;
};

function parseOptionalString(v: string) {
  const trimmed = v.trim();
  return trimmed.length ? trimmed : undefined;
}

function parseOptionalNumber(v: string) {
  const trimmed = v.trim();
  if (!trimmed) return undefined;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : undefined;
}

export default function AdminMatchesEditor({ initialFeatured }: AdminMatchesEditorProps) {
  const [nextMatch, setNextMatch] = useState<Match>(initialFeatured.nextMatch);
  const [lastMatch, setLastMatch] = useState<Match>(initialFeatured.lastMatch);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>(initialFeatured.upcomingMatches);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function getNextUpcomingId() {
    return upcomingMatches.reduce((acc, m) => Math.max(acc, m.id), 0) + 1;
  }

  function addUpcomingMatch() {
    const id = getNextUpcomingId();
    setUpcomingMatches((prev) => [
      ...prev,
      {
        id,
        date: "",
        time: undefined,
        homeTeam: "",
        awayTeam: "",
        venue: undefined,
        tour: undefined,
        competition: undefined,
      },
    ]);
  }

  function removeUpcomingMatch(index: number) {
    setUpcomingMatches((prev) => prev.filter((_, i) => i !== index));
  }

  function updateUpcomingMatch(index: number, patch: Partial<Match>) {
    setUpcomingMatches((prev) => prev.map((m, i) => (i === index ? { ...m, ...patch } : m)));
  }

  function updateNextMatch(patch: Partial<Match>) {
    setNextMatch((prev) => ({ ...prev, ...patch }));
  }

  function updateLastMatch(patch: Partial<Match>) {
    setLastMatch((prev) => ({ ...prev, ...patch }));
  }

  async function handleSave() {
    setError(null);
    setSaving(true);
    try {
      await upsertMatchesFeatured({
        nextMatch,
        lastMatch,
        upcomingMatches,
      });
      router.push("/admin/matches?saved=1");
    } catch {
      setError("Не вдалося зберегти матчі в Firestore.");
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    setError(null);
    setSaving(true);
    try {
      await resetMatches();
      router.push("/admin/matches?reset=1");
    } catch {
      setError("Не вдалося скинути матчі до дефолту.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="space-y-8">
        {error ? (
          <div className="rounded-xs border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </div>
        ) : null}

        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-dark text-2xl font-semibold dark:text-white">Календар матчів</h2>
              <p className="text-body-color mt-1 text-sm dark:text-body-color-dark">
                Редагуйте prev/next та майбутні матчі. Збережіть форму для оновлення Firestore.
              </p>
            </div>

            <button
              type="button"
              onClick={addUpcomingMatch}
              className="rounded-xs border border-primary bg-white px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10"
            >
              Додати майбутній матч
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <section className="space-y-3 rounded-xs border border-body-color/10 bg-white p-4 dark:border-white/10 dark:bg-gray-dark">
            <h3 className="text-dark text-lg font-semibold dark:text-white">Наступний матч</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="text-sm">
                Дата
                <input
                  type="text"
                  value={nextMatch.date}
                  onChange={(e) => updateNextMatch({ date: e.target.value })}
                  className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-3 py-2 outline-hidden focus:border-primary"
                />
              </label>
              <label className="text-sm">
                Час (опц.)
                <input
                  type="text"
                  value={nextMatch.time ?? ""}
                  onChange={(e) => updateNextMatch({ time: parseOptionalString(e.target.value) })}
                  className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-3 py-2 outline-hidden focus:border-primary"
                />
              </label>
              <label className="text-sm">
                Домашня команда
                <input
                  type="text"
                  value={nextMatch.homeTeam}
                  onChange={(e) => updateNextMatch({ homeTeam: e.target.value })}
                  className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-3 py-2 outline-hidden focus:border-primary"
                />
              </label>
              <label className="text-sm">
                Гостьова команда
                <input
                  type="text"
                  value={nextMatch.awayTeam}
                  onChange={(e) => updateNextMatch({ awayTeam: e.target.value })}
                  className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-3 py-2 outline-hidden focus:border-primary"
                />
              </label>
              <label className="text-sm">
                Тур (опц.)
                <input
                  type="number"
                  value={nextMatch.tour ?? ""}
                  onChange={(e) => updateNextMatch({ tour: parseOptionalNumber(e.target.value) })}
                  className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-3 py-2 outline-hidden focus:border-primary"
                />
              </label>
              <label className="text-sm">
                Конкуренція (опц.)
                <input
                  type="text"
                  value={nextMatch.competition ?? ""}
                  onChange={(e) => updateNextMatch({ competition: parseOptionalString(e.target.value) })}
                  className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-3 py-2 outline-hidden focus:border-primary"
                />
              </label>
            </div>
          </section>

          <section className="space-y-3 rounded-xs border border-body-color/10 bg-white p-4 dark:border-white/10 dark:bg-gray-dark">
            <h3 className="text-dark text-lg font-semibold dark:text-white">Попередній матч</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="text-sm">
                Дата
                <input
                  type="text"
                  value={lastMatch.date}
                  onChange={(e) => updateLastMatch({ date: e.target.value })}
                  className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-3 py-2 outline-hidden focus:border-primary"
                />
              </label>
              <label className="text-sm">
                Домашня команда
                <input
                  type="text"
                  value={lastMatch.homeTeam}
                  onChange={(e) => updateLastMatch({ homeTeam: e.target.value })}
                  className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-3 py-2 outline-hidden focus:border-primary"
                />
              </label>
              <label className="text-sm">
                Гостьова команда
                <input
                  type="text"
                  value={lastMatch.awayTeam}
                  onChange={(e) => updateLastMatch({ awayTeam: e.target.value })}
                  className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-3 py-2 outline-hidden focus:border-primary"
                />
              </label>
              <label className="text-sm">
                Рахунок (дім.) (опц.)
                <input
                  type="number"
                  value={lastMatch.homeScore ?? ""}
                  onChange={(e) => updateLastMatch({ homeScore: parseOptionalNumber(e.target.value) })}
                  className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-3 py-2 outline-hidden focus:border-primary"
                />
              </label>
              <label className="text-sm">
                Рахунок (гость.) (опц.)
                <input
                  type="number"
                  value={lastMatch.awayScore ?? ""}
                  onChange={(e) => updateLastMatch({ awayScore: parseOptionalNumber(e.target.value) })}
                  className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-3 py-2 outline-hidden focus:border-primary"
                />
              </label>
              <label className="text-sm">
                Тур (опц.)
                <input
                  type="number"
                  value={lastMatch.tour ?? ""}
                  onChange={(e) => updateLastMatch({ tour: parseOptionalNumber(e.target.value) })}
                  className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-3 py-2 outline-hidden focus:border-primary"
                />
              </label>
            </div>
          </section>
        </div>

        <section className="space-y-4 rounded-xs border border-body-color/10 bg-white p-4 dark:border-white/10 dark:bg-gray-dark">
          <h3 className="text-dark text-lg font-semibold dark:text-white">Майбутні матчі</h3>

          <div className="space-y-4">
            {upcomingMatches.map((m, index) => (
              <div
                key={m.id}
                className="rounded-xs border border-body-color/10 bg-body-color/5 p-3 dark:border-white/10 dark:bg-white/5"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-black dark:text-white">Матч #{index + 1}</div>
                  <button
                    type="button"
                    onClick={() => removeUpcomingMatch(index)}
                    className="rounded-xs border border-red-200 bg-white px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-300"
                  >
                    Видалити
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="text-sm">
                    Дата
                    <input
                      type="text"
                      value={m.date}
                      onChange={(e) => updateUpcomingMatch(index, { date: e.target.value })}
                      className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-3 py-2 outline-hidden focus:border-primary"
                    />
                  </label>
                  <label className="text-sm">
                    Час (опц.)
                    <input
                      type="text"
                      value={m.time ?? ""}
                      onChange={(e) => updateUpcomingMatch(index, { time: parseOptionalString(e.target.value) })}
                      className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-3 py-2 outline-hidden focus:border-primary"
                    />
                  </label>

                  <label className="text-sm">
                    Домашня команда
                    <input
                      type="text"
                      value={m.homeTeam}
                      onChange={(e) => updateUpcomingMatch(index, { homeTeam: e.target.value })}
                      className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-3 py-2 outline-hidden focus:border-primary"
                    />
                  </label>

                  <label className="text-sm">
                    Гостьова команда
                    <input
                      type="text"
                      value={m.awayTeam}
                      onChange={(e) => updateUpcomingMatch(index, { awayTeam: e.target.value })}
                      className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-3 py-2 outline-hidden focus:border-primary"
                    />
                  </label>

                  <label className="text-sm">
                    Тур (опц.)
                    <input
                      type="number"
                      value={m.tour ?? ""}
                      onChange={(e) => updateUpcomingMatch(index, { tour: parseOptionalNumber(e.target.value) })}
                      className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-3 py-2 outline-hidden focus:border-primary"
                    />
                  </label>

                  <label className="text-sm sm:col-span-2">
                    Конкуренція (опц.)
                    <input
                      type="text"
                      value={m.competition ?? ""}
                      onChange={(e) =>
                        updateUpcomingMatch(index, { competition: parseOptionalString(e.target.value) })
                      }
                      className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-3 py-2 outline-hidden focus:border-primary"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={saving}
            className="rounded-xs border border-primary bg-white px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "..." : "Скинути до дефолту"}
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-primary/90 rounded-xs px-6 py-3 text-sm font-medium text-white duration-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Збереження..." : "Зберегти матчі"}
          </button>
        </div>
    </div>
  </div>
  );
}

