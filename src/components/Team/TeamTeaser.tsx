import Link from "next/link";
import { teamData } from "@/data/teamData";

const TeamTeaser = () => {
  return (
    <section className="bg-white py-16 dark:bg-gray-dark md:py-20">
      <div className="container">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-black dark:text-white md:text-3xl">
            Команда
          </h2>
          <Link
            href="/team"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            Детальніше
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {teamData.slice(0, 5).map((player) => (
            <div
              key={player.id}
              className="rounded-lg border border-body-color/10 p-4 text-center dark:border-white/10"
            >
              <div className="mb-2 text-2xl font-bold text-primary">{player.number}</div>
              <div className="font-medium text-black dark:text-white">{player.name}</div>
              <div className="text-sm text-body-color dark:text-body-color-dark">{player.position}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamTeaser;
