import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Інфраструктура | ФК «Уличне»" };

export default function Page() {
  return (
    <>
      <Breadcrumb pageName="Клуб — Інфраструктура" description="Інфраструктура клубу." />
      <section className="pb-16 pt-4"><div className="container"><p className="text-body-color dark:text-body-color-dark">Інфраструктура клубу.</p></div></section>
    </>
  );
}
