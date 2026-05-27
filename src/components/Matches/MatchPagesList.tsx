import Link from "next/link";
import { getPublishedMatchCenterEntries } from "@/lib/match-pages";
import MatchCenterLink from "@/components/Matches/MatchCenterLink";
import type { MatchCenterEntry } from "@/types/matchPage";

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function MatchCenterMobileCard({ entry }: { entry: MatchCenterEntry }) {
  const hasNews = Boolean(entry.postSlug);

  const inner = (
    <>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          {entry.tour != null ? (
            <span className="mb-2 inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {entry.tour} тур
            </span>
          ) : null}
          <p className="text-base font-semibold leading-snug text-black dark:text-white">
            {entry.title}
          </p>
        </div>
        {hasNews ? (
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ChevronRightIcon className="h-5 w-5" />
          </span>
        ) : null}
      </div>
      <p
        className={`mt-3 text-sm font-medium ${
          hasNews
            ? "text-primary"
            : "text-body-color dark:text-body-color-dark"
        }`}
      >
        {hasNews ? "Читати звіт матчу" : "Звіт ще не опубліковано"}
      </p>
    </>
  );

  if (hasNews && entry.postSlug) {
    return (
      <li>
        <Link
          href={`/news/${entry.postSlug}`}
          className="block rounded-xl border border-body-color/10 bg-white p-4 shadow-sm transition active:scale-[0.99] active:bg-body-color/5 dark:border-white/10 dark:bg-gray-dark dark:active:bg-white/5"
        >
          {inner}
        </Link>
      </li>
    );
  }

  return (
    <li className="rounded-xl border border-body-color/10 bg-white/80 p-4 dark:border-white/10 dark:bg-gray-dark/80">
      {inner}
    </li>
  );
}

function MatchCenterDesktopRow({ entry }: { entry: MatchCenterEntry }) {
  return (
    <li className="flex flex-row items-center justify-between gap-3 rounded-lg border border-body-color/10 bg-white p-4 dark:border-white/10 dark:bg-gray-dark">
      <div>
        {entry.tour != null ? (
          <p className="text-sm text-body-color dark:text-body-color-dark">{entry.tour} тур</p>
        ) : null}
        <p className="font-medium text-black dark:text-white">{entry.title}</p>
      </div>
      <MatchCenterLink
        postSlug={entry.postSlug}
        className="inline-flex shrink-0 items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
      >
        Матч-центр
        <ChevronRightIcon className="h-4 w-4" />
      </MatchCenterLink>
    </li>
  );
}

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
          <>
            <ul className="space-y-3 md:hidden">
              {entries.map((entry) => (
                <MatchCenterMobileCard key={entry.id} entry={entry} />
              ))}
            </ul>

            <ul className="hidden space-y-4 md:block">
              {entries.map((entry) => (
                <MatchCenterDesktopRow key={entry.id} entry={entry} />
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
};

export default MatchPagesList;
