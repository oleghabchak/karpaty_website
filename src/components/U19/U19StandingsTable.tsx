import type { TableRow } from "@/types/table";

const columns = ["№", "Клуб", "І", "П", "Н", "П", "РМ", "О"];

type U19StandingsTableProps = {
  rows: TableRow[];
};

export default function U19StandingsTable({ rows }: U19StandingsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-body-color/10 dark:border-white/10">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead>
          <tr className="border-b border-body-color/10 bg-body-color/5 dark:border-white/10 dark:bg-white/5">
            {columns.map((col) => (
              <th key={col} className="p-2 font-semibold text-black dark:text-white">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={`${row.team}-${index}`}
              className={`border-b border-body-color/10 dark:border-white/10 ${
                row.team === "Карпати Уличне" ? "bg-primary/10 font-medium dark:bg-primary/20" : ""
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
  );
}
