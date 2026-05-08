import SectionTitle from "../Common/SectionTitle";
import { getLatestPostsServer } from "@/lib/posts-server";
import PostCard from "./PostCard";

export default async function NewsSection() {
  const posts = await getLatestPostsServer(3);

  return (
    <section
      id="news"
      className="bg-gray-light dark:bg-bg-color-dark py-16 md:py-20 lg:py-28"
    >
      <div className="container">
        <SectionTitle
          title="Новини"
          paragraph="Останні новини та події ФК «Уличне»."
          center
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
          {posts.map((post) => (
            <div key={post.id} className="w-full">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
