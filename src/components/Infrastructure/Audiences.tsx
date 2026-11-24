import Image from "next/image";
import Link from "next/link";
import { audiences } from "@/data/infrastructureData";

const Audiences = () => {
  return (
    <section className="bg-dark py-20 text-white md:py-28">
      <div className="container">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-xl text-3xl font-bold leading-tight sm:text-4xl">
            Для всіх, хто будує футбол в Уличному.
          </h2>
          <p className="text-sm text-white/60">Гортайте вбік →</p>
        </div>

        {/* Sideways scroll stands in for the template's pinned horizontal section */}
        <ul className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-6">
          {audiences.map((audience, index) => (
            <li
              key={audience.title}
              className="flex w-[85%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-white/5 sm:w-[60%] lg:w-[38%]"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={audience.image}
                  alt={audience.title}
                  fill
                  sizes="(min-width: 992px) 38vw, (min-width: 575px) 60vw, 85vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-6 lg:p-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-yellow">
                  {String(index + 1).padStart(2, "0")} · {audience.eyebrow}
                </p>
                <h3 className="mb-3 text-2xl font-bold">{audience.title}</h3>
                <p className="mb-4 text-base leading-relaxed text-white/70">{audience.description}</p>
                <p className="mb-8 flex-1 text-base leading-relaxed text-white">{audience.offer}</p>
                <Link
                  href={audience.href}
                  className="inline-flex self-start rounded-xs bg-primary px-6 py-3 text-sm font-semibold text-white duration-300 ease-in-out hover:bg-primary/80"
                >
                  {audience.linkLabel}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Audiences;
