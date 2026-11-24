import Image from "next/image";
import Link from "next/link";
import { places } from "@/data/infrastructureData";

const Places = () => {
  return (
    <section id="places" className="scroll-mt-24 bg-body-color/5 py-20 dark:bg-white/5 md:py-28">
      <div className="container">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-xl text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl">
            Шість місць, одна команда.
          </h2>
          <p className="max-w-md text-base leading-relaxed text-body-color dark:text-body-color-dark">
            Кожне місце має свою роль у сезоні — від дитячих тренувань до
            домашніх матчів основного складу.
          </p>
        </div>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((place, index) => (
            <li key={place.id} className="scroll-reveal">
              <Link
                href={place.href}
                className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-one dark:bg-gray-dark"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={place.image}
                    alt={place.title}
                    fill
                    sizes="(min-width: 992px) 33vw, (min-width: 575px) 50vw, 100vw"
                    className="object-cover duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="mb-3 text-sm font-semibold tabular-nums text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mb-3 text-xl font-bold text-black dark:text-white">
                    {place.title}
                  </h3>
                  <p className="mb-6 flex-1 text-base leading-relaxed text-body-color dark:text-body-color-dark">
                    {place.description}
                  </p>
                  <span className="text-sm font-semibold text-primary group-hover:underline">
                    {place.linkLabel} →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Places;
