import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";
import MarkdownContent from "@/components/News/MarkdownContent";
import NewsYoutubeEmbed from "@/components/News/NewsYoutubeEmbed";
import PostMeta from "@/components/News/PostMeta";
import { getPostBySlugServer } from "@/lib/posts-server";
import { buildPageMetadata } from "@/lib/seo";

type NewsPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: NewsPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlugServer(slug);

  if (!post) {
    return {
      title: "Новина не знайдена | ФК «Уличне»",
    };
  }

  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/news/${slug}`,
  });
}

export default async function NewsPostPage({ params }: NewsPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlugServer(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Breadcrumb
        pageName={post.title}
        description={post.excerpt}
        parent={{ href: "/news", label: "Новини" }}
      />

      <section className="pb-16 pt-4 md:pb-20 md:pt-8">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="overflow-hidden rounded-xs">
              <img
                src={post.image || "/images/blog/blog-01.jpg"}
                alt={post.title}
                className="h-full max-h-[480px] w-full object-cover"
              />
            </div>

            <div className="shadow-three dark:bg-dark mb-8 rounded-xs bg-white p-6 sm:p-8">
              <PostMeta author={post.author} publishDate={post.publishDate} />
            </div>

            <article className="shadow-three dark:bg-dark rounded-xs bg-white p-6 sm:p-8">
              <MarkdownContent markdown={post.bodyMarkdown} />
              {post.youtubeVideoId ? (
                <NewsYoutubeEmbed videoId={post.youtubeVideoId} title={post.title} />
              ) : null}
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
