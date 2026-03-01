import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Клуб | ФК «Уличне»",
  description: "Інформація про клуб: менеджмент, інфраструктура, партнери.",
};

const links = [
  { href: "/club/management", title: "Менеджмент" },
  { href: "/club/infrastructure", title: "Інфраструктура" },
  { href: "/club/reports", title: "Звітність" },
  { href: "/club/media", title: "Медіацентр" },
  { href: "/club/partners", title: "Партнери" },
];

export default function ClubPage() {
  return (
    <>
      <Breadcrumb
        pageName="Клуб"
        description="Історія, менеджмент, інфраструктура та партнери ФК «Уличне»."
      />
      <section className="pb-16 pt-4 md:pb-20 md:pt-8">
        <div className="container">
          <div className="mx-auto max-w-2xl">
            <p className="mb-8 text-body-color dark:text-body-color-dark">
              Футбольний клуб «Уличне» — український футбольний клуб. На цій сторінці ви знайдете інформацію про менеджмент, інфраструктуру та партнерів клубу.
            </p>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-primary hover:underline"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
