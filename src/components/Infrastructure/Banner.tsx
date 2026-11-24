import Image from "next/image";
import { bannerImage } from "@/data/infrastructureData";

const Banner = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="relative isolate flex aspect-[4/5] items-center overflow-hidden rounded-2xl bg-dark sm:aspect-[16/9]">
          <div className="scroll-parallax absolute inset-0 -z-10">
            <Image
              src={bannerImage}
              alt="Футбольне поле з висоти"
              fill
              sizes="(min-width: 1400px) 1320px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 -z-10 bg-dark/55" />
          <p className="scroll-reveal mx-auto max-w-3xl px-6 text-center text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Одне поле. Сотні тренувань. Цілий сезон разом.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Banner;
