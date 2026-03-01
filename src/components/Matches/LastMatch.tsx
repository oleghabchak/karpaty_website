import Link from "next/link";
import { lastMatch } from "@/data/matchesData";

const LastMatch = () => {
  return (
    <section className="bg-body-color/5 py-16 dark:bg-white/5 md:py-20">
      <div className="container">
        <h2 className="mb-8 text-2xl font-bold text-black dark:text-white md:text-3xl">
          Попередній матч
        </h2>
        <div className="rounded-lg border border-body-color/10 bg-white p-6 dark:border-white/10 dark:bg-gray-dark md:p-8">
          <p className="mb-4 text-sm text-body-color dark:text-body-color-dark">
            {lastMatch.date} / 18 тур
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            <span className="text-lg font-bold text-black dark:text-white md:text-xl">
              «{lastMatch.homeTeam}»
            </span>
            <span className="text-2xl font-bold text-primary md:text-3xl">
              {lastMatch.homeScore} – {lastMatch.awayScore}
            </span>
            <span className="text-lg font-bold text-black dark:text-white md:text-xl">
              «{lastMatch.awayTeam}»
            </span>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/video"
              className="inline-flex items-center gap-2 rounded border border-primary px-4 py-2 text-primary hover:bg-primary/10"
            >
              Відео матчу
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/matches"
              className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-white hover:bg-primary/90"
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

export default LastMatch;
