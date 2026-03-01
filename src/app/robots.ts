import { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  "https://karpaty-website.vercel.app";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl || "https://karpaty-website.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/signin", "/signup", "/error"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
