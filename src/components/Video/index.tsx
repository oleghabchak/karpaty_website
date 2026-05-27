import Image from "next/image";
import Link from "next/link";
import SectionTitle from "../Common/SectionTitle";

const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@FCUlychne";

export default function Video() {
  return (
    <section className="relative z-10 py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="Відео"
          paragraph="Офіційний YouTube-канал ФК «Уличне» — трансляції, огляди матчів та новини клубу."
          center
          mb="80px"
        />
      </div>
      <div className="relative overflow-hidden">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto max-w-[770px] overflow-hidden rounded-md">
              <Link
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-77/40"
                aria-label="Перейти на офіційний YouTube-канал ФК Уличне"
              >
                <Image
                  src="/teamLogo/youtube.png"
                  alt="ФК Уличне на YouTube"
                  className="object-cover transition duration-300 group-hover:scale-105"
                  fill
                />
                {/* <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/25 transition group-hover:bg-black/35">
                  <span className="flex h-[70px] w-[70px] items-center justify-center rounded-full bg-white/75 text-primary transition group-hover:bg-white">
                    <svg
                      width="16"
                      height="18"
                      viewBox="0 0 16 18"
                      className="fill-current"
                      aria-hidden
                    >
                      <path d="M15.5 8.13397C16.1667 8.51888 16.1667 9.48112 15.5 9.86602L2 17.6603C1.33333 18.0452 0.499999 17.564 0.499999 16.7942L0.5 1.20577C0.5 0.43597 1.33333 -0.0451549 2 0.339745L15.5 8.13397Z" />
                    </svg>
                  </span>
                  <span className="rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-black shadow-sm">
                    @FCUlychne на YouTube
                  </span>
                </div> */}
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 left-0 z-[-1] h-full w-full bg-[url(/images/video/shape.svg)] bg-cover bg-center bg-no-repeat" />
      </div>
    </section>
  );
}
