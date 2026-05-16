import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { buildPageMetadata, NOINDEX_ROBOTS } from "@/lib/seo";

export const metadata = {
  ...buildPageMetadata({
    title: "Про шаблон",
    description: "Службова сторінка шаблону (не індексується).",
    path: "/about",
  }),
  robots: NOINDEX_ROBOTS,
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="About Page"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In varius eros eget sapien consectetur ultrices. Ut quis dapibus libero."
      />
      <AboutSectionOne />
      <AboutSectionTwo />
    </>
  );
};

export default AboutPage;
