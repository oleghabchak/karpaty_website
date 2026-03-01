const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  "https://karpaty-website.vercel.app";

export function JsonLd() {
  const base = siteUrl || "https://karpaty-website.vercel.app";

  const organization = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: "ФК «Уличне»",
    alternateName: "FC Ulychne",
    url: base,
    logo: `${base}/images/logo/logo-2.svg`,
    description:
      "Офіційний сайт футбольного клубу «Уличне». Новини, матчі, команда, турнірна таблиця.",
    inLanguage: "uk",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${base}/news?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ФК «Уличне»",
    url: base,
    publisher: { "@id": `${base}/#organization` },
    inLanguage: "uk",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organization),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(website),
        }}
      />
    </>
  );
}
