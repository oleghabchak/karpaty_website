"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TableRow } from "@/types/table";
import { resetStandings, upsertStandingsRows } from "@/lib/standings";

type AdminStandingsEditorProps = {
  initialRows: TableRow[];
};

function makeEmptyRow(nextPosition: number): TableRow {
  return {
    position: nextPosition,
    team: "",
    played: 0,
    won: 0,
    draw: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
  };
}

export default function AdminStandingsEditor({ initialRows }: AdminStandingsEditorProps) {
  const [rows, setRows] = useState<TableRow[]>(initialRows);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function addRow() {
    const maxPos = rows.reduce((acc, r) => Math.max(acc, r.position), 0);
    setRows((prev) => [...prev, makeEmptyRow(maxPos + 1)]);
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  function updateRow(index: number, patch: Partial<TableRow>) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  async function handleSave() {
    setError(null);
    setSaving(true);
    try {
      await upsertStandingsRows(rows);
      router.push("/admin/table?saved=1");
    } catch {
      setError("Не вдалося зберегти таблицю в Firestore.");
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    setError(null);
    setSaving(true);
    try {
      await resetStandings();
      router.push("/admin/table?reset=1");
    } catch {
      setError("Не вдалося скинути таблицю в Firestore.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-dark text-2xl font-semibold dark:text-white">Турнірна таблиця</h2>
            <p className="text-body-color mt-1 text-sm dark:text-body-color-dark">
              Редагуйте рядки та збережіть. Дані зберігаються у Firestore.
            </p>
          </div>

          <button
            type="button"
            onClick={addRow}
            className="rounded-xs border border-primary bg-white px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10"
          >
            Додати рядок
          </button>
        </div>

        {error ? (
          <div className="rounded-xs border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </div>
        ) : null}

        <div className="space-y-4">
          {rows.map((row, index) => (
            <div
              key={`${row.position}-${index}`}
              className="rounded-xs border border-body-color/10 bg-white p-4 dark:border-white/10 dark:bg-gray-dark"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-black dark:text-white">
                  Рядок #{index + 1}
                </div>
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="rounded-xs border border-red-200 bg-white px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-300"
                >
                  Видалити
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="text-sm">
                  <span className="mb-1 block text-body-color dark:text-body-color-dark">№</span>
                  <input
                    type="number"
                    value={row.position}
                    onChange={(e) => updateRow(index, { position: Number(e.target.value) })}
                    className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-3 py-2 outline-hidden focus:border-primary"
                  />
                </label>

                <label className="text-sm">
                  <span className="mb-1 block text-body-color dark:text-body-color-dark">Клуб</span>
                  <input
                    value={row.team}
                    onChange={(e) => updateRow(index, { team: e.target.value })}
                    className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-3 py-2 outline-hidden focus:border-primary"
                  />
                </label>

                <label className="text-sm">
                  <span className="mb-1 block text-body-color dark:text-body-color-dark">І</span>
                  <input
                    type="number"
                    value={row.played}
                    onChange={(e) => updateRow(index, { played: Number(e.target.value) })}
                    className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-3 py-2 outline-hidden focus:border-primary"
                  />
                </label>

                <label className="text-sm">
                  <span className="mb-1 block text-body-color dark:text-body-color-dark">П</span>
                  <input
                    type="number"
                    value={row.won}
                    onChange={(e) => updateRow(index, { won: Number(e.target.value) })}
                    className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-3 py-2 outline-hidden focus:border-primary"
                  />
                </label>

                <label className="text-sm">
                  <span className="mb-1 block text-body-color dark:text-body-color-dark">Н</span>
                  <input
                    type="number"
                    value={row.draw}
                    onChange={(e) => updateRow(index, { draw: Number(e.target.value) })}
                    className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-3 py-2 outline-hidden focus:border-primary"
                  />
                </label>

                <label className="text-sm">
                  <span className="mb-1 block text-body-color dark:text-body-color-dark">П</span>
                  <input
                    type="number"
                    value={row.lost}
                    onChange={(e) => updateRow(index, { lost: Number(e.target.value) })}
                    className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-3 py-2 outline-hidden focus:border-primary"
                  />
                </label>

                <label className="text-sm">
                  <span className="mb-1 block text-body-color dark:text-body-color-dark">Голи (за)</span>
                  <input
                    type="number"
                    value={row.goalsFor}
                    onChange={(e) => updateRow(index, { goalsFor: Number(e.target.value) })}
                    className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-3 py-2 outline-hidden focus:border-primary"
                  />
                </label>

                <label className="text-sm">
                  <span className="mb-1 block text-body-color dark:text-body-color-dark">Голи (проти)</span>
                  <input
                    type="number"
                    value={row.goalsAgainst}
                    onChange={(e) => updateRow(index, { goalsAgainst: Number(e.target.value) })}
                    className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-3 py-2 outline-hidden focus:border-primary"
                  />
                </label>

                <label className="text-sm sm:col-span-2">
                  <span className="mb-1 block text-body-color dark:text-body-color-dark">О</span>
                  <input
                    type="number"
                    value={row.points}
                    onChange={(e) => updateRow(index, { points: Number(e.target.value) })}
                    className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-3 py-2 outline-hidden focus:border-primary"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

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
            {saving ? "Збереження..." : "Зберегти таблицю"}
          </button>
        </div>
      </div>
    </div>
  );
}

