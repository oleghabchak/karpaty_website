"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import NewsYoutubeEmbed from "@/components/News/NewsYoutubeEmbed";
import { parseYoutubeVideoId } from "@/lib/youtube-utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MarkdownContent from "@/components/News/MarkdownContent";
import PostCard from "@/components/News/PostCard";
import { createPostClient, updatePostClient } from "@/lib/posts";
import { revalidatePost } from "@/app/admin/news/actions";
import {
  insertImagesBetweenParagraphs,
  uploadImageToCloudinary,
} from "@/lib/post-body-images";
import { formatPublishDate, normalizeGoogleDriveImageUrl, splitTags } from "@/lib/post-utils";
import type { Post } from "@/types/post";

type AdminNewsEditorProps = {
  mode: "create" | "edit";
  slug?: string;
  initial?: Post;
  cloudName?: string;
  uploadPreset?: string;
};

const defaultAuthorName = "Прес-служба ФК Уличне";
const defaultAuthorImage = "/teamLogo/logo_noBG.png";
const defaultAuthorDesignation = "Офіційно";

function toDateInputValue(iso?: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function youtubeUrlFromVideoId(videoId?: string) {
  return videoId ? `https://www.youtube.com/watch?v=${videoId}` : "";
}

function buildPostInput(
  title: string,
  excerpt: string,
  image: string,
  bodyMarkdown: string,
  tags: string,
  publishDate: string,
  authorName: string,
  authorImage: string,
  authorDesignation: string,
  youtubeVideoId: string | null,
) {
  return {
    title: title.trim(),
    excerpt: excerpt.trim(),
    image: image.trim(),
    bodyMarkdown: bodyMarkdown.trim(),
    tags: splitTags(tags),
    publishDate: publishDate || undefined,
    author: {
      name: authorName.trim(),
      image: authorImage.trim(),
      designation: authorDesignation.trim(),
    },
    youtubeVideoId: youtubeVideoId ?? undefined,
  };
}

export default function AdminNewsEditor({
  mode,
  slug,
  initial,
  cloudName,
  uploadPreset,
}: AdminNewsEditorProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [tags, setTags] = useState(initial?.tags?.join(", ") ?? "Новини");
  const [publishDate, setPublishDate] = useState(() => toDateInputValue(initial?.publishedAt));
  const [authorName, setAuthorName] = useState(initial?.author.name ?? defaultAuthorName);
  const [authorImage, setAuthorImage] = useState(initial?.author.image ?? defaultAuthorImage);
  const [authorDesignation, setAuthorDesignation] = useState(
    initial?.author.designation ?? defaultAuthorDesignation,
  );
  const [bodyMarkdown, setBodyMarkdown] = useState(initial?.bodyMarkdown ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(() => youtubeUrlFromVideoId(initial?.youtubeVideoId));
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const canUploadToCloudinary = Boolean(cloudName && uploadPreset);
  const youtubeVideoId = useMemo(() => parseYoutubeVideoId(youtubeUrl), [youtubeUrl]);
  const previewSlug = isEdit && slug ? slug : "preview-post";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    if (!title.trim() || !excerpt.trim() || !image.trim() || !bodyMarkdown.trim()) {
      setSubmitError("Заповніть усі обов'язкові поля.");
      return;
    }
    if (youtubeUrl.trim() && !youtubeVideoId) {
      setSubmitError("Некоректне посилання YouTube.");
      return;
    }
    if (isEdit && !slug) {
      setSubmitError("Не вказано slug новини.");
      return;
    }

    setSaving(true);
    try {
      const input = buildPostInput(
        title,
        excerpt,
        image,
        bodyMarkdown,
        tags,
        publishDate,
        authorName,
        authorImage,
        authorDesignation,
        youtubeVideoId,
      );

      const post = isEdit
        ? await updatePostClient(slug!, input)
        : await createPostClient(input);

      await revalidatePost(post.slug);
      router.push(
        isEdit ? `/admin/news?updated=${post.slug}` : `/admin/news?created=${post.slug}`,
      );
    } catch (err) {
      console.error(err);
      setSubmitError(
        isEdit
          ? "Не вдалося зберегти зміни. Перевірте, що ви увійшли як admin@gmail.com."
          : "Не вдалося зберегти новину в Firestore. Перевірте, що ви увійшли як admin@gmail.com.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleImagesUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length || !cloudName || !uploadPreset) {
      return;
    }

    setIsUploadingImage(true);
    setUploadError("");

    try {
      const urls = await Promise.all(
        files.map((file) => uploadImageToCloudinary(file, cloudName, uploadPreset)),
      );

      if (urls[0]) {
        setImage(urls[0]);
      }

      if (urls.length > 1) {
        setBodyMarkdown((prev) => insertImagesBetweenParagraphs(prev, urls.slice(1)));
      }
    } catch (error) {
      console.error(error);
      setUploadError("Не вдалося завантажити зображення в Cloudinary.");
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  }

  const previewPost = useMemo<Post>(
    () => ({
      id: previewSlug,
      slug: previewSlug,
      title: title || "Назва новини",
      excerpt: excerpt || "Короткий опис новини з'явиться тут у режимі попереднього перегляду.",
      image: normalizeGoogleDriveImageUrl(image) || "/images/blog/blog-01.jpg",
      bodyMarkdown:
        bodyMarkdown ||
        "## Попередній перегляд\n\nТут буде показано повний текст новини у Markdown.",
      author: {
        name: authorName || defaultAuthorName,
        image: normalizeGoogleDriveImageUrl(authorImage) || defaultAuthorImage,
        designation: authorDesignation || defaultAuthorDesignation,
      },
      tags: splitTags(tags),
      publishDate: publishDate ? formatPublishDate(publishDate) : formatPublishDate(new Date()),
      publishedAt: publishDate ? new Date(publishDate).toISOString() : new Date().toISOString(),
      youtubeVideoId: youtubeVideoId ?? undefined,
    }),
    [
      authorDesignation,
      authorImage,
      authorName,
      bodyMarkdown,
      excerpt,
      image,
      previewSlug,
      publishDate,
      tags,
      title,
      youtubeVideoId,
    ],
  );

  return (
    <div className="grid gap-10 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="shadow-three dark:bg-dark rounded-xs bg-white p-6 sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-dark text-2xl font-bold dark:text-white">
              {isEdit ? "Редагувати новину" : "Створити новину"}
            </h2>
            <p className="text-body-color mt-2 text-sm dark:text-body-color-dark">
              Завантажуйте одне або кілька фото: перше — обкладинка, решта
              з&apos;являться в тексті між абзацами. Також можна вставити прямий
              URL обкладинки.
            </p>
          </div>

          <Link
            href="/admin/news"
            className="text-primary shrink-0 text-sm font-medium hover:underline"
          >
            До списку
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isEdit && slug ? (
            <div>
              <label className="text-dark mb-2 block text-sm font-medium dark:text-white">
                URL (slug)
              </label>
              <input
                value={slug}
                readOnly
                className="border-stroke dark:bg-dark/50 dark:border-white/10 text-body-color w-full cursor-not-allowed rounded-xs border bg-body-color/5 px-4 py-3 font-mono text-sm dark:text-body-color-dark"
              />
              <p className="text-body-color mt-2 text-xs dark:text-body-color-dark">
                Адреса новини не змінюється — посилання з матч-центру лишаються валідними.
              </p>
            </div>
          ) : null}

          <div>
            <label className="text-dark mb-2 block text-sm font-medium dark:text-white">
              Заголовок
            </label>
            <input
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-4 py-3 outline-hidden focus:border-primary"
            />
          </div>

          <div>
            <label className="text-dark mb-2 block text-sm font-medium dark:text-white">
              Короткий опис
            </label>
            <textarea
              name="excerpt"
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              required
              rows={3}
              className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-4 py-3 outline-hidden focus:border-primary"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-dark mb-2 block text-sm font-medium dark:text-white">
                URL зображення
              </label>
              <input
                name="image"
                value={image}
                onChange={(event) => setImage(event.target.value)}
                placeholder="https://res.cloudinary.com/... або інший прямий URL"
                required
                className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-4 py-3 outline-hidden focus:border-primary"
              />
              <div className="mt-3 space-y-2">
                <label className="text-body-color dark:text-body-color-dark block text-xs">
                  Завантажити файл у Cloudinary
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesUpload}
                  disabled={!canUploadToCloudinary || isUploadingImage}
                  className="text-body-color dark:text-body-color-dark block w-full text-sm file:mr-4 file:rounded-xs file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-primary/90 disabled:opacity-60"
                />
                <p className="text-body-color dark:text-body-color-dark text-xs">
                  {canUploadToCloudinary
                    ? isUploadingImage
                      ? "Завантаження в Cloudinary..."
                      : "Перше фото — обкладинка; додаткові вставляються в Markdown між абзацами."
                    : "Додайте `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` і `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` у `.env.local`."}
                </p>
                {uploadError ? (
                  <p className="text-xs text-red-600 dark:text-red-300">{uploadError}</p>
                ) : null}
              </div>
            </div>

            <div>
              <label className="text-dark mb-2 block text-sm font-medium dark:text-white">
                Дата публікації
              </label>
              <input
                type="date"
                name="publishDate"
                value={publishDate}
                onChange={(event) => setPublishDate(event.target.value)}
                className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-4 py-3 outline-hidden focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-dark mb-2 block text-sm font-medium dark:text-white">
              Теги
            </label>
            <input
              name="tags"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="Новини, Команда, U-19"
              className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-4 py-3 outline-hidden focus:border-primary"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="text-dark mb-2 block text-sm font-medium dark:text-white">
                Автор
              </label>
              <input
                name="authorName"
                value={authorName}
                onChange={(event) => setAuthorName(event.target.value)}
                className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-4 py-3 outline-hidden focus:border-primary"
              />
            </div>

            <div>
              <label className="text-dark mb-2 block text-sm font-medium dark:text-white">
                Посада автора
              </label>
              <input
                name="authorDesignation"
                value={authorDesignation}
                onChange={(event) => setAuthorDesignation(event.target.value)}
                className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-4 py-3 outline-hidden focus:border-primary"
              />
            </div>

            <div>
              <label className="text-dark mb-2 block text-sm font-medium dark:text-white">
                Фото автора
              </label>
              <input
                name="authorImage"
                value={authorImage}
                onChange={(event) => setAuthorImage(event.target.value)}
                className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-4 py-3 outline-hidden focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-dark mb-2 block text-sm font-medium dark:text-white">
              Текст новини у Markdown
            </label>
            <textarea
              name="bodyMarkdown"
              value={bodyMarkdown}
              onChange={(event) => setBodyMarkdown(event.target.value)}
              required
              rows={14}
              className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-4 py-3 font-mono text-sm outline-hidden focus:border-primary"
            />
          </div>

          <div>
            <label className="text-dark mb-2 block text-sm font-medium dark:text-white">
              Посилання YouTube (опц.)
            </label>
            <input
              type="text"
              value={youtubeUrl}
              onChange={(event) => setYoutubeUrl(event.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-4 py-3 outline-hidden focus:border-primary"
            />
            <p className="text-body-color mt-2 text-xs dark:text-body-color-dark">
              Якщо вказано, в кінці новини з&apos;явиться компактний плеєр. Очистіть поле, щоб
              прибрати відео.
            </p>
          </div>

          {submitError ? (
            <p className="text-sm text-red-600 dark:text-red-300">{submitError}</p>
          ) : null}

          <button
            type="submit"
            disabled={saving}
            className="bg-primary hover:bg-primary/90 rounded-xs px-6 py-3 text-sm font-medium text-white duration-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Збереження..." : isEdit ? "Зберегти зміни" : "Опублікувати новину"}
          </button>
        </form>
      </div>

      <div className="space-y-8">
        <div className="shadow-three dark:bg-dark rounded-xs bg-white p-6">
          <h3 className="text-dark mb-4 text-lg font-semibold dark:text-white">
            Попередній перегляд картки
          </h3>
          <PostCard post={previewPost} />
        </div>

        <div className="shadow-three dark:bg-dark rounded-xs bg-white p-6">
          <h3 className="text-dark mb-4 text-lg font-semibold dark:text-white">
            Попередній перегляд статті
          </h3>
          <div className="mb-6 space-y-3">
            <h2 className="text-dark text-3xl font-bold dark:text-white">{previewPost.title}</h2>
            <p className="text-body-color dark:text-body-color-dark">{previewPost.excerpt}</p>
          </div>
          <MarkdownContent markdown={previewPost.bodyMarkdown} />
          {previewPost.youtubeVideoId ? (
            <NewsYoutubeEmbed videoId={previewPost.youtubeVideoId} title={previewPost.title} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
