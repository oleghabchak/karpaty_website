import Breadcrumb from "@/components/Common/Breadcrumb";
import U19ScorersTable from "@/components/U19/U19ScorersTable";
import U19StandingsTable from "@/components/U19/U19StandingsTable";
import { u19Scorers2025, u19Table2025 } from "@/data/u19TableData";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Сезон 2025 U-19 | ФК «Уличне»",
  description: "Підсумки сезону 2025 для команди U-19.",
};

export default function U19Season2025Page() {
  return (
    <>
      <Breadcrumb
        pageName="Уличне U-19 — Сезон 2025"
        description="Турнірна таблиця та бомбардири U-19 за сезон 2025."
      />
      <section className="pb-16 pt-4 md:pb-20 md:pt-8">
        <div className="container">
          <h1 className="mb-2 text-2xl font-bold text-black dark:text-white md:text-3xl">
            Чемпіонат Дрогобиччини U-19 — 2025
          </h1>
          <p className="mb-6 text-body-color dark:text-body-color-dark">
            Карпати Уличне — чемпіон 2025 р.
          </p>

          <h2 className="mb-3 text-xl font-bold text-black dark:text-white md:text-2xl">
            Турнірна таблиця
          </h2>
          <U19StandingsTable rows={u19Table2025} />

          <h2 className="mb-3 mt-10 text-xl font-bold text-black dark:text-white md:text-2xl">
            Бомбардири
          </h2>
          <p className="mb-4 text-sm text-body-color dark:text-body-color-dark">
            Колотило Ростислав (ФК Долішній лужок) — найкращий бомбардир чемпіонату.
          </p>
          <U19ScorersTable rows={u19Scorers2025} />
        </div>
      </section>
    </>
  );
}
