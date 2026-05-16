import Breadcrumb from "@/components/Common/Breadcrumb";
import TableTeaser from "@/components/Matches/TableTeaser";
import FriendlyMatchesTeaser from "@/components/Matches/FriendlyMatchesTeaser";
import CalendarTeaser from "@/components/Matches/CalendarTeaser";
import NextMatch from "@/components/Matches/NextMatch";
import { buildPageMetadata } from "@/lib/seo";
import LastMatch from "@/components/Matches/LastMatch";
import MatchPagesList from "@/components/Matches/MatchPagesList";

export const metadata = buildPageMetadata({
  title: "Матчі та календар",
  description:
    "Календар матчів і результати ФК «Уличне» (Карпати Уличне) — футбол у Уличному та Дрогобицькому районі.",
  path: "/matches",
});

export default function MatchesPage() {
  return (
    <>
      <Breadcrumb
        pageName="Матчі"
        description="Календар матчів, результати та турнірна таблиця."
      />
      <NextMatch />
      <LastMatch />
      <MatchPagesList />
      <section id="table">
        <TableTeaser />
      </section>
      <FriendlyMatchesTeaser />
      <CalendarTeaser />
    </>
  );
}
