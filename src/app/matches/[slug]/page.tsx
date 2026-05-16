import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";
import MarkdownContent from "@/components/News/MarkdownContent";
import MatchYoutubeEmbed from "@/components/Matches/MatchYoutubeEmbed";
import MatchPageDraftNotice from "@/components/Matches/MatchPageDraftNotice";
import { getMatchPageBySlug, getMatchPageBySlugAny } from "@/lib/match-pages";

type MatchCenterPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: MatchCenterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getMatchPageBySlug(slug);

  if (!page) {
    return { title: "Матч не знайдено | ФК «Уличне»" };
  }

  const description =
    page.competition ??
    `«${page.homeTeam}» — «${page.awayTeam}», ${page.date}`;

  return {
    title: `${page.title} | Матч-центр | ФК «Уличне»`,
    description,
  };
}

export default async function MatchCenterPage({ params }: MatchCenterPageProps) {
  const { slug } = await params;
  const page = await getMatchPageBySlug(slug);

  if (!page) {
    const existing = await getMatchPageBySlugAny(slug);
    if (existing && !existing.published) {
      return <MatchPageDraftNotice page={existing} />;
    }
    notFound();
  }

  const hasScore = page.homeScore != null && page.awayScore != null;

  return (
    <>
      <Breadcrumb
        pageName={page.title}
        description={page.competition ?? `Матч-центр · ${page.date}`}
      />

      <section className="pb-16 pt-4 md:pb-20 md:pt-8">
        <div className="container">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="rounded-lg border border-body-color/10 bg-body-color/5 p-6 dark:border-white/10 dark:bg-white/5 md:p-8">
              <p className="mb-2 text-sm text-body-color dark:text-body-color-dark">
                {page.date}
                {page.time ? ` / ${page.time}` : ""}
                {page.tour != null ? ` / ${page.tour} тур` : ""}
              </p>
              {page.venue ? (
                <p className="mb-4 text-sm text-body-color dark:text-body-color-dark">{page.venue}</p>
              ) : null}
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                <span className="text-lg font-bold text-black dark:text-white md:text-xl">
                  «{page.homeTeam}»
                </span>
                <span className="text-2xl font-bold text-primary md:text-3xl">
                  {hasScore ? `${page.homeScore} – ${page.awayScore}` : "VS"}
                </span>
                <span className="text-lg font-bold text-black dark:text-white md:text-xl">
                  «{page.awayTeam}»
                </span>
              </div>
            </div>

            {page.youtubeVideoId ? (
              <MatchYoutubeEmbed videoId={page.youtubeVideoId} title={page.title} />
            ) : null}

            {page.descriptionMarkdown.trim() ? (
              <article className="shadow-three dark:bg-dark rounded-xs bg-white p-6 sm:p-8">
                <MarkdownContent markdown={page.descriptionMarkdown} />
              </article>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
