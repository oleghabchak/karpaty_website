import Activities from "@/components/Infrastructure/Activities";
import Atlas from "@/components/Infrastructure/Atlas";
import Audiences from "@/components/Infrastructure/Audiences";
import Banner from "@/components/Infrastructure/Banner";
import Cta from "@/components/Infrastructure/Cta";
import Faq from "@/components/Infrastructure/Faq";
import InfrastructureHero from "@/components/Infrastructure/InfrastructureHero";
import Places from "@/components/Infrastructure/Places";
import Statement from "@/components/Infrastructure/Statement";
import { heroImage } from "@/data/infrastructureData";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Інфраструктура",
  description:
    "Інфраструктура ФК «Уличне»: головне поле, тренування, академія, команда U-19 та Трибуна Героїв. Футбол у селі Уличне, Дрогобицький район.",
  path: "/club/infrastructure",
  image: heroImage,
  imageAlt: "Футбольне поле ФК «Уличне»",
});

export default function InfrastructurePage() {
  return (
    <>
      <InfrastructureHero />
      <Statement />
      <Places />
      <Atlas />
      <Activities />
      <Banner />
      <Audiences />
      <Faq />
      <Cta />
    </>
  );
}
