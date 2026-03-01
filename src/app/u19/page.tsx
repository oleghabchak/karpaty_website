import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Уличне U-19 | ФК «Уличне»",
  description: "Юнацька команда Уличне U-19.",
};

const links = [
  { href: "/u19/team", title: "Команда" },
  { href: "/u19/photo", title: "Фото" },
  { href: "/u19/news", title: "Новини" },
  { href: "/u19/table", title: "Турнірна таблиця" },
];

export default function U19Page() {
  return (
    <>
      <Breadcrumb
        pageName="Уличне U-19"
        description="Юнацька команда Уличне U-19. Команда, фото, новини, турнірна таблиця."
      />
      <section className="pb-16 pt-4 md:pb-20 md:pt-8">
        <div className="container">
          <p className="mb-8 text-body-color dark:text-body-color-dark">
            Юнацька команда Уличне U-19 виступає в Національній лізі U-19. Тут ви знайдете склад, новини, фото та турнірну таблицю.
          </p>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-primary hover:underline">
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
