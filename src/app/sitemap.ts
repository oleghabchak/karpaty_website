import { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  "https://karpaty-website.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl || "https://karpaty-website.vercel.app";

  const routes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/team`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/matches`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/news`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/club`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/photo`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/shop`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/u19`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/academy`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/video`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/tribune`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  return routes;
}
