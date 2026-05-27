"use client";

import Link from "next/link";
import type { Post } from "@/types/post";

type AdminNewsListProps = {
  posts: Post[];
};

export default function AdminNewsList({ posts }: AdminNewsListProps) {
  if (!posts.length) {
    return (
      <p className="text-body-color text-sm dark:text-body-color-dark">
        Ще немає новин.{" "}
        <Link href="/admin/news/new" className="text-primary font-medium hover:underline">
          Створіть першу
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <div
          key={post.slug}
          className="flex flex-col gap-3 rounded-xs border border-body-color/10 bg-white p-4 dark:border-white/10 dark:bg-gray-dark sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="font-semibold text-black dark:text-white">{post.title}</div>
            <p className="text-body-color mt-1 text-sm dark:text-body-color-dark">
              {post.publishDate} · <span className="font-mono text-xs">{post.slug}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/news/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xs border border-body-color/20 px-3 py-1.5 text-sm hover:bg-body-color/5 dark:border-white/10"
            >
              На сайті
            </Link>
            <Link
              href={`/admin/news/${post.slug}/edit`}
              className="rounded-xs border border-primary px-3 py-1.5 text-sm text-primary hover:bg-primary/10"
            >
              Редагувати
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
