export async function uploadImageToCloudinary(
  file: File,
  cloudName: string,
  uploadPreset: string
): Promise<string> {
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

  return secureUrl;
}

export function buildInlineImageMarkdown(url: string, alt = "Фото"): string {
  return `\n\n![${alt}](${url})\n\n`;
}

export function insertImagesBetweenParagraphs(body: string, urls: string[]): string {
  if (!urls.length) {
    return body;
  }

  const trimmed = body.trim();
  const paragraphs = trimmed ? trimmed.split(/\n\n+/) : [];

  if (paragraphs.length < 2) {
    const imagesMarkdown = urls.map((url) => buildInlineImageMarkdown(url)).join("");
    return trimmed ? `${trimmed}${imagesMarkdown}` : imagesMarkdown.trim();
  }

  const insertAfterIndices = urls.map((_, i) =>
    Math.min(
      paragraphs.length - 1,
      Math.round(((i + 1) * paragraphs.length) / (urls.length + 1))
    )
  );

  const result: string[] = [];
  let urlIndex = 0;

  for (let i = 0; i < paragraphs.length; i++) {
    result.push(paragraphs[i]);
    while (urlIndex < urls.length && insertAfterIndices[urlIndex] === i) {
      result.push(buildInlineImageMarkdown(urls[urlIndex]).trim());
      urlIndex++;
    }
  }

  while (urlIndex < urls.length) {
    result.push(buildInlineImageMarkdown(urls[urlIndex]).trim());
    urlIndex++;
  }

  return result.join("\n\n");
}
