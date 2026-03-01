import Breadcrumb from "@/components/Common/Breadcrumb";
import { teamData } from "@/data/teamData";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Команда | ФК «Уличне»",
  description: "Склад основної команди ФК «Уличне».",
};

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
                className="rounded-lg border border-body-color/10 bg-white p-6 dark:border-white/10 dark:bg-gray-dark"
              >
                <div className="mb-2 text-3xl font-bold text-primary">{player.number}</div>
                <h3 className="text-lg font-bold text-black dark:text-white">{player.name}</h3>
                <p className="text-body-color dark:text-body-color-dark">{player.position}</p>
                {(player.matches != null || player.goals != null) && (
                  <p className="mt-2 text-sm text-body-color dark:text-body-color-dark">
                    Матчі: {player.matches}
                    {player.goals != null && ` · Голи: ${player.goals}`}
                    {player.assists != null && ` · Асисти: ${player.assists}`}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
