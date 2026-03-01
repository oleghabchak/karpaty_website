import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Фаншоп | ФК «Уличне»",
  description: "Офіційний фаншоп ФК «Уличне».",
};

export default function ShopPage() {
  return (
    <>
      <Breadcrumb
        pageName="Фаншоп"
        description="Офіційна атрибутика та мерч клубу."
      />
      <section className="pb-16 pt-4 md:pb-20 md:pt-8">
        <div className="container">
          <p className="text-body-color dark:text-body-color-dark">
            Фаншоп незабаром. Тут з&apos;являться футболки, шарфи та інша атрибутика клубу.
          </p>
        </div>
      </section>
    </>
  );
}
