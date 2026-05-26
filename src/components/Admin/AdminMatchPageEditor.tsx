"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveMatchPage } from "@/app/admin/match-pages/actions";
import type { MatchCenterEntry } from "@/types/matchPage";

export type PostSlugOption = {
  slug: string;
  title: string;
  publishDate: string;
};

type AdminMatchPageEditorProps = {
  initial?: MatchCenterEntry;
  mode: "create" | "edit";
  postSlugOptions: PostSlugOption[];
};

function parseOptionalNumber(v: string) {
  const trimmed = v.trim();
  if (!trimmed) return undefined;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : undefined;
}

export default function AdminMatchPageEditor({
  initial,
  mode,
  postSlugOptions,
}: AdminMatchPageEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [tour, setTour] = useState(initial?.tour != null ? String(initial.tour) : "");
  const [postSlug, setPostSlug] = useState(initial?.postSlug ?? "");
  const [published, setPublished] = useState(
    initial?.published ?? (mode === "create" ? true : false),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setError(null);
    if (!title.trim()) {
      setError("Заповніть назву матчу.");
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.set(
        "payload",
        JSON.stringify({
          id: initial?.id,
          title: title.trim(),
          tour: parseOptionalNumber(tour),
          postSlug: postSlug.trim(),
          published,
        }),
      );

      const result = await saveMatchPage(formData);
      if (!result.ok) {
        if (result.error === "unauthorized") {
          setError("Сесія завершилась. Увійдіть ще раз.");
        } else if (result.error === "post-not-found") {
          setError("Новину не знайдено. Перевірте slug або створіть новину.");
        } else if (result.error === "invalid-payload") {
          setError("Некоректні дані запису матч-центру.");
        } else {
          setError("Не вдалося зберегти запис.");
        }
        return;
      }

      router.push(`/admin/match-pages?saved=1`);
    } catch {
      setError("Не вдалося зберегти запис.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-3 py-2 outline-hidden focus:border-primary";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/match-pages"
          className="text-body-color text-sm hover:text-primary dark:text-body-color-dark"
        >
          ← До списку
        </Link>
        {mode === "edit" && initial?.published && initial.postSlug ? (
          <Link
            href={`/news/${initial.postSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            Відкрити новину на сайті
          </Link>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-xs border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <div className="space-y-4 rounded-xs border border-body-color/10 bg-white p-4 dark:border-white/10 dark:bg-gray-dark">
        <h3 className="text-dark text-lg font-semibold dark:text-white">
          {mode === "create" ? "Новий запис матч-центру" : "Редагування"}
        </h3>
        <p className="text-body-color text-sm dark:text-body-color-dark">
          Контент матчу редагується в{" "}
          <Link href="/admin/news" className="text-primary hover:underline">
            Адмін новин
          </Link>
          . Тут лише назва, тур і опційна прив&apos;язка до новини. Без новини кнопка
          «Матч-центр» на сайті не веде на сторінку.
        </p>

        <label className="block text-sm">
          Назва матчу
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`mt-1 ${inputClass}`}
          />
        </label>

        <label className="block text-sm">
          Тур (опц.)
          <input
            type="number"
            value={tour}
            onChange={(e) => setTour(e.target.value)}
            className={`mt-1 ${inputClass}`}
          />
        </label>

        <label className="block text-sm">
          Новина
          {postSlugOptions.length === 0 ? (
            <p className="text-body-color mt-2 text-xs dark:text-body-color-dark">
              Немає новин.{" "}
              <Link href="/admin/news" className="text-primary hover:underline">
                Створити новину
              </Link>
            </p>
          ) : (
            <select
              value={postSlug}
              onChange={(e) => setPostSlug(e.target.value)}
              className={`mt-1 ${inputClass}`}
            >
              <option value="">— не прив&apos;язано —</option>
              {postSlugOptions.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.title} · {p.publishDate}
                </option>
              ))}
            </select>
          )}
        </label>

        {postSlug ? (
          <p className="text-body-color text-xs dark:text-body-color-dark">
            Посилання: /news/{postSlug}
          </p>
        ) : null}

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 rounded border-body-color/20"
          />
          Опубліковано (видно в списку матч-центру)
        </label>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-primary hover:bg-primary/90 rounded-xs px-6 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? "Збереження..." : "Зберегти"}
        </button>
      </div>
    </div>
  );
}
