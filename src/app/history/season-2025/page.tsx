import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Сезон 2025 | ФК «Уличне»",
  description: "Архів і матеріали сезону 2025 футбольного клубу «Уличне».",
};

export default function HistorySeason2025Page() {
  return (
    <>
      <Breadcrumb
        pageName="Сезон 2025"
        description="Матеріали, події та підсумки сезону 2025 ФК «Уличне»."
      />
      <section className="pb-16 pt-4 md:pb-20 md:pt-8">
        <div className="container">
          <h1 className="mb-3 text-2xl font-bold text-black dark:text-white md:text-3xl">
            Архів сезону 2025
          </h1>
  
          <p className="text-body-color dark:text-body-color-dark">
            Перейти:{" "}
            <Link href="/u19/season-2025" className="text-primary underline hover:no-underline">
              Сезон 2025 U-19
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
