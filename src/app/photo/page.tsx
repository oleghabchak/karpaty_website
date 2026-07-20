import Breadcrumb from "@/components/Common/Breadcrumb";
import { buildPageMetadata } from "@/lib/seo";
import Image from "next/image";

export const metadata = buildPageMetadata({
  title: "Фото",
  description: "Фотогалерея матчів та подій ФК «Уличне».",
  path: "/photo",
});

const gallery = [
  {
    src: "/images/gallery/team_2025.JPG",
    alt: "Командне фото ФК «Уличне» сезон 2025",
    caption: "ФК «Уличне» в сезоні 2025",
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
          <ul className="grid gap-10">
            {gallery.map((item) => (
              <li key={item.src}>
                <figure>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-body-color/5 dark:bg-white/5">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 1100px"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <figcaption className="mt-4 text-center text-base font-medium text-black dark:text-white md:text-lg">
                    {item.caption}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
