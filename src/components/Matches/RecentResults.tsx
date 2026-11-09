import { recentResults, type RecentResultRow } from "@/data/recentResultsData";

type Outcome = "win" | "draw" | "loss";

const outcomeLabel: Record<Outcome, string> = {
  win: "Перемога",
  draw: "Нічия",
  loss: "Поразка",
};

const outcomeClass: Record<Outcome, string> = {
  win: "bg-primary/15 text-primary",
  draw: "bg-body-color/10 text-body-color dark:bg-white/10 dark:text-body-color-dark",
  loss: "bg-red-600/15 text-red-700 dark:bg-red-500/20 dark:text-red-300",
};

function getOutcome(row: RecentResultRow): Outcome {
  if (row.goalsFor > row.goalsAgainst) return "win";
  if (row.goalsFor < row.goalsAgainst) return "loss";
  return "draw";
}

function OutcomeBadge({ outcome }: { outcome: Outcome }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${outcomeClass[outcome]}`}
    >
      {outcomeLabel[outcome]}
    </span>
  );
}

function ResultCard({ row }: { row: RecentResultRow }) {
  const outcome = getOutcome(row);

  return (
    <li className="rounded-lg border border-body-color/10 bg-white p-4 dark:border-white/10 dark:bg-gray-dark">
      <div className="mb-3 flex items-center justify-between gap-3 text-sm text-body-color dark:text-body-color-dark">
        <span>{row.date}</span>
        <span className="font-medium text-black dark:text-white">{row.tour}</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium text-black dark:text-white">{row.opponent}</span>
        <span className="shrink-0 font-semibold tabular-nums text-black dark:text-white">
          {row.goalsFor}:{row.goalsAgainst}
        </span>
      </div>
      <div className="mt-3">
        <OutcomeBadge outcome={outcome} />
      </div>
    </li>
  );
}

const RecentResults = () => {
  return (
    <section id="recent-results" className="bg-body-color/5 py-16 dark:bg-white/5 md:py-20">
      <div className="container">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black dark:text-white md:text-3xl">
            Останні результати
          </h2>
        </div>

        <div className="hidden md:block">
          <div className="overflow-x-auto rounded-lg border border-body-color/10 dark:border-white/10">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-body-color/10 bg-body-color/5 dark:border-white/10 dark:bg-white/5">
                  <th className="p-2 font-semibold text-black dark:text-white">Дата</th>
                  <th className="p-2 font-semibold text-black dark:text-white">Тур</th>
                  <th className="p-2 font-semibold text-black dark:text-white">Суперник</th>
                  <th className="p-2 text-center font-semibold text-black dark:text-white">
                    Результат
                  </th>
                  <th className="p-2 text-right font-semibold text-black dark:text-white">
                    Підсумок
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentResults.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-body-color/10 last:border-b-0 dark:border-white/10"
                  >
                    <td className="p-2 text-body-color dark:text-body-color-dark">{row.date}</td>
                    <td className="p-2 font-medium text-black dark:text-white">{row.tour}</td>
                    <td className="p-2 font-medium text-black dark:text-white">{row.opponent}</td>
                    <td className="p-2 text-center font-semibold tabular-nums text-black dark:text-white">
                      {row.goalsFor}:{row.goalsAgainst}
                    </td>
                    <td className="p-2 text-right">
                      <OutcomeBadge outcome={getOutcome(row)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <ul className="space-y-4 md:hidden">
          {recentResults.map((row) => (
            <ResultCard key={row.id} row={row} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default RecentResults;
