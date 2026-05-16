"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MarkdownContent from "@/components/News/MarkdownContent";
import { saveMatchPage } from "@/app/admin/match-pages/actions";
import { buildMatchPageSlugFromFields } from "@/lib/match-page-utils";
import { parseYoutubeVideoId, getYoutubeThumbnailUrl } from "@/lib/youtube-utils";
import { slugify } from "@/lib/post-utils";
import type { MatchPage } from "@/types/matchPage";

type AdminMatchPageEditorProps = {
  initial?: MatchPage;
  mode: "create" | "edit";
};

function parseOptionalString(v: string) {
  const trimmed = v.trim();
  return trimmed.length ? trimmed : undefined;
}

function parseOptionalNumber(v: string) {
  const trimmed = v.trim();
  if (!trimmed) return undefined;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : undefined;
}

export default function AdminMatchPageEditor({ initial, mode }: AdminMatchPageEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [date, setDate] = useState(initial?.date ?? "");
  const [time, setTime] = useState(initial?.time ?? "");
  const [homeTeam, setHomeTeam] = useState(initial?.homeTeam ?? "");
  const [awayTeam, setAwayTeam] = useState(initial?.awayTeam ?? "");
  const [venue, setVenue] = useState(initial?.venue ?? "");
  const [homeScore, setHomeScore] = useState(
    initial?.homeScore != null ? String(initial.homeScore) : "",
  );
  const [awayScore, setAwayScore] = useState(
    initial?.awayScore != null ? String(initial.awayScore) : "",
  );
  const [tour, setTour] = useState(initial?.tour != null ? String(initial.tour) : "");
  const [competition, setCompetition] = useState(initial?.competition ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(initial?.youtubeVideoId ?? "");
  const [descriptionMarkdown, setDescriptionMarkdown] = useState(initial?.descriptionMarkdown ?? "");
  const [published, setPublished] = useState(
    initial?.published ?? (mode === "create" ? true : false),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const youtubeVideoId = useMemo(() => parseYoutubeVideoId(youtubeUrl), [youtubeUrl]);

  useEffect(() => {
    if (slugTouched) return;
    if (title.trim()) {
      setSlug(slugify(title));
      return;
    }
    if (homeTeam.trim() && awayTeam.trim() && date.trim()) {
      setSlug(buildMatchPageSlugFromFields(homeTeam, awayTeam, date));
    }
  }, [title, homeTeam, awayTeam, date, slugTouched]);

  async function handleSave() {
    setError(null);
    if (!title.trim() || !date.trim() || !homeTeam.trim() || !awayTeam.trim()) {
      setError("Заповніть обов'язкові поля: назва, дата, команди.");
      return;
    }
    if (youtubeUrl.trim() && !youtubeVideoId) {
      setError("Некоректне посилання YouTube.");
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
          slug: slug.trim() || slugify(title),
          date: date.trim(),
          time: parseOptionalString(time),
          homeTeam: homeTeam.trim(),
          awayTeam: awayTeam.trim(),
          venue: parseOptionalString(venue),
          homeScore: parseOptionalNumber(homeScore),
          awayScore: parseOptionalNumber(awayScore),
          tour: parseOptionalNumber(tour),
          competition: parseOptionalString(competition),
          youtubeUrl: youtubeUrl.trim(),
          descriptionMarkdown,
          published,
        }),
      );

      const result = await saveMatchPage(formData);
      if (!result.ok) {
        if (result.error === "unauthorized") {
          setError("Сесія завершилась. Увійдіть ще раз.");
        } else if (result.error === "duplicate-slug") {
          setError("Такий slug вже існує. Оберіть інший.");
        } else if (result.error === "invalid-payload") {
          setError("Некоректні дані сторінки матчу.");
        } else {
          setError("Не вдалося зберегти сторінку.");
        }
        return;
      }

      router.push(`/admin/match-pages?saved=1`);
    } catch {
      setError("Не вдалося зберегти сторінку.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-3 py-2 outline-hidden focus:border-primary";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/match-pages"
          className="text-body-color text-sm hover:text-primary dark:text-body-color-dark"
        >
          ← До списку
        </Link>
        {mode === "edit" && initial?.published ? (
          <Link
            href={`/matches/${initial.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            Відкрити на сайті
          </Link>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-xs border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xs border border-body-color/10 bg-white p-4 dark:border-white/10 dark:bg-gray-dark">
          <h3 className="text-dark text-lg font-semibold dark:text-white">
            {mode === "create" ? "Нова сторінка матчу" : "Редагування"}
          </h3>

          <label className="block text-sm">
            Назва сторінки
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`mt-1 ${inputClass}`}
            />
          </label>

          <label className="block text-sm">
            Slug (URL)
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              className={`mt-1 ${inputClass}`}
            />
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="text-sm">
              Дата
              <input type="text" value={date} onChange={(e) => setDate(e.target.value)} className={`mt-1 ${inputClass}`} />
            </label>
            <label className="text-sm">
              Час (опц.)
              <input type="text" value={time} onChange={(e) => setTime(e.target.value)} className={`mt-1 ${inputClass}`} />
            </label>
            <label className="text-sm">
              Домашня команда
              <input
                type="text"
                value={homeTeam}
                onChange={(e) => setHomeTeam(e.target.value)}
                className={`mt-1 ${inputClass}`}
              />
            </label>
            <label className="text-sm">
              Гостьова команда
              <input
                type="text"
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                className={`mt-1 ${inputClass}`}
              />
            </label>
            <label className="text-sm">
              Рахунок (дім.)
              <input
                type="number"
                value={homeScore}
                onChange={(e) => setHomeScore(e.target.value)}
                className={`mt-1 ${inputClass}`}
              />
            </label>
            <label className="text-sm">
              Рахунок (гості)
              <input
                type="number"
                value={awayScore}
                onChange={(e) => setAwayScore(e.target.value)}
                className={`mt-1 ${inputClass}`}
              />
            </label>
            <label className="text-sm">
              Тур (опц.)
              <input type="number" value={tour} onChange={(e) => setTour(e.target.value)} className={`mt-1 ${inputClass}`} />
            </label>
            <label className="text-sm">
              Змагання (опц.)
              <input
                type="text"
                value={competition}
                onChange={(e) => setCompetition(e.target.value)}
                className={`mt-1 ${inputClass}`}
              />
            </label>
            <label className="text-sm sm:col-span-2">
              Місце (опц.)
              <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} className={`mt-1 ${inputClass}`} />
            </label>
          </div>

          <label className="block text-sm">
            YouTube (URL або ID)
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className={`mt-1 ${inputClass}`}
            />
          </label>
          {youtubeVideoId ? (
            <p className="text-body-color text-xs dark:text-body-color-dark">
              ID: {youtubeVideoId}
            </p>
          ) : null}

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded border-body-color/20"
            />
            Опубліковано (видно на сайті)
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

        <div className="space-y-4">
          <label className="block text-sm">
            Опис (Markdown)
            <textarea
              value={descriptionMarkdown}
              onChange={(e) => setDescriptionMarkdown(e.target.value)}
              rows={14}
              className={`mt-1 ${inputClass}`}
            />
          </label>

          <div className="rounded-xs border border-body-color/10 bg-white p-4 dark:border-white/10 dark:bg-gray-dark">
            <p className="text-body-color mb-3 text-xs font-medium uppercase tracking-wide dark:text-body-color-dark">
              Прев&apos;ю опису
            </p>
            {descriptionMarkdown.trim() ? (
              <MarkdownContent markdown={descriptionMarkdown} />
            ) : (
              <p className="text-body-color text-sm dark:text-body-color-dark">Опис порожній.</p>
            )}
          </div>

          {youtubeVideoId ? (
            <div className="overflow-hidden rounded-xs border border-body-color/10 dark:border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getYoutubeThumbnailUrl(youtubeVideoId)}
                alt="YouTube preview"
                className="aspect-video w-full object-cover"
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
