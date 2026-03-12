import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  type DocumentData,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import postSeedData from "./post-seed-data";
import {
  formatPublishDate,
  normalizeGoogleDriveImageUrl,
  slugify,
} from "./post-utils";
import type { CreatePostInput, Post, PostAuthor } from "@/types/post";

const POSTS_COLLECTION = "posts";
const LOG = process.env.NODE_ENV === "development";

const DEFAULT_AUTHOR: PostAuthor = {
  name: "Прес-служба ФК Уличне",
  image: "/images/blog/author-03.png",
  designation: "Офіційно",
};

function timestampToIso(value: unknown) {
  if (!value) {
    return undefined;
  }

  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "object" && value !== null && "toDate" in value) {
    const maybeTimestamp = value as { toDate?: () => Date };
    const date = maybeTimestamp.toDate?.();
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
    data.publishedAt ??
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
    publishDate:
      data.publishDate ??
      formatPublishDate(publishedAt || timestampToIso(data.createdAt)),
    publishedAt,
    createdAt: timestampToIso(data.createdAt),
    updatedAt: timestampToIso(data.updatedAt),
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

export async function getPosts(options?: { maxPosts?: number }): Promise<Post[]> {
  const maxPosts = options?.maxPosts;

  if (!isFirebaseConfigured || !db) {
    if (LOG) {
      console.log("[Posts] Using static fallback:", {
        isFirebaseConfigured,
        hasDb: Boolean(db),
      });
    }
    return getFallbackPosts(maxPosts);
  }

  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    const postsQuery =
      typeof maxPosts === "number"
        ? query(postsRef, orderBy("publishedAt", "desc"), limit(maxPosts))
        : query(postsRef, orderBy("publishedAt", "desc"));
    const snapshot = await getDocs(postsQuery);

    if (snapshot.empty) {
      if (LOG) console.log("[Posts] Firestore returned 0 docs, using static fallback");
      return getFallbackPosts(maxPosts);
    }

    const posts = snapshot.docs.map((entry) => mapDocToPost(entry.id, entry.data()));
    if (LOG) console.log("[Posts] Loaded", posts.length, "posts from Firestore");
    return posts;
  } catch (error) {
    if (LOG) console.error("[Posts] Firestore error (using static fallback):", error);
    return getFallbackPosts(maxPosts);
  }
}

export type PostsPageCursor = { publishedAt: string; id: string };

export type GetPostsPageResult = {
  posts: Post[];
  nextCursor: PostsPageCursor | null;
};

/**
 * Cursor-based pagination for the news list. Requires Firestore composite index
 * on (publishedAt desc, __name__ desc) if not auto-created.
 */
export async function getPostsPage(
  pageSize: number,
  cursor?: PostsPageCursor | null
): Promise<GetPostsPageResult> {
  const sortedFallback = sortPosts(postSeedData);

  if (!isFirebaseConfigured || !db) {
    const startIndex = cursor
      ? sortedFallback.findIndex((p) => p.id === cursor.id) + 1
      : 0;
    const page = sortedFallback.slice(startIndex, startIndex + pageSize);
    const nextCursor =
      page.length === pageSize && page[page.length - 1]
        ? { publishedAt: page[page.length - 1].publishedAt, id: page[page.length - 1].id }
        : null;
    return { posts: page, nextCursor };
  }

  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    const q = cursor
      ? query(
          postsRef,
          orderBy("publishedAt", "desc"),
          orderBy(documentId(), "desc"),
          startAfter(cursor.publishedAt, cursor.id),
          limit(pageSize)
        )
      : query(
          postsRef,
          orderBy("publishedAt", "desc"),
          orderBy(documentId(), "desc"),
          limit(pageSize)
        );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { posts: [], nextCursor: null };
    }

    const posts = snapshot.docs.map((d) => mapDocToPost(d.id, d.data()));
    const hasMore = snapshot.docs.length === pageSize;
    const last = posts[posts.length - 1];
    const nextCursor =
      hasMore && last
        ? { publishedAt: last.publishedAt, id: last.id }
        : null;

    if (LOG) console.log("[Posts] getPostsPage:", posts.length, "nextCursor:", !!nextCursor);
    return { posts, nextCursor };
  } catch (error) {
    if (LOG) console.error("[Posts] getPostsPage error (fallback):", error);
    const startIndex = cursor
      ? sortedFallback.findIndex((p) => p.id === cursor.id) + 1
      : 0;
    const page = sortedFallback.slice(startIndex, startIndex + pageSize);
    const nextCursor =
      page.length === pageSize && page[page.length - 1]
        ? { publishedAt: page[page.length - 1].publishedAt, id: page[page.length - 1].id }
        : null;
    return { posts: page, nextCursor };
  }
}

export async function getLatestPosts(maxPosts = 3) {
  const posts = await getPosts({ maxPosts });
  return posts.slice(0, maxPosts);
}

export async function getPostBySlug(slug: string) {
  const fallback = postSeedData.find((post) => post.slug === slug) ?? null;

  if (!isFirebaseConfigured || !db) {
    return fallback;
  }

  try {
    const snapshot = await getDoc(doc(db, POSTS_COLLECTION, slug));
    if (snapshot.exists()) {
      return mapDocToPost(snapshot.id, snapshot.data());
    }

    const posts = await getPosts();
    return posts.find((post) => post.slug === slug) ?? fallback;
  } catch (error) {
    if (LOG) console.error("[Posts] Failed to load post by slug:", error);
    return fallback;
  }
}

async function ensureUniqueSlug(baseSlug: string) {
  if (!db) {
    return baseSlug || `post-${Date.now()}`;
  }

  const initialSlug = baseSlug || `post-${Date.now()}`;
  let candidate = initialSlug;
  let counter = 2;

  while (true) {
    const existing = await getDoc(doc(db, POSTS_COLLECTION, candidate));
    if (!existing.exists()) {
      return candidate;
    }
    candidate = `${initialSlug}-${counter}`;
    counter += 1;
  }
}

export async function createPost(input: CreatePostInput) {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured for writing posts.");
  }

  const baseSlug = slugify(input.title);
  const slug = await ensureUniqueSlug(baseSlug);
  const publishDateValue = input.publishDate ? new Date(input.publishDate) : new Date();
  const publishedAt = Number.isNaN(publishDateValue.getTime())
    ? new Date().toISOString()
    : publishDateValue.toISOString();

  const post = {
    slug,
    title: input.title.trim(),
    excerpt: input.excerpt.trim(),
    image: normalizeGoogleDriveImageUrl(input.image),
    bodyMarkdown: input.bodyMarkdown.trim(),
    author: {
      name: input.author?.name?.trim() || DEFAULT_AUTHOR.name,
      image: normalizeGoogleDriveImageUrl(input.author?.image ?? DEFAULT_AUTHOR.image),
      designation: input.author?.designation?.trim() || DEFAULT_AUTHOR.designation,
    },
    tags: input.tags,
    publishDate: formatPublishDate(publishedAt),
    publishedAt,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, POSTS_COLLECTION, slug), post);

  return mapDocToPost(slug, {
    ...post,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}
