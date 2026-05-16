import { MetadataRoute } from "next";
import { getPublishedMatchPages } from "@/lib/match-pages";
import { getLatestPostsServer } from "@/lib/posts-server";
import { absoluteUrl, getSiteUrl } from "@/lib/seo";

export const revalidate = 3600;

function parseLastModified(value?: string): Date {
  if (!value) return new Date();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/team"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/matches"), lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/news"), lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/club"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/photo"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/history"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl("/contact"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/u19"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/academy"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl("/video"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl("/tribune"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  let newsRoutes: MetadataRoute.Sitemap = [];
  let matchRoutes: MetadataRoute.Sitemap = [];

  try {
    const posts = await getLatestPostsServer(500);
    newsRoutes = posts.map((post) => ({
      url: absoluteUrl(`/news/${post.slug}`),
      lastModified: parseLastModified(post.publishedAt ?? post.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    newsRoutes = [];
  }

  try {
    const matchPages = await getPublishedMatchPages();
    matchRoutes = matchPages.map((page) => ({
      url: absoluteUrl(`/matches/${page.slug}`),
      lastModified: parseLastModified(page.updatedAt ?? page.date),
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));
  } catch {
    matchRoutes = [];
  }

  return [...staticRoutes, ...newsRoutes, ...matchRoutes];
}
