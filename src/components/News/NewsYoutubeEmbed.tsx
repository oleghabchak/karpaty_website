type NewsYoutubeEmbedProps = {
  videoId: string;
  title?: string;
};

export default function NewsYoutubeEmbed({ videoId, title }: NewsYoutubeEmbedProps) {
  return (
    <div className="my-6">
      <p className="text-body-color mb-3 text-center text-sm dark:text-body-color-dark">Відео</p>
      <div className="border-stroke shadow-three mx-auto max-w-md overflow-hidden rounded-xs border dark:border-white/10">
        <div className="relative aspect-video w-full">
          <iframe
            title={title ?? "Відео"}
            src={`https://www.youtube.com/embed/${videoId}`}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
