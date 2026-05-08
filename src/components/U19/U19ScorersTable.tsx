import type { ScorerRow } from "@/data/u19TableData";

type U19ScorersTableProps = {
  rows: ScorerRow[];
};

export default function U19ScorersTable({ rows }: U19ScorersTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-body-color/10 dark:border-white/10">
      <table className="w-full min-w-[320px] text-left text-sm">
        <thead>
          <tr className="border-b border-body-color/10 bg-body-color/5 dark:border-white/10 dark:bg-white/5">
            <th className="p-2 font-semibold text-black dark:text-white">№</th>
            <th className="p-2 font-semibold text-black dark:text-white">Гравець</th>
            <th className="p-2 font-semibold text-black dark:text-white">Клуб</th>
            <th className="p-2 font-semibold text-black dark:text-white">Г</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.position}
              className={`border-b border-body-color/10 dark:border-white/10 ${
                row.team === "Карпати Уличне" ? "bg-primary/10 font-medium dark:bg-primary/20" : ""
              }`}
            >
              <td className="p-2 text-body-color dark:text-body-color-dark">{row.position}</td>
              <td className="p-2 font-medium text-black dark:text-white">{row.player}</td>
              <td className="p-2 text-body-color dark:text-body-color-dark">{row.team}</td>
              <td className="p-2 font-semibold text-black dark:text-white">{row.goals}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
