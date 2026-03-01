import Link from "next/link";
import { tableData } from "@/data/tableData";

const TableTeaser = () => {
  const columns = ["№", "Клуб", "І", "П", "Н", "П", "РМ", "О"];

  return (
    <section className="bg-white py-16 dark:bg-gray-dark md:py-20">
      <div className="container">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-black dark:text-white md:text-3xl">
            Турнірна таблиця
          </h2>
          <Link
            href="/matches#table"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            Переглянути усю таблицю
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
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
              {tableData.slice(0, 8).map((row) => (
                <tr
                  key={row.position}
                  className={`border-b border-body-color/10 dark:border-white/10 ${
                    row.team === "Уличне" ? "bg-primary/10 font-medium dark:bg-primary/20" : ""
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
      </div>
    </section>
  );
};

export default TableTeaser;
