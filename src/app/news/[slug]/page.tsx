import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";
import MarkdownContent from "@/components/News/MarkdownContent";
import { getPostBySlug } from "@/lib/posts";

type NewsPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: NewsPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Новина не знайдена | ФК «Уличне»",
    };
  }

  return {
    title: `${post.title} | ФК «Уличне»`,
    description: post.excerpt,
  };
}

export default async function NewsPostPage({ params }: NewsPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Breadcrumb pageName={post.title} description={post.excerpt} />

      <section className="pb-16 pt-4 md:pb-20 md:pt-8">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 overflow-hidden rounded-xs">
              <img
                src={post.image || "/images/blog/blog-01.jpg"}
                alt={post.title}
                className="h-full max-h-[480px] w-full object-cover"
              />
            </div>

            <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-body-color dark:text-body-color-dark">
              <span>{post.publishDate}</span>
              <span>{post.author.name}</span>
              {post.tags.length ? <span>{post.tags.join(" / ")}</span> : null}
            </div>

            <article className="shadow-three dark:bg-dark rounded-xs bg-white p-6 sm:p-8">
              <MarkdownContent markdown={post.bodyMarkdown} />
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
