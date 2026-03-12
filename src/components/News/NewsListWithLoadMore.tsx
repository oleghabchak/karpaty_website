"use client";

import { useState } from "react";
import PostCard from "@/components/News/PostCard";
import { loadMoreNews } from "@/app/news/actions";
import type { Post } from "@/types/post";
import type { PostsPageCursor } from "@/lib/posts";

type NewsListWithLoadMoreProps = {
  initialPosts: Post[];
  initialNextCursor: PostsPageCursor | null;
};

export default function NewsListWithLoadMore({
  initialPosts,
  initialNextCursor,
}: NewsListWithLoadMoreProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [nextCursor, setNextCursor] = useState<PostsPageCursor | null>(initialNextCursor);
  const [loading, setLoading] = useState(false);

  async function handleLoadMore() {
    if (!nextCursor || loading) return;
    setLoading(true);
    try {
      const { posts: nextPosts, nextCursor: next } = await loadMoreNews(nextCursor);
      setPosts((prev) => [...prev, ...nextPosts]);
      setNextCursor(next);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="-mx-4 flex flex-wrap justify-center">
        {posts.map((post) => (
          <div
            key={post.id}
            className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3"
          >
            <PostCard post={post} />
          </div>
        ))}
      </div>

      {nextCursor ? (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loading}
            className="bg-primary hover:bg-primary/90 rounded-xs px-6 py-3 text-sm font-medium text-white duration-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Завантаження..." : "Завантажити ще"}
          </button>
        </div>
      ) : (
        posts.length > 0 && (
          <p className="text-body-color dark:text-body-color-dark mt-10 text-center text-sm">
            Усі новини завантажено
          </p>
        )
      )}
    </>
  );
}
