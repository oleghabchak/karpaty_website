import { getPublishedMatchCenterEntries } from "@/lib/match-pages";
import MatchCenterLink from "@/components/Matches/MatchCenterLink";

const MatchPagesList = async () => {
  const entries = await getPublishedMatchCenterEntries();

  return (
    <section className="bg-body-color/5 py-16 dark:bg-white/5 md:py-20" id="recent-matches">
      <div className="container">
        <h2 className="mb-8 text-2xl font-bold text-black dark:text-white md:text-3xl">
          Останні матчі
        </h2>

        {entries.length === 0 ? (
          <p className="text-body-color text-sm dark:text-body-color-dark">
            Поки немає опублікованих записів матч-центру. Додайте їх у адмінці «Матч-центр».
          </p>
        ) : (
          <ul className="space-y-4">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="flex flex-col gap-3 rounded-lg border border-body-color/10 bg-white p-4 dark:border-white/10 dark:bg-gray-dark sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  {entry.tour != null ? (
                    <p className="text-sm text-body-color dark:text-body-color-dark">
                      {entry.tour} тур
                    </p>
                  ) : null}
                  <p className="font-medium text-black dark:text-white">{entry.title}</p>
                </div>
                <MatchCenterLink
                  postSlug={entry.postSlug}
                  className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                >
                  Матч-центр
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </MatchCenterLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default MatchPagesList;
