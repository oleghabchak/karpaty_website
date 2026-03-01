import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Новини U-19 | ФК «Уличне»" };

export default function Page() {
  return (
    <>
      <Breadcrumb pageName="Уличне U-19 — Новини" description="Новини юнацької команди." />
      <section className="pb-16 pt-4"><div className="container"><p className="text-body-color dark:text-body-color-dark">Новини U-19.</p></div></section>
    </>
  );
}
