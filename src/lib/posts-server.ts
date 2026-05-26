import "server-only";

import { FieldPath, type DocumentData } from "firebase-admin/firestore";
import { getAdminFirestore } from "@/lib/firebaseAdminServer";
import postSeedData from "./post-seed-data";
import { formatPublishDate, normalizeGoogleDriveImageUrl, slugify } from "./post-utils";
import type { Post, PostAuthor } from "@/types/post";
import type { GetPostsPageResult, PostsPageCursor } from "@/lib/posts";

const POSTS_COLLECTION = "posts";
const LOG = process.env.NODE_ENV === "development" || process.env.VERCEL === "1";
const LOG_PREFIX = "[News/Posts]";

const DEFAULT_AUTHOR: PostAuthor = {
  name: "Прес-служба ФК Уличне",
  image: "/teamLogo/logo_noBG.png",
  designation: "Офіційно",
};

function timestampToIso(value: unknown) {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object" && value !== null && "toDate" in value) {
    const date = (value as { toDate?: () => Date }).toDate?.();
    return date instanceof Date ? date.toISOString() : undefined;
  }
  return undefined;
}

function mapAuthor(data: DocumentData): PostAuthor {
  const author = data.author ?? {};
  return {
    name: author.name ?? DEFAULT_AUTHOR.name,
    image: author.image ?? DEFAULT_AUTHOR.image,
    designation: author.designation ?? DEFAULT_AUTHOR.designation,
  };
}

function mapDocToPost(id: string, data: DocumentData): Post {
  const title = data.title ?? "";
  const publishedAt =
    timestampToIso(data.publishedAt) ??
    (typeof data.publishedAt === "string" ? data.publishedAt : undefined) ??
    timestampToIso(data.createdAt) ??
    timestampToIso(data.updatedAt) ??
    "";

  return {
    id,
    slug: data.slug ?? (slugify(title) || id),
    title,
    excerpt: data.excerpt ?? data.paragraph ?? "",
    image: normalizeGoogleDriveImageUrl(data.image ?? ""),
    bodyMarkdown: data.bodyMarkdown ?? data.content ?? data.paragraph ?? "",
    author: mapAuthor(data),
    tags: Array.isArray(data.tags) ? data.tags : [],
    publishDate: data.publishDate ?? formatPublishDate(publishedAt || timestampToIso(data.createdAt)),
    publishedAt,
    createdAt: timestampToIso(data.createdAt),
    updatedAt: timestampToIso(data.updatedAt),
    youtubeVideoId:
      typeof data.youtubeVideoId === "string" && data.youtubeVideoId.trim()
        ? data.youtubeVideoId.trim()
        : undefined,
  };
}

function sortPosts(posts: Post[]) {
  return [...posts].sort((left, right) => {
    const leftTime = left.publishedAt ? Date.parse(left.publishedAt) : 0;
    const rightTime = right.publishedAt ? Date.parse(right.publishedAt) : 0;
    return rightTime - leftTime;
  });
}

function getFallbackPosts(maxPosts?: number) {
  const posts = sortPosts(postSeedData);
  return typeof maxPosts === "number" ? posts.slice(0, maxPosts) : posts;
}

export async function getPostsPageServer(
  pageSize: number,
  cursor?: PostsPageCursor | null
): Promise<GetPostsPageResult> {
  if (LOG) {
    console.log(`${LOG_PREFIX} getPostsPageServer:start`, { pageSize, cursor: cursor ?? null });
  }

  try {
    const postsRef = getAdminFirestore().collection(POSTS_COLLECTION);
    const q = cursor
      ? postsRef
          .orderBy("publishedAt", "desc")
          .orderBy(FieldPath.documentId(), "desc")
          .startAfter(cursor.publishedAt, cursor.id)
          .limit(pageSize)
      : postsRef.orderBy("publishedAt", "desc").orderBy(FieldPath.documentId(), "desc").limit(pageSize);
    const snapshot = await q.get();

    if (snapshot.empty) {
      if (LOG) console.log(`${LOG_PREFIX} getPostsPageServer:empty_snapshot`);
      return { posts: [], nextCursor: null };
    }

    const posts = snapshot.docs.map((d) => mapDocToPost(d.id, d.data()));
    const hasMore = snapshot.docs.length === pageSize;
    const last = posts[posts.length - 1];
    const nextCursor = hasMore && last ? { publishedAt: last.publishedAt, id: last.id } : null;
    if (LOG) console.log(`${LOG_PREFIX} getPostsPageServer:success`, { resultCount: posts.length, nextCursor });
    return { posts, nextCursor };
  } catch (error) {
    if (LOG) {
      console.error(`${LOG_PREFIX} getPostsPageServer:error_fallback`, {
        error: error instanceof Error ? { message: error.message, stack: error.stack } : String(error),
      });
    }
    const sortedFallback = sortPosts(postSeedData);
    const startIndex = cursor ? sortedFallback.findIndex((p) => p.id === cursor.id) + 1 : 0;
    const page = sortedFallback.slice(startIndex, startIndex + pageSize);
    const nextCursor =
      page.length === pageSize && page[page.length - 1]
        ? { publishedAt: page[page.length - 1].publishedAt, id: page[page.length - 1].id }
        : null;
    return { posts: page, nextCursor };
  }
}

export async function getLatestPostsServer(maxPosts = 3) {
  try {
    const snapshot = await getAdminFirestore()
      .collection(POSTS_COLLECTION)
      .orderBy("publishedAt", "desc")
      .limit(maxPosts)
      .get();

    if (snapshot.empty) return getFallbackPosts(maxPosts);
    return snapshot.docs.map((entry) => mapDocToPost(entry.id, entry.data())).slice(0, maxPosts);
  } catch (error) {
    if (LOG) {
      console.error(`${LOG_PREFIX} getLatestPostsServer:error_fallback`, {
        error: error instanceof Error ? { message: error.message, stack: error.stack } : String(error),
      });
    }
    return getFallbackPosts(maxPosts);
  }
}

export async function getPostBySlugServer(slug: string) {
  const fallback = postSeedData.find((post) => post.slug === slug) ?? null;
  try {
    const snapshot = await getAdminFirestore().collection(POSTS_COLLECTION).doc(slug).get();
    if (snapshot.exists) return mapDocToPost(snapshot.id, snapshot.data() ?? {});

    const posts = await getLatestPostsServer(200);
    return posts.find((post) => post.slug === slug) ?? fallback;
  } catch (error) {
    if (LOG) {
      console.error(`${LOG_PREFIX} getPostBySlugServer:error_fallback`, {
        slug,
        error: error instanceof Error ? { message: error.message, stack: error.stack } : String(error),
      });
    }
    return fallback;
  }
}
