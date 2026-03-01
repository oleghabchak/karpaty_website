import Breadcrumb from "@/components/Common/Breadcrumb";
import Brands from "@/components/Brands";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Партнери | ФК «Уличне»" };

export default function Page() {
  return (
    <>
      <Breadcrumb pageName="Клуб — Партнери" description="Партнери клубу." />
      <section className="pb-16 pt-4"><div className="container"><p className="mb-8 text-body-color dark:text-body-color-dark">Партнери ФК «Уличне».</p><Brands /></div></section>
    </>
  );
}
