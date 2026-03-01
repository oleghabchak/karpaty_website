import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Турнірні таблиці Академії | ФК «Уличне»" };

export default function Page() {
  return (
    <>
      <Breadcrumb pageName="Академія — Турнірні таблиці" description="Турнірні таблиці академії." />
      <section className="pb-16 pt-4"><div className="container"><p className="text-body-color dark:text-body-color-dark">Турнірні таблиці.</p></div></section>
    </>
  );
}
