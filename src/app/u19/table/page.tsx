import Breadcrumb from "@/components/Common/Breadcrumb";
import U19StandingsTable from "@/components/U19/U19StandingsTable";
import Link from "next/link";
import { getU19StandingsRows } from "@/lib/u19Standings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Турнірна таблиця U-19 (2026) | ФК «Уличне»",
  description: "Поточний сезон U-19 (2026) з оновленням після редагування в адмінці.",
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const rows = await getU19StandingsRows({ forAdmin: true });

  return (
    <>
      <Breadcrumb
        pageName="Уличне U-19 — Турнірна таблиця (2026)"
        description="Поточний сезон U-19. Дані оновлюються після змін в адмін-панелі."
      />
      <section className="pb-16 pt-4">
        <div className="container">
          <h1 className="mb-2 text-2xl font-bold text-black dark:text-white md:text-3xl">
            Турнірна таблиця U-19 (2026)
          </h1>
          <p className="mb-4 text-body-color dark:text-body-color-dark">
            Підсумки попереднього чемпіонату дивіться у розділі{" "}
            <Link href="/u19/season-2025" className="text-primary underline hover:no-underline">
              Сезон 2025
            </Link>
            .
          </p>
          {rows.length > 0 ? (
            <U19StandingsTable rows={rows} />
          ) : (
            <p className="text-body-color dark:text-body-color-dark">
              Таблиця сезону 2026 ще не заповнена. Додайте дані в адмінці.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
