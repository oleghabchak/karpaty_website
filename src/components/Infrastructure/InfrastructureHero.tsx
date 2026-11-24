import Image from "next/image";
import Link from "next/link";
import { heroImage } from "@/data/infrastructureData";

const InfrastructureHero = () => {
  return (
    <section className="pt-28 lg:pt-[150px]">
      <div className="container">
        <nav aria-label="Навігація" className="mb-6 text-sm font-medium text-body-color dark:text-body-color-dark">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-primary">
                Головна
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/club" className="hover:text-primary">
                Клуб
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-primary">Інфраструктура</li>
          </ol>
        </nav>

        <div className="relative isolate flex min-h-[460px] items-end overflow-hidden rounded-2xl bg-dark md:min-h-[560px] lg:min-h-[640px]">
          {/* Extra height on top covers the downward parallax shift */}
          <div className="scroll-hero-parallax absolute inset-x-0 -top-[30%] bottom-0 -z-10">
            <Image
              src={heroImage}
              alt="Футбольне поле стадіону"
              fill
              priority
              sizes="(min-width: 1400px) 1320px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 -z-10 bg-linear-to-t from-dark via-dark/50 to-dark/10" />

          <div className="w-full p-6 sm:p-10 lg:p-14">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-yellow">
              ФК «Уличне» · Інфраструктура
            </p>
            <h1 className="mb-6 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Місця, де народжується футбол Уличного.
            </h1>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <p className="max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                Головне поле, тренування, академія та трибуна — усе, що тримає
                команду разом від першого тренування до домашнього матчу.
              </p>
              <a
                href="#places"
                className="inline-flex shrink-0 items-center justify-center rounded-xs bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80"
              >
                Оглянути місця
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfrastructureHero;
