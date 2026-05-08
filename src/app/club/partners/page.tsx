import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Партнери | ФК «Уличне»" };

export default function Page() {
  return (
    <>
      <Breadcrumb pageName="Клуб — Партнери" description="Партнери клубу." />
    </>
  );
}
