import Breadcrumb from "@/components/Common/Breadcrumb";
import Video from "@/components/Video";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Відео | ФК «Уличне»",
  description: "Відео та трансляції ФК «Уличне».",
};

export default function VideoPage() {
  return (
    <>
      <Breadcrumb
        pageName="Відео"
        description="Відео матчів та огляди."
      />
      <Video />
    </>
  );
}
