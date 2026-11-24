import Image from "next/image";
import { statementImages } from "@/data/infrastructureData";

function InlineImage({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="relative mx-2 inline-block h-[0.8em] w-[1.8em] overflow-hidden rounded-full align-baseline">
      <Image src={src} alt={alt} fill sizes="120px" className="object-cover" />
    </span>
  );
}

const Statement = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <p className="mb-8 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          Як ми працюємо
        </p>
        <p className="scroll-text-fill max-w-5xl text-3xl font-bold leading-snug text-black dark:text-white sm:text-4xl lg:text-5xl lg:leading-tight">
          Футбол біля підніжжя Карпат
          <InlineImage src={statementImages.mountains} alt="Карпатські гори" />
          — це не лише дев&apos;яносто хвилин матчу. Це поле, м&apos;яч
          <InlineImage src={statementImages.ball} alt="Футбольний м'яч на полі" />
          і
          <InlineImage src={statementImages.players} alt="Гравці на тренуванні" />
          люди, які щотижня повертаються сюди заради команди.
        </p>
      </div>
    </section>
  );
};

export default Statement;
