import Breadcrumb from "@/components/Common/Breadcrumb";
import U19StandingsTable from "@/components/U19/U19StandingsTable";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Турнірна таблиця U-19 | ФК «Уличне»" };

export default function Page() {
  return (
    <>
      <Breadcrumb
        pageName="Уличне U-19 — Турнірна таблиця"
        description="Підсумки сезону 2025 дивіться на сторінці «Сезон 2025»."
      />
      <section className="pb-16 pt-4">
        <div className="container">
          <h1 className="mb-2 text-2xl font-bold text-black dark:text-white md:text-3xl">
            Турнірна таблиця U-19
          </h1>
          <p className="mb-4 text-body-color dark:text-body-color-dark">
            Дані чемпіонату та бомбардири перенесено в розділ{" "}
            <Link href="/u19/season-2025" className="text-primary underline hover:no-underline">
              Сезон 2025
            </Link>
            .
          </p>
          <U19StandingsTable rows={[]} />
        </div>
      </section>
    </>
  );
}
