import Link from "next/link";
import { upcomingMatches } from "@/data/matchesData";

const CalendarTeaser = () => {
  return (
    <section className="bg-body-color/5 py-16 dark:bg-white/5 md:py-20">
      <div className="container">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-black dark:text-white md:text-3xl">
            Календар матчів
          </h2>
          <Link
            href="/matches"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            Усі матчі
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <ul className="space-y-4">
          {upcomingMatches.map((m) => (
            <li
              key={m.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-body-color/10 bg-white p-4 dark:border-white/10 dark:bg-gray-dark"
            >
              <span className="text-sm text-body-color dark:text-body-color-dark">
                {m.date} {m.time && m.time} , {m.tour} тур
              </span>
              <span className="font-medium text-black dark:text-white">
                «{m.homeTeam}» – «{m.awayTeam}»
              </span>
              <Link
                href="/matches"
                className="text-sm text-primary hover:underline"
              >
                Переглянути
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default CalendarTeaser;
