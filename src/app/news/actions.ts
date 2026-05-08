"use server";

import { getPostsPage } from "@/lib/posts";
import type { PostsPageCursor } from "@/lib/posts";

const PAGE_SIZE = 9;

export async function loadMoreNews(prevCursor: PostsPageCursor | null) {
  console.log("[News/Action] loadMoreNews:start", { prevCursor: prevCursor ?? null });
  const result = await getPostsPage(PAGE_SIZE, prevCursor ?? undefined);
  console.log("[News/Action] loadMoreNews:success", {
    postsCount: result.posts.length,
    nextCursor: result.nextCursor,
  });
  return { posts: result.posts, nextCursor: result.nextCursor };
}
