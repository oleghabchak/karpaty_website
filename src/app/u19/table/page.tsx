import Breadcrumb from "@/components/Common/Breadcrumb";
import { u19Scorers2025, u19Table2025 } from "@/data/u19TableData";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Турнірна таблиця U-19 | ФК «Уличне»" };

const columns = ["№", "Клуб", "І", "П", "Н", "П", "РМ", "О"];

export default function Page() {
  return (
    <>
      <Breadcrumb
        pageName="Уличне U-19 — Турнірна таблиця"
        description="Турнірна таблиця Чемпіонату Дрогобиччини U-19, сезон 2025. Карпати Уличне — чемпіон 2025."
      />
      <section className="pb-16 pt-4">
        <div className="container">
          <h1 className="mb-2 text-2xl font-bold text-black dark:text-white md:text-3xl">
            Чемпіонат Дрогобиччини U-19 — 2025
          </h1>
          <p className="mb-6 text-body-color dark:text-body-color-dark">
            Карпати Уличне — чемпіон 2025 р.
          </p>
          <div className="overflow-x-auto rounded-lg border border-body-color/10 dark:border-white/10">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-body-color/10 bg-body-color/5 dark:border-white/10 dark:bg-white/5">
                  {columns.map((col) => (
                    <th key={col} className="px-3 py-3 font-semibold text-black dark:text-white">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {u19Table2025.map((row) => (
                  <tr
                    key={row.position}
                    className={`border-b border-body-color/10 dark:border-white/10 ${
                      row.team === "Карпати Уличне" ? "bg-primary/10 font-medium dark:bg-primary/20" : ""
                    }`}
                  >
                    <td className="px-3 py-2 text-body-color dark:text-body-color-dark">{row.position}</td>
                    <td className="px-3 py-2 font-medium text-black dark:text-white">{row.team}</td>
                    <td className="px-3 py-2 text-body-color dark:text-body-color-dark">{row.played}</td>
                    <td className="px-3 py-2 text-body-color dark:text-body-color-dark">{row.won}</td>
                    <td className="px-3 py-2 text-body-color dark:text-body-color-dark">{row.draw}</td>
                    <td className="px-3 py-2 text-body-color dark:text-body-color-dark">{row.lost}</td>
                    <td className="px-3 py-2 text-body-color dark:text-body-color-dark">
                      {row.goalsFor}-{row.goalsAgainst}
                    </td>
                    <td className="px-3 py-2 font-semibold text-black dark:text-white">{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mb-3 mt-10 text-xl font-bold text-black dark:text-white md:text-2xl">
            Бомбардири
          </h2>
          <p className="mb-4 text-sm text-body-color dark:text-body-color-dark">
            Колотило Ростислав (ФК Долішній лужок) — найкращий бомбардир чемпіонату.
          </p>
          <div className="overflow-x-auto rounded-lg border border-body-color/10 dark:border-white/10">
            <table className="w-full min-w-[320px] text-left text-sm">
              <thead>
                <tr className="border-b border-body-color/10 bg-body-color/5 dark:border-white/10 dark:bg-white/5">
                  <th className="px-3 py-3 font-semibold text-black dark:text-white">№</th>
                  <th className="px-3 py-3 font-semibold text-black dark:text-white">Гравець</th>
                  <th className="px-3 py-3 font-semibold text-black dark:text-white">Клуб</th>
                  <th className="px-3 py-3 font-semibold text-black dark:text-white">Г</th>
                </tr>
              </thead>
              <tbody>
                {u19Scorers2025.map((row) => (
                  <tr
                    key={row.position}
                    className={`border-b border-body-color/10 dark:border-white/10 ${
                      row.team === "Карпати Уличне" ? "bg-primary/10 font-medium dark:bg-primary/20" : ""
                    }`}
                  >
                    <td className="px-3 py-2 text-body-color dark:text-body-color-dark">{row.position}</td>
                    <td className="px-3 py-2 font-medium text-black dark:text-white">{row.player}</td>
                    <td className="px-3 py-2 text-body-color dark:text-body-color-dark">{row.team}</td>
                    <td className="px-3 py-2 font-semibold text-black dark:text-white">{row.goals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
