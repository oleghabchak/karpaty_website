import Link from "next/link";

const Cta = () => {
  return (
    <section className="pb-20 md:pb-28">
      <div className="container">
        <div className="scroll-reveal rounded-2xl bg-primary px-6 py-14 text-center text-white sm:px-12 lg:py-20">
          <h2 className="mx-auto mb-5 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
            Приходьте на поле. Решту покаже гра.
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Запитання про академію, перегляд чи партнерство — напишіть нам, і ми
            відповімо.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="rounded-xs bg-white px-8 py-4 text-base font-semibold text-primary duration-300 ease-in-out hover:bg-white/90"
            >
              Зв&apos;язатися з клубом
            </Link>
            <Link
              href="/matches"
              className="rounded-xs border border-white/40 px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-white/10"
            >
              Календар матчів
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;
