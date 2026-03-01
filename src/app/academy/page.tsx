import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Академія | ФК «Уличне»",
  description: "Дитячо-юнацька академія ФК «Уличне».",
};

const links = [
  { href: "/academy/news", title: "Новини" },
  { href: "/academy/tables", title: "Турнірні таблиці" },
  { href: "/academy/u17", title: "U-17" },
  { href: "/academy/u16", title: "U-16" },
  { href: "/academy/u15", title: "U-15" },
  { href: "/academy/u14", title: "U-14" },
];

export default function AcademyPage() {
  return (
    <>
      <Breadcrumb
        pageName="Академія"
        description="Дитячо-юнацька академія ФК «Уличне»."
      />
      <section className="pb-16 pt-4 md:pb-20 md:pt-8">
        <div className="container">
          <p className="mb-8 text-body-color dark:text-body-color-dark">
            Академія ФК «Уличне» — виховання молодих гравців. Новини, турнірні таблиці та склади команд U-17, U-16, U-15, U-14.
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
