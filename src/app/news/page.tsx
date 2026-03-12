import Breadcrumb from "@/components/Common/Breadcrumb";
import NewsListWithLoadMore from "@/components/News/NewsListWithLoadMore";
import { getPostsPage } from "@/lib/posts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Новини | ФК «Уличне»",
  description: "Останні новини та події ФК «Уличне».",
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 9;

export default async function NewsPage() {
  const { posts: initialPosts, nextCursor: initialNextCursor } =
    await getPostsPage(PAGE_SIZE);

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
