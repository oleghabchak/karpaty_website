import {
  collection,
  deleteField,
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
import type { CreatePostInput, Post, PostAuthor, UpdatePostInput } from "@/types/post";

const POSTS_COLLECTION = "posts";
const LOG = process.env.NODE_ENV === "development" || process.env.VERCEL === "1";
const LOG_PREFIX = "[News/Posts]";

const DEFAULT_AUTHOR: PostAuthor = {
  name: "Прес-служба ФК Уличне",
  image: "/teamLogo/logo_noBG.png",
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
    publishDate:
      data.publishDate ??
      formatPublishDate(publishedAt || timestampToIso(data.createdAt)),
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

export async function getPosts(options?: { maxPosts?: number }): Promise<Post[]> {
  const maxPosts = options?.maxPosts;
  if (LOG) {
    console.log(`${LOG_PREFIX} getPosts:start`, {
      maxPosts: maxPosts ?? null,
      isFirebaseConfigured,
      hasDb: Boolean(db),
    });
  }

  if (!isFirebaseConfigured || !db) {
    if (LOG) {
      console.log(`${LOG_PREFIX} getPosts:fallback_no_firebase`, {
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
      if (LOG) {
        console.log(`${LOG_PREFIX} getPosts:fallback_empty_snapshot`, {
          maxPosts: maxPosts ?? null,
        });
      }
      return getFallbackPosts(maxPosts);
    }

    const posts = snapshot.docs.map((entry) => mapDocToPost(entry.id, entry.data()));
    if (LOG) {
      console.log(`${LOG_PREFIX} getPosts:success`, {
        postsCount: posts.length,
        maxPosts: maxPosts ?? null,
      });
    }
    return posts;
  } catch (error) {
    if (LOG) {
      console.error(`${LOG_PREFIX} getPosts:error_fallback`, {
        maxPosts: maxPosts ?? null,
        error:
          error instanceof Error
            ? { message: error.message, stack: error.stack }
            : String(error),
      });
    }
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
  if (LOG) {
    console.log(`${LOG_PREFIX} getPostsPage:start`, {
      pageSize,
      cursor: cursor ?? null,
      isFirebaseConfigured,
      hasDb: Boolean(db),
    });
  }

  if (!isFirebaseConfigured || !db) {
    const startIndex = cursor
      ? sortedFallback.findIndex((p) => p.id === cursor.id) + 1
      : 0;
    const page = sortedFallback.slice(startIndex, startIndex + pageSize);
    const nextCursor =
      page.length === pageSize && page[page.length - 1]
        ? { publishedAt: page[page.length - 1].publishedAt, id: page[page.length - 1].id }
        : null;
    if (LOG) {
      console.log(`${LOG_PREFIX} getPostsPage:fallback_no_firebase`, {
        pageSize,
        resultCount: page.length,
        nextCursor,
      });
    }
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
      if (LOG) {
        console.log(`${LOG_PREFIX} getPostsPage:empty_snapshot`, {
          pageSize,
          cursor: cursor ?? null,
        });
      }
      return { posts: [], nextCursor: null };
    }

    const posts = snapshot.docs.map((d) => mapDocToPost(d.id, d.data()));
    const hasMore = snapshot.docs.length === pageSize;
    const last = posts[posts.length - 1];
    const nextCursor =
      hasMore && last
        ? { publishedAt: last.publishedAt, id: last.id }
        : null;

    if (LOG) {
      console.log(`${LOG_PREFIX} getPostsPage:success`, {
        resultCount: posts.length,
        nextCursor,
      });
    }
    return { posts, nextCursor };
  } catch (error) {
    if (LOG) {
      console.error(`${LOG_PREFIX} getPostsPage:error_fallback`, {
        pageSize,
        cursor: cursor ?? null,
        error:
          error instanceof Error
            ? { message: error.message, stack: error.stack }
            : String(error),
      });
    }
    const startIndex = cursor
      ? sortedFallback.findIndex((p) => p.id === cursor.id) + 1
      : 0;
    const page = sortedFallback.slice(startIndex, startIndex + pageSize);
    const nextCursor =
      page.length === pageSize && page[page.length - 1]
        ? { publishedAt: page[page.length - 1].publishedAt, id: page[page.length - 1].id }
        : null;
    if (LOG) {
      console.log(`${LOG_PREFIX} getPostsPage:fallback_result`, {
        resultCount: page.length,
        nextCursor,
      });
    }
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
    ...(input.youtubeVideoId ? { youtubeVideoId: input.youtubeVideoId } : {}),
  };

  await setDoc(doc(db, POSTS_COLLECTION, slug), post);

  return mapDocToPost(slug, {
    ...post,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Client-side post creation. Must be called from the browser with an authenticated
 * admin user (admin@gmail.com) so Firestore rules allow the write.
 */
export async function createPostClient(input: CreatePostInput): Promise<Post> {
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
    author: buildAuthorFields(input.author),
    tags: input.tags,
    publishDate: formatPublishDate(publishedAt),
    publishedAt,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...(input.youtubeVideoId ? { youtubeVideoId: input.youtubeVideoId } : {}),
  };

  await setDoc(doc(db, POSTS_COLLECTION, slug), post);

  return mapDocToPost(slug, {
    ...post,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

function buildAuthorFields(author?: Partial<PostAuthor>) {
  return {
    name: author?.name?.trim() || DEFAULT_AUTHOR.name,
    image: normalizeGoogleDriveImageUrl(author?.image ?? DEFAULT_AUTHOR.image),
    designation: author?.designation?.trim() || DEFAULT_AUTHOR.designation,
  };
}

function resolvePublishedAt(inputPublishDate: string | undefined, fallbackIso: string) {
  if (inputPublishDate) {
    const publishDateValue = new Date(inputPublishDate);
    if (!Number.isNaN(publishDateValue.getTime())) {
      return publishDateValue.toISOString();
    }
  }
  return fallbackIso;
}

/**
 * Client-side post update. Must be called from the browser with an authenticated
 * admin user (admin@gmail.com) so Firestore rules allow the write.
 */
export async function updatePostClient(slug: string, input: UpdatePostInput): Promise<Post> {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured for writing posts.");
  }

  const ref = doc(db, POSTS_COLLECTION, slug);
  const existing = await getDoc(ref);
  if (!existing.exists()) {
    throw new Error("Post not found.");
  }

  const existingData = existing.data();
  const existingPublishedAt = resolvePublishedAt(
    undefined,
    timestampToIso(existingData.publishedAt) ??
      (typeof existingData.publishedAt === "string" ? existingData.publishedAt : undefined) ??
      new Date().toISOString(),
  );
  const publishedAt = resolvePublishedAt(input.publishDate, existingPublishedAt);

  const update = {
    slug,
    title: input.title.trim(),
    excerpt: input.excerpt.trim(),
    image: normalizeGoogleDriveImageUrl(input.image),
    bodyMarkdown: input.bodyMarkdown.trim(),
    author: buildAuthorFields(input.author),
    tags: input.tags,
    publishDate: formatPublishDate(publishedAt),
    publishedAt,
    updatedAt: serverTimestamp(),
    youtubeVideoId: input.youtubeVideoId ? input.youtubeVideoId : deleteField(),
  };

  await setDoc(ref, update, { merge: true });

  return mapDocToPost(slug, {
    ...existingData,
    ...update,
    youtubeVideoId: input.youtubeVideoId,
    createdAt: timestampToIso(existingData.createdAt),
    updatedAt: new Date().toISOString(),
    publishedAt,
  });
}
