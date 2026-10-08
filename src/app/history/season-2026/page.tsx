import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";
import { TableRow } from "@/types/table";

export const metadata: Metadata = {
  title: "Сезон весна 2026 | ФК «Уличне»",
  description: "Архів турнірної таблиці весняного сезону 2026 футбольного клубу «Уличне».",
};

const season2026SpringTable: TableRow[] = [
  { position: 1, team: "ФК «Мостиська-2»", played: 5, won: 5, draw: 0, lost: 0, goalsFor: 22, goalsAgainst: 7, points: 15 },
  { position: 2, team: "«Карпати» (Східницька ТГ)", played: 5, won: 4, draw: 0, lost: 1, goalsFor: 15, goalsAgainst: 5, points: 12 },
  { position: 3, team: "СФК Уличне/Трускавець-2", played: 5, won: 2, draw: 0, lost: 3, goalsFor: 17, goalsAgainst: 16, points: 6 },
  { position: 4, team: "ФК «Стебник»", played: 5, won: 2, draw: 0, lost: 3, goalsFor: 8, goalsAgainst: 10, points: 6 },
  { position: 5, team: "«Прикарпаття» (Старий Самбір)", played: 5, won: 2, draw: 0, lost: 3, goalsFor: 6, goalsAgainst: 11, points: 6 },
  { position: 6, team: "ФК «Легіон» (Львів/Никонковичі)", played: 5, won: 0, draw: 0, lost: 5, goalsFor: 4, goalsAgainst: 23, points: 0 },
];

export default function HistorySeason2026Page() {
  const columns = ["№", "Клуб", "І", "П", "Н", "П", "РМ", "О"];

  return (
    <>
      <Breadcrumb
        pageName="Сезон весна 2026"
        description="Підсумкова турнірна таблиця весняного сезону 2026 ФК «Уличне»."
      />
      <section className="pb-16 pt-4 md:pb-20 md:pt-8">
        <div className="container">
          <h1 className="mb-6 text-2xl font-bold text-black dark:text-white md:text-3xl">
            Архів сезону весна 2026
          </h1>
          <div className="overflow-x-auto rounded-lg border border-body-color/10 dark:border-white/10">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-body-color/10 bg-body-color/5 dark:border-white/10 dark:bg-white/5">
                  {columns.map((col, index) => (
                    <th key={`${col}-${index}`} className="p-2 font-semibold text-black dark:text-white">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {season2026SpringTable.map((row, index) => (
                  <tr
                    key={`${row.team}-${index}`}
                    className={`border-b border-body-color/10 dark:border-white/10 ${
                      row.team === "СФК Уличне/Трускавець-2" ? "bg-primary/10 font-medium dark:bg-primary/20" : ""
                    }`}
                  >
                    <td className="p-2 text-body-color dark:text-body-color-dark">{row.position}</td>
                    <td className="p-2 font-medium text-black dark:text-white">{row.team}</td>
                    <td className="p-2 text-body-color dark:text-body-color-dark">{row.played}</td>
                    <td className="p-2 text-body-color dark:text-body-color-dark">{row.won}</td>
                    <td className="p-2 text-body-color dark:text-body-color-dark">{row.draw}</td>
                    <td className="p-2 text-body-color dark:text-body-color-dark">{row.lost}</td>
                    <td className="p-2 text-body-color dark:text-body-color-dark">
                      {row.goalsFor}-{row.goalsAgainst}
                    </td>
                    <td className="p-2 font-semibold text-black dark:text-white">{row.points}</td>
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
