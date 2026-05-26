import ScrollUp from "@/components/Common/ScrollUp";
import Hero from "@/components/Hero";
import NextMatch from "@/components/Matches/NextMatch";
import TableTeaser from "@/components/Matches/TableTeaser";
import FriendlyMatchesTeaser from "@/components/Matches/FriendlyMatchesTeaser";
import CalendarTeaser from "@/components/Matches/CalendarTeaser";
import NewsSection from "@/components/News";
import TeamTeaser from "@/components/Team/TeamTeaser";
import Video from "@/components/Video";
import Contact from "@/components/Contact";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "ФК «Уличне» (Карпати) — футбол у Уличному",
  description:
    "Футбол у селі Уличне, у Уличному та Дрогобицькому районі: офіційний сайт ФК «Уличне» / ФК Карпати Уличне — новини, матчі, склад, таблиця та календар.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <NextMatch />
      <TableTeaser />
      <FriendlyMatchesTeaser />
      <NewsSection />
      <CalendarTeaser />
      <TeamTeaser />
      <Video />
      <Contact />
    </>
  );
}
