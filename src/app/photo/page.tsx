import Breadcrumb from "@/components/Common/Breadcrumb";
import { buildPageMetadata } from "@/lib/seo";
import { MorphGallery } from "@/components/ui/morph-gallery";

export const metadata = buildPageMetadata({
  title: "Фото",
  description: "Фотогалерея матчів та подій ФК «Уличне».",
  path: "/photo",
});

const gallery = [
  {
    src: "/images/gallery/team_2026.jpg",
    alt: "Командне фото ФК «Уличне» сезон 26/27",
    caption: "ФК «Уличне» в сезоні 26/27",
  },
  {
    src: "/images/gallery/team_season_2026.jpg",
    alt: "Командне фото ФК «Уличне» сезон 2026",
    caption: "ФК «Уличне» в сезоні 2026",
  },
  {
    src: "/images/gallery/team_2025.JPG",
    alt: "Командне фото ФК «Уличне» сезон 2025",
    caption: "ФК «Уличне» в сезоні 2025",
  },
  {
    src: "/images/gallery/2023.jpg",
    alt: "Командне фото ФК Карпати Уличне — чемпіон Дрогобицького району сезону 2023",
    caption: "ФК Карпати Уличне — чемпіон Дрогобицького району в сезоні 2023",
  },
  {
    src: "/images/gallery/2022.jpg",
    alt: "Командне фото ФК «Уличне» сезон 2022",
    caption: "ФК «Уличне» в сезоні 2022",
  },
];

export default function PhotoPage() {
  return (
    <>
      <Breadcrumb
        pageName="Фото"
        description="Фотогалерея матчів та подій клубу."
      />
      <section className="pb-16 pt-4 md:pb-20 md:pt-8">
        <div className="container">
          <MorphGallery images={gallery} />
        </div>
      </section>
    </>
  );
}
