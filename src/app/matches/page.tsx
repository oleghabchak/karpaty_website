import Breadcrumb from "@/components/Common/Breadcrumb";
import TableTeaser from "@/components/Matches/TableTeaser";
import CalendarTeaser from "@/components/Matches/CalendarTeaser";
import NextMatch from "@/components/Matches/NextMatch";
import LastMatch from "@/components/Matches/LastMatch";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Матчі | ФК «Уличне»",
  description: "Календар матчів та турнірна таблиця ФК «Уличне».",
};

export default function MatchesPage() {
  return (
    <>
      <Breadcrumb
        pageName="Матчі"
        description="Календар матчів, результати та турнірна таблиця."
      />
      <NextMatch />
      <LastMatch />
      <section id="table">
        <TableTeaser />
      </section>
      <CalendarTeaser />
    </>
  );
}
