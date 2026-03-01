import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Контакти | ФК «Уличне»",
  description: "Контактна інформація ФК «Уличне».",
};

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
