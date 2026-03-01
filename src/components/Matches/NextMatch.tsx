import Link from "next/link";
import { nextMatch } from "@/data/matchesData";

const NextMatch = () => {
  return (
    <section className="bg-white py-16 dark:bg-gray-dark md:py-20">
      <div className="container">
        <h2 className="mb-8 text-2xl font-bold text-black dark:text-white md:text-3xl">
          Наступний матч
        </h2>
        <div className="rounded-lg border border-body-color/10 bg-body-color/5 p-6 dark:border-white/10 dark:bg-white/5 md:p-8">
          <p className="mb-2 text-sm text-body-color dark:text-body-color-dark">
            {nextMatch.date} / {nextMatch.time}
          </p>
          {nextMatch.venue && (
            <p className="mb-4 text-sm text-body-color dark:text-body-color-dark">
              {nextMatch.venue}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            <span className="text-lg font-bold text-black dark:text-white md:text-xl">
              «{nextMatch.homeTeam}»
            </span>
            <span className="text-2xl font-bold text-primary md:text-3xl">VS</span>
            <span className="text-lg font-bold text-black dark:text-white md:text-xl">
              «{nextMatch.awayTeam}»
            </span>
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/matches"
              className="inline-flex items-center gap-2 rounded bg-primary px-6 py-3 text-white hover:bg-primary/90"
            >
              Матч-центр
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NextMatch;
