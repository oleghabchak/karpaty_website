"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteMatchPage, publishMatchPage } from "@/app/admin/match-pages/actions";
import type { MatchPage } from "@/types/matchPage";

type AdminMatchPagesListProps = {
  pages: MatchPage[];
};

export default function AdminMatchPagesList({ pages }: AdminMatchPagesListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handlePublish(page: MatchPage) {
    setError(null);
    setPublishingId(page.id);
    try {
      const formData = new FormData();
      formData.set("id", page.id);
      formData.set("slug", page.slug);
      const result = await publishMatchPage(formData);
      if (!result.ok) {
        setError("Не вдалося опублікувати сторінку.");
        return;
      }
      router.refresh();
    } catch {
      setError("Не вдалося опублікувати сторінку.");
    } finally {
      setPublishingId(null);
    }
  }

  async function handleDelete(page: MatchPage) {
    if (!window.confirm(`Видалити сторінку «${page.title}»?`)) return;

    setError(null);
    setDeletingId(page.id);
    try {
      const formData = new FormData();
      formData.set("id", page.id);
      formData.set("slug", page.slug);
      const result = await deleteMatchPage(formData);
      if (!result.ok) {
        setError("Не вдалося видалити сторінку.");
        return;
      }
      router.refresh();
    } catch {
      setError("Не вдалося видалити сторінку.");
    } finally {
      setDeletingId(null);
    }
  }

  if (!pages.length) {
    return (
      <p className="text-body-color text-sm dark:text-body-color-dark">
        Ще немає сторінок матч-центру. Створіть першу.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {error ? (
        <div className="rounded-xs border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
          {error}
        </div>
      ) : null}

      {pages.map((page) => (
        <div
          key={page.id}
          className="flex flex-col gap-3 rounded-xs border border-body-color/10 bg-white p-4 dark:border-white/10 dark:bg-gray-dark sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="font-semibold text-black dark:text-white">{page.title}</div>
            <p className="text-body-color mt-1 text-sm dark:text-body-color-dark">
              {page.date}
              {page.time ? ` · ${page.time}` : ""} · «{page.homeTeam}» – «{page.awayTeam}»
            </p>
            <p className="text-body-color mt-1 text-xs dark:text-body-color-dark">
              /matches/{page.slug}
              {page.published ? " · опубліковано" : " · чернетка (не видно на сайті)"}
              {page.youtubeVideoId ? " · відео" : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {!page.published ? (
              <button
                type="button"
                onClick={() => handlePublish(page)}
                disabled={publishingId === page.id}
                className="bg-primary hover:bg-primary/90 rounded-xs px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
              >
                {publishingId === page.id ? "..." : "Опублікувати"}
              </button>
            ) : null}
            {page.published ? (
              <Link
                href={`/matches/${page.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xs border border-body-color/20 px-3 py-1.5 text-sm hover:bg-body-color/5 dark:border-white/10"
              >
                На сайті
              </Link>
            ) : null}
            <Link
              href={`/admin/match-pages/${page.id}/edit`}
              className="rounded-xs border border-primary px-3 py-1.5 text-sm text-primary hover:bg-primary/10"
            >
              Редагувати
            </Link>
            <button
              type="button"
              onClick={() => handleDelete(page)}
              disabled={deletingId === page.id}
              className="rounded-xs border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60 dark:border-red-500/30 dark:text-red-300"
            >
              {deletingId === page.id ? "..." : "Видалити"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
