import Link from "next/link";
import Breadcrumb from "@/components/Common/Breadcrumb";
import type { MatchPage } from "@/types/matchPage";

type MatchPageDraftNoticeProps = {
  page: MatchPage;
};

export default function MatchPageDraftNotice({ page }: MatchPageDraftNoticeProps) {
  return (
    <>
      <Breadcrumb pageName={page.title} description="Сторінка матч-центру" />

      <section className="pb-16 pt-4 md:pb-20 md:pt-8">
        <div className="container">
          <div className="mx-auto max-w-2xl rounded-lg border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-500/30 dark:bg-amber-500/10">
            <h2 className="mb-3 text-xl font-semibold text-black dark:text-white">
              Сторінка ще не опублікована
            </h2>
            <p className="text-body-color mb-6 text-sm dark:text-body-color-dark">
              Матч «{page.title}» збережено в адмінці як чернетка. Увімкніть «Опубліковано», щоб
              відкрити її за адресою{" "}
              <span className="font-mono text-black dark:text-white">/matches/{page.slug}</span>.
            </p>
            <Link
              href={`/admin/match-pages/${page.id}/edit`}
              className="bg-primary hover:bg-primary/90 inline-flex rounded-xs px-6 py-3 text-sm font-medium text-white"
            >
              Відкрити в адмінці
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
