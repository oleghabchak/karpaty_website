"use client";

type MatchYoutubeEmbedProps = {
  videoId: string;
  title?: string;
};

export default function MatchYoutubeEmbed({ videoId, title }: MatchYoutubeEmbedProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-body-color/10 dark:border-white/10">
      <div className="relative aspect-video w-full">
        <iframe
          title={title ?? "Відео матчу"}
          src={`https://www.youtube.com/embed/${videoId}`}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
