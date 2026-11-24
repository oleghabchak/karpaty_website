import Link from "next/link";
import { faq } from "@/data/infrastructureData";

const Faq = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <h2 className="text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl">
            Часті запитання
          </h2>

          <div className="border-t border-body-color/20 dark:border-white/20">
            {faq.map((item) => (
              <details
                key={item.question}
                className="details-animated group border-b border-body-color/20 dark:border-white/20"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-semibold text-black dark:text-white [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span
                    aria-hidden
                    className="text-2xl leading-none text-primary duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="pb-6">
                  <p className="mb-3 text-base leading-relaxed text-body-color dark:text-body-color-dark">
                    {item.answer}
                  </p>
                  <Link href={item.href} className="text-sm font-semibold text-primary hover:underline">
                    {item.linkLabel} →
                  </Link>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
