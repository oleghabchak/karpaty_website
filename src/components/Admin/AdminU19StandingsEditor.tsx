"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TableRow } from "@/types/table";
import { resetU19StandingsAction, saveU19Standings } from "@/app/admin/u19-table/actions";

type AdminU19StandingsEditorProps = {
  initialRows: TableRow[];
};

function n0(v: unknown): number {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

function normalizeRow(row: TableRow): TableRow {
  return {
    position: n0(row.position),
    team: typeof row.team === "string" ? row.team : "",
    played: n0(row.played),
    won: n0(row.won),
    draw: n0(row.draw),
    lost: n0(row.lost),
    goalsFor: n0(row.goalsFor),
    goalsAgainst: n0(row.goalsAgainst),
    points: n0(row.points),
  };
}

const inputCell =
  "border-stroke dark:bg-dark dark:border-white/10 dark:text-white min-w-0 w-full rounded-xs border p-2 text-sm outline-hidden focus:border-primary";

const statTh =
  "min-w-[2.5rem] whitespace-nowrap p-2 font-semibold text-black dark:text-white";
const statTd = "min-w-[2.5rem] p-2 align-middle";

const clubTh =
  "min-w-[18rem] p-2 font-semibold text-black dark:text-white md:min-w-[22rem]";
const clubTd = "min-w-[18rem] p-2 align-middle md:min-w-[22rem]";

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

export default function AdminU19StandingsEditor({ initialRows }: AdminU19StandingsEditorProps) {
  const [rows, setRows] = useState<TableRow[]>(() => initialRows.map(normalizeRow));
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
      const formData = new FormData();
      formData.set("payload", JSON.stringify(rows));
      const result = await saveU19Standings(formData);
      if (!result.ok) {
        if (result.error === "unauthorized") {
          setError("Сесія завершилась. Увійдіть ще раз.");
        } else if (result.error === "invalid-payload") {
          setError("Некоректні дані таблиці.");
        } else {
          setError("Не вдалося зберегти таблицю U-19 у Firestore.");
        }
        return;
      }
      router.push("/admin/u19-table?saved=1");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Не вдалося зберегти таблицю U-19 у Firestore.");
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    setError(null);
    setSaving(true);
    try {
      const result = await resetU19StandingsAction();
      if (!result.ok) {
        setError("Сесія завершилась. Увійдіть ще раз.");
        return;
      }
      router.push("/admin/u19-table?reset=1");
    } catch {
      setError("Не вдалося скинути таблицю U-19.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-dark text-2xl font-semibold dark:text-white">Турнірна таблиця U-19</h2>
          <p className="text-body-color mt-1 text-sm dark:text-body-color-dark">
            Редагуйте рядки та збережіть. Публічний перегляд — на сторінці «Сезон 2025».
          </p>
        </div>
      </div>

      {error ? (
        <div className="mb-3 rounded-xs border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={addRow}
          className="rounded-xs border border-primary bg-white px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10"
        >
          Додати рядок
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={saving}
          className="rounded-xs border border-primary bg-white px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? "…" : "Скинути (видалити з Firestore)"}
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-primary hover:bg-primary/90 rounded-xs px-4 py-1.5 text-sm font-medium text-white duration-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? "Збереження…" : "Зберегти таблицю U-19"}
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-body-color/10 dark:border-white/10">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead>
            <tr className="border-b border-body-color/10 bg-body-color/5 dark:border-white/10 dark:bg-white/5">
              <th className={statTh}>№</th>
              <th className={clubTh}>Клуб</th>
              <th className={statTh}>І</th>
              <th className={statTh}>П</th>
              <th className={statTh}>Н</th>
              <th className={statTh}>П</th>
              <th className="min-w-[7rem] p-2 font-semibold text-black dark:text-white">РМ</th>
              <th className={statTh}>О</th>
              <th className="w-24 min-w-[5rem] p-2 text-right font-semibold text-black dark:text-white">
                Дії
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={`${row.position}-${index}`}
                className="border-b border-body-color/10 dark:border-white/10"
              >
                <td className={statTd}>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={row.position}
                    onChange={(e) => {
                      const parsed = Number(e.target.value);
                      updateRow(index, { position: Number.isFinite(parsed) ? parsed : 0 });
                    }}
                    className={inputCell}
                  />
                </td>
                <td className={clubTd}>
                  <input
                    value={row.team}
                    onChange={(e) => updateRow(index, { team: e.target.value })}
                    className={inputCell}
                  />
                </td>
                <td className={statTd}>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={row.played}
                    onChange={(e) => {
                      const parsed = Number(e.target.value);
                      updateRow(index, { played: Number.isFinite(parsed) ? parsed : 0 });
                    }}
                    className={inputCell}
                  />
                </td>
                <td className={statTd}>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={row.won}
                    onChange={(e) => {
                      const parsed = Number(e.target.value);
                      updateRow(index, { won: Number.isFinite(parsed) ? parsed : 0 });
                    }}
                    className={inputCell}
                  />
                </td>
                <td className={statTd}>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={row.draw}
                    onChange={(e) => {
                      const parsed = Number(e.target.value);
                      updateRow(index, { draw: Number.isFinite(parsed) ? parsed : 0 });
                    }}
                    className={inputCell}
                  />
                </td>
                <td className={statTd}>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={row.lost}
                    onChange={(e) => {
                      const parsed = Number(e.target.value);
                      updateRow(index, { lost: Number.isFinite(parsed) ? parsed : 0 });
                    }}
                    className={inputCell}
                  />
                </td>
                <td className="p-2 align-middle">
                  <div className="flex min-w-0 items-center gap-2">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={row.goalsFor}
                      onChange={(e) => {
                        const parsed = Number(e.target.value);
                        updateRow(index, { goalsFor: Number.isFinite(parsed) ? parsed : 0 });
                      }}
                      className={inputCell}
                      aria-label="Голи за"
                    />
                    <span className="shrink-0 text-body-color dark:text-body-color-dark">—</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={row.goalsAgainst}
                      onChange={(e) => {
                        const parsed = Number(e.target.value);
                        updateRow(index, { goalsAgainst: Number.isFinite(parsed) ? parsed : 0 });
                      }}
                      className={inputCell}
                      aria-label="Голи проти"
                    />
                  </div>
                </td>
                <td className={statTd}>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={row.points}
                    onChange={(e) => {
                      const parsed = Number(e.target.value);
                      updateRow(index, { points: Number.isFinite(parsed) ? parsed : 0 });
                    }}
                    className={inputCell}
                  />
                </td>
                <td className="p-2 text-right align-middle">
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    className="rounded-xs border border-red-200 bg-white p-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-300"
                  >
                    Видалити
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
