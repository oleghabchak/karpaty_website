const GOOGLE_DRIVE_HOSTS = new Set([
  "drive.google.com",
  "www.drive.google.com",
  "docs.google.com",
  "lh3.googleusercontent.com",
]);

const UKRAINIAN_TO_LATIN_MAP: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "h",
  ґ: "g",
  д: "d",
  е: "e",
  є: "ye",
  ж: "zh",
  з: "z",
  и: "y",
  і: "i",
  ї: "yi",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "kh",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
  ь: "",
  ю: "yu",
  я: "ya",
};

function transliterateUkrainian(value: string) {
  return value.replace(/[а-щьюяєіїґ]/g, (char) => UKRAINIAN_TO_LATIN_MAP[char] ?? char);
}

export function slugify(value: string) {
  const transliterated = transliterateUkrainian(value.toLowerCase());

  return transliterated
    .toLowerCase()
    .trim()
    .replace(/['"`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function formatPublishDate(value?: string | Date) {
  const date = value instanceof Date ? value : value ? new Date(value) : new Date();

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function extractDriveFileId(url: URL) {
  const fileIdFromQuery = url.searchParams.get("id");
  if (fileIdFromQuery) {
    return fileIdFromQuery;
  }

  const match = url.pathname.match(/\/d\/([^/]+)/);
  if (match) {
    return match[1];
  }

  return null;
}

export function normalizeGoogleDriveImageUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  try {
    const url = new URL(trimmed);

    if (!GOOGLE_DRIVE_HOSTS.has(url.hostname)) {
      return trimmed;
    }

    if (url.hostname === "lh3.googleusercontent.com") {
      return trimmed;
    }

    const fileId = extractDriveFileId(url);
    if (!fileId) {
      return trimmed;
    }

    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  } catch {
    return trimmed;
  }
}

export function splitTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}
