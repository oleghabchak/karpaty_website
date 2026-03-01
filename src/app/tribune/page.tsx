import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Трибуна Героїв | ФК «Уличне»",
  description: "Трибуна Героїв — вшанування легенд та уболівальників.",
};

export default function TribunePage() {
  return (
    <>
      <Breadcrumb
        pageName="Трибуна Героїв"
        description="Вшанування легенд клубу та уболівальників."
      />
      <section className="pb-16 pt-4 md:pb-20 md:pt-8">
        <div className="container">
          <p className="text-body-color dark:text-body-color-dark">
            Розділ «Трибуна Героїв» присвячено легендам клубу та найвідданішим вболівальникам.
          </p>
        </div>
      </section>
    </>
  );
}
