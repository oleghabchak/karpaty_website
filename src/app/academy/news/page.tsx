import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Новини Академії | ФК «Уличне»" };

export default function Page() {
  return (
    <>
      <Breadcrumb pageName="Академія — Новини" description="Новини академії." />
      <section className="pb-16 pt-4"><div className="container"><p className="text-body-color dark:text-body-color-dark">Новини академії.</p></div></section>
    </>
  );
}
