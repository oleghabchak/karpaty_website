"use server";

import { getPostsPage } from "@/lib/posts";
import type { PostsPageCursor } from "@/lib/posts";

const PAGE_SIZE = 9;

export async function loadMoreNews(prevCursor: PostsPageCursor | null) {
  const result = await getPostsPage(PAGE_SIZE, prevCursor ?? undefined);
  return { posts: result.posts, nextCursor: result.nextCursor };
}
