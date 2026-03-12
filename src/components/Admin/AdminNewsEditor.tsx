"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { useFormStatus } from "react-dom";
import MarkdownContent from "@/components/News/MarkdownContent";
import PostCard from "@/components/News/PostCard";
import { formatPublishDate, normalizeGoogleDriveImageUrl, splitTags } from "@/lib/post-utils";
import type { Post } from "@/types/post";

type AdminNewsEditorProps = {
  action: (formData: FormData) => void;
  createdSlug?: string;
  cloudName?: string;
  uploadPreset?: string;
};

const defaultAuthorName = "Прес-служба ФК Уличне";
const defaultAuthorImage = "/images/blog/author-03.png";
const defaultAuthorDesignation = "Офіційно";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-primary hover:bg-primary/90 rounded-xs px-6 py-3 text-sm font-medium text-white duration-300 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Збереження..." : "Опублікувати новину"}
    </button>
  );
}

export default function AdminNewsEditor({
  action,
  createdSlug,
  cloudName,
  uploadPreset,
}: AdminNewsEditorProps) {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [image, setImage] = useState("");
  const [tags, setTags] = useState("Новини");
  const [publishDate, setPublishDate] = useState("");
  const [authorName, setAuthorName] = useState(defaultAuthorName);
  const [authorImage, setAuthorImage] = useState(defaultAuthorImage);
  const [authorDesignation, setAuthorDesignation] = useState(defaultAuthorDesignation);
  const [bodyMarkdown, setBodyMarkdown] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const canUploadToCloudinary = Boolean(cloudName && uploadPreset);

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !cloudName || !uploadPreset) {
      return;
    }

    setIsUploadingImage(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Cloudinary upload failed.");
      }

      const payload = await response.json();
      const secureUrl =
        typeof payload.secure_url === "string" ? payload.secure_url : "";

      if (!secureUrl) {
        throw new Error("Cloudinary did not return an image URL.");
      }

      setImage(secureUrl);
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
      id: "preview-post",
      slug: "preview-post",
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
    }),
    [
      authorDesignation,
      authorImage,
      authorName,
      bodyMarkdown,
      excerpt,
      image,
      publishDate,
      tags,
      title,
    ]
  );

  return (
    <div className="grid gap-10 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="shadow-three dark:bg-dark rounded-xs bg-white p-6 sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-dark text-2xl font-bold dark:text-white">
              Створити новину
            </h2>
            <p className="text-body-color mt-2 text-sm dark:text-body-color-dark">
              Завантажуйте зображення в Cloudinary або вставляйте прямий URL.
            </p>
          </div>

          {createdSlug ? (
            <a
              href={`/news/${createdSlug}`}
              className="text-primary text-sm font-medium hover:underline"
            >
              Відкрити опубліковану новину
            </a>
          ) : null}
        </div>

        <form action={action} className="space-y-5">
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
                  onChange={handleImageUpload}
                  disabled={!canUploadToCloudinary || isUploadingImage}
                  className="text-body-color dark:text-body-color-dark block w-full text-sm file:mr-4 file:rounded-xs file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-primary/90 disabled:opacity-60"
                />
                <p className="text-body-color dark:text-body-color-dark text-xs">
                  {canUploadToCloudinary
                    ? isUploadingImage
                      ? "Завантаження в Cloudinary..."
                      : "Після завантаження URL автоматично підставиться в поле вище."
                    : "Додайте `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` і `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` у `.env.local`."}
                </p>
                {uploadError ? (
                  <p className="text-xs text-red-600 dark:text-red-300">
                    {uploadError}
                  </p>
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

          <SubmitButton />
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
            <h2 className="text-dark text-3xl font-bold dark:text-white">
              {previewPost.title}
            </h2>
            <p className="text-body-color dark:text-body-color-dark">
              {previewPost.excerpt}
            </p>
          </div>
          <MarkdownContent markdown={previewPost.bodyMarkdown} />
        </div>
      </div>
    </div>
  );
}
