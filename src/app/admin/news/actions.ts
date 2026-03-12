"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createPost } from "@/lib/posts";
import {
  clearAdminSession,
  createAdminSession,
  getAdminSecret,
  isAdminAuthenticated,
} from "@/lib/admin-session";
import { splitTags } from "@/lib/post-utils";

function getField(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function loginAdmin(formData: FormData) {
  const configuredSecret = getAdminSecret();
  const secret = getField(formData, "secret");

  if (!configuredSecret) {
    redirect("/admin/news?error=missing-secret");
  }

  if (secret !== configuredSecret) {
    redirect("/admin/news?error=invalid-secret");
  }

  await createAdminSession();
  redirect("/admin/news");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/news");
}

export async function createNewsPost(formData: FormData) {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    redirect("/admin/news?error=unauthorized");
  }

  const title = getField(formData, "title");
  const excerpt = getField(formData, "excerpt");
  const image = getField(formData, "image");
  const bodyMarkdown = getField(formData, "bodyMarkdown");

  if (!title || !excerpt || !image || !bodyMarkdown) {
    redirect("/admin/news?error=missing-fields");
  }

  const post = await createPost({
    title,
    excerpt,
    image,
    bodyMarkdown,
    publishDate: getField(formData, "publishDate") || undefined,
    tags: splitTags(getField(formData, "tags")),
    author: {
      name: getField(formData, "authorName"),
      image: getField(formData, "authorImage"),
      designation: getField(formData, "authorDesignation"),
    },
  });

  revalidatePath("/");
  revalidatePath("/news");
  revalidatePath(`/news/${post.slug}`);
  redirect(`/admin/news?created=${post.slug}`);
}
