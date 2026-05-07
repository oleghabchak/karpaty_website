import { getFriendlyMatches } from "@/lib/friendlyMatches";
import type { FriendlyMatchRow } from "@/types/friendlyMatch";

function MatchCard({ row }: { row: FriendlyMatchRow }) {
  const isUlychneAway = row.awayTeam === "Уличне";
  const isUlychneHome = row.homeTeam === "Уличне";

  return (
    <li
      className={`rounded-lg border border-body-color/10 bg-white p-4 dark:border-white/10 dark:bg-gray-dark ${
        isUlychneHome || isUlychneAway ? "ring-1 ring-primary/30 dark:ring-primary/40" : ""
      }`}
    >
      <div className="mb-3 text-sm text-body-color dark:text-body-color-dark">
        {row.date} · {row.time}
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
        <span
          className={`text-left font-medium text-black dark:text-white ${
            isUlychneHome ? "text-primary dark:text-primary" : ""
          }`}
        >
          {row.homeTeam}
        </span>
        <span className="shrink-0 px-1 text-center font-semibold tabular-nums text-black dark:text-white">
          {row.homeScore}:{row.awayScore}
        </span>
        <span
          className={`text-right font-medium text-black dark:text-white ${
            isUlychneAway ? "text-primary dark:text-primary" : ""
          }`}
        >
          {row.awayTeam}
        </span>
      </div>
    </li>
  );
}

const FriendlyMatchesTeaser = async () => {
  const rows = await getFriendlyMatches();

  return (
    <section
      id="friendly-matches"
      className="bg-body-color/5 py-16 dark:bg-white/5 md:py-20"
    >
      <div className="container">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-black dark:text-white md:text-3xl">
            Контрольні матчі
          </h2>
        </div>

        <div className="hidden md:block">
          <div className="overflow-x-auto rounded-lg border border-body-color/10 dark:border-white/10">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-body-color/10 bg-body-color/5 dark:border-white/10 dark:bg-white/5">
                  <th className="p-2 font-semibold text-black dark:text-white">Дата</th>
                  <th className="p-2 font-semibold text-black dark:text-white">Час</th>
                  <th className="p-2 font-semibold text-black dark:text-white">Господарі</th>
                  <th className="p-2 text-center font-semibold text-black dark:text-white">
                    Рахунок
                  </th>
                  <th className="p-2 font-semibold text-black dark:text-white">Гості</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const hlHome = row.homeTeam === "Уличне";
                  const hlAway = row.awayTeam === "Уличне";
                  return (
                    <tr
                      key={row.id}
                      className="border-b border-body-color/10 dark:border-white/10"
                    >
                      <td className="p-2 text-body-color dark:text-body-color-dark">
                        {row.date}
                      </td>
                      <td className="p-2 text-body-color dark:text-body-color-dark">
                        {row.time}
                      </td>
                      <td
                        className={`p-2 font-medium text-black dark:text-white ${
                          hlHome ? "bg-primary/10 dark:bg-primary/20" : ""
                        }`}
                      >
                        {row.homeTeam}
                      </td>
                      <td className="p-2 text-center font-semibold tabular-nums text-black dark:text-white">
                        {row.homeScore} : {row.awayScore}
                      </td>
                      <td
                        className={`p-2 font-medium text-black dark:text-white ${
                          hlAway ? "bg-primary/10 dark:bg-primary/20" : ""
                        }`}
                      >
                        {row.awayTeam}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <ul className="space-y-4 md:hidden">
          {rows.map((row) => (
            <MatchCard key={row.id} row={row} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FriendlyMatchesTeaser;
