import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Фото | ФК «Уличне»",
  description: "Фотогалерея ФК «Уличне».",
};

export default function PhotoPage() {
  return (
    <>
      <Breadcrumb
        pageName="Фото"
        description="Фотогалерея матчів та подій клубу."
      />
      <section className="pb-16 pt-4 md:pb-20 md:pt-8">
        <div className="container">
          <p className="text-body-color dark:text-body-color-dark">
            Тут буде фотогалерея. Додайте зображення у розділ фото.
          </p>
        </div>
      </section>
    </>
  );
}
