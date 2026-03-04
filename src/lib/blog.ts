import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  type DocumentData,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import type { Blog } from "@/types/blog";
import blogData from "@/components/Blog/blogData";

const POSTS_COLLECTION = "posts";
const LOG = process.env.NODE_ENV === "development";

function mapDocToBlog(id: string, data: DocumentData): Blog {
  const author = data.author ?? {};
  return {
    id,
    title: data.title ?? "",
    paragraph: data.paragraph ?? "",
    image: data.image ?? "",
    author: {
      name: author.name ?? "",
      image: author.image ?? "",
      designation: author.designation ?? "",
    },
    tags: Array.isArray(data.tags) ? data.tags : [],
    publishDate: data.publishDate ?? "",
  };
}

/**
 * Fetches blog/news posts from Firestore. Falls back to static blogData
 * if Firebase is not configured or the query fails.
 */
export async function getBlogPosts(options?: {
  maxPosts?: number;
}): Promise<Blog[]> {
  if (!isFirebaseConfigured || !db) {
    if (LOG) {
      console.log("[Blog] Using static fallback:", {
        isFirebaseConfigured,
        hasDb: Boolean(db),
      });
    }
    return blogData;
  }
  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    const q = query(
      postsRef,
      orderBy("publishDate", "desc"),
      limit(options?.maxPosts ?? 50)
    );
    if (LOG) console.log("[Blog] Fetching posts from Firestore...");
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      if (LOG) console.log("[Blog] Firestore returned 0 docs, using static fallback");
      return blogData;
    }
    const posts = snapshot.docs.map((doc) => mapDocToBlog(doc.id, doc.data()));
    if (LOG) console.log("[Blog] Loaded", posts.length, "posts from Firestore");
    return posts;
  } catch (err) {
    if (LOG) console.error("[Blog] Firestore error (using static fallback):", err);
    return blogData;
  }
}
