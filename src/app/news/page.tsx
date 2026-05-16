import Breadcrumb from "@/components/Common/Breadcrumb";
import NewsListWithLoadMore from "@/components/News/NewsListWithLoadMore";
import { getPostsPageServer } from "@/lib/posts-server";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Новини футболу",
  description:
    "Новини футболу: ФК «Уличне» (Карпати Уличне) — Уличне, футбол у Уличному та Дрогобицькому районі.",
  path: "/news",
});

export const dynamic = "force-dynamic";

const PAGE_SIZE = 9;

export default async function NewsPage() {
  console.log("[News/Page] render:start");
  const { posts: initialPosts, nextCursor: initialNextCursor } =
    await getPostsPageServer(PAGE_SIZE);
  console.log("[News/Page] render:data", {
    initialPostsCount: initialPosts.length,
    hasNextCursor: Boolean(initialNextCursor),
    nextCursor: initialNextCursor,
  });

  return (
    <>
      <Breadcrumb
        pageName="Новини"
        description="Останні новини та події клубу."
      />
      <section className="pt-4 pb-16 md:pt-8 md:pb-20">
        <div className="container">
          <NewsListWithLoadMore
            initialPosts={initialPosts}
            initialNextCursor={initialNextCursor}
          />
        </div>
      </section>
    </>
  );
}
