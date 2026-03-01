import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Турнірна таблиця U-19 | ФК «Уличне»" };

export default function Page() {
  return (
    <>
      <Breadcrumb pageName="Уличне U-19 — Турнірна таблиця" description="Турнірна таблиця Національної ліги U-19." />
      <section className="pb-16 pt-4"><div className="container"><p className="text-body-color dark:text-body-color-dark">Турнірна таблиця U-19.</p></div></section>
    </>
  );
}
