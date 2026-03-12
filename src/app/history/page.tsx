import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Історія клубу | ФК «Уличне»",
  description: "Історія футбольного клубу «Уличне» та сторінки сезонів.",
};

const seasons = [
  { href: "/history/season-2025", title: "Сезон 2025" },
  { href: "/history/season-2024", title: "Сезон 2024" },
  { href: "/history/season-2023", title: "Сезон 2023" },
];

export default function HistoryPage() {
  return (
    <>
      <Breadcrumb
        pageName="Історія клубу"
        description="Історія розвитку ФК «Уличне» та архів сезонів клубу."
      />
      <section className="pb-16 pt-4 md:pb-20 md:pt-8">
        <div className="container">
          <div className="mx-auto max-w-2xl">
            <p className="mb-8 text-body-color dark:text-body-color-dark">
              На цій сторінці зібрана історія футбольного клубу «Уличне» та
              архів сезонів команди.
            </p>
            <ul className="space-y-2">
              {seasons.map((season) => (
                <li key={season.href}>
                  <Link
                    href={season.href}
                    className="text-primary hover:underline"
                  >
                    {season.title}
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
