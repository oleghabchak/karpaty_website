"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteMatchPage, publishMatchPage } from "@/app/admin/match-pages/actions";
import type { MatchCenterEntry } from "@/types/matchPage";

type AdminMatchPagesListProps = {
  entries: MatchCenterEntry[];
};

export default function AdminMatchPagesList({ entries }: AdminMatchPagesListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handlePublish(entry: MatchCenterEntry) {
    setError(null);
    setPublishingId(entry.id);
    try {
      const formData = new FormData();
      formData.set("id", entry.id);
      formData.set("postSlug", entry.postSlug ?? "");
      const result = await publishMatchPage(formData);
      if (!result.ok) {
        setError("Не вдалося опублікувати запис.");
        return;
      }
      router.refresh();
    } catch {
      setError("Не вдалося опублікувати запис.");
    } finally {
      setPublishingId(null);
    }
  }

  async function handleDelete(entry: MatchCenterEntry) {
    if (!window.confirm(`Видалити «${entry.title}»?`)) return;

    setError(null);
    setDeletingId(entry.id);
    try {
      const formData = new FormData();
      formData.set("id", entry.id);
      formData.set("postSlug", entry.postSlug ?? "");
      const result = await deleteMatchPage(formData);
      if (!result.ok) {
        setError("Не вдалося видалити запис.");
        return;
      }
      router.refresh();
    } catch {
      setError("Не вдалося видалити запис.");
    } finally {
      setDeletingId(null);
    }
  }

  if (!entries.length) {
    return (
      <p className="text-body-color text-sm dark:text-body-color-dark">
        Ще немає записів матч-центру. Створіть перший.
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

      {entries.map((entry) => (
        <div
          key={entry.id}
          className="flex flex-col gap-3 rounded-xs border border-body-color/10 bg-white p-4 dark:border-white/10 dark:bg-gray-dark sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="font-semibold text-black dark:text-white">{entry.title}</div>
            <p className="text-body-color mt-1 text-sm dark:text-body-color-dark">
              {entry.tour != null ? `${entry.tour} тур` : "Без туру"}
              {entry.postSlug ? ` · /news/${entry.postSlug}` : " · новина не привʼязана"}
            </p>
            <p className="text-body-color mt-1 text-xs dark:text-body-color-dark">
              {entry.published ? "опубліковано" : "чернетка (не видно на сайті)"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {!entry.published ? (
              <button
                type="button"
                onClick={() => handlePublish(entry)}
                disabled={publishingId === entry.id}
                className="bg-primary hover:bg-primary/90 rounded-xs px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
              >
                {publishingId === entry.id ? "..." : "Опублікувати"}
              </button>
            ) : null}
            {entry.published && entry.postSlug ? (
              <Link
                href={`/news/${entry.postSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xs border border-body-color/20 px-3 py-1.5 text-sm hover:bg-body-color/5 dark:border-white/10"
              >
                На сайті
              </Link>
            ) : null}
            <Link
              href={`/admin/match-pages/${entry.id}/edit`}
              className="rounded-xs border border-primary px-3 py-1.5 text-sm text-primary hover:bg-primary/10"
            >
              Редагувати
            </Link>
            <button
              type="button"
              onClick={() => handleDelete(entry)}
              disabled={deletingId === entry.id}
              className="rounded-xs border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60 dark:border-red-500/30 dark:text-red-300"
            >
              {deletingId === entry.id ? "..." : "Видалити"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
