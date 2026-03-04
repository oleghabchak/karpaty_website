import SingleBlog from "@/components/Blog/SingleBlog";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { getBlogPosts } from "@/lib/blog";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Новини | ФК «Уличне»",
  description: "Останні новини та події ФК «Уличне».",
};

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const posts = await getBlogPosts();
  return (
    <>
      <Breadcrumb
        pageName="Новини"
        description="Останні новини та події клубу."
      />
      <section className="pt-4 pb-16 md:pt-8 md:pb-20">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            {posts.map((blog) => (
              <div
                key={blog.id}
                className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3"
              >
                <SingleBlog blog={blog} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
