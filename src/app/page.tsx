import ScrollUp from "@/components/Common/ScrollUp";
import Hero from "@/components/Hero";
import NextMatch from "@/components/Matches/NextMatch";
import LastMatch from "@/components/Matches/LastMatch";
import TableTeaser from "@/components/Matches/TableTeaser";
import CalendarTeaser from "@/components/Matches/CalendarTeaser";
import NewsSection from "@/components/News";
import TeamTeaser from "@/components/Team/TeamTeaser";
import Video from "@/components/Video";
import Brands from "@/components/Brands";
import Contact from "@/components/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ФК «Уличне» — Офіційний сайт",
  description:
    "Офіційний сайт футбольного клубу «Уличне». Новини, матчі, команда, турнірна таблиця.",
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <NextMatch />
      <LastMatch />
      <TableTeaser />
      <NewsSection />
      <CalendarTeaser />
      <TeamTeaser />
      <Video />
      <Brands />
      <Contact />
    </>
  );
}
