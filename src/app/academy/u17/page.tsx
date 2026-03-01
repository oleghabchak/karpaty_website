import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = { title: "U-17 | ФК «Уличне»" };

export default function Page() {
  return (
    <>
      <Breadcrumb pageName="Академія — U-17" description="Команда U-17." />
      <section className="pb-16 pt-4"><div className="container"><p className="text-body-color dark:text-body-color-dark">Команда U-17.</p></div></section>
    </>
  );
}
