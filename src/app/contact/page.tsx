import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";

import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Контакти",
  description:
    "Зв'яжіться з ФК «Уличне» — футбольний клуб у селі Уличне, Дрогобичський район, Львівська область.",
  path: "/contact",
});

const ContactPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Контакти"
        description="Зв'яжіться з нами. Контактна інформація та форма зворотного зв'язку."
      />

      <Contact />
    </>
  );
};

export default ContactPage;
