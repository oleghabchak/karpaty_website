import Breadcrumb from "@/components/Common/Breadcrumb";
import { teamData } from "@/data/teamData";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Команда | ФК «Уличне»",
  description: "Склад основної команди ФК «Уличне».",
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

export default function TeamPage() {
  return (
    <>
      <Breadcrumb
        pageName="Команда"
        description="Склад основної команди ФК «Уличне»."
      />
      <section className="pb-16 pt-4 md:pb-20 md:pt-8">
        <div className="container">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {teamData.map((player) => (
              <div
                key={player.id}
                className="group flex gap-4 rounded-lg border border-body-color/10 bg-white p-4 transition hover:-translate-y-0.5 hover:border-body-color/20 hover:shadow-lg hover:shadow-black/5 dark:border-white/10 dark:bg-gray-dark dark:hover:border-white/20 dark:hover:shadow-black/20 sm:flex-col sm:p-5"
              >
                <div className="relative w-20 shrink-0 overflow-hidden rounded-xl bg-body-color/5 ring-1 ring-body-color/10 dark:bg-white/5 dark:ring-white/10 sm:w-full">
                  <div className="aspect-[1/1] w-full">
                    {player.image ? (
                    <Image
                      src={player.image}
                      alt={player.name}
                      fill
                      sizes="(max-width: 340px) 96px, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-300 group-hover:scale-[1.1]"
                      priority={player.id <= 3}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 to-primary/5 text-lg font-bold text-primary dark:from-primary/25 dark:to-primary/10">
                      {getInitials(player.name)}
                    </div>
                  )}
                  </div>
                </div>

                <div className="min-w-0 flex-1 sm:flex-none">
                  <h3 className="flex items-center gap-2 text-base font-bold text-black dark:text-white sm:text-lg">
                   
                    <span className="truncate">{player.name}</span>
                  </h3>
                  
                  <p className="mt-0.5 text-sm text-body-color dark:text-body-color-dark">
                     <span className="shrink-0 mr-2 rounded-md bg-body-color/10 px-2 py-0.5 text-xs font-semibold text-body-color dark:bg-white/10 dark:text-body-color-dark">
                      #{player.number}
                    </span> 
                    { player.position}
                  </p>
                  {(player.matches != null || player.goals != null || player.assists != null) && (
                    <div className="mt-3 flex flex-wrap gap-2 text-xs sm:text-sm">
                      {player.matches != null && (
                        <span className="rounded-full bg-body-color/5 px-3 py-1 text-body-color dark:bg-white/5 dark:text-body-color-dark">
                          Матчі: {player.matches}
                        </span>
                      )}
                      {player.goals != null && (
                        <span className="rounded-full bg-body-color/5 px-3 py-1 text-body-color dark:bg-white/5 dark:text-body-color-dark">
                          Голи: {player.goals}
                        </span>
                      )}
                      {player.assists != null && (
                        <span className="rounded-full bg-body-color/5 px-3 py-1 text-body-color dark:bg-white/5 dark:text-body-color-dark">
                          Асисти: {player.assists}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
