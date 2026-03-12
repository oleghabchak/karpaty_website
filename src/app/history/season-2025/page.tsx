import Breadcrumb from "@/components/Common/Breadcrumb";
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
          <p className="text-body-color dark:text-body-color-dark">
            Сторінка сезону 2025 у підготовці. Тут з&apos;являться головні події,
            результати та матеріали команди.
          </p>
        </div>
      </section>
    </>
  );
}
