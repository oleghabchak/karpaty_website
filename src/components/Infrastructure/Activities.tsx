import Image from "next/image";
import Link from "next/link";
import { activities } from "@/data/infrastructureData";

const Activities = () => {
  return (
    <section className="bg-body-color/5 py-20 dark:bg-white/5 md:py-28">
      <div className="container">
        <h2 className="mb-12 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl">
          Життя клубу — на полі і поруч.
        </h2>

        <div className="hidden grid-cols-[minmax(0,1fr)_minmax(0,3fr)_auto] gap-6 border-b border-body-color/20 pb-3 text-xs font-semibold uppercase tracking-[0.2em] text-body-color dark:border-white/20 dark:text-body-color-dark md:grid">
          <span>Розділ</span>
          <span>Що подивитися</span>
          <span className="sr-only">Перейти</span>
        </div>

        <ul>
          {activities.map((activity) => (
            <li key={activity.href} className="border-b border-body-color/20 dark:border-white/20">
              <Link
                href={activity.href}
                className="group relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-1 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,3fr)_auto]"
              >
                <span className="col-span-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary md:col-span-1">
                  {activity.section}
                </span>
                <span className="text-xl font-bold text-black duration-300 group-hover:translate-x-2 group-hover:text-primary dark:text-white md:text-2xl">
                  {activity.title}
                </span>
                <span aria-hidden className="text-xl text-primary">
                  →
                </span>
                {/* Hover preview, as in the template's project rows */}
                <span className="pointer-events-none absolute right-16 top-1/2 z-10 hidden aspect-[4/3] w-48 -translate-y-1/2 scale-90 overflow-hidden rounded-xl opacity-0 shadow-two duration-300 group-hover:scale-100 group-hover:opacity-100 lg:block">
                  <Image src={activity.image} alt="" fill sizes="192px" className="object-cover" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Activities;
