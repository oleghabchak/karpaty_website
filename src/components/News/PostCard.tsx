import Link from "next/link";
import PostMeta from "@/components/News/PostMeta";
import type { Post } from "@/types/post";

const fallbackImage = "/images/blog/blog-01.jpg";

export default function PostCard({ post }: { post: Post }) {
  const {
    title,
    slug,
    image,
    excerpt,
    author,
    tags,
    publishDate,
  } = post;

  return (
    <div className="group shadow-one hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark relative overflow-hidden rounded-xs bg-white duration-300">
      <Link href={`/news/${slug}`} className="relative block aspect-37/22 w-full overflow-hidden">
        <img
          src={image || fallbackImage}
          alt={title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        {tags[0] ? (
          <span className="bg-primary absolute right-6 top-6 z-20 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white capitalize">
            {tags[0]}
          </span>
        ) : null}
      </Link>

      <div className="p-6 sm:p-8 md:px-6 md:py-8 lg:p-8 xl:px-5 xl:py-8 2xl:p-8">
        <h3>
          <Link
            href={`/news/${slug}`}
            className="hover:text-primary dark:hover:text-primary mb-4 block text-xl font-bold text-black sm:text-2xl dark:text-white"
          >
            {title}
          </Link>
        </h3>

        <p className="border-body-color/10 text-body-color mb-6 border-b pb-6 text-base font-medium dark:border-white/10">
          {excerpt}
        </p>

        <PostMeta author={author} publishDate={publishDate} />
      </div>
    </div>
  );
}
